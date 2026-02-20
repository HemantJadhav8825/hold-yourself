"use client";

import React from 'react';
import { useConversations } from '@/hooks/useConversations';
import { useMessagingContext } from '@/context/MessagingContext';
import { X, Edit } from 'lucide-react';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { formatDistanceToNowStrict } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { useUsers } from '@/hooks/useUsers';
import { cn } from '@/lib/utils';
import { chatService } from '@/api/chat.service';

export const ConversationList: React.FC = () => {
    const { conversations, setActiveConversationId, includeArchived, onlineUsers, refresh: refreshConversations } = useConversations();
    const { setIsOpen } = useMessagingContext();
    const { user } = useAuth();
    const { users, isLoading: isLoadingUsers, isEmpty: isUsersEmpty } = useUsers(50);

    const displayUsers = users.filter(u => u.id !== user?.id);

    const onChatSelect = async (id: string, isUserSelection = false) => {
        if (isUserSelection) {
            try {
                const existing = conversations.find(c =>
                    c.participants.some((p: any) => (typeof p === 'string' ? p : p.id) === id)
                );

                if (existing) {
                    setActiveConversationId(existing.id);
                } else {
                    const newConv = await chatService.createConversation(id);
                    setActiveConversationId(newConv.id);
                    refreshConversations();
                }
            } catch (err) {
                console.error('Failed to start conversation', err);
            }
        } else {
            setActiveConversationId(id);
        }
    };

    return (
        <div className="flex flex-col h-full bg-paper-bg">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-paper-border/50">
                <Heading level={3} className="text-xl font-bold font-serif tracking-tight">
                    Messages
                </Heading>
                <div className="flex items-center space-x-2">
                    <button className="p-2 rounded-full hover:bg-paper-surfaceSoft transition-colors">
                        <Edit className="w-5 h-5 text-foreground/80" />
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-full hover:bg-paper-surfaceSoft transition-colors"
                    >
                        <X className="w-5 h-5 text-foreground/80" />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2">
                {conversations.length === 0 ? (
                    <div className="p-8 text-center flex flex-col items-center justify-center h-full opacity-60">
                        <div className="flex items-center justify-between px-3 py-2">
                            <Text size="xs" weight="medium" className="uppercase tracking-[0.2em] text-muted-foreground/30 text-[9px]">
                                {includeArchived ? 'Archive' : 'Conversations'}
                            </Text>
                        </div>                <Text size="sm" className="text-foreground/50">
                            You can take your time.
                        </Text>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {conversations.map((conv) => {
                            // Safety invariant: We do NOT use conv.unreadCount here for visual badges.
                            // We just rely on the API already floating unread/recent to the top.

                            const otherParticipant = conv.participants.find(
                                (p: any) => (typeof p === 'string' ? p : p.id) !== user?.id
                            );

                            const otherUserId = typeof otherParticipant === 'string' ? otherParticipant : otherParticipant?.id;
                            const fullOtherUser = users.find(u => u.id === otherUserId);

                            const displayName = fullOtherUser?.displayName || fullOtherUser?.username || 'Someone';
                            const avatarSrc = fullOtherUser?.avatar;

                            const timeStr = conv.lastMessageAt ? formatDistanceToNowStrict(new Date(conv.lastMessageAt), { addSuffix: false }) : '';

                            return (
                                <button
                                    key={conv.id}
                                    onClick={() => setActiveConversationId(conv.id)}
                                    className="w-full text-left flex items-center px-3 h-[72px] rounded-xl hover:bg-paper-surfaceSoft transition-colors"
                                >
                                    <ProfileAvatar
                                        src={avatarSrc}
                                        name={displayName}
                                        size="md"
                                        className="flex-shrink-0"
                                    />

                                    <div className="ml-3 flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <Text className="font-medium truncate text-[15px]">
                                                {displayName}
                                            </Text>
                                            {timeStr && (
                                                <Text className="text-[11px] text-foreground/40 ml-2 flex-shrink-0 font-medium">
                                                    {timeStr}
                                                </Text>
                                            )}
                                        </div>

                                        <Text className="text-[13px] text-foreground/50 truncate">
                                            {conv.lastMessageContent || 'Started a connection'}
                                        </Text>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
                {/* Search & Active Feed */}
                <div className="px-4 space-y-4 mb-4">
                    {/* People to start a chat with */}
                    {!isUsersEmpty && displayUsers.length > 0 && !includeArchived && (
                        <div className="flex flex-col gap-2">
                            <Text size="xs" weight="medium" className="uppercase tracking-[0.2em] px-1 text-muted-foreground/30 text-[9px]">People</Text>
                            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2 border-b border-paper-border/20">
                                {displayUsers.slice(0, 10).map((u) => {
                                    const isOnline = onlineUsers.has(u.id);
                                    return (
                                        <button
                                            key={`user-${u.id}`}
                                            onClick={() => onChatSelect(u.id, true)}
                                            className="flex flex-col items-center gap-1.5 transition-opacity hover:opacity-70 active:scale-95 flex-shrink-0"
                                        >
                                            <div className="relative">
                                                <ProfileAvatar src={u.avatar} name={u.displayName || u.username} size="sm" className={cn("transition-all", !isOnline && "grayscale-[0.5] opacity-80")} />
                                                {isOnline && (
                                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-paper-bg rounded-full" />
                                                )}
                                            </div>
                                            <Text size="xs" className={cn("truncate w-12 text-center text-[10px]", isOnline ? "text-foreground font-medium" : "text-muted-foreground/60")}>
                                                {(u.displayName || u.username)?.split(' ')[0]}
                                            </Text>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
