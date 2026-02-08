'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Step1_Arrival } from '@/components/onboarding/steps/Step1_Arrival';
import { Step2_Intent, OnboardingIntent } from '@/components/onboarding/steps/Step2_Intent';
import { Step3_Visibility, VisibilitySetting } from '@/components/onboarding/steps/Step3_Visibility';
import { Step4_Action } from '@/components/onboarding/steps/Step4_Action';
import { Step5_Completion } from '@/components/onboarding/steps/Step5_Completion';

// Logic helpers (defined inline for now as requested, ideally in lib/onboarding/state.ts)
const ONBOARDING_KEY = 'webelong_onboarding_state';

interface OnboardingState {
  status: 'completed' | 'skipped' | 'in_progress';
  completedAt?: number;
  intent?: OnboardingIntent;
  visibility?: VisibilitySetting;
}

const STEPS = [
  Step1_Arrival,
  Step2_Intent,
  Step3_Visibility,
  Step4_Action,
  Step5_Completion
];

export const OnboardingOrchestrator: React.FC = () => {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Temporary In-Memory State (Not persisted until completion)
  const [intent, setIntent] = useState<OnboardingIntent | undefined>(undefined);
  const [visibility, setVisibility] = useState<VisibilitySetting | undefined>(undefined);

  const handleNext = async (data?: any) => {
    // 1. Capture Data (if any) based on current step index
    // Note: This relies on index stability. 
    if (currentStepIndex === 1) { // Step 2: Intent
      setIntent(data as OnboardingIntent);
    }
    if (currentStepIndex === 2) { // Step 3: Visibility
      setVisibility(data as VisibilitySetting);
    }

    // 2. Check if we are done
    if (currentStepIndex < STEPS.length - 1) {
      // Advance
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // 3. Final Step Completed -> Finish
      await handleCompletion();
    }
  };

  const handleCompletion = async () => {
    try {
      // A. Apply Defaults (CRITICAL: Visibility defaults to 'ghost' if undefined)
      const finalVisibility = visibility || 'ghost';
      const finalIntent = intent; // remains undefined if skipped

      // B. Persist State Locally
      const finalState: OnboardingState = {
        status: 'completed',
        completedAt: Date.now(),
        intent: finalIntent,
        visibility: finalVisibility,
      };
      
      localStorage.setItem(ONBOARDING_KEY, JSON.stringify(finalState));

      // C. Fire-and-Forget Backend Sync (Mocked for now)
      // await api.users.updateOnboarding({ intent, visibility: finalVisibility });
      console.log('Syncing onboarding completion to backend:', finalState);

      // D. Navigate
      router.replace('/dashboard');

    } catch (error) {
      console.error('Onboarding completion failed, forcing skip:', error);
      
      // FAIL-OPEN SAFETY: If anything breaks, mark skipped to unblock user.
      localStorage.setItem(ONBOARDING_KEY, JSON.stringify({
        status: 'skipped',
        completedAt: Date.now()
      }));
      router.replace('/dashboard');
    }
  };

  const ActiveComponent = STEPS[currentStepIndex];

  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* 
        We pass `onNext` to every component. 
        Each component knows its specific signature, but pure JS allows passing safely.
        The orchestrator handles the data internally in `handleNext`.
      */}
      <ActiveComponent onNext={handleNext} />
    </div>
  );
};
