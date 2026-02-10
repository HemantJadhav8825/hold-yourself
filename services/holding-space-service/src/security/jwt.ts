import jwt from 'jsonwebtoken';

export interface TokenPayload {
  sub: string;
  role: string;
  scopes: string[];
  type: 'access' | 'refresh' | 'service';
}

export const JwtVerifier = {
  verify: (token: string): TokenPayload => {
    const PUBLIC_KEY = process.env.JWT_PUBLIC_KEY || '';
    if (!PUBLIC_KEY) {
      throw new Error('JWT_PUBLIC_KEY is not defined in environment');
    }

    return jwt.verify(token, PUBLIC_KEY.replace(/\\n/g, '\n'), {
      algorithms: ['RS256'],
      issuer: 'hold-yourself-auth',
    }) as TokenPayload;
  }
};
