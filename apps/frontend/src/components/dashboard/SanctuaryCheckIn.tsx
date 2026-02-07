'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { env } from '@/config/env';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';

const STORAGE_KEY = 'sanctuary_checkin_last_shown';
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

export const SanctuaryCheckIn: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check feature flag
    if (env.NEXT_PUBLIC_SANCTUARY_ENABLED !== 'true') return;

    // Check if we just came from sanctuary (session storage check could be added if needed, 
    // but for now let's focus on the 24h/session rule)
    const lastShown = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (!lastShown || now - parseInt(lastShown, 10) > COOLDOWN_MS) {
      // Check session storage to ensure it's once per session if 24h isn't met but session is fresh
      const sessionDismissed = sessionStorage.getItem('sanctuary_session_dismissed');
      if (!sessionDismissed) {
        setIsVisible(true);
      }
    }
  }, []);

  const handleCTA = () => {
    // Navigate to sanctuary
    router.push('/sanctuary');
    // Hide and record shown (or just hide, as we don't want to show it immediately after a visit)
    dismiss(true);
  };

  const dismiss = (permanent = false) => {
    setIsVisible(false);
    sessionStorage.setItem('sanctuary_session_dismissed', 'true');
    if (permanent) {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    }
  };

  if (!isVisible) return null;

  return (
    <div className="px-4 py-3 mb-4 bg-background/50 border border-border/40 rounded-xl max-w-md transition-all duration-300 animate-in fade-in slide-in-from-top-2">
      <div className="flex flex-col gap-3">
        <Text size="sm" className="text-foreground/80">
          How are you feeling right now?
        </Text>
        <div className="flex items-center gap-4">
          <button
            onClick={handleCTA}
            className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Release a thought
          </button>
          <span className="text-border/40 h-3 w-[1px] bg-border/40" />
          <button
            onClick={() => dismiss(true)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};
