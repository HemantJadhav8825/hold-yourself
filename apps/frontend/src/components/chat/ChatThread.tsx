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

  // Calm Utility: Group messages by sender and time (5-min threshold)
  const groupedMessages = messages.reduce((acc: any[], msg, i) => {
    const prevMsg = messages[i + 1]; // We are in flex-col-reverse
    const nextMsg = messages[i - 1];
    
    const currDate = new Date(msg.createdAt);
    const prevDate = prevMsg ? new Date(prevMsg.createdAt) : null;
    
    // Day Separator Check
    const isNewDay = !prevDate || currDate.toDateString() !== prevDate.toDateString();
    
    // Grouping Check
    const isSameSender = prevMsg && prevMsg.senderId === msg.senderId;
    const isWithinThreshold = prevDate && (currDate.getTime() - prevDate.getTime() < 5 * 60 * 1000);
    const isFirstInGroup = isNewDay || !isSameSender || !isWithinThreshold;
    
    const isLastInGroup = !nextMsg || nextMsg.senderId !== msg.senderId || 
                         (new Date(nextMsg.createdAt).getTime() - currDate.getTime() > 5 * 60 * 1000);

    if (isNewDay) {
      acc.push({ type: 'day', date: currDate.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' }) });
    }

    acc.push({
      ...msg,
      type: 'message',
      isFirstInGroup,
      isLastInGroup
    });

    return acc;
  }, []);

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
            <Text size="xs" muted className="hidden lg:block text-primary/40 italic">In a quiet space</Text>
          </div>
        </div>
        
        <button className="p-2 hover:bg-muted rounded-full transition-colors">
          <Info className="w-5 h-5 text-muted-foreground/50" />
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 no-scrollbar flex flex-col-reverse">
        {groupedMessages.length > 0 ? (
          groupedMessages.map((item, idx) => (
            item.type === 'day' ? (
              <div key={`day-${idx}`} className="flex justify-center my-8">
                <div className="px-3 py-1 bg-muted/30 rounded-full">
                  <Text size="xs" muted className="text-[10px] uppercase tracking-widest font-bold opacity-40">
                    {item.date}
                  </Text>
                </div>
              </div>
            ) : (
              <MessageBubble 
                key={item.id}
                content={item.content}
                isSelf={item.senderId === currentUser?.id}
                status={item.status}
                error={item.error}
                timestamp={new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                isFirstInGroup={item.isFirstInGroup}
                isLastInGroup={item.isLastInGroup}
                onRetry={() => sendMessage(item.content, item.clientMessageId)}
              />
            )
          ))
        ) : isLoading ? (
          <div className="h-full flex items-center justify-center opacity-20">
            <Text>Listening to the silence...</Text>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
            <ProfileAvatar src={chatAvatar} name={chatName} size="xl" hasStory storySeen />
            <div>
              <Text weight="bold" className="text-xl">{chatName}</Text>
              <Text size="sm" muted className="opacity-40 italic">Nature is always here for you</Text>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <MessageInput onSend={sendMessage} />
    </div>
  );
};
