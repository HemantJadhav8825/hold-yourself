'use client';

import React from 'react';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Aura } from '@/components/ui/Aura';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';
import { CreatePost } from './CreatePost';
import { useState } from 'react';

export const HomeFeed: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const posts: any[] = []; // Empty for now to show empty state

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-8">
        <div className="relative">
          <Aura color="#60A5FA" size={280} className="mb-4" />
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center"
          >
             <div className="w-32 h-32 rounded-full glass flex items-center justify-center">
                <PlusCircle className="w-12 h-12 text-primary/40" />
             </div>
          </motion.div>
        </div>

        <div className="space-y-4 max-w-sm">
          <Heading level={3}>The space is quiet.</Heading>
          <Text size="lg" muted>
            This is your private canvas and a gateway to the community. When you're ready, share your first reflection.
          </Text>
        </div>

        <Button 
          size="lg" 
          className="px-10 group"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircle className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
          Share a Reflection
        </Button>

        <CreatePost 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onPost={(content, visibility, isAnonymous) => {
            console.log('Posting:', { content, visibility, isAnonymous });
            setIsModalOpen(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8">
      {/* Posts would go here */}
    </div>
  );
};
