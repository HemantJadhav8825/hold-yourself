'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageCircle, Heart, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems = [
  { id: 'home', label: 'Home', icon: Home, href: '/dashboard' },
  { id: 'connect', label: 'Connect', icon: MessageCircle, href: '/connect' },
  { id: 'reflect', label: 'Reflect', icon: Heart, href: '/reflect' },
  { id: 'vault', label: 'Vault', icon: Shield, href: '/vault' },
];

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-lg">
      <div className="glass rounded-2xl flex items-center justify-around px-4 py-3 shadow-xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link 
              key={item.id} 
              href={item.href}
              className="relative flex flex-col items-center justify-center gap-1 group"
            >
              <div 
                className={cn(
                  'p-2 rounded-xl transition-all duration-300',
                  isActive ? 'text-primary' : 'text-text/40 group-hover:text-text/60'
                )}
              >
                <Icon className={cn('w-6 h-6', isActive && 'fill-primary/10')} />
                
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-primary/10 rounded-xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </div>
              <span 
                className={cn(
                  'text-[10px] uppercase tracking-widest font-bold font-body transition-colors duration-300',
                  isActive ? 'text-primary' : 'text-text/40 group-hover:text-text/60'
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
