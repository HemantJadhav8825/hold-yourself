'use client';

import React from 'react';
import { ProfileView } from '@/components/profile/ProfileView';

export default function ProfilePage() {
  return (
    <div className="py-6 lg:py-10 max-w-3xl mx-auto px-4 md:px-0">
      <ProfileView />
    </div>
  );
}
