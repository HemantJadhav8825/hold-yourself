'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface MomentItem {
    id: string;
    label: string;
    gradient: string;
    isAction?: boolean;
}

const MOMENTS: MomentItem[] = [
    { id: 'calm', label: 'Calm', gradient: 'from-blue-100 to-indigo-50' },
    { id: 'heavy', label: 'Heavy', gradient: 'from-slate-200 to-zinc-100' },
    { id: 'hopeful', label: 'Hopeful', gradient: 'from-amber-100 to-orange-50' },
    { id: 'lonely', label: 'Lonely', gradient: 'from-purple-100 to-fuchsia-50' },
    { id: 'grateful', label: 'Grateful', gradient: 'from-emerald-100 to-teal-50' },
];

export const MomentsStrip = () => {
    return (
        <div className="w-full relative">
            <div className="flex w-full overflow-x-auto pb-4 pt-2 hide-scrollbar items-start gap-4 px-1">

                {MOMENTS.map((moment, idx) => (
                    <motion.div
                        key={moment.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group"
                    >
                        {/* Soft Warm Ring - No Red/Urgency */}
                        <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-paper-border/50 via-paper-border/20 to-paper-border/50 transition-all duration-200 group-hover:from-primary/10 group-hover:to-primary/5">
                            {/* Inner Circle */}
                            <div className={`w-full h-full rounded-full bg-gradient-to-br ${moment.gradient} border-[2px] border-paper-surface flex items-center justify-center p-1`}>
                                <div className="w-full h-full rounded-full bg-white/40 mix-blend-overlay" />
                            </div>
                        </div>
                        <span className="text-[11px] font-normal text-foreground/50 group-hover:text-foreground/80 transition-opacity duration-200">
                            {moment.label}
                        </span>
                    </motion.div>
                ))}

                {/* Find a Circle Action - Safe Discovery */}
                <Link href="#" className="flex flex-col items-center gap-2 flex-shrink-0 group">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: MOMENTS.length * 0.05 }}
                        className="w-14 h-14 rounded-full border border-dashed border-paper-border/60 flex items-center justify-center bg-paper-surfaceSoft transition-colors duration-200 group-hover:border-primary/20 group-hover:bg-primary/5"
                    >
                        <Plus className="w-5 h-5 text-foreground/40 group-hover:text-primary/60 transition-colors" strokeWidth={1.5} />
                    </motion.div>
                    <span className="text-[11px] font-normal text-foreground/50 group-hover:text-primary/80 flex items-center justify-center text-center leading-tight mt-1 max-w-[56px] transition-opacity duration-200">
                        Find a Circle
                    </span>
                </Link>

            </div>
        </div>
    );
};
