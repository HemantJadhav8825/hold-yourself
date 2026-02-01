'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { PageContainer } from '@/components/layout/PageContainer';
import { Search, Flame, Compass, Map, Wind } from 'lucide-react';
import { DailyQuestion } from '@/components/explore/DailyQuestion';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';

export default function ConnectPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  return (
    <PageContainer>
      <div className="space-y-8 pb-12">
        {/* Header Section */}
        <div className="space-y-4">
          <Heading level={2}>The Compass</Heading>
          
          {/* Search / Utility Bar */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text/30 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="How can we help you today?"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary/30 focus:bg-white/[0.08] transition-all placeholder:text-text/30"
            />
          </div>
        </div>

        {/* 1. The Daily Question */}
        <section>
          <DailyQuestion />
        </section>

        {/* 2. Mood Paths (Algorithmic Utility) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Compass className="w-4 h-4 text-primary" />
            <Text weight="bold" size="sm" className="uppercase tracking-widest text-text/50">For your Anxiety</Text>
          </div>
          
          <div className="grid gap-3">
             {['Grounding Techniques', 'Stories of Calm', 'Hope in Darkness'].map((path) => (
               <button key={path} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all text-left group">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                     <Wind className="w-4 h-4" />
                   </div>
                   <Text weight="medium">{path}</Text>
                 </div>
                 <Map className="w-4 h-4 text-text/20 group-hover:text-primary transition-colors" />
               </button>
             ))}
          </div>
        </section>

        {/* 3. Campfires (Thematic Groups) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Flame className="w-4 h-4 text-orange-400" />
            <Text weight="bold" size="sm" className="uppercase tracking-widest text-text/50">Campfires</Text>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Grief', color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
              { label: 'Work Stress', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
              { label: 'Relationships', color: 'text-rose-400', bg: 'bg-rose-400/10' },
              { label: 'Late Night', color: 'text-purple-400', bg: 'bg-purple-400/10' },
            ].map((camp) => (
              <button key={camp.label} className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all flex flex-col gap-3 group">
                <div className={`w-8 h-8 rounded-full ${camp.bg} flex items-center justify-center ${camp.color}`}>
                  <Flame className="w-4 h-4" />
                </div>
                <Text weight="semibold" size="sm">{camp.label}</Text>
              </button>
            ))}
          </div>
        </section>

      </div>
    </PageContainer>
  );
}
