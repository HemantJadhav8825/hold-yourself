'use client';

import React, { useState, useEffect } from 'react';
import { CommentDTO } from '../types';
import { createComment } from '../api/createComment';
import { getComments } from '../api/getComments';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Loader2, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { AnonymousAvatar } from '@/components/ui/anonymous-avatar';

import { useRequireAuth } from '@/hooks/useRequireAuth';
interface CommentSectionProps {
    shareId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ shareId }) => {
    const { user } = useAuth();
    const { requireAuth } = useRequireAuth();
    const [comments, setComments] = useState<CommentDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [anonymous, setAnonymous] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const loadComments = async () => {
            try {
                const data = await getComments(shareId);
                if (isMounted) {
                    setComments(data);
                }
            } catch (error) {
                console.error('Failed to load comments:', error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        if (shareId) {
            loadComments();
        } else {
            setLoading(false);
        }

        return () => {
            isMounted = false;
        };
    }, [shareId]);

    const handleSubmit = async () => {
        if (!requireAuth()) return;
        if (!content.trim() || isSubmitting) return;

        setIsSubmitting(true);
        // Optimistic ID
        const tempId = `temp-${Date.now()}`;
        const optimisticComment: CommentDTO = {
            id: tempId,
            shareId,
            authorId: user?.id || 'unknown',
            content: content.trim(),
            anonymous,
            createdAt: new Date().toISOString(),
        };

        setComments(prev => [...prev, optimisticComment]);
        setContent('');

        try {
            // API Call
            // We need to update it to take anonymous flag.
            const realComment = await createComment(shareId, optimisticComment.content, anonymous);

            setComments(prev => prev.map(c => c.id === tempId ? realComment : c));
        } catch (error) {
            console.error('Failed to post comment', error);
            // Rollback
            setComments(prev => prev.filter(c => c.id !== tempId));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="p-4 text-center"><Loader2 className="animate-spin inline-block text-muted-foreground" size={16} /></div>;
    }

    return (
        <div className="border-t border-border/40 bg-muted/20 p-4 space-y-4 animate-in slide-in-from-top-2">

            {/* List */}
            <div className="space-y-4">
                {comments.length === 0 && (
                    <p className="text-xs text-muted-foreground italic text-center py-2">
                        No one has spoken yet. You can be the first.
                    </p>
                )}
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 text-sm group">
                        <div className="mt-0.5 shrink-0">
                            {comment.anonymous ? (
                                <AnonymousAvatar seed={`#${comment.id.slice(0, 6)}:?`} size="sm" />
                            ) : (
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                    {comment.authorId.slice(0, 1).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-xs text-foreground/80">
                                    {comment.anonymous ? 'Anonymous' : 'Community Member'}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                </span>
                            </div>
                            <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Composer */}
            <div className="flex gap-3 pt-2">
                <div className="flex-1">
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write a gentle reply..."
                        maxLength={500}
                        className="min-h-[40px] h-[40px] py-2 resize-none text-sm bg-background border-transparent focus:border-border transition-all"
                    />
                    <div className="flex items-center justify-between mt-2">
                        <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={anonymous}
                                onChange={(e) => setAnonymous(e.target.checked)}
                                className="rounded border-gray-300 text-primary focus:ring-primary h-3 w-3"
                            />
                            Reply anonymously
                        </label>
                        <Button
                            size="sm"
                            variant="ghost"
                            disabled={!content.trim() || isSubmitting}
                            onClick={handleSubmit}
                            className="h-7 px-3 text-xs"
                        >
                            {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} className="mr-1.5" />}
                            Reply
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
