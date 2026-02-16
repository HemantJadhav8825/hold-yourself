# Project Structure Audit - Webelong (Precision Edition)

**Date**: 2026-02-16
**Status**: Read-Only Audit v1 (Structural Accuracy: High)

## 📁 Repository Root

```text
.
├── apps/                 # Application entry points
├── services/             # Domain-specific microservices
├── packages/             # Shared libraries & types
├── infra/                # Infrastructure & Environment
├── scripts/              # Utility & Database scripts
├── docs/                 # Documentation & Audits
├── package.json          [true]
├── turbo.json            [true]
├── pnpm-lock.yaml        [true]
├── pnpm-workspace.yaml   [true]
├── ecosytem.config.js    [true]
└── nodepilot.yml         [true]
```

## 📱 Applications (`apps/`)

### [frontend](file:///Users/baki/Desktop/projects/webelong/apps/frontend)
- **Framework**: Next.js 16 (App Router)
- **Core Path**: `src/app/`
- **Route Groups**:
  - `(app)`: Main application interface (Messages, Sanctuary, Profile).
  - `(marketing)`: SEO/Public landing pages (Belong, Feeling Alone).
  - `(emotions)`: Programmatic SEO routes for emotions.
  - `(auth)`: Login and Signup flows.
- **Key Files**: `next.config.js`, `tailwind.config.js`, `package.json`.

### [backend](file:///Users/baki/Desktop/projects/webelong/apps/backend)
- **Framework**: Express (API Gateway/Proxy)
- **Primary Routes**: `src/routes/api.routes.ts`, `src/routes/auth.routes.ts`.
- **Logic**: Proxies requests to specialized services.

## ⚙️ Services (`services/`)

- **[auth-service](file:///Users/baki/Desktop/projects/webelong/services/auth-service)**: User identity and session management.
- **[holding-space-service](file:///Users/baki/Desktop/projects/webelong/services/holding-space-service)**: Holding Space domain logic (Post, Comment, Support).
- **[chat-service](file:///Users/baki/Desktop/projects/webelong/services/chat-service)**: Real-time messaging logic.
- **[notification-service](file:///Users/baki/Desktop/projects/webelong/services/notification-service)**: Push and in-app alerts.
- **[payment-service](file:///Users/baki/Desktop/projects/webelong/services/payment-service)**: Transaction and subscription handling.

## 📦 Packages (`packages/`)

- **[types](file:///Users/baki/Desktop/projects/webelong/packages/types)**: Shared TypeScript definitions and Zod schemas.
- **[utils](file:///Users/baki/Desktop/projects/webelong/packages/utils)**: Common helpers (logger, common logic).
- **[ui](file:///Users/baki/Desktop/projects/webelong/packages/ui)**: Reusable UI component library.
- **[auth-internal](file:///Users/baki/Desktop/projects/webelong/packages/auth-internal)**: Internal authentication logic for services.
