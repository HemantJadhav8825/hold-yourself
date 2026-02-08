'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { getSafeOnboardingState } from '@/lib/onboarding/state';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();


  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Onboarding Check
    // If the user has not started onboarding (or is in progress), force them there.
    // AuthGuard is typically used on protected routes like /dashboard.
    // We assume the Onboarding route itself does NOT use AuthGuard (it uses OnboardingGuard).
    const onboardingStatus = getSafeOnboardingState(user);

    if (onboardingStatus === 'not_started' || onboardingStatus === 'in_progress') {
       router.push('/onboarding');
    }
  }, [isLoading, isAuthenticated, router, user]);

  if (isLoading) {
    // You might want to render a loading spinner here
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading session...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Return null to prevent rendering protected content while redirecting
  }

  return <>{children}</>;
};
