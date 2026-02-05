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

import { useChat } from '@/hooks/useChat';
import { useUsers } from '@/hooks/useUsers';
import { useCurrentUser } from '@/hooks/useCurrentUser';

import { Conversation } from '@/api/chat.service';

interface ChatThreadProps {
  conversation?: Conversation;
  onBack?: () => void;
}

export const ChatThread: React.FC<ChatThreadProps> = ({
  conversation,
  onBack,
}) => {
  const { messages, sendMessage, isLoading, isSending } = useChat(conversation?.id || null);
  const { users } = useUsers(50);
  const { user: currentUser } = useCurrentUser();

  // Resolve the other participant's info from the conversation participants list
  const getOtherParticipant = () => {
    if (!conversation) return null;
    const otherId = conversation.participants.find((p: any) => (typeof p === 'string' ? p : p.id) !== currentUser?.id);
    return users.find(u => u.id === (typeof otherId === 'string' ? otherId : otherId?.id));
  };

  const otherUser = getOtherParticipant();
  const chatName = otherUser?.displayName || otherUser?.username || 'Chat';
  const chatAvatar = otherUser?.avatar;

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
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-1 no-scrollbar flex flex-col-reverse">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <MessageBubble 
              key={msg.id}
              content={msg.content}
              isSelf={msg.senderId === currentUser?.id}
              timestamp={new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            />
          ))
        ) : isLoading ? (
          <div className="h-full flex items-center justify-center opacity-20">
            <Text>Loading silence...</Text>
          </div>
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
      <MessageInput onSend={sendMessage} />
    </div>
  );
};
