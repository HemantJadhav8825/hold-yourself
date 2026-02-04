'use client';

import React from 'react';
import { Mail, Lock, Loader2, UserPlus, ShieldCheck } from 'lucide-react';
import { GoogleButton } from '@/components/auth/GoogleButton';
import Link from 'next/link';

interface SignupFormProps {
  formData: any;
  isLoading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  formData,
  isLoading,
  error,
  onSubmit,
  onChange,
}) => {
  return (
    <div className="space-y-6">
      <GoogleButton />
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold">
          <span className="bg-[#0a0a0a] px-4 text-white/20">Or use email</span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
            <input
              type="email"
              name="email"
              required
              inputMode="email"
              autoComplete="email"
              value={formData.email}
              onChange={onChange}
              className="w-full bg-white/[0.05] border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all placeholder:text-white/10 text-sm font-medium"
              placeholder="Email address"
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
            <input
              type="password"
              name="password"
              required
              autoComplete="new-password"
              value={formData.password}
              onChange={onChange}
              className="w-full bg-white/[0.05] border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all placeholder:text-white/10 text-sm font-medium"
              placeholder="Create password"
            />
          </div>

          <div className="relative group">
            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
            <input
              type="password"
              name="confirmPassword"
              required
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={onChange}
              className="w-full bg-white/[0.05] border border-white/5 rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all placeholder:text-white/10 text-sm font-medium"
              placeholder="Confirm password"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-primary hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-xl shadow-primary/10 flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-sm"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              Create Account
            </>
          )}
        </button>

        <p className="text-[10px] text-white/20 text-center px-4 font-medium leading-relaxed">
          By signing up, you agree to our Terms, Privacy Policy and Cookies Policy.
        </p>
      </form>

      <div className="pt-4 text-center border-t border-white/5">
        <p className="text-sm text-white/40 font-medium">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:brightness-110 font-bold transition-all">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
