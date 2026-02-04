'use client';

import React, { useState } from 'react';
import { ChatList } from './ChatList';
import { ChatThread } from './ChatThread';
import { EmptyChatState } from './EmptyChatState';
import { cn } from '@/lib/utils';

export const ChatLayout: React.FC = () => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

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

  const activeThread = activeChatId ? threads[activeChatId] : null;

  return (
    <div className="fixed inset-0 lg:inset-y-0 lg:left-64 bg-background z-50 lg:z-0 flex overflow-hidden">
      {/* List Pane */}
      <div className={cn(
        'w-full lg:w-96 flex-shrink-0',
        activeChatId && 'hidden lg:flex'
      )}>
        <ChatList 
          activeChatId={activeChatId || undefined} 
          onChatSelect={setActiveChatId} 
        />
      </div>

      {/* Thread Pane */}
      <div className={cn(
        'flex-1 flex flex-col',
        !activeChatId && 'hidden lg:flex'
      )}>
        {activeChatId ? (
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
