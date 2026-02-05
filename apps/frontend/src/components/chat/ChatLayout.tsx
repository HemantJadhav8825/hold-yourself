'use client';

import React, { useState } from 'react';
import { ChatList } from './ChatList';
import { ChatThread } from './ChatThread';
import { EmptyChatState } from './EmptyChatState';
import { cn } from '@/lib/utils';

import { useChat } from '@/hooks/useChat';
import { useConversations } from '@/hooks/useConversations';
import { MessageRequestsList } from './MessageRequestsList';
import { MessageRequestDetail } from './MessageRequestDetail';
import { Text } from '@/components/ui/Text';

import { chatService } from '@/api/chat.service';

export const ChatLayout: React.FC = () => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const { conversations, refresh: refreshConversations } = useConversations();

  const handleChatSelect = async (id: string, isUserSelection = false) => {
    if (isUserSelection) {
      // Find or create conversation with this user
      try {
        const existing = conversations.find(c => 
          c.participants.some((p: any) => (typeof p === 'string' ? p : p.id) === id)
        );
        
        if (existing) {
          setActiveChatId(existing.id);
        } else {
          const newConv = await chatService.createConversation(id);
          setActiveChatId(newConv.id);
          refreshConversations();
        }
      } catch (err) {
        console.error('Failed to start conversation:', err);
      }
    } else {
      setActiveChatId(id);
    }
  };

  const isViewingRequests = activeChatId === 'requests';
  const activeConversation = conversations.find(c => c.id === activeChatId);

  // Helper to get chat name (the other participant)
  const getChatName = (conv?: typeof conversations[0]) => {
    if (!conv) return 'Conversation';
    // For now, since we don't have populated participants in the REST response usually,
    // we'll let ChatThread/ChatList handle resolving the name from users list.
    return 'Chat'; 
  };

  return (
    <div className="fixed inset-0 lg:inset-y-0 lg:left-64 bg-background z-50 lg:z-0 flex overflow-hidden">
      {/* List Pane */}
      <div className={cn(
        'w-full lg:w-96 flex-shrink-0',
        activeChatId && 'hidden lg:flex'
      )}>
        {isViewingRequests ? (
          <div className="p-10 text-center opacity-40">
            <Text>Requests coming soon...</Text>
            <button onClick={() => setActiveChatId(null)} className="mt-4 text-primary underline">Back</button>
          </div>
        ) : (
          <ChatList 
            activeChatId={activeChatId || undefined} 
            onChatSelect={handleChatSelect} 
          />
        )}
      </div>

      {/* Thread Pane */}
      <div className={cn(
        'flex-1 flex flex-col',
        !activeChatId && 'hidden lg:flex'
      )}>
        {activeChatId && activeChatId !== 'requests' ? (
          <ChatThread 
            conversation={activeConversation}
            onBack={() => setActiveChatId(null)}
          />
        ) : (
          <EmptyChatState />
        )}
      </div>
    </div>
  );
};
