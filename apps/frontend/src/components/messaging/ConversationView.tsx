"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useConversations } from '@/hooks/useConversations';
import { chatService, Message } from '@/api/chat.service';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Send } from 'lucide-react';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { cn } from '@/lib/utils';
import { socketService } from '@/api/socket.service';

export const ConversationView: React.FC = () => {
    const { activeConversationId, setActiveConversationId, conversations } = useConversations();
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [prevConvId, setPrevConvId] = useState<string | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);
    const isAtBottomRef = useRef(true);

    if (activeConversationId !== prevConvId) {
        setPrevConvId(activeConversationId);
        setMessages([]);
        setIsLoading(activeConversationId !== null);
    }

    const conversation = conversations.find(c => c.id === activeConversationId);
    const otherParticipant = conversation?.participants.find(
        (p: any) => p.id !== user?.id
    ) as any;

    const displayName = otherParticipant?.displayName || otherParticipant?.username || 'Someone';
    const avatarSrc = otherParticipant?.avatar;

    useEffect(() => {
        if (!activeConversationId) return;

        chatService.listMessages(activeConversationId)
            .then(msgs => {
                setMessages(msgs.reverse());
                setIsLoading(false);
                setTimeout(() => {
                    if (scrollRef.current) {
                        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                    }
                }, 10);
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

                // The exact scrolling invariant requested for safe connection UX
                setTimeout(() => {
                    const el = scrollRef.current;
                    if (el && isAtBottomRef.current) {
                        el.scrollTop = el.scrollHeight;
                    }
                }, 10);
            }
        };

        socketService.on('message:new', handleNewMessage);
        return () => {
            socketService.off('message:new', handleNewMessage);
        };
    }, [activeConversationId]);

    const handleScroll = () => {
        const el = scrollRef.current;
        if (el) {
            const isBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 10;
            isAtBottomRef.current = isBottom;
        }
    };

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim() || !activeConversationId) return;

        const content = newMessage.trim();
        setNewMessage('');

        try {
            const msg = await chatService.sendMessage(activeConversationId, content);
            setMessages(prev => [...prev, msg]);

            setTimeout(() => {
                const el = scrollRef.current;
                if (el) el.scrollTop = el.scrollHeight;
            }, 10);
        } catch (error) {
            console.error('Failed to send message', error);
        }
    };

    const handleSendSupport = async () => {
        if (!activeConversationId) return;
        try {
            const msg = await chatService.sendMessage(activeConversationId, "Held. 🤎");
            setMessages(prev => [...prev, msg]);
            setTimeout(() => {
                const el = scrollRef.current;
                if (el) el.scrollTop = el.scrollHeight;
            }, 10);
        } catch (error) {
            console.error('Failed to send support', error);
        }
    };

    if (!conversation) return null;

    return (
        <div className="flex flex-col h-full bg-paper-bg">
            {/* Header */}
            <div className="flex items-center p-4 border-b border-paper-border/50">
                <button
                    onClick={() => setActiveConversationId(null)}
                    className="mr-3 p-2 rounded-full hover:bg-paper-surfaceSoft transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-foreground/80" />
                </button>
                <ProfileAvatar src={avatarSrc} name={displayName} size="sm" />
                <div className="ml-3">
                    <Heading level={4} className="text-lg font-bold font-serif leading-tight">
                        {displayName}
                    </Heading>
                </div>
            </div>

            {/* Message Area */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 space-y-4"
            >
                {isLoading ? (
                    <div className="flex justify-center p-4 opacity-50">
                        <Text size="sm">Loading connection...</Text>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isMe = msg.senderId === user?.id;
                        const isRemoved = msg.content === 'Message unavailable';

                        return (
                            <div key={msg.id || idx} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                                <div className={cn(
                                    "max-w-[75%] px-4 py-2 rounded-2xl",
                                    isMe ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-paper-surfaceSoft text-foreground rounded-tl-sm border border-paper-border/30",
                                    isRemoved && "bg-transparent border border-dashed border-paper-border text-foreground/50 italic opacity-80"
                                )}>
                                    <Text size="sm" className="whitespace-pre-wrap leading-relaxed">
                                        {msg.content}
                                    </Text>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-paper-border/50 bg-paper-surface/50">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Message..."
                        className="flex-1 bg-paper-bg border border-paper-border/60 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-sans"
                    />
                    {newMessage.trim() ? (
                        <button
                            type="submit"
                            className="p-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSendSupport}
                            className="p-2 px-3 rounded-full hover:bg-paper-surface transition-colors whitespace-nowrap text-sm font-medium text-foreground/70"
                        >
                            Send support
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};
