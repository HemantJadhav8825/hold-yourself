import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Text } from '@/components/ui/Text';
import { Heading } from '@/components/ui/Heading';
import { ConnectionCards } from '@/illustrations/components/ConnectionCards';

export const EmptyChatState: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-background">
      <div className="relative mb-12 opacity-30 grayscale transition-all duration-1000 animate-in fade-in zoom-in-95">
        <div className="absolute inset-x-0 -bottom-10 h-32 bg-primary/5 rounded-full blur-[100px]" />
        <div className="relative z-10 w-full flex items-center justify-center">
          <ConnectionCards size="140" />
        </div>
      </div>
      
      <div className="max-w-xs space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <Heading level={4} className="font-heading text-foreground/40 text-lg font-medium">Safe space.</Heading>
        <Text muted className="text-xs leading-relaxed opacity-60 tracking-tight">
          Sharing is an invitation to be seen. <br />
          Speak only when you feel the call.
        </Text>
      </div>
    </div>
  );
};
