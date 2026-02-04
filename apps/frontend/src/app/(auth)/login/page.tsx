'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, Loader2, LogIn, ShieldCheck, ArrowLeft } from 'lucide-react';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { brand } from '@/config/brand';

function LoginContent() {
  const { login, googleLogin, isLoading, error, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const googleLoginCalled = useRef(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const code = searchParams.get('code');
    if (code && !googleLoginCalled.current) {
      googleLoginCalled.current = true;
      const redirectUri = `${window.location.origin}/login`;
      googleLogin(code, redirectUri)
        .then(() => {
          // Optional: Remove code from URL on success if not redirecting immediately
        })
        .catch(() => {
          // Do NOT reset googleLoginCalled.current = false;
          // If the code is invalid, retrying won't help.
          console.error('Google login failed with code');
        });
      
      // Clear the query param to avoid re-triggering
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('code');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams, googleLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData);
    } catch (err) {
      // Error handled by context
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white p-4 pb-20 md:p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[80px] md:blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[80px] md:blur-[120px]" />

      {/* Back to Home */}
      <Link href="/" className="absolute top-8 left-8 z-50 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
        <ArrowLeft className="w-6 h-6" />
      </Link>

      <div className="w-full max-w-md z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[2.5rem] md:rounded-3xl shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <Link href="/" className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 mb-2 md:mb-4 hover:bg-indigo-500/30 transition-colors">
              <ShieldCheck className="w-7 h-7 md:w-8 md:h-8 text-indigo-400" />
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Welcome Home
            </h1>
            <p className="text-white/40 text-sm px-4">Find your place. {brand.TAGLINE}</p>
          </div>

          <div className="space-y-6">
            <GoogleButton />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                <span className="bg-[#121212] px-4 text-white/30">Or continue with</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] md:text-xs font-medium text-white/50 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    required
                    inputMode="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 md:py-4 pl-12 pr-4 outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all placeholder:text-white/10 text-base"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end px-1">
                  <label className="text-[10px] md:text-xs font-medium text-white/50 uppercase tracking-wider">Password</label>
                  <button type="button" className="text-[10px] text-indigo-400/50 hover:text-indigo-400 transition-colors uppercase tracking-wider">Forgot?</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="password"
                    name="password"
                    required
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 md:py-4 pl-12 pr-4 outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all placeholder:text-white/10 text-base"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 md:h-14 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>
          </div>

          <p className="text-center text-white/40 text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white/20">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
