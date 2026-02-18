'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

interface GuestGuardProps {
  children: React.ReactNode;
}

export const GuestGuard: React.FC<GuestGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const redirect = searchParams?.get('redirect') || '/';
      router.push(redirect);
    }
  }, [isLoading, isAuthenticated, router, searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="animate-pulse text-white/20 text-xs font-bold tracking-widest uppercase">Checking Session...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Return null to prevent rendering login/signup content while redirecting
  }

  return <>{children}</>;
};
