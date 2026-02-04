import React from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/Text';

interface MessageBubbleProps {
  content: string;
  isSelf: boolean;
  timestamp?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  isSelf,
  timestamp,
}) => {
  return (
    <div 
      className={cn(
        'flex w-full mb-2',
        isSelf ? 'justify-end' : 'justify-start'
      )}
    >
      <div 
        className={cn(
          'max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm',
          isSelf 
            ? 'bg-primary text-primary-foreground rounded-tr-none' 
            : 'bg-muted text-foreground rounded-tl-none'
        )}
      >
        <Text size="sm" className={isSelf ? 'text-primary-foreground' : 'text-foreground'}>
          {content}
        </Text>
        {timestamp && (
          <div className={cn(
            'text-[10px] mt-1 opacity-50 uppercase tracking-tighter',
            isSelf ? 'text-right' : 'text-left'
          )}>
            {timestamp}
          </div>
        )}
      </div>
    </div>
  );
};
