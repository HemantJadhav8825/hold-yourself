'use client';

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { usePaperMode } from '@/context/PaperModeContext';
import { cn } from '@/lib/utils';

interface PaperToggleProps {
    className?: string;
}

export const PaperToggle: React.FC<PaperToggleProps> = ({ className }) => {
    const { setMode, isNightActive } = usePaperMode();

    return (
        <button
            onClick={() => setMode(isNightActive ? 'day' : 'night')}
            className={cn(
                "p-2 rounded-full hover:bg-paper-surfaceSoft hover:text-primary transition-all duration-300 flex items-center justify-center text-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                className
            )}
            title={isNightActive ? 'Morning Paper' : 'Dim the lights'}
            aria-label={isNightActive ? 'Switch to Morning Paper' : 'Switch to Dim the lights'}
        >
            {isNightActive ? (
                <Sun className="w-5 h-5 transition-transform hover:scale-110" />
            ) : (
                <Moon className="w-5 h-5 transition-transform hover:scale-110" />
            )}
        </button>
    );
};
