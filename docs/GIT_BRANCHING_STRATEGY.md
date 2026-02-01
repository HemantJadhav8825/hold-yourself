# Git Branching Strategy - Hold Yourself

This document defines the Git branching strategy for the **Hold Yourself** monorepo (PNPM + Turborepo). It is designed to be simple, scalable, and low-friction, prioritizing architectural discipline.

## 1. Core Branches (Mandatory)

These branches are permanent and protected.

- **`main`**
  - Always production-ready.
  - Protected: No direct commits.
  - Deployment source for production environments.
- **`develop`**
  - Primary integration branch.
  - Default branch for active development.
  - Always deployable to staging/QA environments.

## 2. Work Branch Types (Strict Naming)

All work branches must be short-lived and follow this pattern:
`type/<scope>-<description>`

### Types

- `feature/`: New functionality or enhancements.
- `fix/`: Bug fixes.
- `chore/`: Maintenance, dependency updates, or internal tooling changes.

### Scopes

One of: `frontend`, `admin`, `gateway`, `auth`, `payment`, `notification`, `infra`, `docs`, `tooling`.

### Examples

- `feature/auth-refresh-rotation`
- `fix/gateway-jwt-validation`
- `chore/infra-env-cleanup`

## 3. Merge Rules (Non-Negotiable)

- **Work branches** (`feature/*`, `fix/*`, `chore/*`) must merge into **`develop`**.
- **`develop`** merges into **`main`** ONLY via Pull Request.
- **`main`** is NEVER rebased.
- **`develop`** may be rebased locally for clean history, but NEVER force-pushed to the central repository.

## 4. Release Flow (Simple & Safe)

1.  Create a Pull Request from `develop` to `main`.
2.  Once merged, tag the release on `main`: `vX.Y.Z` (following SemVer).
3.  No long-lived release branches.
4.  No hotfix branches unless production is broken.

## 5. Hotfix Rule (Rare)

Used ONLY if production is broken and requires immediate remediation:

1.  Create `hotfix/<description>` from `main`.
2.  Apply the fix.
3.  Merge back into BOTH `main` and `develop`.
4.  Delete the hotfix branch immediately.

## 6. Monorepo-Specific Rules

- One PR may touch multiple apps or services.
- The `<scope>` in the branch name should reflect the **PRIMARY** change.
- Do **NOT** create per-service permanent branches.
- Do **NOT** use Gitflow with `release/*` branches.

## 7. Hard Prohibitions

- **DO NOT** commit directly to `main`.
- **DO NOT** keep feature branches long-lived (avoid "merge hell").
- **DO NOT** create branches per developer.
- **DO NOT** create branches per service.

---

**Verdict:** This strategy is optimized for a growing monorepo with strong architectural discipline and minimal operational overhead.
