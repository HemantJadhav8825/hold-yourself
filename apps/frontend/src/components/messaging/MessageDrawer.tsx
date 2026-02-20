"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMessagingContext } from '@/context/MessagingContext';
import { useConversations } from '@/hooks/useConversations';
import { ConversationList } from './ConversationList';
import { ConversationView } from './ConversationView';

export const MessageDrawer: React.FC = () => {
    const { isOpen, setIsOpen } = useMessagingContext();
    const { activeConversationId } = useConversations();
    // Close on escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [setIsOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 z-40 bg-transparent lg:hidden"
                    />

                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'tween', ease: 'easeOut', duration: 0.18 }}
                        className="fixed inset-y-0 right-0 lg:inset-y-auto lg:bottom-4 lg:right-4 z-50 flex flex-col overflow-hidden bg-paper-bg shadow-[0_0_40px_-10px_rgba(0,0,0,0.06)] transition-all lg:border lg:border-paper-border lg:rounded-[20px] w-full lg:w-[380px] lg:h-[70vh]"
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
