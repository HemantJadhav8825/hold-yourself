import { useState, useEffect, useCallback } from 'react';
import { chatService, Conversation } from '@/api/chat.service';
import { useAuth } from '@/context/AuthContext';
import { socketService } from '@/api/socket.service';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [includeArchived, setIncludeArchived] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  const fetchConversations = useCallback(async () => {
    // Don't fetch if not authenticated
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await chatService.listConversations(includeArchived);
      setConversations(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, includeArchived]);

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

    const handlePresenceInitial = (userIds: string[]) => {
      setOnlineUsers(new Set(userIds));
    };

    const syncPresence = () => {
      socketService.emit('presence:sync', {});
    };

    socketService.on('presence:initial', handlePresenceInitial);
    socketService.on('presence:update', handlePresenceUpdate);
    socketService.on('reconnected', syncPresence);

    // Unread count handlers
    const handleConversationRead = ({ conversationId, userId }: { conversationId: string, userId: string }) => {
      // Only clear if it was read by the current user (on another device or this one)
      const currentUserId = user?.id || '';
      if (userId && userId !== currentUserId) return;

      setConversations(prev => prev.map(c => {
        if (c.id === conversationId) {
          return { ...c, unreadCount: 0 };
        }
        return c;
      }));
    };

    const handleNewMessage = ({ conversationId, senderId }: { conversationId: string, senderId: string }) => {
      const currentUserId = user?.id || '';
      
      setConversations(prev => {
        const index = prev.findIndex(c => c.id === conversationId);
        // If conversation not found, it's a new conversation (or we were removed and added back).
        // Since we don't have full conversation details in this event, we must fetch fresh.
        if (index === -1) {
          fetchConversations();
          return prev;
        } 
        
        const updated = [...prev];
        const conv = { ...updated[index] };
        
        // Update lastMessageAt regardless of who sent it
        conv.lastMessageAt = new Date().toISOString(); 

        // Increment unread count ONLY if:
        // 1. Message is NOT from current user
        // 2. We are NOT currently "reading" it? 
        //    (Optimistic UI issue: if we are in chat, we mark as read immediately, 
        //    but the socket event comes later. If we increment here using socket event, 
        //    we might flicker. But `handleConversationRead` should arrive and clear it.)
        //    For now, standard logic: if sender != me, increment.
        
        if (senderId && senderId !== currentUserId) { 
           conv.unreadCount = (conv.unreadCount || 0) + 1;
        }
        
        updated.splice(index, 1);
        updated.unshift(conv);
        return updated;
      });
    };

    socketService.on('conversation:read', handleConversationRead);
    socketService.on('message:new', handleNewMessage);
    
    // Initial sync attempt
    syncPresence();

    return () => {
      socketService.off('presence:initial', handlePresenceInitial);
      socketService.off('presence:update', handlePresenceUpdate);
      socketService.off('reconnected', syncPresence);
      socketService.off('conversation:read', handleConversationRead);
      socketService.off('message:new', handleNewMessage);
    };
  }, [user?.id]);

  return {
    conversations,
    includeArchived,
    setIncludeArchived,
    isLoading,
    isEmpty: conversations.length === 0,
    error,
    onlineUsers,
    refresh: fetchConversations
  };
}
