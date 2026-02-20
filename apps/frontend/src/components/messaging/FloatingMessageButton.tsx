'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useMessagingContext } from '@/context/MessagingContext';
import { usePathname } from 'next/navigation';
import { useConversations } from '@/hooks/useConversations';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { useUsers } from '@/hooks/useUsers';
import { useAuth } from '@/context/AuthContext';

export const FloatingMessageButton: React.FC = () => {
    const { isOpen, setIsOpen } = useMessagingContext();
    const pathname = usePathname();
    const { conversations } = useConversations();
    const { users } = useUsers();
    const { user: currentUser } = useAuth();

    // Don't show if the drawer is already open, or if we're on the dedicated messages page
    if (isOpen || pathname.startsWith('/messages')) {
        return null;
    }

    // Get up to 3 recent unique participants to show their avatars
    const recentParticipants = Array.from(new Set(
        conversations
            .flatMap(c => c.participants)
            .map(p => typeof p === 'string' ? p : (p as any).id)
            .filter(id => id !== currentUser?.id)
    )).slice(0, 3);

    return (
        <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-40 flex items-center gap-3 pl-4 pr-5 py-3 rounded-full bg-paper-surface hover:bg-paper-surfaceSoft border border-paper-border shadow-lg transition-transform hover:scale-105 active:scale-95"
            aria-label="Open messages"
        >
            <MessageCircle className="w-5 h-5 text-foreground/80" />
            <span className="font-medium text-[15px] pt-0.5">Messages</span>

            {recentParticipants.length > 0 && (
                <div className="flex -space-x-2 ml-2">
                    {recentParticipants.map((userId, i) => {
                        const userProfile = users.find(u => u.id === userId);
                        return (
                            <div key={userId} className="relative z-10 border-2 border-paper-surface rounded-full">
                                <ProfileAvatar
                                    src={userProfile?.avatar}
                                    name={userProfile?.displayName || userProfile?.username || 'User'}
                                    size="sm"
                                    className="w-6 h-6 border-none"
                                />
                            </div>
                        );
                    })}
                </div>
            )}
        </button>
    );
};
