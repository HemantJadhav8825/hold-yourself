import React from 'react';
import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { Text } from '@/components/ui/Text';

interface StoryItem {
  id: string;
  name: string;
  avatar?: string;
  hasStory: boolean;
  storySeen?: boolean;
}

interface StoriesRowProps {
  stories?: StoryItem[];
}

export const StoriesRow: React.FC<StoriesRowProps> = ({ stories = [] }) => {
  // Mock data if none provided (for scaffolding)
  const displayStories = stories.length > 0 ? stories : [
    { id: '1', name: 'Your story', hasStory: true, storySeen: false },
    { id: '2', name: 'alex_m', hasStory: true, storySeen: false },
    { id: '3', name: 'sam_wise', hasStory: true, storySeen: true },
    { id: '4', name: 'nature_lo', hasStory: true, storySeen: false },
    { id: '5', name: 'ocean_b', hasStory: true, storySeen: false },
    { id: '6', name: 'sky_high', hasStory: true, storySeen: true },
  ];

  return (
    <div className="w-full py-4 lg:py-6 overflow-x-auto no-scrollbar border-b lg:border-none border-border">
      <div className="flex px-4 lg:px-0 gap-4 sm:gap-6">
        {displayStories.map((story) => (
          <div key={story.id} className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer">
            <ProfileAvatar 
              src={story.avatar} 
              name={story.name} 
              size="lg" 
              hasStory={story.hasStory}
              storySeen={story.storySeen}
            />
            <Text size="xs" muted className="truncate max-w-[64px] text-center">
              {story.name}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
};
