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
// Helper to deduplicate messages by ID and handle optimistic replacements
  const deduplicateMessages = (current: Message[], incoming: Message[]): Message[] => {
    const messageMap = new Map<string, Message>();
    
    // Add current messages first
    current.forEach(msg => messageMap.set(msg.id, msg));
    
    // Process incoming messages
    incoming.forEach(msg => {
      // If matches existing ID, overwrite (likely an update or same message)
      if (messageMap.has(msg.id)) {
         // Optionally check timestamps or content if needed, but ID match is definitive for identity
         messageMap.set(msg.id, msg); 
         return;
      }

      // Optimistic Check: If incoming is from current user, check if we have a matching optimistic message
      if (msg.senderId === currentUser?.id) {
         // Find any optimistic message with same content
         const optimisticMatchId = Array.from(messageMap.keys()).find(id => 
           id.startsWith('opt-') && 
           messageMap.get(id)?.content === msg.content
         );

         if (optimisticMatchId) {
           // Remove optimistic, add real
           messageMap.delete(optimisticMatchId);
           messageMap.set(msg.id, msg);
           return;
         }
      }

      // No duplicate, no optimistic match -> add it
      messageMap.set(msg.id, msg);
    });

    // Convert back to array and sort by createdAt (assuming API returns sorted, but good to be safe)
    // Actually, chat usually relies on array order. 
    // If we assume `incoming` are NEWER, we should merge carefully.
    // But `fetchMessages` can break order if we just map.
    // Safer strategy: Keep `current` order, append/prepend `incoming` appropriately?
    // The current state structure is likely [newest, ..., oldest] or [oldest, ..., newest]?
    // Looking at `fetchMessages`: `setMessages(prev => [...prev, ...data]);` (Load More appends).
    // This implies `messages` are [Newest -> Oldest] (if `data` is older) OR [Oldest -> Newest] (if `data` is newer)?
    // Standard chat: usually [Oldest, ..., Newest].
    // If `loadMore` appends, it implies `data` is NEWER? No, usually load more fetches OLDER.
    // If `loadMore` calls `listMessages(offset)`, it gets the NEXT page.
    // If server returns [Message 50...1], then appending puts them at end.
    // If UI renders `messages.map`, and we want Oldest -> Newest (top to bottom), 
    // then `loadMore` should PREPEND older messages?
    // BUT `fetchMessages` APPENDS: `[...prev, ...data]`.
    // And `handleNewMessage` PREPENDS: `[newMessage, ...prev]`.
    // CONTRADICTION!
    // `handleNewMessage`: `[newMessage, ...prev]` -> Newest is at Index 0.
    // `fetchMessages`: `[...prev, ...data]` -> Appends to end.
    // So `prev` (Newest...Oldest) + `data` (Next Page causing even Older).
    // So the list is [Newest, ..., Oldest].
    // So index 0 is at BOTTOM of screen (if flex-col-reverse) or TOP (if standard)?
    // Standard map renders Index 0 at TOP.
    // If Index 0 is Newest, then Newest is at Top. Chat usually has Newest at Bottom.
    // So likely standard UI uses `flex-col-reverse` or renders in reverse?
    // Regardless, valid list order seems to be Descending (Newest -> Oldest).
    
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

    const pollInterval = 3000;
    const intervalId = setInterval(async () => {
      // Skip polling if socket is connected
      if (socketService.isConnected()) return;
      
      if (document.visibilityState === 'hidden') return;

      try {
        // Fetch only latest 20 to check for new ones
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
