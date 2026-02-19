import React from 'react';
import { Heading } from '@/components/ui/Heading';
import { brand } from '@/config/brand';
import { MessageCircle, User, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { usePaperMode } from '@/context/PaperModeContext';

export const TopBar: React.FC = () => {
  const { setMode, isNightActive } = usePaperMode();
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
          className="p-1 hover:text-primary transition-colors"
          title={isNightActive ? 'Morning Paper' : 'Dim the lights'}
        >
          {isNightActive ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
        <Link href="/messages" className="p-1 hover:text-primary transition-colors">
          <MessageCircle className="w-6 h-6" />
        </Link>
        <Link href="/profile" className="p-1 hover:text-primary transition-colors">
          <User className="w-6 h-6" />
        </Link>
      </div>
    </header>
  );
};
