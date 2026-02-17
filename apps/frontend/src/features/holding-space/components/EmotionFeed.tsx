'use client';

import React from 'react';
import { useHoldingSpaceFeed } from '../hooks/useHoldingSpaceFeed';
import { ShareCard } from './ShareCard';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface EmotionFeedProps {
    tag: string;
}

export const EmotionFeed: React.FC<EmotionFeedProps> = ({ tag }) => {
    const {
        shares,
        loading,
        error,
        hasMore,
        loadMore,
        updateShareInState,
        deleteShareFromState
    } = useHoldingSpaceFeed(tag);

    if (loading && shares.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground animate-pulse">
                <Loader2 className="h-6 w-6 animate-spin mb-2" />
                <p className="text-sm">Listening for whispers...</p>
            </div>
        );
    }

    if (shares.length === 0 && !loading) {
        return (
            <div className="text-center py-16 space-y-4 border border-dashed border-border/50 rounded-3xl bg-muted/10">
                <p className="text-muted-foreground">It seems quiet here right now.</p>
                <p className="text-sm text-muted-foreground/80">You are the first to arrive in this space.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="space-y-6">
                {shares.map((share) => (
                    <ShareCard
                        key={share.id}
                        share={share}
                        onUpdate={async (id, content) => {
                            // We'll impl api call here if needed, or better, pass the hook's updater
                            // For V2, let's keep it simple: strict read-only for now unless it's the author
                            // But ShareCard checks authorship internally.
                            // We need to pass the API function here.
                            // Since `useHoldingSpaceFeed` doesn't expose the API calls directly (it wraps state),
                            // we technically need to implement the API glue here or update hook to return them.
                            // For now, let's pass undefined to disable editing in this view to be safe/fast,
                            // or we can import the API functions directly if we want to enable it.
                            // Let's enable it for consistency if the user is the author.

                            // Oops, `ShareCard` expects a promise-returning function.
                            // Let's import the API functions.
                            const { updateShare } = await import('../api/updateShare');
                            await updateShare(id, { content });
                            updateShareInState(id, { ...share, content });
                        }}
                        onDelete={async (id) => {
                            const { deleteShare } = await import('../api/deleteShare');
                            await deleteShare(id);
                            deleteShareFromState(id);
                        }}
                    />
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center pt-8">
                    <Button
                        variant="ghost"
                        onClick={loadMore}
                        disabled={loading}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                        Read more
                    </Button>
                </div>
            )}
        </div>
    );
};
