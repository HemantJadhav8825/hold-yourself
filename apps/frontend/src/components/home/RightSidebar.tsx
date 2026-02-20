'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Droplet, Moon, Search, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const RightSidebar = () => {
    return (
        <div className="w-full flex justify-center lg:justify-start">
            <div className="w-full max-w-[280px] space-y-6">

                {/* Section 1: Gentle Affirmation */}
                <Card className="bg-paper-surfaceSoft border-paper-border/50 p-6 rounded-[24px] shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 blur-[1px]">
                        <Sparkles size={48} className="text-primary" />
                    </div>
                    <div className="relative z-10">
                        <Text size="sm" weight="medium" className="text-primary/70 uppercase tracking-widest font-heading mb-2">
                            A gentle reminder
                        </Text>
                        <Heading level={4} className="font-serif italic text-foreground/90 leading-tight mb-2">
                            You belong, <br />even here.
                        </Heading>
                        <Text size="sm" className="text-foreground/60 leading-relaxed">
                            There is no pressure to perform. Take all the time you need.
                        </Text>
                    </div>
                </Card>

                {/* Section 2: Personal Grounding Prompts */}
                <div className="space-y-3 px-2">
                    <Text size="xs" weight="bold" className="uppercase tracking-wider text-foreground/40 font-heading">
                        Slow down a moment
                    </Text>

                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-paper-surface border border-paper-border/40 hover:border-paper-border/80 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                            <Droplet size={18} className="text-blue-500/60" />
                        </div>
                        <div>
                            <Text size="sm" weight="medium" className="text-foreground/80">Drink some water</Text>
                            <Text size="xs" className="text-foreground/50">Hydration helps you ground.</Text>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-paper-surface border border-paper-border/40 hover:border-paper-border/80 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                            <Moon size={18} className="text-indigo-500/60" />
                        </div>
                        <div>
                            <Text size="sm" weight="medium" className="text-foreground/80">Unclench your jaw</Text>
                            <Text size="xs" className="text-foreground/50">Let your shoulders drop.</Text>
                        </div>
                    </div>
                </div>

                {/* Section 3: Suggested Circles (Very soft, no growth hacking) */}
                <div className="space-y-4 px-2 pt-4 border-t border-paper-border/30">
                    <div className="flex items-center justify-between">
                        <Text size="xs" weight="bold" className="uppercase tracking-wider text-foreground/40 font-heading">
                            Quiet spaces
                        </Text>
                        <Link href="/circles" className="text-xs text-primary/60 hover:text-primary transition-colors">
                            View all
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {/* Mock Spaces */}
                        {[
                            { name: 'Late Night Thinkers', members: '1.2k', emoji: '🌙' },
                            { name: 'Grief & Healing', members: '850', emoji: '🍂' },
                            { name: 'Quiet Creators', members: '2.1k', emoji: '🎨' },
                        ].map((space, i) => (
                            <Link key={i} href="/circles" className="flex items-center justify-between group p-2 rounded-xl hover:bg-paper-surfaceSoft transition-colors -mx-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-paper-surface border border-paper-border/50 flex items-center justify-center text-sm shadow-sm">
                                        {space.emoji}
                                    </div>
                                    <div className="flex flex-col">
                                        <Text size="sm" weight="medium" className="text-foreground/80 group-hover:text-foreground transition-colors">
                                            {space.name}
                                        </Text>
                                        <Text size="xs" className="text-foreground/40">{space.members} resting here</Text>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Bottom Links */}
                <div className="px-2 pt-6 flex flex-wrap gap-x-3 gap-y-2 text-[11px] text-foreground/40">
                    <Link href="/about" className="hover:text-foreground/70 transition-colors">About</Link>
                    <Link href="/privacy" className="hover:text-foreground/70 transition-colors">Privacy</Link>
                    <Link href="/terms" className="hover:text-foreground/70 transition-colors">Terms</Link>
                    <Link href="/marketing/belong" className="hover:text-foreground/70 transition-colors">Manifesto</Link>
                    <span className="w-full mt-2">© 2026 Webelong</span>
                </div>

            </div>
        </div>
    );
};
