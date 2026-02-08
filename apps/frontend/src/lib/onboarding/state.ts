export type OnboardingStatus = 'not_started' | 'in_progress' | 'completed' | 'skipped';

export interface OnboardingState {
  status: OnboardingStatus;
  completedAt?: number;
}

const ONBOARDING_KEY = 'webelong_onboarding_state';

/**
 * Resolves the deterministic state of onboarding for the current session.
 * This is the ONLY source of truth for "Am I allowed to onboard?"
 */
export function getSafeOnboardingState(user: any): OnboardingStatus {
  try {
    console.log('user', user);
    // 1. Backend Truth Wins (Absolute Authority)
    // If the user profile says they are done, they are done.
    if (user?.hasOnboarded === true) {
      return 'completed';
    }

    // 2. Local State Check
    const stored = localStorage.getItem(ONBOARDING_KEY);
    if (stored) {
      const state = JSON.parse(stored) as OnboardingState;
      
      // REFRESH TRAP / CRASH SAFETY:
      // If we find 'in_progress' in storage during a fresh boot/check,
      // it means the user refreshed or crashed mid-flow.
      // We must fail-open to 'skipped' to avoid locking them out.
      if (state.status === 'in_progress') {
        return 'skipped';
      }
      
      return state.status;
    }

    // 3. 🚨 NEW USER ENTRY (The Fix)
    // Defines first authenticated session entry into onboarding.
    if (user && !stored && user.hasOnboarded !== true) {
      return 'not_started';
    }

    // Default Fallback
    return 'skipped';

  } catch (error) {
    // 4. Absolute Safety Fallback
    // If anything throws (JSON parse error, storage quota, etc),
    // we assume 'skipped' to let the user into the app.
    console.warn('Onboarding state resolution failed, defaulting to skipped:', error);
    return 'skipped';
  }
}

export function setOnboardingState(state: OnboardingState) {
  try {
    localStorage.setItem(ONBOARDING_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save onboarding state:', e);
  }
}
