'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { X, Loader2, Sparkles, User, Shield } from 'lucide-react';
import { ShareDTO } from '@/features/holding-space/types';
import { createShare } from '@/features/holding-space/api/createShare';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';

interface CheckInComposerProps {
    addOptimisticShare: (share: ShareDTO) => void;
    replaceShare: (tempId: string, realShare: ShareDTO) => void;
    removeShare: (id: string) => void;
    onPostSuccess?: () => void;
}

export const CheckInComposer = ({
    addOptimisticShare,
    replaceShare,
    removeShare,
    onPostSuccess,
}: CheckInComposerProps) => {
    const { user } = useAuth();

    // State: 'idle' (compact), 'expanded' (typing), 'resting' (quiet mode)
    const [composerState, setComposerState] = useState<'idle' | 'expanded' | 'resting'>('idle');

    const [content, setContent] = useState('');
    const [visibility, setVisibility] = useState<'public' | 'followers'>('public');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorVibe, setErrorVibe] = useState<string | null>(null);

    const handleExpand = () => {
        if (composerState === 'idle') setComposerState('expanded');
    };

    const handleRest = (e: React.MouseEvent) => {
        e.stopPropagation();
        setComposerState('resting');
        setContent('');
        setTags([]);
    };

    const handleWakeUp = (e: React.MouseEvent) => {
        e.stopPropagation();
        setComposerState('expanded');
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = tagInput.trim().toLowerCase();
            if (newTag && !tags.includes(newTag) && tags.length < 5) {
                setTags([...tags, newTag]);
                setTagInput('');
            }
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const handleSubmit = async () => {
        if (!content.trim() || isSubmitting) return;

        setErrorVibe(null);
        setIsSubmitting(true);

        const tempId = `temp-${Date.now()}`;
        const now = new Date().toISOString();

        const optimisticShare: ShareDTO = {
            id: tempId,
            authorId: user?.id || 'unknown',
            content,
            // @ts-ignore
            visibility,
            // @ts-ignore
            isAnonymous,
            // @ts-ignore
            sensitivityTags: tags,
            createdAt: now,
            updatedAt: now,
            author: user ? {
                id: user.id,
                displayName: user.displayName || 'Me',
                username: user.username || 'me',
                avatar: user.avatar,
            } : undefined,
        };

        addOptimisticShare(optimisticShare);

        setContent('');
        setTags([]);
        setComposerState('idle');

        try {
            const realShare = await createShare({
                content: optimisticShare.content,
                visibility,
                anonymous: isAnonymous,
                sensitivityTags: tags,
            });

            replaceShare(tempId, realShare);
            onPostSuccess?.();
        } catch (err) {
            console.error('Failed to post share:', err);
            removeShare(tempId);
            setErrorVibe("Something went wrong. You can try again.");
            setContent(optimisticShare.content);
            setComposerState('expanded');
        } finally {
            setIsSubmitting(false);
        }
    };

    const canPost = content.trim().length > 0;

    // ----------------------------------------------------
    // RESTING STATE (Edge Case 1)
    // ----------------------------------------------------
    if (composerState === 'resting') {
        return (
            <div className="w-full bg-paper-surfaceSoft border border-paper-border/50 rounded-2xl p-4 flex items-center justify-between transition-all duration-500 min-h-[64px]">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-primary/40" strokeWidth={1.5} />
                    </div>
                    <div>
                        <Text size="sm" weight="medium" className="text-foreground/80">Resting quietly today.</Text>
                        <Text size="xs" muted>No pressure to share.</Text>
                    </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleWakeUp} className="text-foreground/40 hover:text-foreground/80 font-normal h-8">
                    Share something
                </Button>
            </div>
        );
    }

    // ----------------------------------------------------
    // IDLE / EXPANDED STATE
    // ----------------------------------------------------
    return (
        <div
            className={cn(
                "w-full bg-paper-surface border border-paper-border rounded-2xl shadow-sm transition-all duration-300 overflow-hidden",
                composerState === 'idle' ? "cursor-text hover:border-border/60 p-4" : "p-6"
            )}
            onClick={handleExpand}
        >
            <div className="flex gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-5 h-5 text-primary/40" />
                        )}
                    </div>
                </div>

                {/* Input Area */}
                <div className="flex-1 pt-1">
                    {composerState === 'idle' ? (
                        <div className="flex items-center justify-between h-8">
                            <Text size="md" className="text-foreground/40 font-serif italic">How are you holding up today?</Text>
                            <Button variant="ghost" size="sm" onClick={handleRest} className="h-8 rounded-full px-4 text-xs font-medium text-foreground/60 hover:bg-paper-surfaceSoft">
                                Stay quiet today
                            </Button>
                        </div>
                    ) : (
                        <Textarea
                            autoFocus
                            placeholder="What is heavy on your heart today? (This is anonymous)"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            disabled={isSubmitting}
                            className="resize-none min-h-[120px] text-lg font-serif placeholder:font-serif placeholder:italic placeholder:opacity-40 border-none bg-transparent focus-visible:ring-0 px-0 shadow-none leading-relaxed"
                        />
                    )}
                </div>
            </div>

            {errorVibe && (
                <div className="text-xs text-destructive mt-2 pl-14">
                    {errorVibe}
                </div>
            )}

            {/* Expanded Tools Footer */}
            {composerState === 'expanded' && (
                <div className="mt-4 pl-14 animate-in fade-in slide-in-from-top-2 space-y-4">

                    {/* Tags */}
                    <div className="space-y-2">
                        <div className="flex flex-wrap gap-2 mb-2">
                            {tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="flex items-center gap-1 font-normal bg-paper-surfaceSoft">
                                    #{tag}
                                    <button onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive transition-colors" type="button">
                                        <X size={12} />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                        {tags.length < 5 && (
                            <input
                                type="text"
                                placeholder="Add sensitivity tags (optional, press Enter)"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                disabled={isSubmitting}
                                className="text-sm w-full bg-transparent border-b border-paper-border focus:outline-none focus:border-primary/50 py-1 font-serif italic placeholder:opacity-50"
                            />
                        )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-paper-border/50">
                        <div className="flex items-center gap-6">
                            {/* Visibility */}
                            <select
                                value={visibility}
                                onChange={(e) => setVisibility(e.target.value as 'public' | 'followers')}
                                disabled={isSubmitting}
                                className="text-xs bg-transparent text-foreground/70 focus:outline-none cursor-pointer"
                            >
                                <option value="public">🌍 Public Network</option>
                                <option value="followers">👥 Followers Only</option>
                            </select>

                            {/* Incognito */}
                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => !isSubmitting && setIsAnonymous(!isAnonymous)}>
                                <div className={cn("w-4 h-4 rounded-sm border flex items-center justify-center transition-colors", isAnonymous ? "bg-primary border-primary text-white" : "border-paper-border")}>
                                    {isAnonymous && <Sparkles className="w-3 h-3" />}
                                </div>
                                <Label className="text-xs font-normal text-foreground/70 cursor-pointer">Wait incognito</Label>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setComposerState('idle')} className="h-9 px-4 text-foreground/60 font-normal">
                                Cancel
                            </Button>
                            <Button disabled={!canPost || isSubmitting} size="sm" onClick={handleSubmit} className="h-9 px-6 rounded-full font-medium shadow-sm transition-transform hover:scale-105 active:scale-95">
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Share quietly'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
