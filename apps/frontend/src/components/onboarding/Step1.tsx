import React from 'react';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Aura } from '@/components/ui/Aura';
import { motion } from 'framer-motion';

export const Step1: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center text-center gap-8 py-12"
    >
      <Aura color="#3B82F6" size={240} />
      
      <div className="space-y-4">
        <Heading level={1}>You're home.</Heading>
        <Text size="lg" className="max-w-md mx-auto">
          Hold Yourself is a space for genuine connection, built on a foundation of absolute privacy. You are anonymous here, and your story is safe with us.
        </Text>
      </div>

      <Button size="lg" onClick={onNext} className="mt-8">
        Let's begin
      </Button>
    </motion.div>
  );
};
