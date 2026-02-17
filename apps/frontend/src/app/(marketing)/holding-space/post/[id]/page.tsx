import React from 'react';
import { Metadata } from 'next';
import { FeedCard } from '@/components/dashboard/FeedCard';
import { constructMetadata } from '@/components/seo/metadata';
import { env } from '@/config/env';
import { notFound } from 'next/navigation';
import { RelatedShares } from '@/features/holding-space/components/RelatedShares';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PostPageProps {
    params: Promise<{ id: string }>;
}

async function getPost(id: string) {
    try {
        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/v1/shares/${id}`, {
            next: { revalidate: 60 } // Cache for 1 minute
        });

        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    const { id } = await params;
    const post = await getPost(id);

    if (!post) {
        return constructMetadata({
            title: 'Post Not Found — Webelong',
            description: 'The requested reflection could not be found.',
        });
    }

    const excerpt = post.content.substring(0, 60);

    return constructMetadata({
        title: `${excerpt} — Webelong Holding Space`,
        description: 'You are not alone in feeling this.',
    });
}

export default async function PostPermalinkPage({ params }: PostPageProps) {
    const { id } = await params;
    const post = await getPost(id);

    if (!post) {
        notFound();
    }

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <Link
                href="/holding-space"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors group"
            >
                <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Holding Space
            </Link>
            <FeedCard
                id={post.id}
                username="Someone in Holding Space"
                caption={post.content}
                timeAgo={new Date(post.createdAt).toLocaleDateString()}
                sensitivityTags={post.sensitivityTags}
                hideIdentity={true}
            />

            <div className="mt-12">
                {post.sensitivityTags && post.sensitivityTags.length > 0 && (
                    <RelatedShares tag={post.sensitivityTags[0]} currentShareId={post.id} />
                )}
            </div>
        </div>
    );
}
