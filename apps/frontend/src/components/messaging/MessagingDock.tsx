'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMessagingContext } from '@/context/MessagingContext';
import { useConversations } from '@/hooks/useConversations';
import { useAuth } from '@/context/AuthContext';
import { useUsers } from '@/hooks/useUsers';
import { MessageCircle, X, ChevronDown, ChevronUp } from 'lucide-react';
import { ConversationList } from './ConversationList';
import { ConversationView } from './ConversationView';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { Heading } from '@/components/ui/Heading';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export const MessagingDock: React.FC = () => {
    const { isOpen, setIsOpen } = useMessagingContext();
    const pathname = usePathname();
    const { conversations, activeConversationId, setActiveConversationId } = useConversations();
    const { users } = useUsers();
    const { user: currentUser } = useAuth();

    const [isChatExpanded, setIsChatExpanded] = useState(false);
    const [prevConvId, setPrevConvId] = useState<string | null>(null);

    if (activeConversationId !== prevConvId) {
        setPrevConvId(activeConversationId);
        if (activeConversationId) {
            setIsChatExpanded(true);
        }
    }

    // Don't show if we're on the dedicated messages page
    if (pathname.startsWith('/messages')) {
        return null;
    }

    // Get up to 3 recent unique participants to show their avatars in root dock
    const recentParticipants = Array.from(new Set(
        conversations
            .flatMap(c => c.participants)
            .map(p => typeof p === 'string' ? p : (p as any).id)
            .filter(id => id !== currentUser?.id)
    )).slice(0, 3);

    // Active Chat metadata for minimized chat header
    const activeConv = conversations.find(c => c.id === activeConversationId);
    const otherParticipantIdRaw = activeConv?.participants.find(
        (p: any) => (typeof p === 'string' ? p : p.id) !== currentUser?.id
    );
    const otherParticipantId = typeof otherParticipantIdRaw === 'string' ? otherParticipantIdRaw : otherParticipantIdRaw?.id;
    const fullOtherUser = users.find(u => u.id === otherParticipantId);
    const chatDisplayName = fullOtherUser?.displayName || fullOtherUser?.username || 'Someone';
    const chatAvatarSrc = fullOtherUser?.avatar;

    return (
        <>
            {/* 
              MAIN DOCK (Inbox)
              Anchored bottom-0, right-6 (desktop). Hidden on mobile (relies on /messages route).
            */}
            <motion.div
                layout
                initial={false}
                animate={{
                    height: isOpen ? 600 : 48,
                }}
                transition={{
                    type: "tween",
                    ease: "easeOut",
                    duration: 0.18
                }}
                className={cn(
                    "fixed z-40 origin-bottom bg-paper-bg shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.12)] border-paper-border overflow-hidden pointer-events-auto",
                    // Desktop styles (hidden on mobile)
                    "hidden md:flex md:bottom-0 md:right-6 md:w-[320px] md:border-x md:border-t md:rounded-t-[20px] md:rounded-b-none",
                    isOpen ? "md:h-auto" : "h-[48px]",
                    !isOpen && "cursor-pointer hover:bg-paper-surface hover:border-paper-border/80 transition-colors"
                )}
                onClick={() => {
                    if (!isOpen) setIsOpen(true);
                }}
            >
                <AnimatePresence mode="wait">
                    {!isOpen ? (
                        <motion.div
                            key="minimized"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="flex items-center h-[48px] px-4 gap-3 w-full"
                        >
                            <MessageCircle className="w-5 h-5 text-foreground/80" />
                            <span className="font-semibold text-[15px] font-sans">Messaging</span>

                            <div className="flex-1" />

                            {recentParticipants.length > 0 && (
                                <div className="flex -space-x-2 mr-2">
                                    {recentParticipants.map((userId) => {
                                        const userProfile = users.find(u => u.id === userId);
                                        return (
                                            <div key={userId} className="relative z-10 border-2 border-paper-bg rounded-full bg-paper-bg">
                                                <ProfileAvatar
                                                    src={userProfile?.avatar}
                                                    name={userProfile?.displayName || userProfile?.username || 'User'}
                                                    size="sm"
                                                    className="w-5 h-5 border-none"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            <ChevronUp className="w-5 h-5 text-foreground/60" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="expanded"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex-1 w-full bg-paper-bg overflow-hidden flex flex-col h-full"
                        >
                            <ConversationList />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* 
              ACTIVE CONVERSATION PANEL
              Spawns to the left of the Main Dock on desktop. Hidden on mobile.
            */}
            <AnimatePresence>
                {activeConversationId && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{
                            y: 0,
                            opacity: 1,
                            height: isChatExpanded ? 600 : 48
                        }}
                        exit={{ y: 50, opacity: 0, transition: { duration: 0.2 } }}
                        transition={{
                            type: "tween",
                            ease: "easeOut",
                            duration: 0.18
                        }}
                        className={cn(
                            "fixed z-[50] origin-bottom bg-paper-bg shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.12)] border-paper-border overflow-hidden pointer-events-auto",
                            // Desktop: attached floor, right of dock
                            "hidden md:flex flex-col md:bottom-0 md:right-[360px] md:w-[360px] md:border-x md:border-t md:rounded-t-[20px] md:rounded-b-none",
                            isChatExpanded ? "md:h-auto" : "h-[48px]",
                            !isChatExpanded && "cursor-pointer hover:bg-paper-surface hover:border-paper-border/80 transition-colors"
                        )}
                        onClick={() => {
                            if (!isChatExpanded) setIsChatExpanded(true);
                        }}
                    >
                        <AnimatePresence mode="wait">
                            {!isChatExpanded ? (
                                <motion.div
                                    key="minimized-chat"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className="flex items-center h-[48px] px-3 gap-3 w-full border-b border-paper-border/20"
                                >
                                    <ProfileAvatar src={chatAvatarSrc} name={chatDisplayName} size="sm" className="w-7 h-7" />
                                    <span className="font-semibold text-[15px] font-sans truncate flex-1">{chatDisplayName}</span>

                                    <div className="flex items-center space-x-1">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setActiveConversationId(null); }}
                                            className="p-1.5 rounded hover:bg-paper-surfaceSoft"
                                        >
                                            <X className="w-4 h-4 text-foreground/80" />
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="expanded-chat"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-1 w-full bg-paper-bg overflow-hidden flex flex-col h-full"
                                >
                                    {/* ConversationView handles its own max/min headers */}
                                    <ConversationView />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
