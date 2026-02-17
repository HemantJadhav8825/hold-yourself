import React from 'react';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { Text } from '@/components/ui/Text';
import { MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';

interface FeedCardProps {
  id: string;
  username: string;
  avatar?: string;
  image?: string;
  caption?: string;
  timeAgo?: string;
  sensitivityTags?: string[];
  hideIdentity?: boolean;
}

export const FeedCard: React.FC<FeedCardProps> = ({
  id,
  username,
  avatar,
  image,
  caption,
  timeAgo = '2h',
  sensitivityTags = [],
  hideIdentity = false,
}) => {
  const displayUsername = hideIdentity ? 'Someone in Holding Space' : username;
  const displayAvatar = hideIdentity ? undefined : avatar;

  return (
    <Link href={`/holding-space/post/${id}`} className="block">
      <article className="bg-webelong-card border-b border-webelong-border lg:border lg:rounded-xl lg:mb-6 overflow-hidden hover:bg-webelong-hover transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between p-3 lg:p-4">
          <div className="flex items-center gap-3">
            <ProfileAvatar src={displayAvatar} name={displayUsername} size="sm" hasStory={!hideIdentity} />
            <div className="flex flex-col">
              <Text weight="semibold" className="text-sm">
                {displayUsername}
              </Text>
              <Text size="xs" muted className="lg:hidden">{timeAgo}</Text>
            </div>
          </div>
          <button className="p-1 hover:text-foreground/60">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="aspect-square bg-muted relative overflow-hidden flex items-center justify-center">
          {image ? (
            <img src={image} alt="Post content" className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
              <div className="w-24 h-24 border-2 border-current rounded-lg flex items-center justify-center">
                <span className="text-sm font-medium">Space for reflection</span>
              </div>
            </div>
          )}
        </div>

        {/* Caption & Metadata */}
        <div className="p-3 lg:p-4 pt-0 lg:pt-0 space-y-3">

          <div className="space-y-1">
            {caption && (
              <div className="flex gap-1.5">
                <Text weight="semibold" className="text-sm">{displayUsername}</Text>
                <Text size="sm" className="flex-1 opacity-90">{caption}</Text>
              </div>
            )}
            {sensitivityTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {sensitivityTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            <Text size="xs" muted className="hidden lg:block pt-1 uppercase tracking-wider text-[10px]">
              {timeAgo}
            </Text>
          </div>
        </div>
      </article>
    </Link>
  );
};
