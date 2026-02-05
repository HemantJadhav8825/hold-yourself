import { useState, useEffect, useCallback } from 'react';
import { chatService, Conversation } from '@/api/chat.service';
import { useAuth } from '@/context/AuthContext';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      console.error('Failed to fetch conversations:', err);
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

  return {
    conversations,
    isLoading,
    isEmpty: conversations.length === 0,
    error,
    refresh: fetchConversations
  };
}
