'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import client from '@/api/client';

const UNSPOKEN_STORAGE_KEY = 'webelong_unspoken_entries';
const AUTOSAVE_DELAY = 1000;

interface UnspokenEntry {
    id: string;
    content: string;
    createdAt: number;
    updatedAt: number;
    sharedAt?: number;
}

const saveToStorage = (newEntries: UnspokenEntry[]) => {
    localStorage.setItem(UNSPOKEN_STORAGE_KEY, JSON.stringify(newEntries));
};

export default function UnspokenPage() {
    const [entries, setEntries] = useState<UnspokenEntry[]>([]);
    const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
    const [activeEntryContent, setActiveEntryContent] = useState<string>('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
    const [entryToShare, setEntryToShare] = useState<string | null>(null);
    const [isSharing, setIsSharing] = useState(false);
    const [shareError, setShareError] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Initial load from storage and focus
    useEffect(() => {
        const _stored = localStorage.getItem(UNSPOKEN_STORAGE_KEY);
        let loadedEntries: UnspokenEntry[] = [];
        if (_stored) {
            try {
                const parsed = JSON.parse(_stored);
                // Migrate legacy entries without `createdAt`
                loadedEntries = parsed.map((e: any) => ({
                    ...e,
                    createdAt: e.createdAt || e.updatedAt || Date.now()
                })).sort((a: any, b: any) => b.updatedAt - a.updatedAt);
            } catch (e) {
                console.error("Failed to parse unspoken entries", e);
            }
        }

        setEntries(loadedEntries);

        if (loadedEntries.length > 0) {
            setActiveEntryId(loadedEntries[0].id);
            setActiveEntryContent(loadedEntries[0].content);
        } else {
            // Create a new blank slate if completely empty
            const newId = crypto.randomUUID();
            const now = Date.now();
            setEntries([{ id: newId, content: '', createdAt: now, updatedAt: now }]);
            setActiveEntryId(newId);
            setActiveEntryContent('');
        }

        setIsLoaded(true);

        const focusTimer = setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
            }
        }, 50);
        return () => clearTimeout(focusTimer);
    }, []);

    const activeEntry = entries.find(e => e.id === activeEntryId);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;

        if (!isLoaded || !activeEntryId) return;

        // Optimistically update ONLY text state (for instant typing)
        setActiveEntryContent(val);

        // Clear existing timer if user types again
        if (typingTimerRef.current) {
            clearTimeout(typingTimerRef.current);
        }

        setSaveStatus('saving');
        typingTimerRef.current = setTimeout(() => {
            // Commit to entries array only on delayed autosave
            const updatedEntries = entries.map(entry =>
                entry.id === activeEntryId
                    ? { ...entry, content: val, updatedAt: Date.now() }
                    : entry
            );

            setEntries(updatedEntries);
            saveToStorage(updatedEntries);
            setSaveStatus('saved');

            // Keep the "saved" status slightly visible then drop to idle to make it feel quiet
            setTimeout(() => {
                setSaveStatus('idle');
            }, 2000);
        }, AUTOSAVE_DELAY);
    };

    const handleCreateNew = React.useCallback(() => {
        const newId = crypto.randomUUID();
        const now = Date.now();
        const newEntry = { id: newId, content: '', createdAt: now, updatedAt: now };
        const updatedEntries = [newEntry, ...entries];
        setEntries(updatedEntries);
        setActiveEntryId(newId);
        setActiveEntryContent('');
        saveToStorage(updatedEntries);

        setTimeout(() => {
            if (textareaRef.current) textareaRef.current.focus();
        }, 50);
    }, [entries]);

    const handleSelectEntry = React.useCallback((id: string) => {
        const selected = entries.find(e => e.id === id);
        if (selected) {
            setActiveEntryId(id);
            setActiveEntryContent(selected.content);
        }
        setTimeout(() => {
            if (textareaRef.current) textareaRef.current.focus();
        }, 50);
    }, [entries]);

    // Timeline must display entries ordered by updatedAt DESC. Never sort during typing directly in state.
    const displayEntries = React.useMemo(() => {
        return [...entries].sort((a, b) => b.updatedAt - a.updatedAt);
    }, [entries]);

    const handleRequestDelete = React.useCallback((id: string) => {
        setEntryToDelete(id);
    }, []);

    const confirmDelete = React.useCallback(() => {
        if (!entryToDelete) return;

        const updatedEntries = entries.filter(e => e.id !== entryToDelete);

        setEntries(updatedEntries);
        saveToStorage(updatedEntries);

        if (activeEntryId === entryToDelete) {
            // Deleted the active entry, find a replacement
            if (updatedEntries.length > 0) {
                // Select the most recently updated among remaining (they are already mostly sorted, but let's be safe)
                const mostRecent = [...updatedEntries].sort((a, b) => b.updatedAt - a.updatedAt)[0];
                setActiveEntryId(mostRecent.id);
                setActiveEntryContent(mostRecent.content);
            } else {
                // No entries remain, create a new blank one
                const newId = crypto.randomUUID();
                const now = Date.now();
                const newEntry = { id: newId, content: '', createdAt: now, updatedAt: now };
                const finalEntries = [newEntry];
                setEntries(finalEntries);
                saveToStorage(finalEntries);
                setActiveEntryId(newId);
                setActiveEntryContent('');
            }
        }

        setEntryToDelete(null);
        setTimeout(() => {
            if (textareaRef.current) textareaRef.current.focus();
        }, 50);
    }, [entryToDelete, entries, activeEntryId]);

    const handleRequestShare = React.useCallback(() => {
        if (!activeEntryId) return;
        const entry = entries.find(e => e.id === activeEntryId);
        if (entry?.sharedAt) return; // duplicate protection
        setEntryToShare(activeEntryId);
    }, [activeEntryId, entries]);

    const confirmShare = React.useCallback(async () => {
        if (!entryToShare) return;

        const entry = entries.find(e => e.id === entryToShare);
        if (!entry || entry.sharedAt) return;

        setIsSharing(true);
        setShareError(null);

        try {
            const response = await client.post('/api/unspoken/share', {
                entryId: entry.id,
                content: entry.content
            });

            if (response.data.success) {
                const updatedEntries = entries.map(e =>
                    e.id === entryToShare
                        ? { ...e, sharedAt: Date.now() }
                        : e
                );

                setEntries(updatedEntries);
                saveToStorage(updatedEntries);
            }
        } catch (error) {
            setShareError("Could not share right now.");
        } finally {
            setIsSharing(false);
            setEntryToShare(null);

            setTimeout(() => {
                if (textareaRef.current) textareaRef.current.focus();
            }, 50);
        }
    }, [entryToShare, entries]);

    const cancelShare = React.useCallback(() => {
        setEntryToShare(null);
        setTimeout(() => {
            if (textareaRef.current) textareaRef.current.focus();
        }, 50);
    }, []);

    const cancelDelete = React.useCallback(() => {
        setEntryToDelete(null);
        setTimeout(() => {
            if (textareaRef.current) textareaRef.current.focus();
        }, 50);
    }, []);

    return (
        <PageContainer>
            <div className="flex flex-col md:flex-row w-full max-w-[1100px] h-[calc(100dvh-4rem)] md:h-[calc(100vh-6rem)] mx-auto relative mt-0 md:mt-6 px-0 md:px-8">

                {/* Mobile: Horizontal Tabs */}
                <div className="md:hidden flex w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] border-b border-paper-border/10 bg-paper-bg z-20 px-4">
                    <button
                        onClick={handleCreateNew}
                        className="flex-shrink-0 px-4 py-4 font-serif text-sm text-paper-textSoft/60 hover:text-paper-text transition-colors"
                    >
                        + New Page
                    </button>
                    {displayEntries.map(entry => {
                        const isActive = entry.id === activeEntryId;
                        return (
                            <button
                                key={entry.id}
                                onClick={() => handleSelectEntry(entry.id)}
                                className={cn(
                                    "flex-shrink-0 px-4 py-4 font-serif text-sm transition-all duration-300 relative",
                                    isActive
                                        ? "text-paper-text"
                                        : "text-paper-textSoft/50 hover:text-paper-textSoft/80"
                                )}
                            >
                                {format(entry.createdAt, 'MMM d')}
                                {isActive && (
                                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-paper-textSoft/30" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Editor Core: The Physical Page */}
                <main className="flex-1 flex flex-col relative min-h-0 bg-paper-surface md:rounded-l-[1rem] md:rounded-br-[1rem] shadow-[8px_8px_32px_rgba(0,0,0,0.03)] transition-colors duration-1000 p-6 md:p-16 z-10 w-full h-full border border-paper-border/5">
                    <Textarea
                        ref={textareaRef}
                        value={activeEntryContent}
                        onChange={handleChange}
                        placeholder={activeEntryContent || !isLoaded ? '' : 'Some things live here before they are ready.'}
                        className="w-full flex-1 resize-none bg-transparent border-none text-xl md:text-2xl leading-[1.85] tracking-[0.015em] font-serif font-normal placeholder:font-serif placeholder:not-italic placeholder:text-paper-textSoft/40 caret-paper-textSoft focus-visible:ring-0 px-0 shadow-none text-paper-text selection:bg-paper-surfaceSoft [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    />

                    {/* Active Page Footer Controls */}
                    <div className="w-full flex justify-end items-center pt-8 font-serif text-sm gap-6">
                        {shareError && (
                            <span className="text-paper-textSoft/60 text-xs tracking-wide pointer-events-none transition-opacity duration-1000">
                                {shareError}
                            </span>
                        )}

                        {activeEntry && isLoaded && (
                            <button
                                onClick={() => handleRequestDelete(activeEntry.id)}
                                className="text-paper-textSoft/40 hover:text-paper-textSoft/80 transition-colors duration-500"
                            >
                                Tear out page
                            </button>
                        )}

                        {activeEntry && isLoaded && (
                            <button
                                onClick={handleRequestShare}
                                disabled={!!activeEntry.sharedAt || isSharing}
                                className={cn(
                                    "transition-all duration-700 ease-in-out",
                                    (activeEntry.sharedAt || isSharing)
                                        ? "text-paper-textSoft/30 cursor-default"
                                        : "text-paper-textSoft/50 hover:text-paper-textSoft/80"
                                )}
                            >
                                {isSharing ? 'Sharing...' : activeEntry.sharedAt ? 'Shared' : 'Share to Holding Space'}
                            </button>
                        )}
                    </div>

                    {/* Quiet Autosave Indicator */}
                    <div
                        aria-live="polite"
                        className={cn(
                            "absolute bottom-6 left-6 md:bottom-16 md:left-16 text-[11px] tracking-[0.2em] lowercase font-mono transition-all duration-1000 ease-in-out pointer-events-none text-paper-textSoft/30",
                            saveStatus === 'saved' ? "opacity-100" : "opacity-0 translate-y-2"
                        )}
                    >
                        saved
                    </div>
                </main>

                {/* Desktop: Vertical Tabs */}
                <aside className="hidden md:flex flex-col w-32 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pt-12 pb-12 z-0 relative -ml-1">
                    <button
                        onClick={handleCreateNew}
                        className="text-left px-5 py-3 font-serif text-sm text-paper-textSoft/60 hover:text-paper-text transition-colors"
                    >
                        + New Page
                    </button>
                    <div className="flex flex-col gap-1 mt-4">
                        {displayEntries.map(entry => {
                            const isActive = entry.id === activeEntryId;
                            return (
                                <button
                                    key={entry.id}
                                    onClick={() => handleSelectEntry(entry.id)}
                                    className={cn(
                                        "text-left px-5 py-3 font-serif text-sm transition-all duration-500 rounded-r-xl border-y border-r flex flex-col gap-1",
                                        isActive
                                            ? "bg-paper-surface text-paper-text shadow-[4px_4px_15px_rgba(0,0,0,0.03)] border-paper-border/10 pl-7 z-10"
                                            : "bg-transparent text-paper-textSoft/40 hover:bg-paper-surface/30 border-transparent hover:text-paper-textSoft/80"
                                    )}
                                >
                                    <span>{format(entry.createdAt, 'MMM d')}</span>
                                    {entry.sharedAt && (
                                        <span className="text-[9px] tracking-[0.1em] lowercase opacity-50">shared</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </aside>
            </div>

            {/* Deletion Confirmation Dialog */}
            {entryToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper-bg/40 backdrop-blur-[2px] p-4 animate-in fade-in duration-500">
                    <div className="bg-paper-surface rounded-2xl p-8 max-w-[320px] w-full shadow-paper-shadow border border-paper-border/10 text-center animate-in zoom-in-95 duration-500">
                        <h3 className="text-paper-text font-serif text-lg mb-2 tracking-wide">Remove this page?</h3>
                        <p className="text-paper-textSoft/70 font-serif text-sm mb-8 tracking-wide">This cannot be undone.</p>
                        <div className="flex justify-center gap-4 font-serif text-sm">
                            <button
                                autoFocus
                                onClick={cancelDelete}
                                className="px-6 py-2 text-paper-textSoft hover:text-paper-text transition-colors duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-6 py-2 text-paper-textSoft hover:text-paper-text transition-colors duration-300"
                            >
                                Tear out
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Share Confirmation Dialog */}
            {entryToShare && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper-bg/40 backdrop-blur-[2px] p-4 animate-in fade-in duration-500">
                    <div className="bg-paper-surface rounded-2xl p-8 max-w-[320px] w-full shadow-paper-shadow border border-paper-border/10 text-center animate-in zoom-in-95 duration-500">
                        <h3 className="text-paper-text font-serif text-lg mb-2 tracking-wide">Share this to Holding Space?</h3>
                        <p className="text-paper-textSoft/70 font-serif text-sm mb-8 tracking-wide leading-relaxed">
                            You can remain anonymous. You can also keep it unshared.
                        </p>
                        <div className="flex justify-center gap-4 font-serif text-sm">
                            <button
                                autoFocus
                                onClick={cancelShare}
                                className="px-6 py-2 text-paper-textSoft hover:text-paper-text transition-colors duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmShare}
                                disabled={isSharing}
                                className={cn(
                                    "px-6 py-2 transition-colors duration-300",
                                    isSharing
                                        ? "text-paper-textSoft/30 cursor-default"
                                        : "text-paper-textSoft hover:text-paper-text"
                                )}
                            >
                                {isSharing ? 'Sharing...' : 'Share'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </PageContainer>
    );
}
