import React from 'react';
import { cn } from '@/lib/utils';
import { SidebarNav } from './SidebarNav';
import { TopBar } from './TopBar';

interface DashShellProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const DashShell: React.FC<DashShellProps> = ({ children, fullWidth = false }) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Mobile Top Bar */}
      <TopBar />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <SidebarNav />

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64 min-h-screen pt-14 lg:pt-0 flex flex-col overflow-hidden">
          <div className={cn(
            'flex-1 flex flex-col w-full min-w-0',
            !fullWidth && 'max-w-[600px] mx-auto px-4 sm:px-6'
          )}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
