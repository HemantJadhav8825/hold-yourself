'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import client from '@/api/client';

const UNSPOKEN_STORAGE_KEY = 'webelong_unspoken_entries';
const AUTOSAVE_DELAY = 1000;

interface UnspokenEntry {
    id: string;
    title?: string;
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
    const [activeEntryTitle, setActiveEntryTitle] = useState<string>('');
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
                    createdAt: e.createdAt || e.updatedAt || Date.now(),
                    title: e.title || ''
                })).sort((a: any, b: any) => b.updatedAt - a.updatedAt);
            } catch (e) {
                console.error("Failed to parse unspoken entries", e);
            }
        }

        setEntries(loadedEntries);

        if (loadedEntries.length > 0) {
            setActiveEntryId(loadedEntries[0].id);
            setActiveEntryTitle(loadedEntries[0].title || '');
            setActiveEntryContent(loadedEntries[0].content);
        } else {
            // Create a new blank slate if completely empty
            const newId = crypto.randomUUID();
            const now = Date.now();
            setEntries([{ id: newId, title: '', content: '', createdAt: now, updatedAt: now }]);
            setActiveEntryId(newId);
            setActiveEntryTitle('');
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

    const triggerAutosave = React.useCallback((id: string, title: string, content: string) => {
        if (typingTimerRef.current) {
            clearTimeout(typingTimerRef.current);
        }

        setSaveStatus('saving');
        typingTimerRef.current = setTimeout(() => {
            setEntries(prev => {
                const updated = prev.map(entry =>
                    entry.id === id
                        ? { ...entry, title, content, updatedAt: Date.now() }
                        : entry
                );
                saveToStorage(updated);
                return updated;
            });
            setSaveStatus('saved');
            setTimeout(() => {
                setSaveStatus('idle');
            }, 2000);
        }, AUTOSAVE_DELAY);
    }, []);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        if (!isLoaded || !activeEntryId) return;

        setActiveEntryContent(val);
        triggerAutosave(activeEntryId, activeEntryTitle, val);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (!isLoaded || !activeEntryId) return;

        setActiveEntryTitle(val);
        triggerAutosave(activeEntryId, val, activeEntryContent);
    };

    const handleCreateNew = React.useCallback(() => {
        const newId = crypto.randomUUID();
        const now = Date.now();
        const newEntry = { id: newId, title: '', content: '', createdAt: now, updatedAt: now };
        const updatedEntries = [newEntry, ...entries];
        setEntries(updatedEntries);
        setActiveEntryId(newId);
        setActiveEntryTitle('');
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
            setActiveEntryTitle(selected.title || '');
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
                setActiveEntryTitle(mostRecent.title || '');
                setActiveEntryContent(mostRecent.content);
            } else {
                // No entries remain, create a new blank one
                const newId = crypto.randomUUID();
                const now = Date.now();
                const newEntry = { id: newId, title: '', content: '', createdAt: now, updatedAt: now };
                const finalEntries = [newEntry];
                setEntries(finalEntries);
                saveToStorage(finalEntries);
                setActiveEntryId(newId);
                setActiveEntryTitle('');
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
        <>
            {/* 1. DESK ENVIRONMENT */}
            <div className="bg-[#eae3d9] h-full flex-1 w-full flex flex-col items-center justify-center relative overflow-hidden py-4 md:py-8 px-4 md:pl-8 md:pr-[160px]">

                {/* Mobile: Horizontal Tabs (Positioned on desk above notebook) */}
                <div role="tablist" className="md:hidden flex w-full max-w-[1100px] overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] z-20 pb-4 mb-4">
                    <button
                        onClick={handleCreateNew}
                        className="flex-shrink-0 px-4 py-3 font-serif text-sm text-[#8a8174] hover:text-[#5a5144] transition-colors"
                    >
                        + New Page
                    </button>
                    {displayEntries.map(entry => {
                        const isActive = entry.id === activeEntryId;
                        return (
                            <button
                                key={entry.id}
                                role="tab"
                                aria-selected={isActive}
                                onClick={() => handleSelectEntry(entry.id)}
                                className={cn(
                                    "flex-shrink-0 px-4 py-3 font-serif text-sm transition-all duration-300 relative rounded-t-md mx-1 max-w-[160px] flex items-center justify-center gap-2",
                                    isActive
                                        ? "bg-[#f8f6f3] text-[#3a352d] shadow-[0_-4px_10px_rgba(0,0,0,0.05)] border-t border-x border-[#d8d1c7]/40"
                                        : "bg-paper text-[#8a8174] hover:bg-[#efebe4]"
                                )}
                            >
                                <span className="truncate">{entry.title?.trim() ? entry.title : format(entry.createdAt, 'MMM d')}</span>
                                {entry.sharedAt && <span className="inline-block w-1.5 h-1.5 rounded-full bg-black/20 shrink-0" />}
                            </button>
                        );
                    })}
                </div>

                {/* 2. NOTEBOOK OBJECT CONTAINER */}
                <div className="relative w-full h-full flex-1 max-w-none shadow-[0_40px_80px_rgba(0,0,0,0.15)] rounded-r-xl transition-all duration-1000 z-10">

                    {/* 7. NOTEBOOK DEPTH EFFECT */}
                    <div className="absolute inset-y-2 left-0 right-[-6px] bg-white shadow-sm rounded-r-xl z-[-1] opacity-70 border border-black/5 mix-blend-multiply" />
                    <div className="absolute inset-y-4 left-0 right-[-12px] bg-[#fdfbf7] shadow-sm rounded-r-xl z-[-2] opacity-40 border border-black/5 bg-blend-multiply" />
                    <div className="absolute inset-y-6 left-0 right-[-16px] bg-[#f8f6f3] shadow-sm rounded-r-xl z-[-3] opacity-20 border border-black/5" />

                    {/* 3. NOTEBOOK SPINE */}
                    <div className="absolute left-0 top-0 bottom-0 w-[40px] md:w-[60px] bg-[#d8d1c7] z-30 shadow-[inset_-8px_0_12px_rgba(0,0,0,0.06),inset_2px_0_4px_rgba(255,255,255,0.4)] rounded-l-md flex flex-col justify-evenly items-center py-6 md:py-10 border-r border-[#c4bcaf]">
                        {/* Spiral binding illusion */}
                        {[...Array(14)].map((_, i) => (
                            <div key={i} className="relative w-[30px] md:w-[45px] h-[10px] md:h-[14px] bg-[#2a2a2a] rounded-full transform -translate-x-1 md:-translate-x-2 shadow-[0_2px_5px_rgba(0,0,0,0.4),inset_0_2px_1px_rgba(255,255,255,0.2)] opacity-90 z-40">
                                {/* Coil highlight */}
                                <div className="absolute top-[2px] left-[10%] right-[10%] h-[3px] bg-white/30 rounded-full" />
                            </div>
                        ))}
                    </div>

                    {/* 4. PAGE SURFACE */}
                    <main className="absolute left-[40px] md:left-[60px] right-0 top-0 bottom-0 bg-paper-surface shadow-[inset_12px_0_20px_rgba(0,0,0,0.04)] rounded-r-xl z-20 flex flex-col px-8 md:px-8 py-8 md:py-12 transition-colors duration-1000 overflow-hidden">

                        {/* Subtle paper grain/lines (optional, keeping minimal for now to match user preference) */}

                        {/* 5. TITLE & EDITOR */}
                        <div className="flex flex-col flex-1 h-full mb-[80px]">
                            <input
                                value={activeEntryTitle}
                                onChange={handleTitleChange}
                                placeholder={activeEntryContent || !isLoaded ? '' : 'Untitled'}
                                className="w-full bg-transparent border-none outline-none shadow-none font-serif text-[28px] md:text-[32px] font-medium tracking-[0.02em] text-[#3a352d] placeholder:text-[#3a352d]/30 focus-visible:ring-0 px-2 pb-4"
                            />
                            <Textarea
                                ref={textareaRef}
                                value={activeEntryContent}
                                onChange={handleContentChange}
                                placeholder={activeEntryContent || !isLoaded ? '' : 'Some things live here before they are ready.'}
                                className="w-full flex-1 bg-transparent border-none outline-none shadow-none resize-none font-serif text-[20px] md:text-[22px] leading-[1.85] tracking-[0.01em] text-[#3a352d] placeholder:text-[#3a352d]/30 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:ring-0 px-2"
                            />
                        </div>

                        {/* Active Page Footer Controls */}
                        <div className="absolute bottom-8 md:bottom-12 right-8 md:right-16 flex flex-col md:flex-row gap-4 md:gap-8 z-30 items-end md:items-center">
                            {shareError && (
                                <span className="text-[#8a8174]/70 text-[14px] md:text-[15px] pointer-events-none transition-opacity duration-1000">
                                    {shareError}
                                </span>
                            )}

                            {activeEntry && isLoaded && (
                                <button
                                    onClick={() => handleRequestDelete(activeEntry.id)}
                                    aria-label="Delete entry"
                                    className="text-[14px] md:text-[15px] text-[#8a8174] hover:text-[#c44a4a] transition-colors font-serif italic"
                                >
                                    Tear out page
                                </button>
                            )}

                            {activeEntry && isLoaded && (
                                <button
                                    onClick={handleRequestShare}
                                    disabled={!!activeEntry.sharedAt || isSharing}
                                    aria-label="Share this to holding space"
                                    className={cn(
                                        "text-[14px] md:text-[15px] font-serif italic transition-colors",
                                        (activeEntry.sharedAt || isSharing)
                                            ? "text-[#8a8174]/40 cursor-default"
                                            : "text-[#8a8174] hover:text-[#3a352d]"
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
                                "absolute bottom-8 md:bottom-12 left-8 md:left-16 text-[11px] tracking-[0.2em] lowercase font-mono transition-all duration-1000 ease-in-out pointer-events-none text-[#8a8174]/40 z-30",
                                saveStatus === 'saved' ? "opacity-100" : "opacity-0 translate-y-2"
                            )}
                        >
                            saved
                        </div>
                    </main>

                    {/* 6. ATTACHED TABS (DESKTOP) */}
                    <aside role="tablist" aria-orientation="vertical" className="hidden md:flex absolute right-[-140px] top-12 flex-col gap-[6px] z-[-5] max-h-[calc(100vh-120px)] overflow-y-auto pb-8 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#d8d1c7]/50 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#d8d1c7] pr-2 -mr-2">
                        <button
                            onClick={handleCreateNew}
                            className="w-[140px] pl-[20px] pr-4 py-3 bg-[#e8e2d7] text-[#8a8174] hover:text-[#5a5144] rounded-r-lg shadow-[4px_2px_8px_rgba(0,0,0,0.06),inset_2px_0_0_#d8d1c7] border-y border-r border-[#d8d1c7]/40 transition-colors text-left font-serif text-sm -ml-[10px]"
                        >
                            + New Page
                        </button>
                        {displayEntries.map((entry, idx) => {
                            const isActive = entry.id === activeEntryId;
                            // Slight variation in tab width to look organic
                            const widthOffset = idx % 3 === 0 ? 'w-[145px]' : idx % 3 === 1 ? 'w-[140px]' : 'w-[135px]';

                            return (
                                <button
                                    key={entry.id}
                                    onClick={() => handleSelectEntry(entry.id)}
                                    className={cn(
                                        `pl-[20px] pr-4 py-[14px] rounded-r-lg border-y border-r border-[#d8d1c7]/50 text-left font-serif text-[15px] flex flex-col gap-1 transition-all duration-300 -ml-[10px]`,
                                        widthOffset,
                                        isActive
                                            ? "bg-[#fdfbf7] text-[#3a352d] shadow-[8px_4px_16px_rgba(0,0,0,0.1)] z-10 translate-x-2 font-medium"
                                            : "bg-[#f4efe6] text-[#8a8174] shadow-[4px_2px_8px_rgba(0,0,0,0.04)] hover:bg-[#faf7f2] hover:translate-x-1"
                                    )}
                                >
                                    <span className="w-[100px] truncate block text-ellipsis whitespace-nowrap">{entry.title?.trim() ? entry.title : format(entry.createdAt, 'MMM d')}</span>
                                    {entry.sharedAt && (
                                        <span className="text-[9.5px] tracking-[0.1em] lowercase text-[#8a8174]/60 font-mono shrink-0">shared</span>
                                    )}
                                </button>
                            );
                        })}
                    </aside>
                </div>
            </div>

            {/* Deletion Confirmation Dialog */}
            {entryToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#eae3d9]/60 backdrop-blur-[4px] p-4 animate-in fade-in duration-500">
                    <div className="bg-[#fdfbf7] rounded-xl p-10 max-w-[340px] w-full shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-[#d8d1c7] text-center animate-in zoom-in-95 duration-500 relative">
                        {/* Torn paper texture effect at top */}
                        <div className="absolute top-0 left-0 right-0 h-2 bg-[#fdfbf7] [mask-image:url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxwYXRoIGQ9Ik0wLDVMMTAsMkwyMCw3TDMwLDRMNDAsNkw1MCwzTDYwLDhMNzAsNEw4MCw3TDkwLDNMMTAwLzUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==')] opacity-20" />

                        <h3 className="text-[#3a352d] font-serif text-xl mb-3 tracking-wide">Tear out this page?</h3>
                        <p className="text-[#8a8174] font-serif text-[15px] mb-8 tracking-wide">This cannot be undone.</p>
                        <div className="flex justify-center gap-6 font-serif text-[15px]">
                            <button
                                autoFocus
                                onClick={cancelDelete}
                                className="px-4 py-2 text-[#8a8174] hover:text-[#3a352d] transition-colors duration-300"
                            >
                                Keep it
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 text-[#c44a4a]/80 hover:text-[#c44a4a] transition-colors duration-300 italic"
                            >
                                Tear out
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Share Confirmation Dialog */}
            {entryToShare && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#eae3d9]/60 backdrop-blur-[4px] p-4 animate-in fade-in duration-500">
                    <div className="bg-[#fdfbf7] rounded-xl p-10 max-w-[340px] w-full shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-[#d8d1c7] text-center animate-in zoom-in-95 duration-500">
                        <h3 className="text-[#3a352d] font-serif text-xl mb-3 tracking-wide">Share to Holding Space?</h3>
                        <p className="text-[#8a8174] font-serif text-[15px] mb-8 tracking-wide leading-relaxed">
                            You can remain anonymous. You can also keep it unshared.
                        </p>
                        <div className="flex justify-center gap-6 font-serif text-[15px]">
                            <button
                                autoFocus
                                onClick={cancelShare}
                                className="px-4 py-2 text-[#8a8174] hover:text-[#3a352d] transition-colors duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmShare}
                                disabled={isSharing}
                                className={cn(
                                    "px-4 py-2 transition-colors duration-300 italic",
                                    isSharing
                                        ? "text-[#8a8174]/40 cursor-default"
                                        : "text-[#5a5144] hover:text-[#3a352d]"
                                )}
                            >
                                {isSharing ? 'Sharing...' : 'Share'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
