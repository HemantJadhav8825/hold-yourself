'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ShareDTO, SupportType } from '@/features/holding-space/types';
import { formatDistanceToNow } from 'date-fns';
import { SensitivityBlurWrapper } from '@/features/holding-space/components/SensitivityBlurWrapper';
import { AnonymousAvatar } from '@/components/ui/anonymous-avatar';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { useAuth } from '@/context/AuthContext';
import { MoreVertical, Edit2, Trash2, X, Check, Loader2, AlertTriangle, Heart, MessageCircle, Share } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { toggleSupport } from '@/features/holding-space/api/toggleSupport';
import { CommentSection } from '@/features/holding-space/components/CommentSection';
import { useRequireAuth } from '@/hooks/useRequireAuth';

/**
 * INSTAGRAM-INSPIRED, BELONGING-FIRST POST CARD
 * Rule: NO like counts, comment counts, or share counts.
 */
interface FeedPostCardProps {
    share: ShareDTO;
    onUpdate?: (id: string, content: string) => Promise<void>;
    onDelete?: (id: string) => Promise<void>;
}

export const FeedPostCard: React.FC<FeedPostCardProps> = ({ share, onUpdate, onDelete }) => {
    const { user } = useAuth();
    const { requireAuth } = useRequireAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [editedContent, setEditedContent] = useState(share.content);
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [hasResonated, setHasResonated] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const isAuthor = !!share.isOwner;
    const isAnonymous = share.authorId === 'anonymous' || share.anonymous;
    const displayName = isAnonymous ? 'Anonymous' : 'Community Member';
    const avatarSeed = isAnonymous ? `#${share.id.slice(0, 6)}:?` : undefined;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSave = async () => {
        if (!editedContent.trim() || !onUpdate) return;
        setIsSaving(true);
        try {
            await onUpdate(share.id, editedContent);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update share', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!onDelete) return;
        setIsDeleting(true);
        try {
            await onDelete(share.id);
        } catch (error) {
            console.error('Failed to delete share', error);
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleResonate = async () => {
        if (!requireAuth()) return;
        setHasResonated(!hasResonated);
        try {
            await toggleSupport(share.id, SupportType.HEARD);
        } catch (error) {
            setHasResonated(!hasResonated);
        }
    };

    const handleReplyClick = () => {
        if (!requireAuth()) return;
        setShowComments(!showComments);
    };

    const handleShare = async () => {
        const url = `${window.location.origin}/holding-space/post/${share.id}`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Shared from Holding Space',
                    text: 'Someone shared a thought in the holding space.',
                    url,
                });
                return;
            } catch (err) { }
        }
        try {
            await navigator.clipboard.writeText(url);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const renderMenu = () => {
        if (!isAuthor || !onUpdate || !onDelete) return null;
        return (
            <div className="relative" ref={menuRef}>
                <button className="p-2 text-foreground/40 hover:text-foreground/80 transition-colors rounded-full" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <MoreVertical size={18} />
                </button>
                {isMenuOpen && (
                    <div className="absolute right-0 mt-1 w-36 bg-paper-surface border border-paper-border shadow-md rounded-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100 p-1">
                        <button className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-paper-surfaceSoft flex items-center gap-3 text-foreground/80" onClick={() => { setIsEditing(true); setIsMenuOpen(false); }}>
                            <Edit2 size={14} /> Edit
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-destructive/10 text-destructive flex items-center gap-3 mt-1" onClick={() => { setShowDeleteConfirm(true); setIsMenuOpen(false); }}>
                            <Trash2 size={14} /> Delete
                        </button>
                    </div>
                )}
            </div>
        );
    };

    if (showDeleteConfirm) {
        return (
            <div className="mb-6 w-full bg-destructive/5 border border-destructive/20 rounded-2xl p-6 flex flex-col items-center text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                    <AlertTriangle size={24} />
                </div>
                <div className="space-y-1">
                    <h3 className="font-medium text-foreground">Delete this share?</h3>
                    <p className="text-sm text-foreground/60">This action cannot be undone.</p>
                </div>
                <div className="flex gap-3 w-full justify-center pt-2">
                    <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting} className="flex-1 max-w-[140px] rounded-full">
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="flex-1 max-w-[140px] rounded-full">
                        {isDeleting ? <Loader2 size={14} className="animate-spin mr-2" /> : null}
                        Delete
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <article className="w-full bg-paper-surface/40 rounded-3xl mb-12 overflow-hidden transition-opacity duration-200">

            {/* HEADER (Metadata minimal) */}
            <header className="flex items-center justify-between px-6 pt-6 pb-2">
                <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-paper-border/20 to-transparent p-[1px]">
                        <div className="w-full h-full rounded-full border border-paper-surface bg-paper-surface overflow-hidden">
                            {isAnonymous ? (
                                <AnonymousAvatar seed={avatarSeed || '#333:?'} size="xs" />
                            ) : (
                                <ProfileAvatar size="xs" name={displayName} />
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[13px] font-medium text-foreground/50 leading-tight">
                            {displayName}
                        </span>
                        <Link href={`/holding-space/post/${share.id}`} className="text-[11px] text-foreground/30 hover:text-foreground/50 transition-colors duration-200 mt-0.5">
                            {formatDistanceToNow(new Date(share.createdAt), { addSuffix: true })}
                        </Link>
                    </div>
                </div>
                {!isEditing && renderMenu()}
            </header>

            {/* BODY CONTENT (Dominant) */}
            <div className="px-6 pb-4 pt-2">
                {isEditing ? (
                    <div className="space-y-3 animate-in fade-in duration-200">
                        <Textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="min-h-[120px] resize-none text-[15px] leading-relaxed border-paper-border bg-paper-surfaceSoft focus-visible:ring-primary/20"
                            placeholder="Share your thoughts..."
                            autoFocus
                        />
                        <div className="flex gap-2 justify-end">
                            <Button size="sm" variant="ghost" className="rounded-full px-4" onClick={() => { setIsEditing(false); setEditedContent(share.content); }} disabled={isSaving}>
                                Cancel
                            </Button>
                            <Button size="sm" className="rounded-full px-6" onClick={handleSave} disabled={isSaving || !editedContent.trim()}>
                                {isSaving ? <Loader2 size={14} className="animate-spin mr-2" /> : null} Save
                            </Button>
                        </div>
                    </div>
                ) : (
                    <SensitivityBlurWrapper tags={share.sensitivityTags}>
                        <p className="text-[17px] leading-loose whitespace-pre-wrap font-serif text-foreground/90">
                            {share.content}
                        </p>
                    </SensitivityBlurWrapper>
                )}
            </div>

            {/* FOOTER ACTIONS (Ghosted until interaction) */}
            <div className="px-6 py-4 flex items-center gap-5 border-t border-paper-border/10">
                <button
                    onClick={handleResonate}
                    className="group transition-opacity duration-200 opacity-40 hover:opacity-100"
                    title="Resonate"
                >
                    <Heart
                        size={16}
                        strokeWidth={1.5}
                        className={`transition-colors duration-200 ${hasResonated ? 'fill-rose-500 text-rose-500 opacity-100' : 'text-foreground'}`}
                    />
                </button>

                <button
                    onClick={handleReplyClick}
                    className="group transition-opacity duration-200 opacity-40 hover:opacity-100"
                    title="Reply"
                >
                    <MessageCircle
                        size={16}
                        strokeWidth={1.5}
                        className="text-foreground"
                    />
                </button>

                <button
                    onClick={handleShare}
                    className="group transition-opacity duration-200 opacity-40 hover:opacity-100"
                    title="Share"
                >
                    {isCopied ? (
                        <Check size={16} strokeWidth={1.5} className="text-emerald-500" />
                    ) : (
                        <Share size={16} strokeWidth={1.5} className="text-foreground" />
                    )}
                </button>
            </div>

            {/* COMMENTS EXPANSION */}
            {showComments && (
                <div className="border-t border-paper-border/20 bg-paper-surfaceSoft/20">
                    <CommentSection shareId={share.id} />
                </div>
            )}

        </article>
    );
};
