"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMessagingContext } from '@/context/MessagingContext';
import { useConversations } from '@/hooks/useConversations';
import { ConversationList } from './ConversationList';
import { ConversationView } from './ConversationView';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export const MessageDrawer: React.FC = () => {
    const { isOpen, setIsOpen } = useMessagingContext();
    const { activeConversationId } = useConversations();
    const pathname = usePathname();
    const isMessagesRoute = pathname.startsWith('/messages');

    // Close on escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [setIsOpen]);

    if (!isOpen && !isMessagesRoute) return null;

    return (
        <AnimatePresence>
            {(isOpen || isMessagesRoute) && (
                <>
                    {!isMessagesRoute && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-40 bg-transparent lg:bg-black/5"
                        />
                    )}

                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'tween', ease: 'easeOut', duration: 0.2 }}
                        className={cn(
                            "fixed right-0 top-0 bottom-0 z-50 flex flex-col overflow-hidden bg-paper-bg shadow-xl transition-all lg:border-l lg:border-paper-border",
                            isMessagesRoute ? "w-full lg:w-[420px]" : "w-full lg:w-[400px]"
                        )}
                    >
                        {activeConversationId ? (
                            <ConversationView />
                        ) : (
                            <ConversationList />
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
