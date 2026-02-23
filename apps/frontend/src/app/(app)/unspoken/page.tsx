'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/utils';
import { PlusIcon } from 'lucide-react';
import { format } from 'date-fns';

const UNSPOKEN_STORAGE_KEY = 'webelong_unspoken_entries';
const AUTOSAVE_DELAY = 1000;

interface UnspokenEntry {
    id: string;
    content: string;
    updatedAt: number;
}

export default function UnspokenPage() {
    const [entries, setEntries] = useState<UnspokenEntry[]>([]);
    const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Initial load from storage and focus
    useEffect(() => {
        const _stored = localStorage.getItem(UNSPOKEN_STORAGE_KEY);
        let loadedEntries: UnspokenEntry[] = [];
        if (_stored) {
            try {
                loadedEntries = JSON.parse(_stored);
            } catch (e) {
                console.error("Failed to parse unspoken entries", e);
            }
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setEntries(loadedEntries);

        if (loadedEntries.length > 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setActiveEntryId(loadedEntries[0].id);
        } else {
            // Create a new blank slate if completely empty
            const newId = crypto.randomUUID();
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setEntries([{ id: newId, content: '', updatedAt: Date.now() }]);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setActiveEntryId(newId);
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLoaded(true);

        const focusTimer = setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
            }
        }, 50);
        return () => clearTimeout(focusTimer);
    }, []);

    const activeEntry = entries.find(e => e.id === activeEntryId);

    const saveToStorage = (newEntries: UnspokenEntry[]) => {
        // Filter out completely empty entries on save unless it's the only one
        const validEntries = newEntries.filter(e => e.content.trim().length > 0);
        if (validEntries.length > 0) {
            localStorage.setItem(UNSPOKEN_STORAGE_KEY, JSON.stringify(validEntries));
        } else {
            localStorage.removeItem(UNSPOKEN_STORAGE_KEY);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;

        if (!isLoaded || !activeEntryId) return;

        // Optimistically update UI
        const updatedEntries = entries.map(entry =>
            entry.id === activeEntryId
                ? { ...entry, content: val, updatedAt: Date.now() }
                : entry
        ).sort((a, b) => b.updatedAt - a.updatedAt); // ensure newest is top

        setEntries(updatedEntries);

        // Clear existing timer if user types again
        if (typingTimerRef.current) {
            clearTimeout(typingTimerRef.current);
        }

        setSaveStatus('saving');
        typingTimerRef.current = setTimeout(() => {
            saveToStorage(updatedEntries);
            setSaveStatus('saved');

            // Keep the "saved" status slightly visible then drop to idle to make it feel quiet
            setTimeout(() => {
                setSaveStatus('idle');
            }, 2000);
        }, AUTOSAVE_DELAY);
    };

    const handleCreateNew = () => {
        // Don't create new if current is completely empty
        if (activeEntry && !activeEntry.content.trim()) {
            if (textareaRef.current) textareaRef.current.focus();
            return;
        }

        const newId = crypto.randomUUID();
        const newEntry = { id: newId, content: '', updatedAt: Date.now() };
        const updatedEntries = [newEntry, ...entries].sort((a, b) => b.updatedAt - a.updatedAt);
        setEntries(updatedEntries);
        setActiveEntryId(newId);
        saveToStorage(updatedEntries);

        setTimeout(() => {
            if (textareaRef.current) textareaRef.current.focus();
        }, 50);
    };

    const handleSelectEntry = (id: string) => {
        setActiveEntryId(id);
        setTimeout(() => {
            if (textareaRef.current) textareaRef.current.focus();
        }, 50);
    };

    // Derived states
    const activeContent = activeEntry?.content || '';

    // For the timeline, we only want to show entries with content (or if we are currently looking at it)
    const displayEntries = entries.filter(e => e.content.trim() || e.id === activeEntryId);

    return (
        <PageContainer>
            <div className="flex flex-col md:flex-row h-[calc(100dvh-6rem)] md:h-[calc(100vh-8rem)] w-full max-w-6xl mx-auto py-6 md:py-12 px-4 md:px-12 gap-8 md:gap-20">

                {/* Timeline Panel */}
                <aside className="w-full md:w-56 flex-shrink-0 flex flex-col h-32 md:h-full">
                    <div className="flex items-center justify-between mb-4 md:mb-12 px-2">
                        <span className="text-sm font-serif tracking-wide text-paper-textSoft/50">timeline</span>
                        <button
                            onClick={handleCreateNew}
                            className="p-2 rounded-full text-paper-textSoft/40 hover:text-paper-textSoft/80 hover:bg-paper-surface/50 transition-all duration-700 ease-in-out"
                            aria-label="New entry"
                        >
                            <PlusIcon size={16} strokeWidth={1.5} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 p-2 custom-scrollbar">
                        {displayEntries.map((entry) => {
                            const firstLine = entry.content.split('\n')[0].trim();
                            const preview = firstLine || 'Empty slate';
                            const isActive = entry.id === activeEntryId;

                            return (
                                <button
                                    key={entry.id}
                                    onClick={() => handleSelectEntry(entry.id)}
                                    className={cn(
                                        "w-full text-left px-4 py-4 rounded-xl transition-all duration-700 ease-in-out",
                                        isActive
                                            ? "bg-paper-surface text-paper-text shadow-paper-shadow shadow-sm"
                                            : "text-paper-textSoft/50 hover:bg-paper-surface/40 hover:text-paper-textSoft/80"
                                    )}
                                >
                                    <div className="text-xs font-mono opacity-50 mb-2 tracking-wide">
                                        {format(entry.updatedAt, 'EEEE, MMM d')}
                                    </div>
                                    <div className={cn(
                                        "text-sm font-serif truncate tracking-wide leading-relaxed",
                                        !firstLine && "opacity-60"
                                    )}>
                                        {preview}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </aside>

                {/* Editor Core */}
                <main className="flex-1 flex flex-col relative min-h-0 bg-paper-surface rounded-[2rem] p-6 md:p-16 shadow-paper-shadow shadow-sm transition-colors duration-1000">
                    <Textarea
                        ref={textareaRef}
                        value={activeContent}
                        onChange={handleChange}
                        placeholder={activeContent || !isLoaded ? '' : 'Some things live here before they are ready.'}
                        className="w-full flex-1 resize-none bg-transparent border-none text-xl md:text-2xl leading-[1.85] tracking-[0.015em] font-serif font-normal placeholder:font-serif placeholder:not-italic placeholder:text-paper-textSoft/70 caret-paper-textSoft focus-visible:ring-0 px-0 shadow-none text-paper-text selection:bg-paper-surfaceSoft [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    />

                    {/* Quiet Autosave Indicator */}
                    <div
                        aria-live="polite"
                        className={cn(
                            "absolute bottom-6 right-6 md:bottom-12 md:right-12 text-[11px] tracking-[0.2em] lowercase font-mono transition-all duration-1000 ease-in-out pointer-events-none text-paper-textSoft/50",
                            saveStatus === 'saved' ? "opacity-100" : "opacity-0 translate-y-2"
                        )}
                    >
                        saved
                    </div>
                </main>
            </div>
        </PageContainer>
    );
}
