'use client';

import React, { useCallback } from 'react';
import { ShareComposer } from '../components/ShareComposer';
import { DailyCheckInPrompt } from '../components/DailyCheckInPrompt';
import { ShareCard } from '../components/ShareCard';
import { EndOfFeedMessage } from '../components/EndOfFeedMessage';
import { useHoldingSpaceFeed } from '../hooks/useHoldingSpaceFeed';
import { useDailyCheckIn } from '../hooks/useDailyCheckIn';
import { updateShare } from '../api/updateShare';
import { deleteShare } from '../api/deleteShare';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CheckInComposer } from '@/components/home/CheckInComposer';
import { MomentsStrip } from '@/components/home/MomentsStrip';
import { RightSidebar } from '@/components/home/RightSidebar';
import { FeedPostCard } from '@/components/home/FeedPostCard';

export const HoldingSpaceScreen = () => {
  const {
    shares,
    loading,
    error,
    hasMore,
    loadMore,
    addOptimisticShare,
    replaceShare,
    removeShare,
    restoreShare
  } = useHoldingSpaceFeed();
  const { dismissCheckIn } = useDailyCheckIn();
  const composerRef = React.useRef<HTMLDivElement>(null);

  const handleScrollToComposer = () => {
    composerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleUpdate = useCallback(async (id: string, content: string) => {
    const originalShare = shares.find(s => s.id === id);
    if (!originalShare) return;

    // 1. Optimistic Update
    const optimisticShare = { ...originalShare, content, updatedAt: new Date().toISOString() };
    replaceShare(id, optimisticShare);

    try {
      // 2. Call API
      const updatedShare = await updateShare(id, { content });
      // 3. Confirm with server data
      replaceShare(id, updatedShare);
    } catch (err) {
      console.error('Failed to update share:', err);
      // 4. Rollback
      replaceShare(id, originalShare);
      // Optional: Trigger a toast here if we had a toast system
    }
  }, [shares, replaceShare]);

  const handleDelete = useCallback(async (id: string) => {
    const originalIndex = shares.findIndex(s => s.id === id);
    const originalShare = shares[originalIndex];

    if (!originalShare) return;

    // 1. Optimistic Delete
    removeShare(id);

    try {
      // 2. Call API
      await deleteShare(id);
    } catch (err) {
      console.error('Failed to delete share:', err);
      // 3. Rollback
      restoreShare(originalShare, originalIndex);
    }
  }, [shares, removeShare, restoreShare]);

  return (
    <div className="w-full h-full flex justify-center">
      {/* 2-Column Flex Container (Center + Right) */}
      <div className="w-full max-w-[1020px] px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8 lg:gap-12 justify-center lg:justify-between">

        {/* Main Feed - Center Column */}
        <div className="w-full flex-1 min-w-0 max-w-[640px] mx-auto lg:mx-0 flex flex-col items-start min-h-screen">

          {/* Check-In Composer */}
          <div ref={composerRef} className="w-full mb-6">
            <CheckInComposer
              addOptimisticShare={addOptimisticShare}
              replaceShare={replaceShare}
              removeShare={removeShare}
              onPostSuccess={dismissCheckIn}
            />
          </div>

          {/* Safe Story Strip (Moments) */}
          <div className="w-full mb-8">
            <MomentsStrip />
          </div>

          {/* Feed Area */}
          <div className="w-full space-y-8 pb-32">
            {loading && shares.length === 0 && (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-muted-foreground" />
              </div>
            )}

            {error && (
              <div className="text-center py-10 text-destructive">
                {error}
                <Button variant="link" onClick={() => window.location.reload()} className="ml-2">
                  Retry
                </Button>
              </div>
            )}

            {shares.map((share) => (
              <FeedPostCard
                key={share.id}
                share={share}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}

            {!loading && shares.length > 0 && hasMore && (
              <div className="flex justify-center pt-6">
                <Button onClick={loadMore} variant="ghost" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                  Load more
                </Button>
              </div>
            )}

            {!hasMore && shares.length > 0 && <EndOfFeedMessage />}

            {!loading && shares.length === 0 && !error && (
              <div className="text-center py-10 text-muted-foreground">
                <p>The space is quiet right now.</p>
                <p className="text-sm">Be the first to share if you feel called.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Context Panel */}
        <aside className="hidden lg:block w-[280px] flex-shrink-0 sticky top-8 h-fit">
          <RightSidebar />
        </aside>

      </div>
    </div>
  );
};
