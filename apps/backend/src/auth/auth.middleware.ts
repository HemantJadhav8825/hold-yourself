import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AUTH_CONFIG } from './auth.config';
import { IdentityContext } from './auth.types';

export const jwtValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  console.log('🔐 [JWT] Validating request:', req.method, req.path);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('⚠️  [JWT] No Bearer token found, skipping validation');
    return next();
  }

  const token = authHeader.split(' ')[1];
  console.log('🔑 [JWT] Token received:', token.substring(0, 20) + '...');

  try {
    const payload = jwt.verify(token, AUTH_CONFIG.PUBLIC_KEY, {
      algorithms: ['RS256'],
      issuer: AUTH_CONFIG.ISSUER,
    }) as any;

    console.log('✅ [JWT] Token valid! User:', payload.sub, 'Role:', payload.role);

    req.auth = {
      userId: payload.sub,
      role: payload.role,
      scopes: payload.scopes,
    };

    next();
  } catch (err: any) {
    // We don't block here, just don't set req.auth
    // The requireAuth middleware will handle blocking if needed
    console.error('❌ [JWT] Token validation failed:', err.message);
    console.error('   - Token (first 30 chars):', token.substring(0, 30) + '...');
    console.error('   - Issuer expected:', AUTH_CONFIG.ISSUER);
    console.error('   - Public key configured:', AUTH_CONFIG.PUBLIC_KEY ? 'Yes (length: ' + AUTH_CONFIG.PUBLIC_KEY.length + ')' : 'No');
    next();
  }
};
