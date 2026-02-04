'use client';

import React from 'react';
import { brand } from '@/config/brand';
import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0a0a0a] text-white font-body overflow-x-hidden">
      {/* LEFT PANEL: Brand Visuals (Desktop only) */}
      <div className="hidden lg:flex lg:w-[60%] relative flex-col items-center justify-center p-12 overflow-hidden border-r border-white/5">
        {/* Animated Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 max-w-lg text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold font-heading tracking-tight leading-none bg-gradient-to-br from-white via-white to-white/30 bg-clip-text text-transparent">
              {brand.TAGLINE}
            </h1>
            <p className="text-xl text-white/50 font-light leading-relaxed">
              Discover a space where your presence is valued and your voice truly matters.
            </p>
          </div>

          {/* Visual Stack (Optional Mockup Feel) */}
          <div className="relative h-64 w-full flex items-center justify-center mt-12">
            <div className="absolute w-48 h-64 bg-white/5 border border-white/10 rounded-2xl -rotate-12 translate-x-[-40px] shadow-2xl backdrop-blur-sm" />
            <div className="absolute w-48 h-64 bg-primary/20 border border-primary/30 rounded-2xl rotate-3 translate-x-[40px] shadow-2xl backdrop-blur-md flex items-center justify-center">
              <span className="text-6xl">✨</span>
            </div>
            <div className="absolute w-48 h-64 bg-white/10 border border-white/20 rounded-2xl rotate-[-3deg] shadow-2xl backdrop-blur-lg flex flex-col p-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-white/20 animate-pulse" />
              <div className="w-full h-4 bg-white/10 rounded-full" />
              <div className="w-3/4 h-4 bg-white/10 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Auth Form */}
      <div className="flex-1 lg:w-[40%] flex items-center justify-center p-6 md:p-12 relative">
        {/* Mobile-only background blur elements */}
        <div className="lg:hidden absolute top-[-5%] right-[-5%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[80px]" />
        
        <div className="w-full max-w-[400px] flex flex-col space-y-8 z-10 transition-all duration-500 ease-in-out">
          {/* Logo & Heading */}
          <div className="text-center space-y-3">
            <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
              <h2 className="text-3xl font-bold font-heading tracking-tighter text-white">
                {brand.PRODUCT_NAME}
              </h2>
            </Link>
            {title && (
              <h3 className="text-xl font-semibold text-white/90 tracking-tight transition-all duration-300">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-white/40 font-medium">
                {subtitle}
              </p>
            )}
          </div>

          {/* Render Auth Form */}
          <div className="bg-white/[0.03] lg:bg-transparent border border-white/5 lg:border-none p-6 md:p-8 rounded-[2rem] lg:p-0 shadow-2xl lg:shadow-none backdrop-blur-xl lg:backdrop-blur-none transition-all">
            {children}
          </div>

          {/* Footer Copy */}
          <p className="text-center text-[11px] text-white/20 uppercase tracking-[0.2em] font-bold">
            &copy; {new Array(new Date().getFullYear())} {brand.PRODUCT_NAME} from {brand.PARENT.NAME}
          </p>
        </div>
      </div>
    </div>
  );
};
