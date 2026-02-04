'use client';

import React, { useState } from 'react';
import { ChatList } from './ChatList';
import { ChatThread } from './ChatThread';
import { EmptyChatState } from './EmptyChatState';
import { cn } from '@/lib/utils';

import { MessageRequestsList } from './MessageRequestsList';
import { MessageRequestDetail } from './MessageRequestDetail';

export const ChatLayout: React.FC = () => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);

  // Mock thread data
  const threads: Record<string, any> = {
    '1': {
      name: 'alex_mindful',
      messages: [
        { id: 'm1', content: 'Hey, did you see the new collection?', isSelf: false, timestamp: '10:15 AM' },
        { id: 'm2', content: 'Not yet! Send me a link?', isSelf: true, timestamp: '10:16 AM' },
        { id: 'm3', content: 'See you there! 👋', isSelf: false, timestamp: '2:30 PM' },
      ]
    }
  };

  // Mock request data
  const requests: Record<string, any> = {
    'req1': { id: 'req1', name: 'soul_searcher', intro: 'Found your recent reflection very resonant.' },
    'req2': { id: 'req2', name: 'gentle_breeze', intro: 'Hi! Would love to chat about the meditation group.' },
  };

  const activeThread = activeChatId ? threads[activeChatId] : null;
  const activeRequest = activeRequestId ? requests[activeRequestId] : null;
  const isViewingRequests = activeChatId === 'requests';

  return (
    <div className="fixed inset-0 lg:inset-y-0 lg:left-64 bg-background z-50 lg:z-0 flex overflow-hidden">
      {/* List Pane */}
      <div className={cn(
        'w-full lg:w-96 flex-shrink-0',
        (activeChatId || activeRequestId) && 'hidden lg:flex'
      )}>
        {isViewingRequests ? (
          <MessageRequestsList 
            activeRequestId={activeRequestId || undefined}
            onSelect={setActiveRequestId}
            onBack={() => setActiveChatId(null)}
          />
        ) : (
          <ChatList 
            activeChatId={activeChatId || undefined} 
            onChatSelect={setActiveChatId} 
          />
        )}
      </div>

      {/* Thread/Detail Pane */}
      <div className={cn(
        'flex-1 flex flex-col',
        (!activeChatId && !activeRequestId) && 'hidden lg:flex'
      )}>
        {activeRequestId ? (
          <MessageRequestDetail 
            {...activeRequest}
            onAccept={() => {
              setActiveChatId(activeRequestId);
              setActiveRequestId(null);
            }}
            onDecline={() => setActiveRequestId(null)}
            onBack={() => setActiveRequestId(null)}
          />
        ) : activeChatId && activeChatId !== 'requests' ? (
          <ChatThread 
            chatName={activeThread?.name || 'Conversation'} 
            messages={activeThread?.messages || []}
            onBack={() => setActiveChatId(null)}
          />
        ) : (
          <EmptyChatState />
        )}
      </div>
    </div>
  );
};
