import { useState, useEffect, useCallback, useRef } from 'react';
import { chatService, Message } from '@/api/chat.service';
import { useCurrentUser } from './useCurrentUser';

export function useChat(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useCurrentUser();
  
  // Ref for pagination
  const offsetRef = useRef(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchMessages = useCallback(async (isLoadMore = false) => {
    if (!conversationId) return;

    try {
      if (!isLoadMore) setIsLoading(true);
      
      const limit = 50;
      const currentOffset = isLoadMore ? offsetRef.current : 0;
      
      const data = await chatService.listMessages(conversationId, limit, currentOffset);
      
      if (isLoadMore) {
        setMessages(prev => [...prev, ...data]);
        offsetRef.current += data.length;
      } else {
        setMessages(data);
        offsetRef.current = data.length;
      }
      
      setHasMore(data.length === limit);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch messages:', err);
      setError(err.response?.data?.error || 'Failed to load messages');
    } finally {
      if (!isLoadMore) setIsLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    setMessages([]);
    offsetRef.current = 0;
    setHasMore(true);
    if (conversationId) {
      fetchMessages();
    }
  }, [conversationId, fetchMessages]);

  const sendMessage = async (content: string) => {
    if (!conversationId || !content.trim() || !currentUser) return;

    const optimisticId = `opt-${Date.now()}`;
    const optimisticMessage: Message = {
      id: optimisticId,
      conversationId,
      senderId: currentUser.id,
      content,
      createdAt: new Date().toISOString(),
    };

    // Optimistic update
    setMessages(prev => [optimisticMessage, ...prev]);

    try {
      setIsSending(true);
      const realMessage = await chatService.sendMessage(conversationId, content);
      
      // Replace optimistic message with real one
      setMessages(prev => prev.map(msg => msg.id === optimisticId ? realMessage : msg));
      return realMessage;
    } catch (err: any) {
      console.error('Failed to send message:', err);
      // Remove optimistic message on failure
      setMessages(prev => prev.filter(msg => msg.id !== optimisticId));
      throw err;
    } finally {
      setIsSending(false);
    }
  };

  return {
    messages,
    isLoading,
    isSending,
    error,
    hasMore,
    loadMore: () => fetchMessages(true),
    sendMessage
  };
}
