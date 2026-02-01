import Link from 'next/link';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] text-white p-6 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] md:w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[80px] md:blur-[160px]" />
      
      <div className="z-10 w-full max-w-4xl text-center space-y-8 md:space-y-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs md:text-sm font-medium mb-2 animate-bounce">
            <ShieldCheck className="w-4 h-4" />
            Secure Mobile-First Architecture
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] bg-gradient-to-b from-white to-white/30 bg-clip-text text-transparent">
            HOLD <br /> YOURSELF.
          </h1>
          <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto font-light leading-relaxed px-4">
            The ultimate self-accountability platform. <br className="hidden md:block" /> Built with production-grade security and elite design.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 md:px-0">
          <Link 
            href="/signup" 
            className="group w-full sm:w-auto px-8 py-5 md:py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/login" 
            className="w-full sm:w-auto px-8 py-5 md:py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl transition-all flex items-center justify-center active:scale-95"
          >
            Member Login
          </Link>
        </div>

        <div className="pt-8 md:pt-12 grid grid-cols-3 gap-4 md:gap-8 border-t border-white/5 opacity-50">
          <div>
            <p className="text-2xl md:text-3xl font-bold">JWT</p>
            <p className="text-[10px] md:text-xs text-indigo-400 font-bold uppercase tracking-widest">Security</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold">24/7</p>
            <p className="text-[10px] md:text-xs text-indigo-400 font-bold uppercase tracking-widest">Uptime</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold">100%</p>
            <p className="text-[10px] md:text-xs text-indigo-400 font-bold uppercase tracking-widest">Privacy</p>
          </div>
        </div>
      </div>
    </main>
  );
}
