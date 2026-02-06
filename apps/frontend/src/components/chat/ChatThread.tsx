import React from 'react';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { Text } from '@/components/ui/Text';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { ChevronLeft, Info, Archive, Bell, BellOff, Trash2 } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isSelf: boolean;
  timestamp: string;
}

import { useChat } from '@/hooks/useChat';
import { useUsers } from '@/hooks/useUsers';
import { useCurrentUser } from '@/hooks/useCurrentUser';

import { chatService, Conversation } from '@/api/chat.service';

interface ChatThreadProps {
  conversation?: Conversation;
  onBack?: () => void;
}

export const ChatThread: React.FC<ChatThreadProps> = ({
  conversation,
  onBack,
}) => {
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    isSending, 
    typingUsers, 
    onlineStatus, 
    setTyping,
    clearHistory
  } = useChat(conversation?.id || null);
  const { users } = useUsers(50);
  const { user: currentUser } = useCurrentUser();
  
  const [showSettings, setShowSettings] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [isArchived, setIsArchived] = React.useState(false);

  React.useEffect(() => {
    if (conversation && currentUser) {
      const settings = conversation.participantSettings?.find(s => s.userId === currentUser.id);
      setIsMuted(settings?.isMuted || false);
      setIsArchived(settings?.isArchived || false);
    }
  }, [conversation, currentUser]);

  const handleToggleMute = async () => {
    if (!conversation) return;
    try {
      await chatService.updateConversationSettings(conversation.id, { isMuted: !isMuted });
      setIsMuted(!isMuted);
    } catch (err) {
      console.error('Failed to update mute status', err);
    }
  };

  const handleToggleArchive = async () => {
    if (!conversation) return;
    try {
      await chatService.updateConversationSettings(conversation.id, { isArchived: !isArchived });
      setIsArchived(!isArchived);
      if (!isArchived && onBack) onBack(); // If archiving, go back
    } catch (err) {
      console.error('Failed to update archive status', err);
    }
  };

  // Resolve the other participant's info from the conversation participants list
  const getOtherParticipant = () => {
    if (!conversation || !currentUser) return null;
    const other = conversation.participants.find((p: any) => {
      const pId = typeof p === 'string' ? p : (p.id || p._id);
      const currentId = currentUser.id || (currentUser as any)._id;
      return pId !== currentId;
    });
    
    if (!other) return null;
    if (typeof other !== 'string') return other as any;

    return users.find(u => (u.id || (u as any)._id) === other);
  };

  const otherUser = getOtherParticipant();
  const chatName = otherUser?.displayName || otherUser?.username || 'Chat';
  const chatAvatar = otherUser?.avatar;

  const otherUserPresence = otherUser ? onlineStatus.get(otherUser.id) : null;
  const isOnline = otherUserPresence?.status === 'online';

  // Calm Utility: Group messages by sender and time (5-min threshold)
  const groupedMessages = messages.reduce((acc: any[], msg, i) => {
    const prevMsg = messages[i + 1]; // We are in flex-col-reverse
    const nextMsg = messages[i - 1];
    
    const currDate = new Date(msg.createdAt);
    const prevDate = prevMsg ? new Date(prevMsg.createdAt) : null;
    
    // Day Separator Check
    const isNewDay = !prevDate || currDate.toDateString() !== prevDate.toDateString();
    const isLargeGap = prevDate && (currDate.getTime() - prevDate.getTime() > 30 * 60 * 1000);
    
    // Grouping Check
    const isSameSender = prevMsg && prevMsg.senderId === msg.senderId;
    const isWithinThreshold = prevDate && (currDate.getTime() - prevDate.getTime() < 5 * 60 * 1000);
    const isFirstInGroup = isNewDay || isLargeGap || !isSameSender || !isWithinThreshold;
    
    const isLastInGroup = !nextMsg || nextMsg.senderId !== msg.senderId || 
                         (new Date(nextMsg.createdAt).getTime() - currDate.getTime() > 5 * 60 * 1000) ||
                         (new Date(nextMsg.createdAt).getTime() - currDate.getTime() > 30 * 60 * 1000);

    if (isNewDay) {
      acc.push({ type: 'day', date: currDate.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' }) });
    } else if (isLargeGap) {
      acc.push({ type: 'gap', time: currDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
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
          <div className="relative">
            <ProfileAvatar src={chatAvatar} name={chatName} size="sm" />
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary border-2 border-background rounded-full" />
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Text weight="semibold" className="text-sm cursor-pointer">{chatName}</Text>
              {isMuted && <BellOff className="w-3 h-3 text-muted-foreground/40" />}
            </div>
            <Text size="xs" muted className="text-[10px] uppercase tracking-wider opacity-60">
              {isOnline ? (
                <span className="text-primary font-medium">Online now</span>
              ) : otherUserPresence?.lastSeen ? (
                `Last seen ${new Date(otherUserPresence.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
              ) : (
                'Quietly away'
              )}
            </Text>
          </div>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <Info className="w-5 h-5 text-muted-foreground/50" />
          </button>

          {showSettings && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-xl shadow-xl z-50 p-1 animate-in fade-in zoom-in-95 duration-200">
              <button 
                onClick={handleToggleMute}
                className="w-full text-left px-3 py-2 hover:bg-muted rounded-lg flex items-center gap-3 transition-colors"
              >
                {isMuted ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                <Text size="sm">{isMuted ? 'Unmute' : 'Mute'}</Text>
              </button>
              <button 
                onClick={handleToggleArchive}
                className="w-full text-left px-3 py-2 hover:bg-muted rounded-lg flex items-center gap-3 transition-colors"
              >
                <Archive className="w-4 h-4" />
                <Text size="sm">{isArchived ? 'Unarchive' : 'Archive'}</Text>
              </button>
              <div className="h-px bg-border my-1" />
              <button 
                onClick={() => {
                  if (confirm('Clear local history? This only affects this device.')) {
                    clearHistory();
                    setShowSettings(false);
                  }
                }}
                className="w-full text-left px-3 py-2 hover:bg-red-500/10 text-red-500 rounded-lg flex items-center gap-3 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <Text size="sm" className="text-red-500">Clear local history</Text>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 no-scrollbar flex flex-col-reverse relative">
        {/* Typing Indicators */}
        {otherUser && typingUsers.has(otherUser.id) && (
          <div className="absolute bottom-4 left-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="bg-muted/30 px-3 py-1.5 rounded-2xl rounded-bl-none flex items-center gap-1.5">
                <div className="flex gap-1">
                  <span className="w-1 h-1 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1 h-1 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1 h-1 bg-primary/40 rounded-full animate-bounce" />
                </div>
                <Text className="text-[10px] text-muted-foreground font-medium italic opacity-60">
                  {chatName} is thinking...
                </Text>
             </div>
          </div>
        )}

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
            ) : item.type === 'gap' ? (
              <div key={`gap-${idx}`} className="flex justify-center my-4">
                <Text size="xs" muted className="text-[10px] uppercase tracking-widest opacity-20 font-medium">
                  {item.time}
                </Text>
              </div>
            ) : (
              <MessageBubble 
                key={item.id}
                content={item.content}
                isSelf={item.senderId === currentUser?.id}
                status={item.status}
                deliveredAt={item.deliveredAt}
                readAt={item.readAt}
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
            <ProfileAvatar src={chatAvatar} name={chatName} size="xl" />
            <div>
              <Text weight="bold" className="text-xl">{chatName}</Text>
              <Text size="sm" muted className="opacity-40 italic">Nature is always here for you</Text>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <MessageInput 
        onSend={sendMessage} 
        onTypingChange={setTyping}
      />
    </div>
  );
};
