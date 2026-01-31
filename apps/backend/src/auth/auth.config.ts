import dotenv from 'dotenv';
dotenv.config();

export const AUTH_CONFIG = {
  // Pointing to the local auth-service by default
  SERVICE_URL: process.env.AUTH_SERVICE_BASE_URL || 'http://localhost:3001',
  
  // Public Key for RS256 validation
  PUBLIC_KEY: process.env.AUTH_PUBLIC_KEY || '',
  
  // Expected issuer from auth-service
  ISSUER: process.env.AUTH_ISSUER || 'hold-yourself-auth',
};
