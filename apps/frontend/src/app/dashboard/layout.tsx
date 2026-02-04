'use client';

import React from 'react';
import { DashShell } from '@/components/layout/DashShell';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashShell>
      {children}
    </DashShell>
  );
}
