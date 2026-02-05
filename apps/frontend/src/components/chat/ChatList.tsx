import React from 'react';
import { ChatListItem } from './ChatListItem';
import { Text } from '@/components/ui/Text';
import { ChevronLeft, Search, PlusSquare } from 'lucide-react';
import Link from 'next/link';
import { useUsers } from '@/hooks/useUsers';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { UserAvatarWithLabel } from '@/components/ui/UserAvatarWithLabel';
import { EmptyQuiet } from '@/illustrations/components/EmptyQuiet';

interface ChatListProps {
  activeChatId?: string;
  onChatSelect: (id: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ 
  activeChatId,
  onChatSelect 
}) => {
  const { users, isLoading, isEmpty } = useUsers(50);
  const { user: currentUser } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="h-full flex flex-col bg-background lg:border-r border-border animate-pulse">
        <div className="p-6 space-y-4">
          <div className="h-8 w-32 bg-primary/10 rounded" />
          <div className="h-10 w-full bg-primary/10 rounded-xl" />
        </div>
        <div className="px-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-24 bg-primary/10 rounded" />
                <div className="h-3 w-full bg-primary/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Filter out current user to show others in the list
  const displayUsers = users.filter(u => u.id !== currentUser?.id);

  return (
    <div className="h-full flex flex-col bg-background lg:border-r border-border">
      {/* Header */}
      <div className="p-4 lg:p-6 pb-2 lg:pb-4 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div className="flex-1">
            <Text weight="bold" className="text-xl lg:text-2xl">Messages</Text>
          </div>
          <button className="p-2 hover:bg-muted rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <PlusSquare className="w-5 h-5" />
          </button>
        </div>

        {/* Requests Entry Point */}
        <button 
          onClick={() => onChatSelect('requests')}
          className="flex items-center justify-between px-3 py-2 bg-primary/5 hover:bg-primary/10 rounded-xl transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <Text size="sm" weight="medium" className="text-primary/80 group-hover:text-primary transition-colors">
              Message requests
            </Text>
          </div>
          <div className="text-xs text-primary/40 font-bold group-hover:text-primary/60 transition-colors">
            {displayUsers.length > 5 ? '5+' : '0'}
          </div>
        </button>
      </div>

      {/* Search & Active Feed */}
      <div className="px-4 space-y-4 mb-4">
        <div className="flex items-center gap-2 bg-muted/30 border border-border rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search" 
            className="bg-transparent border-none focus:ring-0 text-sm w-full py-0.5 outline-none" 
          />
        </div>

        {/* Active People (Horizontal) */}
        {!isEmpty && displayUsers.length > 0 && (
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2 border-b border-border/50">
            {displayUsers.slice(0, 10).map((user) => (
              <UserAvatarWithLabel 
                key={`active-${user.id}`}
                avatarUrl={user.avatar}
                displayName={user.displayName}
                username={user.username}
                size="sm"
                className="w-14"
              />
            ))}
          </div>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 no-scrollbar pb-20 lg:pb-4">
        {!isEmpty && displayUsers.length > 0 ? (
          displayUsers.map((user) => (
            <ChatListItem 
              key={user.id}
              id={user.id}
              name={user.displayName || user.username || 'Anonymous'}
              avatar={user.avatar}
              lastMessage="No messages yet"
              timestamp=""
              isActive={activeChatId === user.id}
              onClick={() => onChatSelect(user.id)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center pt-20 px-6 text-center opacity-40 grayscale space-y-4">
            <EmptyQuiet size="120" />
            <Text size="sm" muted>No conversations here yet.</Text>
          </div>
        )}
      </div>
    </div>
  );
};
