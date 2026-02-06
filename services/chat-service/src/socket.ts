import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { structuredLog } from '@hold-yourself/utils';
import { UserPresenceModel } from './models/user-presence.model';
import { ConversationService } from './modules/conversations/conversation.service';

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGINS || 'http://localhost:3002'; // Updated to frontend port
const JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY || process.env.JWT_SECRET || 'dev_secret_key_123';

interface SocketUser {
  sub: string;
  email?: string;
}

export class SocketService {
  private static instance: SocketService;
  public io: SocketIOServer | null = null;
  private onlineUsers: Map<string, Set<string>> = new Map(); // userId -> Set of socketIds

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public init(httpServer: HttpServer): void {
    if (this.io) return; // Already initialized

    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: ALLOWED_ORIGIN,
        methods: ['GET', 'POST'],
      },
      pingTimeout: 10000,
      pingInterval: 5000,
    });

    // Authentication Middleware
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      jwt.verify(token, JWT_PUBLIC_KEY, { algorithms: ['RS256', 'HS256'] }, (err: any, decoded: any) => {
        if (err) {
          return next(new Error('Authentication error: Invalid token'));
        }
        
        // Attach user info to socket
        (socket as any).user = decoded as SocketUser;
        next();
      });
    });

    this.io.on('connection', async (socket) => {
      const user = (socket as any).user as SocketUser;
      const userId = user.sub;
      
      // Join a room specific to this user (for direct targeting)
      socket.join(userId);
      
      // Send initial list of online users to the connecting user
      socket.emit('presence:initial', Array.from(this.onlineUsers.keys()));
      
      // Add to online users
      if (!this.onlineUsers.has(userId)) {
        this.onlineUsers.set(userId, new Set());
        // First connection for this user, broadcast online status
        this.io?.emit('presence:update', { userId, status: 'online' });
      }
      this.onlineUsers.get(userId)?.add(socket.id);

      structuredLog('info', 'socket:connect', `User connected: ${userId}`, {
        userId,
        socketId: socket.id,
      });

      // Typing Handlers
      socket.on('presence:sync', () => {
        socket.emit('presence:initial', Array.from(this.onlineUsers.keys()));
      });

      socket.on('typing:start', async ({ conversationId }) => {
        try {
          const conversation = await ConversationService.findConversationById(conversationId);
          if (!conversation) return;

          const recipientId = conversation.participants.find((p: string) => p !== userId);
          if (recipientId) {
            this.emitToUser(recipientId as string, 'typing:start', { userId, conversationId });
          }
        } catch (error: any) {
          structuredLog('error', 'socket:typing_error', 'Error handling typing:start', { userId, conversationId, error });
        }
      });

      socket.on('typing:stop', async ({ conversationId }) => {
        try {
          const conversation = await ConversationService.findConversationById(conversationId);
          if (!conversation) return;

          const recipientId = conversation.participants.find((p: string) => p !== userId);
          if (recipientId) {
            this.emitToUser(recipientId as string, 'typing:stop', { userId, conversationId });
          }
        } catch (error: any) {
          structuredLog('error', 'socket:typing_error', 'Error handling typing:stop', { userId, conversationId, error });
        }
      });

      socket.on('disconnect', async (reason) => {
        const sockets = this.onlineUsers.get(userId);
        if (sockets) {
          sockets.delete(socket.id);
          if (sockets.size === 0) {
            this.onlineUsers.delete(userId);
            
            // Last connection for this user, broadcast offline status and update last seen
            const lastSeen = new Date();
            this.io?.emit('presence:update', { userId, status: 'offline', lastSeen });
            
            try {
              await UserPresenceModel.findOneAndUpdate(
                { userId },
                { lastSeen },
                { upsert: true, new: true }
              );
            } catch (error: any) {
              structuredLog('error', 'socket:presence_error', 'Error updating lastSeen', { userId, error });
            }
          }
        }

        structuredLog('info', 'socket:disconnect', `User disconnected: ${userId}`, {
          userId,
          socketId: socket.id,
          reason,
        });
      });
    });

    structuredLog('info', 'socket:init', 'Socket.IO initialized');
  }

  public emitToUser(userId: string, event: string, payload: any): void {
    if (!this.io) {
      structuredLog('warn', 'socket:emit_failure', 'SocketService not initialized, cannot emit', { userId, event });
      return;
    }
    
    // Emit to the "room" named after the userId
    this.io.to(userId).emit(event, payload);
  }
}

export const socketService = SocketService.getInstance();
