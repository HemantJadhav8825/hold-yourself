'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService, User } from '../api/auth.service';
import { socketService } from '../api/socket.service';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  googleLogin: (code: string, redirectUri?: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const refreshToken = localStorage.getItem('refresh_token');
      const userHint = localStorage.getItem('user_hint');

      if (refreshToken) {
        try {
          // 1. Optimistic UI update from hint
          if (userHint) {
            setUser(JSON.parse(userHint));
          }

          // 2. Real verification: Get fresh access token
          await authService.refresh();
          
          // 3. Connect WebSocket
          socketService.connect();
          
          // Optional: Fetch fresh user profile if needed
          // const profile = await authService.me(); 
          // setUser(profile);
          
        } catch (e) {
          console.error('Session restoration failed:', e);
          // If refresh fails, clear everything
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_hint');
          setUser(null);
        }
      } else {
        // No tokens found, clean up any stale state
        localStorage.removeItem('user_hint');
        setUser(null);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      localStorage.setItem('user_hint', JSON.stringify(data.user));
      socketService.connect();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const googleLogin = useCallback(async (code: string, redirectUri?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.googleLogin(code, redirectUri);
      setUser(data.user);
      localStorage.setItem('user_hint', JSON.stringify(data.user));
      socketService.connect();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Google login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const signup = useCallback(async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.signup(data);
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Signup failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    socketService.disconnect();
    await authService.logout();
    setUser(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        googleLogin,
        signup,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
