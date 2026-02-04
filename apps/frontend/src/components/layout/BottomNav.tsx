import React from 'react';
import { Home, Search, PlusSquare, MessageCircle, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: 'Home', href: '/dashboard' },
    { icon: Search, label: 'Explore', href: '/explore' },
    { icon: PlusSquare, label: 'Create', href: '/create' },
    { icon: MessageCircle, label: 'Messages', href: '/messages' },
    { icon: User, label: 'Profile', href: '/profile' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-1 left-4 right-4 h-14 bg-card/80 backdrop-blur-lg border border-border rounded-2xl z-40 flex items-center justify-around px-2 shadow-xl mb-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.label}
            href={item.href}
            className={cn(
              'p-3 rounded-xl transition-all active:scale-90',
              isActive ? 'text-primary bg-primary/5' : 'text-foreground/60 hover:text-foreground'
            )}
          >
            <item.icon className={cn('w-6 h-6', isActive && 'stroke-[2.5px]')} />
          </Link>
        );
      })}
    </nav>
  );
};
