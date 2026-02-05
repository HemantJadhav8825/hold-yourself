import { useState, useEffect, useCallback } from 'react';
import { chatService, Conversation } from '@/api/chat.service';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    isLoading,
    isEmpty: conversations.length === 0,
    error,
    refresh: fetchConversations
  };
}
