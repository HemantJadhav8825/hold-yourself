import React from 'react';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { Text } from '@/components/ui/Text';
import { cn } from '@/lib/utils';

interface ChatListItemProps {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  timestamp?: string;
  isActive?: boolean;
  isOnline?: boolean;
  onClick?: () => void;
}

export const ChatListItem: React.FC<ChatListItemProps> = ({
  name,
  avatar,
  lastMessage,
  timestamp,
  isActive = false,
  isOnline = false,
  onClick,
}) => {
  return (
    <button 
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-3 lg:px-4 rounded-xl transition-all active:scale-[0.98]',
        isActive ? 'bg-primary/5' : 'hover:bg-muted/50'
      )}
    >
      <div className="relative">
        <ProfileAvatar src={avatar} name={name} size="md" />
        {isOnline && (
          <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-primary border-2 border-background rounded-full" />
        )}
      </div>
      
      <div className="flex-1 text-left min-w-0">
        <div className="flex justify-between items-baseline gap-2">
          <Text weight="semibold" className="text-sm truncate">{name}</Text>
          {timestamp && (
            <Text size="xs" muted className="whitespace-nowrap flex-shrink-0">
              {timestamp}
            </Text>
          )}
        </div>
        {lastMessage && (
          <Text size="xs" muted className="truncate max-w-[180px]">
            {lastMessage}
          </Text>
        )}
      </div>
      
      {isActive && (
        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
      )}
    </button>
  );
};
