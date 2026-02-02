'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService, User } from '../api/auth.service';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  googleLogin: (code: string) => Promise<void>;
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

      if (refreshToken && userHint) {
        try {
          setUser(JSON.parse(userHint));
          // Token will be refreshed on the first API call if needed, 
          // or we can proactively refresh here.
        } catch (e) {
          localStorage.removeItem('user_hint');
        }
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
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const googleLogin = useCallback(async (code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.googleLogin(code);
      setUser(data.user);
      localStorage.setItem('user_hint', JSON.stringify(data.user));
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
