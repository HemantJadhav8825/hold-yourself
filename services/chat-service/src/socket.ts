import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { structuredLog } from '@hold-yourself/utils';

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGINS || 'http://localhost:3002'; // Updated to frontend port
const JWT_PUBLIC_KEY = process.env.JWT_PUBLIC_KEY || process.env.JWT_SECRET || 'dev_secret_key_123';

interface SocketUser {
  sub: string;
  email?: string;
}

export class SocketService {
  private static instance: SocketService;
  public io: SocketIOServer | null = null;

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

    this.io.on('connection', (socket) => {
      const user = (socket as any).user as SocketUser;
      
      // Join a room specific to this user (for direct targeting)
      socket.join(user.sub);
      structuredLog('info', 'room:join', `User joined individual room: ${user.sub}`, {
        userId: user.sub,
        socketId: socket.id,
        room: user.sub,
      });

      structuredLog('info', 'socket:connect', `User connected: ${user.sub}`, {
        userId: user.sub,
        socketId: socket.id,
      });

      // Heartbeat to detect ghost connections
      const heartbeatInterval = setInterval(() => {
        if (!socket.connected) {
          clearInterval(heartbeatInterval);
          return;
        }
        socket.emit('ping');
      }, 30000);

      socket.on('pong', () => {
        // Heartbeat received
      });

      socket.on('disconnect', (reason) => {
        structuredLog('info', 'socket:disconnect', `User disconnected: ${user.sub}`, {
          userId: user.sub,
          socketId: socket.id,
          reason,
        });
        clearInterval(heartbeatInterval);
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
