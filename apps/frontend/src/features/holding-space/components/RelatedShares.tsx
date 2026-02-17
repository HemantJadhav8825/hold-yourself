'use client';

import React from 'react';
import Link from 'next/link';
import { useHoldingSpaceFeed } from '../hooks/useHoldingSpaceFeed';
import { ShareDTO } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { SensitivityBlurWrapper } from './SensitivityBlurWrapper';
import { Loader2 } from 'lucide-react';

interface RelatedSharesProps {
    tag: string;
    currentShareId: string;
}

export const RelatedShares: React.FC<RelatedSharesProps> = ({ tag, currentShareId }) => {
    const { shares, loading } = useHoldingSpaceFeed(tag);

    // Filter out current share
    const related = shares.filter(s => s.id !== currentShareId).slice(0, 3);

    if (loading) return <div className="py-8 flex justify-center"><Loader2 className="animate-spin text-muted-foreground" size={20} /></div>;

    if (related.length === 0) return null;

    return (
        <div className="space-y-6 pt-8 border-t border-border/40">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                More spaces holding "{tag}"
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map(share => (
                    <Link href={`/holding-space/post/${share.id}`} key={share.id} className="group block">
                        <article className="h-full p-6 rounded-2xl bg-muted/20 border border-transparent group-hover:border-border/50 transition-all group-hover:bg-muted/30">
                            <SensitivityBlurWrapper tags={share.sensitivityTags}>
                                <p className="text-sm text-foreground/80 line-clamp-4 leading-relaxed">
                                    {share.content}
                                </p>
                            </SensitivityBlurWrapper>
                            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/20"></span>
                                {formatDistanceToNow(new Date(share.createdAt), { addSuffix: true })}
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        </div>
    );
};
