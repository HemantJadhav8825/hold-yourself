"use client";

import React from 'react';
import { Heading } from '@/components/ui/Heading';
import { brand } from '@/config/brand';
import { MessageCircle, User, Moon, Sun, Wind, PlusSquare } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { usePaperMode } from '@/context/PaperModeContext';

export const TopBar: React.FC = () => {
  const { setMode, isNightActive } = usePaperMode();
  const pathname = usePathname();

  return (
    <header className="lg:hidden fixed top-0 left-0 w-full h-14 bg-paper-nav border-b border-paper-border z-40 flex items-center justify-between px-4">
      <Link href="/">
        <Heading level={5} className="text-primary font-bold tracking-tight">
          {brand.PRODUCT_NAME}
        </Heading>
      </Link>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setMode(isNightActive ? 'day' : 'night')}
          className="p-1 hover:text-primary transition-colors text-foreground/60"
          title={isNightActive ? 'Morning Paper' : 'Dim the lights'}
        >
          {isNightActive ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
        <Link
          href="/unspoken"
          className={cn("p-1 transition-colors", pathname === '/unspoken' ? 'text-primary' : 'text-foreground/60 hover:text-primary')}
        >
          <Wind className={cn("w-6 h-6 transition-transform", pathname === '/unspoken' && 'stroke-[2.5px] scale-110')} />
        </Link>
        <Link
          href="/sanctuary"
          className={cn("p-1 transition-colors", pathname === '/sanctuary' ? 'text-primary' : 'text-foreground/60 hover:text-primary')}
        >
          <PlusSquare className={cn("w-6 h-6 transition-transform", pathname === '/sanctuary' && 'stroke-[2.5px] scale-110')} />
        </Link>
        <Link
          href="/messages"
          className={cn("p-1 transition-colors", pathname === '/messages' ? 'text-primary' : 'text-foreground/60 hover:text-primary')}
        >
          <MessageCircle className={cn("w-6 h-6 transition-transform", pathname === '/messages' && 'stroke-[2.5px] scale-110')} />
        </Link>
        <Link
          href="/profile"
          className={cn("p-1 transition-colors", pathname === '/profile' ? 'text-primary' : 'text-foreground/60 hover:text-primary')}
        >
          <User className={cn("w-6 h-6 transition-transform", pathname === '/profile' && 'stroke-[2.5px] scale-110')} />
        </Link>
      </div>
    </header>
  );
};
