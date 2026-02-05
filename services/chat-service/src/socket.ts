import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGINS || 'http://localhost:3000';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_123'; // Must match auth-service

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

      jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
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
      
      console.log(`User connected: ${user.sub} (${socket.id})`);

      // Join a room specific to this user (for direct targeting)
      socket.join(user.sub);

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${user.sub}`);
      });
    });

    console.log('Socket.IO initialized');
  }

  public emitToUser(userId: string, event: string, payload: any): void {
    if (!this.io) {
      console.warn('SocketService not initialized, cannot emit');
      return;
    }
    
    // Emit to the "room" named after the userId
    this.io.to(userId).emit(event, payload);
  }
}

export const socketService = SocketService.getInstance();
