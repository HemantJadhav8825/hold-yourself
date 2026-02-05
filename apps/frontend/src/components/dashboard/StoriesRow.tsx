import React from 'react';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { Text } from '@/components/ui/Text';
import { useUsers } from '@/hooks/useUsers';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { EmptyQuiet } from '@/illustrations/components/EmptyQuiet';

interface StoryItem {
  id: string;
  name: string;
  avatar?: string;
  hasStory: boolean;
  storySeen?: boolean;
}

export const StoriesRow: React.FC = () => {
  const { users, isLoading, isEmpty } = useUsers(10);
  const { user: currentUser } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="w-full py-4 lg:py-6 overflow-x-auto no-scrollbar border-b lg:border-none border-border">
        <div className="flex px-4 lg:px-0 gap-4 sm:gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-primary/10" />
              <div className="w-12 h-2 bg-primary/10 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isEmpty && !currentUser) {
    return (
      <div className="w-full py-8 flex flex-col items-center justify-center text-center opacity-40 grayscale pointer-events-none">
        <EmptyQuiet size="100" />
        <Text size="xs" muted className="mt-2">This space is quiet for now.</Text>
      </div>
    );
  }

  // Combine current user with other users
  const stories: StoryItem[] = [];

  if (currentUser) {
    stories.push({
      id: currentUser.id,
      name: 'Your story',
      avatar: currentUser.avatar,
      hasStory: true,
      storySeen: false,
    });
  }

  users.forEach(u => {
    if (u.id !== currentUser?.id) {
      stories.push({
        id: u.id,
        name: u.displayName || u.username || 'User',
        avatar: u.avatar,
        hasStory: true,
        storySeen: false,
      });
    }
  });

  return (
    <div className="w-full py-4 lg:py-6 overflow-x-auto no-scrollbar border-b lg:border-none border-border">
      <div className="flex px-4 lg:px-0 gap-4 sm:gap-6">
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
            <ProfileAvatar 
              src={story.avatar} 
              name={story.name} 
              size="lg" 
              hasStory={story.hasStory}
              storySeen={story.storySeen}
              className="group-hover:scale-105 transition-transform duration-300"
            />
            <Text size="xs" muted className="truncate max-w-[64px] text-center group-hover:text-primary transition-colors">
              {story.name}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
};
