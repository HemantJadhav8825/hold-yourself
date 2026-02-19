'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSafeRedirect } from '@/utils/security';

interface GuestGuardProps {
  children: React.ReactNode;
}

export const GuestGuard: React.FC<GuestGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const rawRedirect = searchParams?.get('redirect');
      const redirect = getSafeRedirect(rawRedirect);
      router.push(redirect);
    }
  }, [isLoading, isAuthenticated, router, searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-webelong-background">
        <div className="animate-pulse text-webelong-text/40 text-xs font-bold tracking-widest uppercase">Checking Session...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Return null to prevent rendering login/signup content while redirecting
  }

  return <>{children}</>;
};
