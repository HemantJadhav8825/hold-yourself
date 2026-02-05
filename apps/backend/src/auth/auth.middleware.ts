import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AUTH_CONFIG } from './auth.config';
import { IdentityContext } from './auth.types';

export const jwtValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, AUTH_CONFIG.PUBLIC_KEY, {
      algorithms: ['RS256'],
      issuer: AUTH_CONFIG.ISSUER,
    }) as any;

    req.auth = {
      userId: payload.sub,
      role: payload.role,
      scopes: payload.scopes,
    };

    next();
  } catch (err: any) {
    // We don't block here, just don't set req.auth
    // The requireAuth middleware will handle blocking if needed
    next();
  }
};
