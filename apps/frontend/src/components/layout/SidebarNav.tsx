import React from 'react';
import { Home, Search, PlusSquare, MessageCircle, User, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Heading } from '@/components/ui/Heading';
import { brand } from '@/config/brand';
import { useAuth } from '@/context/AuthContext';

export const SidebarNav: React.FC = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    { icon: Home, label: 'Home', href: '/dashboard' },
    { icon: MessageCircle, label: 'Messages', href: '/messages' },
    { icon: User, label: 'Profile', href: '/dashboard/profile' },
  ];

  return (
    <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-64 border-r border-border bg-background px-4 py-8 z-40">
      <Link href="/dashboard" className="px-4 mb-12">
        <Heading level={4} className="text-primary font-bold tracking-tight">
          {brand.PRODUCT_NAME}
        </Heading>
      </Link>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-4 px-4 py-3 rounded-xl transition-all hover:bg-muted group',
                isActive ? 'text-foreground font-semibold' : 'text-foreground/60 opacity-80'
              )}
            >
              <item.icon className={cn('w-6 h-6 transition-transform group-hover:scale-110', isActive && 'text-primary stroke-[2.5px]')} />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-2">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all hover:bg-red-500/10 text-red-500/60 hover:text-red-500 group"
        >
          <LogOut className="w-6 h-6 transition-transform group-hover:scale-110" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};
