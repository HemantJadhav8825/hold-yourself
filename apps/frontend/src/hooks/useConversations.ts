import { useState, useEffect, useCallback } from 'react';
import { chatService, Conversation } from '@/api/chat.service';
import { useAuth } from '@/context/AuthContext';
import { socketService } from '@/api/socket.service';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const fetchConversations = useCallback(async () => {
    // Don't fetch if not authenticated
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await chatService.listConversations();
      setConversations(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Wait for auth to complete
    if (authLoading) return;
    
    fetchConversations();
  }, [fetchConversations, authLoading]);

  // Presence logic
  useEffect(() => {
    const handlePresenceUpdate = ({ userId, status }: { userId: string, status: 'online' | 'offline' }) => {
      setOnlineUsers(prev => {
        const next = new Set(prev);
        if (status === 'online') next.add(userId);
        else next.delete(userId);
        return next;
      });
    };

    socketService.on('presence:update', handlePresenceUpdate);
    return () => {
      socketService.off('presence:update', handlePresenceUpdate);
    };
  }, []);

  return {
    conversations,
    isLoading,
    isEmpty: conversations.length === 0,
    error,
    onlineUsers,
    refresh: fetchConversations
  };
}
