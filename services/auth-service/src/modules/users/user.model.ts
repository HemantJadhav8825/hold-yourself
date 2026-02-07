export interface User {
  id: string;
  email: string;
  username?: string;
  displayName?: string;
  fullName?: string;
  bio?: string;
  passwordHash?: string;
  authProvider: 'email' | 'google';
  googleId?: string;
  avatar?: string;
  role: string;
  scopes: string[];
  createdAt: Date;
  updatedAt: Date;
  isRevoked: boolean;
  anonymousProfile?: {
    pseudonym: string;
    avatar: string; // URL or identifier for abstract avatar
    bio?: string;
  };
}

export interface UserCreateDTO {
  email: string;
  username?: string;
  displayName?: string;
  fullName?: string;
  passwordHash?: string;
  authProvider: 'email' | 'google';
  googleId?: string;
  avatar?: string;
  role: string;
  scopes: string[];
}

export interface UserListResponseDTO {
  id: string;
  username?: string;
  displayName?: string;
  fullName?: string;
  avatar?: string;
  createdAt: Date;
}

export interface UserProfileResponseDTO {
  id: string;
  username?: string;
  displayName?: string;
  fullName?: string;
  avatar?: string;
  bio?: string;
  anonymousProfile?: {
    pseudonym: string;
    avatar: string;
    bio?: string;
  };
  createdAt: Date;
}
