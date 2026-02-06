import { useState, useEffect } from 'react';
import { userService } from '../api/user.service';
import { User } from '../api/auth.service';
import { useAuth } from '../context/AuthContext';

export const useUsers = (limit: number = 20, offset: number = 0) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    // Don't fetch if auth is still loading or user is not authenticated
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await userService.listUsers(limit, offset);
        setUsers(data);
      } catch (err: any) {
        setError('Something didn\'t load. Try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [limit, offset, isAuthenticated, authLoading]);

  return {
    users,
    isLoading,
    error,
    isEmpty: !isLoading && users.length === 0,
  };
};
