import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../api/user.service';
import { User } from '../api/auth.service';

export const useCurrentUser = () => {
  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Default to true to prevent premature redirects
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      // If auth is still loading, do nothing yet (the hook returns isLoading: true due to authLoading)
      if (authLoading) return;

      if (!isAuthenticated || !authUser) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      // If we already have a profile and it matches the auth user, we might not need to fetch,
      // but to be safe and get fresh data (like anonymousProfile), we fetch.
      // We keep isLoading true from the initial state.
      
      setError(null);
      try {
        const fullProfile = await userService.me();
        console.log('useCurrentUser fetched profile:', fullProfile);
        setProfile(fullProfile);
      } catch (err: any) {
        console.error('Failed to fetch full profile:', err);
        setError('Something didn’t load. Try again later.');
        // Fallback to authUser if profile fetch fails
        setProfile(authUser);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, authUser, authLoading]);

  const refreshUser = useCallback(async () => {
    if (!authLoading && isAuthenticated) {
      // Re-fetch profile
      try {
        const fullProfile = await userService.me();
        setProfile(fullProfile);
      } catch (e) {
        console.error(e);
      }
    }
  }, [authLoading, isAuthenticated]);

  return {
    user: profile || authUser,
    isLoading: authLoading || isLoading,
    error,
    refreshUser
  };
};
