import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../api/user.service';
import { User } from '../api/auth.service';

export const useCurrentUser = () => {
  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated || !authUser) {
        setProfile(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const fullProfile = await userService.me();
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

    if (!authLoading) {
      fetchProfile();
    }
  }, [isAuthenticated, authUser, authLoading]);

  return {
    user: profile || authUser,
    isLoading: authLoading || isLoading,
    error,
  };
};
