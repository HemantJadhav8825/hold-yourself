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
  const resyncMessages = useCallback(async () => {
    if (!conversationId || !messages.length) return;
    
    try {
      // Fetch latest messages to see if we missed any during disconnection
      const latestMessages = await chatService.listMessages(conversationId, 20, 0);
      setMessages(prev => deduplicateMessages(prev, latestMessages));
    } catch (err) {
      console.warn('Resync failed', err);
    }
  }, [conversationId, messages.length]);

  useEffect(() => {
    socketService.on('reconnected', resyncMessages);
    return () => {
      socketService.off('reconnected', resyncMessages);
    };
  }, [resyncMessages]);

// Helper to deduplicate messages by ID and handle optimistic replacements
  const deduplicateMessages = (current: Message[], incoming: Message[]): Message[] => {
    const messageMap = new Map<string, Message>();
    
    // Add current messages first
    current.forEach(msg => messageMap.set(msg.id, msg));
    
    // Process incoming messages
    incoming.forEach(msg => {
      // If we have an optimistic message with this clientMessageId, replace it
      if (msg.clientMessageId) {
        const optimisticId = Array.from(messageMap.keys()).find(id => id === msg.clientMessageId);
        if (optimisticId) {
          messageMap.delete(optimisticId);
        }
      }

      // If matches existing ID, overwrite
      if (messageMap.has(msg.id)) {
         messageMap.set(msg.id, msg); 
         return;
      }

      // Standard add
      messageMap.set(msg.id, msg);
    });

    // Sort logic: Decending by createdAt
    return Array.from(messageMap.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  useEffect(() => {
    const handleNewMessage = (newMessage: Message) => {
      if (newMessage.conversationId !== conversationId) return;
      setMessages(prev => deduplicateMessages(prev, [newMessage]));
    };

    socketService.on('message:new', handleNewMessage);
    return () => {
      socketService.off('message:new', handleNewMessage);
    };
  }, [conversationId, currentUser?.id]);

  // SMART POLLING LOGIC - SAFETY BACKUP
  useEffect(() => {
    if (!conversationId) return;

    const pollInterval = 30000; // Increased interval since we have better socket reliability
    const intervalId = setInterval(async () => {
      // Skip polling if socket is connected
      if (socketService.isConnected()) return;
      
      if (document.visibilityState === 'hidden') return;

      try {
        const latestMessages = await chatService.listMessages(conversationId, 20, 0);
        setMessages(prev => deduplicateMessages(prev, latestMessages));
      } catch (err) {
        console.warn('Polling skipped due to error', err);
      }
    }, pollInterval);

    return () => clearInterval(intervalId);
  }, [conversationId, currentUser?.id]);

  const sendMessage = async (content: string) => {
    if (!conversationId || !content.trim() || !currentUser) return;

    const clientMessageId = crypto.randomUUID();
    const optimisticMessage: Message = {
      id: clientMessageId,
      clientMessageId,
      conversationId,
      senderId: currentUser.id,
      content,
      status: 'sending',
      createdAt: new Date().toISOString(),
    };

    // Optimistic update
    setMessages(prev => [optimisticMessage, ...prev]);

    try {
      setIsSending(true);
      const realMessage = await chatService.sendMessage(conversationId, content, clientMessageId);
      
      // Update with real message and 'sent' status
      setMessages(prev => prev.map(msg => 
        msg.id === clientMessageId ? { ...realMessage, status: 'sent' } : msg
      ));
      return realMessage;
    } catch (err: any) {
      // Mark as failed instead of removing
      setMessages(prev => prev.map(msg => 
        msg.id === clientMessageId ? { ...msg, status: 'failed' } : msg
      ));
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
