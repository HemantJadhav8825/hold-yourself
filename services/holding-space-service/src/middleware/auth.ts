import { Request, Response, NextFunction } from 'express';
import { JwtVerifier, TokenPayload } from '../security/jwt';

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const payload = JwtVerifier.verify(token);
    
    if (payload.type !== 'access') {
      return res.status(401).json({ error: 'Unauthorized: Invalid token type' });
    }

    req.user = payload;
    next();
  } catch (err: any) {
    return res.status(401).json({ 
      error: 'Unauthorized: Invalid or expired token',
      details: err.message 
    });
  }
};

export const optionalAuthenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const payload = JwtVerifier.verify(token);
      
      if (payload.type === 'access') {
        req.user = payload;
      }
    }
    next();
  } catch (err) {
    // Silently continue for optional auth
    next();
  }
};
