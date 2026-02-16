# The Sanctuary (Experimental)

The Sanctuary is a dedicated space for safe, anonymous, and ephemeral community interaction. It is designed to be a "safety valve" rather than a destination.

## 1. Core Philosophy

- **Ephemeral**: Content disappears after **24 hours**.
- **Anonymous**: Nature-inspired pseudonyms (e.g., "Quiet River") are assigned automatically.
- **Minimal Interaction**: Emojis only (🤍, 🤗, 😔, 👂). No replies, no threads.
- **Incident-Driven**: Sanctuary appears at moments of emotional friction, not as a persistent sidebar item.

## 2. Architecture

### Data Flow
- **Frontend**: Next.js (App Router) using a unified API client.
- **Gateway (Port 3000)**: Routes `/v1/vents/*` to Chat Service and `/v1/users/anonymous` to Auth Service.
- **Chat Service (Port 3200)**: Manages `Vent` and `Reaction` models in MongoDB with TTL indexes for auto-deletion.

## 3. User Journey & Entry Points

Sanctuary should appear quietly and disappear completely once its purpose is served.
- **Approved**: Post-login check-in (occasional), aborted social actions (hesitation).
- **Disallowed**: Primary navigation, push notifications, or framing as a community substitute.

## 4. Configuration

Enable via environment variables:
- `SANCTUARY_ENABLED=true` (Backend)
- `NEXT_PUBLIC_SANCTUARY_ENABLED=true` (Frontend)

When disabled, no routes are accessible, and no UI is rendered.
