import React from 'react';
import { SidebarNav } from './SidebarNav';
import { BottomNav } from './BottomNav';
import { TopBar } from './TopBar';

interface DashShellProps {
  children: React.ReactNode;
}

export const DashShell: React.FC<DashShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile Top Bar */}
      <TopBar />

      {/* Desktop Sidebar */}
      <SidebarNav />

      {/* Main Content Area */}
      <main className="lg:ml-64 min-h-screen pt-14 lg:pt-0 pb-24 lg:pb-0">
        <div className="max-w-[600px] mx-auto w-full px-0 sm:px-4">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
