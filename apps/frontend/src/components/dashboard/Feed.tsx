import React from 'react';
import { StoriesRow } from './StoriesRow';
import { FeedCard } from './FeedCard';
import { EmptyQuiet } from '@/illustrations/components/EmptyQuiet';
import { Text } from '@/components/ui/Text';

export const Feed: React.FC = () => {
  // Scaffolding with dummy data
  const posts = [
    {
      id: '1',
      username: 'webelong_official',
      caption: 'Welcome to our new space. A calm harbor for your thoughts. 🌿',
      likes: 1284,
      timeAgo: '4h',
    },
    {
      id: '2',
      username: 'alex_mindful',
      caption: 'Finding peace in the daily noise. #mindfulness',
      likes: 452,
      timeAgo: '6h',
    },
  ];

  return (
    <div className="pb-10">
      <StoriesRow />
      
      <div className="flex flex-col">
        {posts.length > 0 ? (
          posts.map((post) => (
            <FeedCard 
              key={post.id}
              username={post.username}
              caption={post.caption}
              likes={post.likes}
              timeAgo={post.timeAgo}
            />
          ))
        ) : (
          <div className="py-20 flex flex-col items-center text-center space-y-6 px-6">
            <EmptyQuiet size="200" />
            <div className="space-y-2">
              <Text className="text-foreground/80 font-medium">
                This space will fill when it’s ready.
              </Text>
              <Text size="sm" muted>
                Take a breath, look around, and belong.
              </Text>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
