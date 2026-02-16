# Onboarding System

Webelong is a "belonging-first" platform. Our onboarding is not a funnel; it is a **foyer**. It must feel safe, optional, and non-invasive. We do not extract value from the user; we offer them a space.

## 1. Guardrails & Philosophy

The following rules are enforced at the architectural level:
- **No Personal/Demographic/Clinical Questions**: We do not ask for identity or health data.
- **No Gamification**: No progress bars, nudges, or checklists.
- **No Blocking**: The app is fully usable even if onboarding is skipped.
- **Identity Agnostic**: Focus on *intent*, not identity.

## 2. Onboarding Sequence

The flow consists of exactly 5 steps following signup:
1. **The Threshold**: Simple welcome message.
2. **Intent**: User selects loose intent (e.g., "To Listen", "To Share"). Default: "Just to Be".
3. **Visibility**: Choose visibility (e.g., "Visible", "Ghost"). Default: **Ghost/Anonymous**.
4. **First Safe Action**: Single, non-social action (e.g., "Take a breath").
5. **Completion**: Transition to Dashboard.

## 3. Implementation Details

### File Structure
```bash
apps/frontend/src/
├── app/onboarding/
│   ├── layout.tsx       # Shell
│   └── page.tsx         # Orchestrator host
├── components/onboarding/
│   ├── OnboardingGuard.tsx       # Logic: Route protection
│   ├── OnboardingOrchestrator.tsx # Logic: Step flow
│   └── OnboardingShell.tsx       # UI: Visual layout
└── lib/onboarding/
    └── state.ts         # Logic: FSM types and storage helpers
```

### State Machine (FSM)
States: `not_started`, `in_progress`, `completed`, `skipped`.
- **Refresh Safety**: If a user refreshes during `in_progress`, the state forces to `skipped` to avoid traps.
- **Terminal States**: `completed` and `skipped` are terminal; onboarding is never shown again.

## 4. Routing Architecture

Routing uses three layers of protection:
1. **Authentication Guard**: Redirects to `/login` if no user.
2. **Onboarding Guard**:
   - `not_started` or `in_progress` -> Allow `/onboarding`, redirect others.
   - `completed` or `skipped` -> Allow `/dashboard`, redirect `/onboarding`.
3. **Application Layout**: Final render.

## 5. Persistence Strategy

- **Primary**: `localStorage` (`webelong_onboarding_state`) for synchronous tracking.
- **Truth**: Backend `user.hasOnboarded` flag.
- **Fail-Open**: If persistence fails, the system defaults to `skipped` to ensure user access.
