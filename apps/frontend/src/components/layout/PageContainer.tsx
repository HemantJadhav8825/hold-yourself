import React from 'react';
import { cn } from '@/lib/utils';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  hideNav?: boolean;
  hideHeader?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  className, 
  hideNav = false, 
  hideHeader = false 
}) => {
  return (
    <div className="min-h-screen bg-background flex flex-col pt-20 pb-28">
      {!hideHeader && <Header />}
      
      <main className={cn('flex-1 w-full max-w-2xl mx-auto px-6', className)}>
        {children}
      </main>

      {!hideNav && <BottomNav />}
    </div>
  );
};
