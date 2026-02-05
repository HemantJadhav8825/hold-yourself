import React from 'react';
import { ChatListItem } from './ChatListItem';
import { Text } from '@/components/ui/Text';
import { ChevronLeft, Search, PlusSquare } from 'lucide-react';
import Link from 'next/link';
import { useUsers } from '@/hooks/useUsers';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { UserAvatarWithLabel } from '@/components/ui/UserAvatarWithLabel';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { EmptyQuiet } from '@/illustrations/components/EmptyQuiet';

import { useConversations } from '@/hooks/useConversations';

interface ChatListProps {
  activeChatId?: string;
  onChatSelect: (id: string, isUserSelection?: boolean) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ 
  activeChatId,
  onChatSelect 
}) => {
  const { users, isLoading: isLoadingUsers, isEmpty: isUsersEmpty } = useUsers(50);
  const { conversations, isLoading: isLoadingChats } = useConversations();
  const { user: currentUser } = useCurrentUser();

  const isLoading = isLoadingUsers || isLoadingChats;

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

  // Helper to resolve conversation participant info
  const resolveConversationInfo = (conv: any) => {
    const otherId = conv.participants.find((p: any) => (typeof p === 'string' ? p : p.id) !== currentUser?.id);
    const otherUser = users.find(u => u.id === (typeof otherId === 'string' ? otherId : otherId?.id));
    
    return {
       id: conv.id,
       name: otherUser?.displayName || otherUser?.username || 'Quiet User',
       avatar: otherUser?.avatar,
       lastMessage: 'View message history',
       timestamp: new Date(conv.lastMessageAt).toLocaleDateString([], { month: 'short', day: 'numeric' })
    };
  };

  return (
    <div className="h-full flex flex-col bg-background lg:border-r border-border">
      {/* Header */}
      <div className="p-4 lg:p-6 pb-2 lg:pb-4 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/20">
            <ChevronLeft className="w-5 h-5 text-muted-foreground/50" />
          </Link>
          <div className="flex-1">
            <Text weight="medium" className="text-lg text-foreground/80">Messages</Text>
          </div>
          <button className="p-2 hover:bg-muted rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/20">
            <PlusSquare className="w-5 h-5 text-muted-foreground/30" />
          </button>
        </div>

        {/* Requests Entry Point - Subtler */}
        <button 
          onClick={() => onChatSelect('requests')}
          className="flex items-center justify-between px-3 py-2 hover:bg-muted/50 rounded-xl transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-primary/10 border border-transparent hover:border-border/20"
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
            <Text size="sm" className="text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">
              Message requests
            </Text>
          </div>
          <div className="text-xs text-muted-foreground/20 font-medium group-hover:text-muted-foreground/40 transition-colors">
            {conversations.length > 5 ? '5+' : '0'}
          </div>
        </button>
      </div>

      {/* Search & Active Feed */}
      <div className="px-4 space-y-4 mb-4">
        <div className="flex items-center gap-2 bg-muted/10 border border-border/30 rounded-lg px-3 py-1.5 focus-within:ring-1 focus-within:ring-border transition-all">
          <Search className="w-4 h-4 text-muted-foreground/30" />
          <input 
            type="text" 
            placeholder="Search" 
            className="bg-transparent border-none focus:ring-0 text-sm w-full py-0.5 outline-none placeholder:text-muted-foreground/20" 
          />
        </div>

        {/* People to start a chat with - Subtler */}
        {!isUsersEmpty && displayUsers.length > 0 && (
          <div className="flex flex-col gap-2">
            <Text size="xs" weight="medium" className="uppercase tracking-[0.2em] px-1 text-muted-foreground/30 text-[9px]">People</Text>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2 border-b border-border/20">
              {displayUsers.slice(0, 10).map((u) => (
                <button 
                  key={`user-${u.id}`} 
                  onClick={() => onChatSelect(u.id, true)}
                  className="flex flex-col items-center gap-1.5 transition-opacity hover:opacity-70 active:scale-95"
                >
                  <ProfileAvatar src={u.avatar} name={u.displayName} size="sm" className="grayscale-[0.5] hover:grayscale-0 transition-all opacity-80" />
                  <Text size="xs" className="truncate w-12 text-center text-muted-foreground/60 text-[10px]">{u.displayName?.split(' ')[0]}</Text>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 no-scrollbar pb-20 lg:pb-4">
        <Text size="xs" weight="medium" className="uppercase tracking-[0.2em] px-3 py-2 text-muted-foreground/30 text-[9px]">Recent Chats</Text>
        {conversations.length > 0 ? (
          conversations.map((conv) => {
            const info = resolveConversationInfo(conv);
            return (
              <ChatListItem 
                key={conv.id}
                id={info.id}
                name={info.name}
                avatar={info.avatar}
                lastMessage={info.lastMessage}
                timestamp={info.timestamp}
                isActive={activeChatId === conv.id}
                onClick={() => onChatSelect(conv.id)}
              />
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center pt-10 px-6 text-center opacity-40 grayscale space-y-4">
            <EmptyQuiet size="100" />
            <Text size="sm" muted>No conversations here yet.</Text>
          </div>
        )}
      </div>
    </div>
  );
};
