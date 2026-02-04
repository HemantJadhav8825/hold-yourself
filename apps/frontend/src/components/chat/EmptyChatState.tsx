import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Text } from '@/components/ui/Text';
import { Heading } from '@/components/ui/Heading';
import { ConnectionCards } from '@/illustrations/components/ConnectionCards';

export const EmptyChatState: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-background/50">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl" />
        {/* Fallback to MessageCircle if ConnectionIllustration doesn't exist yet */}
        <div className="relative z-10 w-full h-48 flex items-center justify-center">
          <ConnectionCards size="180" className="opacity-80" />
        </div>
      </div>
      
      <div className="max-w-md space-y-4">
        <Heading level={4} className="font-heading text-foreground/80">Your messages.</Heading>
        <Text muted className="text-sm">
          Send private photos and messages to a friend. 
          Conversations start when you’re ready.
        </Text>
      </div>
    </div>
  );
};
