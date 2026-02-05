import { useState, useEffect } from 'react';
import { userService } from '../api/user.service';
import { User } from '../api/auth.service';

export const useUsers = (limit: number = 20, offset: number = 0) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await userService.listUsers(limit, offset);
        setUsers(data);
      } catch (err: any) {
        console.error('Failed to fetch users:', err);
        setError('Something didn’t load. Try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [limit, offset]);

  return {
    users,
    isLoading,
    error,
    isEmpty: !isLoading && users.length === 0,
  };
};
