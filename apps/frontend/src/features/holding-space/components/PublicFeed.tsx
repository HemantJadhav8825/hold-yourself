'use client';

import React from 'react';
import { useHoldingSpaceFeed } from '../hooks/useHoldingSpaceFeed';
import { ShareCard } from './ShareCard';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const PublicFeed: React.FC = () => {
    const {
        shares,
        loading,
        hasMore,
        loadMore,
        updateShareInState,
        deleteShareFromState
    } = useHoldingSpaceFeed(); // No tag = all public shares

    if (loading && shares.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground animate-pulse">
                <Loader2 className="h-6 w-6 animate-spin mb-2" />
                <p className="text-sm">Connecting to the space...</p>
            </div>
        );
    }

    if (shares.length === 0 && !loading) {
        return (
            <div className="text-center py-16 space-y-4 border border-dashed border-border/50 rounded-3xl bg-muted/10">
                <p className="text-muted-foreground">The space is quiet.</p>
                <p className="text-sm text-muted-foreground/80">Be the first to share.</p>
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
                        Listen to more
                    </Button>
                </div>
            )}
        </div>
    );
};
