"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useConversations } from '@/hooks/useConversations';
import { chatService, Message } from '@/api/chat.service';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Send, X, Maximize2 } from 'lucide-react';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { cn } from '@/lib/utils';
import { socketService } from '@/api/socket.service';
import { motion, AnimatePresence } from 'framer-motion';
import { useMessagingContext } from '@/context/MessagingContext';
import { useUsers } from '@/hooks/useUsers';
import Link from 'next/link';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';

export const ConversationView: React.FC = () => {
    const { activeConversationId, setActiveConversationId, conversations } = useConversations();
    const { setIsOpen } = useMessagingContext();
    const { user } = useAuth();
    const { users } = useUsers(50);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [prevConvId, setPrevConvId] = useState<string | null>(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const virtuosoRef = useRef<VirtuosoHandle>(null);

    if (activeConversationId !== prevConvId) {
        setPrevConvId(activeConversationId);
        setMessages([]);
        setIsLoading(activeConversationId !== null);
    }

    const conversation = conversations.find(c => c.id === activeConversationId);

    // Safety check because sometimes it's undefined initially
    const otherParticipantIdRaw = conversation?.participants.find(
        (p: any) => (typeof p === 'string' ? p : p.id) !== user?.id
    );

    const otherParticipantId = typeof otherParticipantIdRaw === 'string' ? otherParticipantIdRaw : otherParticipantIdRaw?.id;
    const fullOtherUser = users.find(u => u.id === otherParticipantId);

    const displayName = fullOtherUser?.displayName || fullOtherUser?.username || 'Someone';
    const avatarSrc = fullOtherUser?.avatar;

    useEffect(() => {
        if (!activeConversationId) return;

        chatService.listMessages(activeConversationId)
            .then(msgs => {
                setMessages(msgs.reverse());
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setIsLoading(false);
            });
    }, [activeConversationId]);

    useEffect(() => {
        if (!activeConversationId) return;

        const handleNewMessage = (msg: Message) => {
            if (msg.conversationId === activeConversationId) {
                setMessages(prev => {
                    if (prev.some(m => m.id === msg.id)) return prev;
                    return [...prev, msg];
                });
            }
        };

        socketService.on('message:new', handleNewMessage);
        return () => {
            socketService.off('message:new', handleNewMessage);
        };
    }, [activeConversationId]);

    // Scroll handling is now managed internally by Virtuoso via followOutput

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim() || !activeConversationId) return;

        const content = newMessage.trim();
        setNewMessage('');

        try {
            const msg = await chatService.sendMessage(activeConversationId, content);
            setMessages(prev => {
                if (prev.some(m => m.id === msg.id)) return prev;
                return [...prev, msg];
            });
        } catch (error) {
            console.error('Failed to send message', error);
        }
    };

    const handleSendSupport = async () => {
        if (!activeConversationId) return;
        try {
            const msg = await chatService.sendMessage(activeConversationId, "Held. 🤎");
            setMessages(prev => {
                if (prev.some(m => m.id === msg.id)) return prev;
                return [...prev, msg];
            });
        } catch (error) {
            console.error('Failed to send support', error);
        }
    };

    if (!conversation) return null;

    return (
        <div className="flex flex-col h-full bg-paper-bg relative">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-paper-border/50">
                <div className="flex items-center min-w-0 pr-2">
                    <button
                        onClick={() => setActiveConversationId(null)}
                        className="mr-3 p-2 rounded-full hover:bg-paper-surfaceSoft transition-colors flex-shrink-0"
                    >
                        <ArrowLeft className="w-5 h-5 text-foreground/80" />
                    </button>
                    <button
                        onClick={() => setIsProfileModalOpen(true)}
                        className="flex-shrink-0 transition-opacity hover:opacity-80 focus:outline-none"
                    >
                        <ProfileAvatar src={avatarSrc} name={displayName} size="sm" />
                    </button>
                    <button
                        onClick={() => setIsProfileModalOpen(true)}
                        className="ml-3 text-left focus:outline-none hover:opacity-80 transition-opacity truncate"
                    >
                        <Heading level={4} className="text-lg font-bold font-serif leading-tight truncate">
                            {displayName}
                        </Heading>
                    </button>
                </div>
                <div className="flex items-center space-x-1">
                    <Link
                        href="/messages"
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-full hover:bg-paper-surfaceSoft transition-colors inline-flex"
                        aria-label="Open in full screen"
                    >
                        <Maximize2 className="w-4 h-4 text-foreground/80 mt-0.5" />
                    </Link>
                    <button
                        onClick={() => setActiveConversationId(null)}
                        className="p-2 flex-shrink-0 rounded-full hover:bg-paper-surfaceSoft transition-colors"
                    >
                        <X className="w-5 h-5 text-foreground/80" />
                    </button>
                </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-hidden relative">
                {isLoading ? (
                    <div className="flex justify-center p-4 opacity-50">
                        <Text size="sm">Loading connection...</Text>
                    </div>
                ) : (
                    <Virtuoso
                        ref={virtuosoRef}
                        data={messages}
                        initialTopMostItemIndex={messages.length - 1}
                        followOutput="smooth"
                        alignToBottom={true}
                        className="w-full h-full pb-2"
                        itemContent={(idx: number, msg: Message) => {
                            const isMe = msg.senderId === user?.id;
                            const isRemoved = msg.content === 'Message unavailable';

                            return (
                                <div className={cn("flex px-4 py-1", isMe ? "justify-end" : "justify-start")}>
                                    <div className={cn(
                                        "max-w-[68%] px-[14px] py-[10px] rounded-[18px]",
                                        isMe ? "bg-paper-border/40 text-foreground rounded-tr-sm" : "bg-paper-surfaceSoft text-foreground rounded-tl-sm border border-paper-border/30",
                                        isRemoved && "bg-transparent border border-dashed border-paper-border text-foreground/50 italic opacity-80"
                                    )}>
                                        <Text size="sm" className="whitespace-pre-wrap leading-relaxed text-[15px]">
                                            {msg.content}
                                        </Text>
                                    </div>
                                </div>
                            );
                        }}
                    />
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-paper-border/30 bg-paper-bg">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Write when you're ready..."
                        className="flex-1 h-[48px] bg-paper-surface border border-paper-border/40 rounded-full px-4 text-[15px] focus:outline-none focus:ring-1 focus:ring-paper-text/10 transition-all font-sans placeholder:text-foreground/40"
                    />
                    {newMessage.trim() ? (
                        <button
                            type="submit"
                            className="p-3 rounded-full bg-transparent text-foreground/60 hover:text-foreground hover:bg-paper-surface transition-colors"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSendSupport}
                            className="flex items-center justify-center h-9 px-4 rounded-full bg-paper-surfaceSoft hover:bg-paper-surfaceDark transition-opacity active:opacity-60 whitespace-nowrap text-[13px] font-medium text-foreground/70"
                        >
                            Send support
                        </button>
                    )}
                </form>
            </div>

            <AnimatePresence>
                {isProfileModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-paper-bg/40 backdrop-blur-[2px]"
                            onClick={() => setIsProfileModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            className="relative z-10 w-full max-w-[280px] mx-4 bg-paper-bg rounded-[24px] p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] flex flex-col items-center border border-paper-border/30"
                        >
                            <div className="w-[72px] h-[72px] mb-4 relative">
                                <ProfileAvatar src={avatarSrc} name={displayName} size="xl" className="w-[72px] h-[72px]" />
                            </div>
                            <Heading level={3} className="text-xl font-bold font-serif text-center mb-6 leading-tight">
                                {displayName}
                            </Heading>
                            <button
                                onClick={() => setIsProfileModalOpen(false)}
                                className="w-full h-11 rounded-full bg-paper-surfaceSoft hover:bg-paper-surfaceDark border border-paper-border/20 font-medium transition-colors text-foreground/80 flex items-center justify-center text-sm"
                            >
                                View profile
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
