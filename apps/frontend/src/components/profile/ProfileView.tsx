'use client';

import React, { useState } from 'react';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Aura } from '@/components/ui/Aura';
import { motion } from 'framer-motion';
import { Book, Users,Lock, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'journey', label: 'Journey', icon: Book },
  { id: 'circles', label: 'Circles', icon: Users },
  { id: 'vault', label: 'Vault', icon: Lock, isPrivate: true },
];

export const ProfileView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('journey');

  return (
    <div className="space-y-12">
      {/* Identity Header */}
      <div className="flex flex-col items-center text-center gap-6">
        <div className="relative">
          <Aura size={180} color="#F59E0B" isPulsing={false} className="opacity-20" />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-24 h-24 rounded-full glass border-4 border-white/20 shadow-xl overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-amber-200 to-amber-500 opacity-60" />
             </div>
          </div>
        </div>

        <div className="space-y-2">
          <Heading level={2}>Anonymous Soul</Heading>
          <Text muted size="lg">Reflecting since Feb 2026</Text>
        </div>

        <Text className="max-w-md italic text-text/60">
          &quot;Finding balance in the quiet moments.&quot;
        </Text>
      </div>

      {/* Tabs */}
      <div className="flex bg-primary/5 p-1.5 rounded-2xl gap-1">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all duration-300 cursor-pointer",
              activeTab === tab.id 
                ? "bg-background text-primary shadow-sm" 
                : "text-text/40 hover:text-text/60"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-text/5 rounded-3xl">
        <div className="p-4 bg-primary/5 rounded-full mb-4">
          {activeTab === 'journey' && <Book className="w-8 h-8 text-primary/40" />}
          {activeTab === 'circles' && <Users className="w-8 h-8 text-primary/40" />}
          {activeTab === 'vault' && <Lock className="w-8 h-8 text-primary/40" />}
        </div>
        <Heading level={5} className="mb-2">
          {activeTab === 'journey' && "Your journey awaits"}
          {activeTab === 'circles' && "Find your safe space"}
          {activeTab === 'vault' && "Your private reflection vault"}
        </Heading>
        <Text muted size="sm">
          {activeTab === 'journey' && "The reflections you share with the community will appear here."}
          {activeTab === 'circles' && "You haven't joined any circles yet. Circles are small, safe groups for deep sharing."}
          {activeTab === 'vault' && "This space is strictly for you. Your moods and private logs are stored safely here."}
        </Text>
      </div>
    </div>
  );
};
