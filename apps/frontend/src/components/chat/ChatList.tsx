import React from 'react';
import { ChatListItem } from './ChatListItem';
import { Text } from '@/components/ui/Text';
import { ChevronLeft, Search, PlusSquare } from 'lucide-react';
import Link from 'next/link';

interface Chat {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  timestamp?: string;
}

interface ChatListProps {
  chats?: Chat[];
  activeChatId?: string;
  onChatSelect: (id: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ 
  chats = [], 
  activeChatId,
  onChatSelect 
}) => {
  // Scaffolding mock data if empty
  const displayChats = chats.length > 0 ? chats : [
    { id: '1', name: 'alex_mindful', lastMessage: 'See you there! 👋', timestamp: '2h' },
    { id: '2', name: 'webelong_bot', lastMessage: 'Welcome to the quiet space.', timestamp: '1d' },
    { id: '3', name: 'nature_seeker', lastMessage: 'That photo was incredible.', timestamp: '2d' },
  ];

  return (
    <div className="h-full flex flex-col bg-background lg:border-r border-border">
      {/* Header */}
      <div className="p-4 lg:p-6 pb-2 lg:pb-4 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div className="flex-1">
            <Text weight="bold" className="text-xl lg:text-2xl">Messages</Text>
          </div>
          <button className="p-2 hover:bg-muted rounded-full transition-colors">
            <PlusSquare className="w-5 h-5" />
          </button>
        </div>

        {/* Requests Entry Point */}
        <button 
          onClick={() => onChatSelect('requests')}
          className="flex items-center justify-between px-3 py-2 bg-primary/5 hover:bg-primary/10 rounded-xl transition-colors group"
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <Text size="sm" weight="medium" className="text-primary/80 group-hover:text-primary transition-colors">
              Message requests
            </Text>
          </div>
          <div className="text-xs text-primary/40 font-bold group-hover:text-primary/60 transition-colors">2</div>
        </button>
      </div>

      {/* Search Scaffolding */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 bg-muted/30 border border-border rounded-lg px-3 py-1.5">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search" 
            className="bg-transparent border-none focus:ring-0 text-sm w-full py-0.5" 
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 no-scrollbar pb-20 lg:pb-4">
        {displayChats.map((chat) => (
          <ChatListItem 
            key={chat.id}
            {...chat}
            isActive={activeChatId === chat.id}
            onClick={() => onChatSelect(chat.id)}
          />
        ))}
      </div>
    </div>
  );
};
