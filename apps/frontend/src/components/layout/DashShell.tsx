import React from 'react';
import { cn } from '@/lib/utils';
import { SidebarNav } from './SidebarNav';
import { TopBar } from './TopBar';
import { usePathname } from 'next/navigation';
import { MessagingDock } from '../messaging/MessagingDock';

interface DashShellProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const DashShell: React.FC<DashShellProps> = ({ children, fullWidth = false }) => {
  const pathname = usePathname();
  const isMessages = pathname.startsWith('/messages');
  const shouldBeFullWidth = fullWidth || isMessages;

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Mobile Top Bar */}
      <TopBar />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <SidebarNav />

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-[240px] h-full pt-14 lg:pt-0 flex flex-col overflow-hidden w-full relative">
          <div className={cn(
            'flex-1 flex w-full min-w-0 min-h-0 overflow-y-auto',
            !shouldBeFullWidth && 'w-full'
          )}>
            {children}
          </div>
        </main>
      </div>

      <MessagingDock />
    </div>
  );
};
