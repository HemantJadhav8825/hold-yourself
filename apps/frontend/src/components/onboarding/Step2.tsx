import React, { useState } from 'react';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const SUPPORT_AREAS = [
  'Anxiety', 'Stress', 'Loneliness', 'Personal Growth', 
  'Relationships', 'Work', 'Grief', 'Self-Esteem'
];

export const Step2: React.FC<{ onNext: (data: any) => void }> = ({ onNext }) => {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  const toggleArea = (area: string) => {
    setSelectedAreas(prev => 
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-8 py-12"
    >
      <div className="space-y-4">
        <Heading level={2}>What&apos;s on your mind?</Heading>
        <Text muted>Select the areas where you&apos;re looking for support. (Optional)</Text>
      </div>

      <div className="flex flex-wrap gap-3">
        {SUPPORT_AREAS.map(area => (
          <button
            key={area}
            onClick={() => toggleArea(area)}
            className={cn(
              "px-6 py-3 rounded-2xl border-2 transition-all duration-200 cursor-pointer text-sm font-semibold",
              selectedAreas.includes(area) 
                ? "bg-primary border-primary text-white shadow-lg" 
                : "border-text/10 text-text/60 hover:border-primary/30 hover:text-primary"
            )}
          >
            {area}
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button size="lg" onClick={() => onNext({ supportAreas: selectedAreas })}>
          Next
        </Button>
      </div>
    </motion.div>
  );
};
