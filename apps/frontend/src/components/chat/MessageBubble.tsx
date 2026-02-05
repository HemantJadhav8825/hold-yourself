import React from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/Text';

interface MessageBubbleProps {
  content: string;
  isSelf: boolean;
  timestamp?: string;
  isFirstInGroup?: boolean;
  isLastInGroup?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  isSelf,
  timestamp,
  isFirstInGroup = true,
  isLastInGroup = true,
}) => {
  return (
    <div 
      className={cn(
        'flex w-full group relative transition-all duration-300',
        isSelf ? 'justify-end' : 'justify-start',
        isLastInGroup ? 'mb-4' : 'mb-0.5'
      )}
    >
      <div 
        className={cn(
          'max-w-[75%] px-4 py-2 text-sm leading-relaxed transition-all duration-200',
          // Adaptive Radius Logic
          isSelf 
            ? cn(
                'bg-primary text-primary-foreground',
                'rounded-2xl rounded-tr-sm',
                !isFirstInGroup && 'rounded-tr-2xl',
                !isLastInGroup && 'rounded-br-sm'
              )
            : cn(
                'bg-muted text-foreground',
                'rounded-2xl rounded-tl-sm',
                !isFirstInGroup && 'rounded-tl-2xl',
                !isLastInGroup && 'rounded-bl-sm'
              )
        )}
      >
        <Text size="sm" className={cn(
          'block',
          isSelf ? 'text-primary-foreground' : 'text-foreground'
        )}>
          {content}
        </Text>
        
        {timestamp && (
          <div className={cn(
            'absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap px-2',
            isSelf ? 'right-full' : 'left-full'
          )}>
            <Text size="xs" muted className="text-[10px] uppercase tracking-tighter">
              {timestamp}
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};
