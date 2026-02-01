export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  authProvider: 'email' | 'google';
  googleId?: string;
  avatar?: string;
  role: string;
  scopes: string[];
  createdAt: Date;
  updatedAt: Date;
  isRevoked: boolean;
}

export interface UserCreateDTO {
  email: string;
  passwordHash?: string;
  authProvider: 'email' | 'google';
  googleId?: string;
  avatar?: string;
  role: string;
  scopes: string[];
}
