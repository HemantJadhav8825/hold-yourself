import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Security
  JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY || '',
  JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY || '',
  TOKEN_ISSUER: 'hold-yourself-auth',
  ACCESS_TOKEN_EXPIRES_IN: '15m',
  REFRESH_TOKEN_EXPIRES_IN: '7d',
  
  // Database placeholder
  DATABASE_URL: process.env.DATABASE_URL || '',
};
