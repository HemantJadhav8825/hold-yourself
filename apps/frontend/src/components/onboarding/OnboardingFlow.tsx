'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { useRouter } from 'next/navigation';

export const OnboardingFlow: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({});
  const router = useRouter();

  const handleNext = (stepData: any = {}) => {
    setData(prev => ({ ...prev, ...stepData }));
    setStep(prev => prev + 1);
  };

  const handleComplete = () => {
    console.log('Onboarding complete:', data);
    localStorage.setItem('has_completed_onboarding', 'true');
    if (onComplete) {
      onComplete();
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="w-full h-full max-w-lg mx-auto flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {step === 1 && <Step1 key="step1" onNext={() => handleNext()} />}
        {step === 2 && <Step2 key="step2" onNext={handleNext} />}
        {step === 3 && <Step3 key="step3" onComplete={handleComplete} />}
      </AnimatePresence>

      <div className="mt-auto py-8 flex justify-center gap-2">
        {[1, 2, 3].map(i => (
          <div 
            key={i} 
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              step === i ? 'bg-primary w-6' : 'bg-primary/20'
            }`} 
          />
        ))}
      </div>
    </div>
  );
};
