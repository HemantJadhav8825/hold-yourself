'use client';

import React from 'react';
import { ShareDTO } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { SensitivityBlurWrapper } from './SensitivityBlurWrapper';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { AnonymousAvatar } from '@/components/ui/anonymous-avatar';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';

/**
 * HOLDING SPACE RULE:
 * Never render engagement counts.
 * Never introduce ranking UI.
 * Never introduce trending or popularity surfaces.
 */

interface ShareCardProps {
  share: ShareDTO;
}

export const ShareCard: React.FC<ShareCardProps> = ({ share }) => {
  const isAnonymous = share.authorId === 'anonymous' || share.anonymous;
  
  const displayName = isAnonymous ? 'Anonymous' : 'Community Member';
  
  // Create a seed for anonymous avatar if needed
  const avatarSeed = isAnonymous ? `#${share.id.slice(0, 6)}:?` : undefined;

  return (
    <Card className="mb-4 overflow-hidden border-border/50 hover:border-border transition-colors">
      <CardHeader className="flex flex-row items-center gap-3 p-4 pb-2 space-y-0">
        {isAnonymous ? (
            <AnonymousAvatar seed={avatarSeed || '#333:?'} size="sm" />
        ) : (
            <ProfileAvatar size="sm" name={displayName} />
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium leading-none">
            {displayName}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(share.createdAt), { addSuffix: true })}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <SensitivityBlurWrapper tags={share.sensitivityTags}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {share.content}
          </p>
        </SensitivityBlurWrapper>
      </CardContent>
    </Card>
  );
};
