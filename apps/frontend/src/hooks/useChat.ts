import { useState, useEffect, useCallback, useRef } from 'react';
import { chatService, Message } from '@/api/chat.service';
import { useCurrentUser } from './useCurrentUser';
import { socketService } from '@/api/socket.service';

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

  // SOCKET LOGIC
  useEffect(() => {
    if (!conversationId) return;

    // Connect socket
    socketService.connect();

    const handleNewMessage = (newMessage: Message) => {
      // Only process messages for this conversation
      if (newMessage.conversationId !== conversationId) return;

      setMessages(prev => {
        // Deduplication
        const exists = prev.some(m => m.id === newMessage.id);
        if (exists) return prev;

        // Optimistic match check
        if (newMessage.senderId === currentUser?.id) {
           const hasMatchingOptimistic = prev.some(p => 
             p.id.startsWith('opt-') && 
             p.content === newMessage.content
           );
           // If we have an optimistic message, we technically should replace it.
           // However, the 'sendMessage' function also replaces it when the REST call returns.
           // To avoid race conditions, if there is a match, we might want to let the existing flow handle it
           // OR we can replace it here.
           // Simplest: If ID matches, we skip (exists check). 
           // If content matches and optimistic: 
           if (hasMatchingOptimistic) {
               // Replace the optimistic one with real one
               return prev.map(p => (p.id.startsWith('opt-') && p.content === newMessage.content) ? newMessage : p);
           }
        }

        // Add to front
        return [newMessage, ...prev];
      });
    };

    socketService.on('message:new', handleNewMessage);

    return () => {
      socketService.off('message:new', handleNewMessage);
      // We don't disconnect here because other components might use it, 
      // but simpler to disconnect if we only use it for chat. 
      // For now, let's keep it alive or minimal management. 
      // Actually, standard is to disconnect or ref count. 
      // Given the rules, let's just detach listener.
    };
  }, [conversationId, currentUser?.id]);

  // SMART POLLING LOGIC - SAFETY BACKUP
  useEffect(() => {
    if (!conversationId) return;

    // Reduced polling frequency if socket is active? 
    // Users requested "REST polling remains as backup". 
    // We'll keep it at 3000ms.
    const pollInterval = 3000;
    
    const intervalId = setInterval(async () => {
      // 1. Tab visibility check
      if (document.visibilityState === 'hidden') return;

      try {
        // 2. Fetch latest messages (offset 0) safely
        const latestMessages = await chatService.listMessages(conversationId, 20, 0);
        
        setMessages(prev => {
          if (!prev.length && latestMessages.length) return latestMessages;
          
          const existingIds = new Set(prev.map(m => m.id));
          const newMessages = latestMessages.filter(msg => {
            if (existingIds.has(msg.id)) return false;
            
            // Optimistic Duplication Guard
            if (msg.senderId === currentUser?.id) {
               const hasMatchingOptimistic = prev.some(p => 
                 p.id.startsWith('opt-') && 
                 p.content === msg.content
               );
               if (hasMatchingOptimistic) return false;
            }
            return true;
          });

          if (newMessages.length === 0) return prev;
          return [...newMessages, ...prev];
        });

      } catch (err) {
        console.warn('Polling skipped due to error', err);
      }
    }, pollInterval);

    return () => clearInterval(intervalId);
  }, [conversationId, currentUser?.id]);

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
