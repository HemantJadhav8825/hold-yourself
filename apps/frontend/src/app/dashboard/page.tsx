'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { HomeFeed } from '@/components/dashboard/HomeFeed';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { MoodCheckIn } from '@/components/dashboard/MoodCheckIn';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (!isLoading && !user) {
      router.replace('/login');
      return;
    }
    
    if (user && typeof window !== 'undefined') {
      const hasCompletedOnboarding = localStorage.getItem('has_completed_onboarding');
      if (!hasCompletedOnboarding) {
        setShowOnboarding(true);
      }

      const today = new Date().toISOString().split('T')[0];
      const checkInStatus = localStorage.getItem(`mood_checkin_${today}`);
      setHasCheckedInToday(!!checkInStatus);
    }
  }, [user, isLoading, router]);

  if (!mounted || isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <Text muted className="animate-pulse font-medium">Coming home...</Text>
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <OnboardingFlow onComplete={() => setShowOnboarding(false)} />
      </main>
    );
  }

  if (!hasCheckedInToday) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <MoodCheckIn 
          onComplete={(mood: string) => {
            const today = new Date().toISOString().split('T')[0];
            localStorage.setItem(`mood_checkin_${today}`, mood);
            setHasCheckedInToday(true);
          }} 
        />
      </main>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-2 mb-12">
        <Heading level={2}>Peace be with you.</Heading>
        <Text size="lg" muted>Your quiet space for reflection.</Text>
      </div>
      
      <HomeFeed />
    </PageContainer>
  );
}
