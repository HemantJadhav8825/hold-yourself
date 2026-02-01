'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, LogOut, User, Settings, Bell, ChevronRight, Activity, Target, Trophy } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-white/40 animate-pulse">Initializing cockpit...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Sidebar - Desktop Only (md+) */}
      <nav className="fixed left-0 top-0 h-full w-20 bg-white/5 border-r border-white/10 hidden md:flex flex-col items-center py-8 gap-8 z-20">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Activity className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1 flex flex-col gap-6">
          <button className="p-3 bg-white/10 rounded-xl text-indigo-400">
            <LayoutDashboard className="w-6 h-6" />
          </button>
          <button className="p-3 text-white/40 hover:text-white/80 transition-colors">
            <Target className="w-6 h-6" />
          </button>
          <button className="p-3 text-white/40 hover:text-white/80 transition-colors">
            <Trophy className="w-6 h-6" />
          </button>
          <button className="p-3 text-white/40 hover:text-white/80 transition-colors">
            <Bell className="w-6 h-6" />
          </button>
        </div>

        <button className="p-3 text-white/40 hover:text-white/80 transition-colors">
          <Settings className="w-6 h-6" />
        </button>
        <button 
          onClick={logout}
          className="p-3 text-red-400/60 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </nav>

      {/* Bottom Navigation - Mobile Only (<md) */}
      <nav className="fixed bottom-0 left-0 w-full h-20 bg-[#0a0a0a]/80 backdrop-blur-xl border-t border-white/10 flex md:hidden items-center justify-around px-6 z-30">
        <button className="p-3 text-indigo-400 flex flex-col items-center gap-1">
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-[10px] uppercase font-bold tracking-widest">Dash</span>
        </button>
        <button className="p-3 text-white/30 flex flex-col items-center gap-1">
          <Target className="w-6 h-6" />
          <span className="text-[10px] uppercase font-bold tracking-widest">Goals</span>
        </button>
        <button className="p-3 text-white/30 flex flex-col items-center gap-1">
          <Trophy className="w-6 h-6" />
          <span className="text-[10px] uppercase font-bold tracking-widest">Wins</span>
        </button>
        <button className="p-3 text-white/30 flex flex-col items-center gap-1">
          <User className="w-6 h-6" />
          <span className="text-[10px] uppercase font-bold tracking-widest">Me</span>
        </button>
      </nav>

      {/* Main Content */}
      <main className="px-6 md:pl-32 md:pr-12 md:py-12 pt-10 pb-24 md:pb-12 max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-8 md:mb-12">
          <div className="space-y-2">
            <p className="text-indigo-400 text-xs font-bold uppercase tracking-[0.2em] mb-1">Overview</p>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">Dashboard</h1>
            <p className="text-white/40 text-sm md:text-base">Welcome back, <span className="text-white font-medium">{user.email}</span></p>
          </div>
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-5 py-3 md:px-6 md:py-3 rounded-2xl w-fit">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-sm">
              <p className="font-bold text-xs md:text-sm uppercase tracking-wide">{user.role}</p>
              <p className="text-white/30 text-[10px] md:text-xs">ID: {user.id.slice(0, 8)}</p>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          {[
            { label: 'Active Goals', value: '12', trend: '+2', icon: Target, color: 'text-indigo-400' },
            { label: 'Consistency', value: '94%', trend: '+4%', icon: Activity, color: 'text-emerald-400' },
            { label: 'Achievements', value: '28', trend: '+1', icon: Trophy, color: 'text-amber-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl hover:bg-white/[0.07] transition-all group flex flex-row md:flex-col justify-between items-center md:items-start">
              <div className="flex items-center md:items-start gap-4 md:flex-col md:gap-0">
                <div className={`p-3 md:p-4 rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform md:mb-6`}>
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <p className="text-white/40 text-[10px] md:text-sm font-bold uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                </div>
              </div>
              <span className="text-emerald-400 text-[10px] font-black px-2 py-1 bg-emerald-400/10 rounded-lg h-fit">{stat.trend}</span>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-black uppercase tracking-tight">Recent Activity</h2>
            <button className="text-[10px] md:text-sm text-indigo-400 font-black uppercase tracking-[0.2em] flex items-center gap-1 hover:underline">
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-xl border border-white/10 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-bold text-sm md:text-base text-white/90 truncate">Daily Deep Work Session</p>
                    <p className="text-[11px] md:text-sm text-white/40 truncate">Completed 4 hours of focused coding</p>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-[10px] md:text-sm font-black uppercase text-indigo-400 tracking-widest">Done</p>
                  <p className="text-[10px] text-white/20 whitespace-nowrap">2h ago</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
