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

export const ConversationList: React.FC = () => {
    const { conversations, setActiveConversationId } = useConversations();
    const { setIsOpen } = useMessagingContext();
    const { user } = useAuth();

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
                        className="p-2 rounded-full hover:bg-paper-surfaceSoft transition-colors lg:hidden"
                    >
                        <X className="w-5 h-5 text-foreground/80" />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2">
                {conversations.length === 0 ? (
                    <div className="p-8 text-center flex flex-col items-center justify-center h-full opacity-60">
                        <Text>No messages yet.</Text>
                        <Text size="sm" className="mt-2 text-foreground/60">
                            Connections will appear here.
                        </Text>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {conversations.map((conv) => {
                            // Safety invariant: We do NOT use conv.unreadCount here for visual badges.
                            // We just rely on the API already floating unread/recent to the top.

                            const otherParticipant = conv.participants.find(
                                (p: any) => p.id !== user?.id
                            ) as any;

                            const displayName = otherParticipant?.displayName || otherParticipant?.username || 'Someone';
                            const avatarSrc = otherParticipant?.avatar;

                            const timeStr = conv.lastMessageAt ? formatDistanceToNowStrict(new Date(conv.lastMessageAt), { addSuffix: false }) : '';

                            return (
                                <button
                                    key={conv.id}
                                    onClick={() => setActiveConversationId(conv.id)}
                                    className="w-full text-left flex items-center p-3 rounded-xl hover:bg-paper-surfaceSoft transition-colors group"
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
                                                <Text size="xs" className="text-foreground/50 ml-2 flex-shrink-0">
                                                    {timeStr}
                                                </Text>
                                            )}
                                        </div>

                                        <Text size="sm" className="text-foreground/60 truncate">
                                            {conv.lastMessageContent || 'Started a connection'}
                                        </Text>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
