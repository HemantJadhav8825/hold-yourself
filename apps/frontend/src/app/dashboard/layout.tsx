'use client';

import React from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { DashShell } from '@/components/layout/DashShell';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <DashShell>
        {children}
      </DashShell>
    </AuthGuard>
  );
}
