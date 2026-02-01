import React, { useState } from 'react';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const GUIDELINES = [
  "Support without judgment.",
  "Respect every perspective.",
  "Protect the anonymity of others."
];

export const Step3: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-8 py-12"
    >
      <div className="space-y-4">
        <Heading level={2}>How we hold one another.</Heading>
        <Text muted>Our community thrive on mutual respect and safety.</Text>
      </div>

      <div className="space-y-6">
        {GUIDELINES.map((guideline, i) => (
          <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-primary/5">
            <ShieldCheck className="w-6 h-6 text-primary mt-0.5" />
            <Text weight="medium">{guideline}</Text>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-6">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-5 h-5 rounded border-2 border-primary text-primary focus:ring-primary cursor-pointer"
          />
          <Text size="sm" weight="semibold">I agree to hold this community with kindness.</Text>
        </label>

        <Button 
          size="lg" 
          fullWidth={true} 
          disabled={!agreed}
          onClick={onComplete}
        >
          Enter Hold Yourself
        </Button>
      </div>
    </motion.div>
  );
};
