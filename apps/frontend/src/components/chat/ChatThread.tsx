import React from 'react';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { Text } from '@/components/ui/Text';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { ChevronLeft, Info } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isSelf: boolean;
  timestamp: string;
}

interface ChatThreadProps {
  chatName: string;
  chatAvatar?: string;
  messages?: Message[];
  onBack?: () => void;
}

export const ChatThread: React.FC<ChatThreadProps> = ({
  chatName,
  chatAvatar,
  messages = [],
  onBack,
}) => {
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <header className="h-16 lg:h-20 border-b border-border flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="lg:hidden p-1 -ml-1">
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          <ProfileAvatar src={chatAvatar} name={chatName} size="sm" hasStory storySeen />
          <div className="flex flex-col">
            <Text weight="semibold" className="text-sm cursor-pointer">{chatName}</Text>
            <Text size="xs" muted className="hidden lg:block">Active quietness</Text>
          </div>
        </div>
        
        <button className="p-2 hover:bg-muted rounded-full transition-colors">
          <Info className="w-5 h-5" />
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-1 no-scrollbar">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <MessageBubble 
              key={msg.id}
              content={msg.content}
              isSelf={msg.isSelf}
              timestamp={msg.timestamp}
            />
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
            <ProfileAvatar src={chatAvatar} name={chatName} size="xl" hasStory storySeen />
            <div>
              <Text weight="bold" className="text-xl">{chatName}</Text>
              <Text size="sm" muted>WeBelong Community</Text>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <MessageInput />
    </div>
  );
};
