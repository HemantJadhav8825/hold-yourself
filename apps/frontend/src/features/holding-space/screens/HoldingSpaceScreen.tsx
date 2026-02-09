'use client';

import React from 'react';
import { ShareComposer } from '../components/ShareComposer';
import { DailyCheckInPrompt } from '../components/DailyCheckInPrompt';
import { ShareCard } from '../components/ShareCard';
import { EndOfFeedMessage } from '../components/EndOfFeedMessage';
import { useHoldingSpaceFeed } from '../hooks/useHoldingSpaceFeed';
import { useDailyCheckIn } from '../hooks/useDailyCheckIn';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const HoldingSpaceScreen = () => {
  const { 
    shares, 
    loading, 
    error, 
    hasMore, 
    loadMore,
    addOptimisticShare,
    replaceShare,
    removeShare
  } = useHoldingSpaceFeed();
  const { dismissCheckIn } = useDailyCheckIn();
  const composerRef = React.useRef<HTMLDivElement>(null);

  const handleScrollToComposer = () => {
    composerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="w-full max-w-[720px] mx-auto px-4 py-8 flex flex-col items-center">
      
      {/* Daily Prompt */}
      <DailyCheckInPrompt onShareClick={handleScrollToComposer} />

      {/* Composer Area */}
      <div ref={composerRef} className="w-full mb-10">
        <ShareComposer 
          addOptimisticShare={addOptimisticShare}
          replaceShare={replaceShare}
          removeShare={removeShare}
          onPostSuccess={dismissCheckIn}
        />
      </div>

      {/* Feed Divider */}
      <div className="w-full border-t border-border/40 mb-8" />

      {/* Feed Area */}
      <div className="w-full space-y-4">
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
          <ShareCard key={share.id} share={share} />
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
  );
};
