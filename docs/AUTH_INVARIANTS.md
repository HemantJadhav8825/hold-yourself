# Webelong Authentication Invariants

> **CRITICAL PLATFORM CONTRACT**
> These rules are PERMANENT. Do not modify without formal security review.

## Invariant 1: Fail-Open Viewing
Unauthenticated users **MUST** be able to view all public emotional content.
Authentication must **NEVER** block emotional arrival.

**Protected Routes:**
-   None (by default)
-   Sanctuary (Access via "Enter" button only)

**Public Routes (Must Never Block):**
-   Homepage (`/`)
-   Holding Space Feed (`/holding-space`)
-   Emotion Pages (`/i-feel-*`)
-   Share Permalinks (`/holding-space/post/*`)
-   Explore Feelings (`/explore-feelings`)

## Invariant 2: Auth Required for Interaction
Authentication is required **ONLY** for:
-   Resonate
-   Comment / Reply
-   Create Share
-   Support
-   Chat
-   Profile Access

**Enforcement Mechanism:**
-   **MUST** use `useRequireAuth()` hook.
-   **NEVER** use direct `router.push('/login')`.

## Invariant 3: Redirect Integrity
All redirect parameters **MUST** be sanitized to prevent Open Redirect vulnerabilities.

**Mechanism:**
-   `utils/security.ts` -> `getSafeRedirect(path)`
-   **Rules:**
    -   Must start with `/`
    -   Must NOT start with `//`
    -   Must NOT contain `://`
    -   Fallback to `/` if invalid.

**Mandatory Usage:**
-   `AuthContext.login`
-   `AuthContext.googleLogin`
-   `GuestGuard`
-   `useRequireAuth`

## Invariant 4: Logout Fail-Open
Logout **MUST** redirect to the **Homepage (`/`)**.
Logout **MUST NOT** redirect to `/login`.

**Reasoning:**
-   Webelong is a public space.
-   Logging out returns the user to the "Fail-Open" public state.
-   Directing to login implies a "walled garden" which violates our philosophy.
