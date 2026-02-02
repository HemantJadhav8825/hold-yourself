# Hold Yourself hemant

A production-ready monorepo workspace managed with **PNPM Workspaces** and **Turborepo**.

## 🏗️ Structure

### Applications (`apps/`)

- **[frontend](./apps/frontend)**: Primary user interface.
- **[admin-panel](./apps/admin-panel)**: Management dashboard.
- **[backend](./apps/backend)**: Core monolithic API (if applicable).

### Services (`services/`)

- **[auth-service](./services/auth-service)**: Authentication & Authorization.
- **[payment-service](./services/payment-service)**: Transaction management.
- **[notification-service](./services/notification-service)**: Multi-channel notifications.

### Packages (`packages/`)

- **[@hold-yourself/ui](./packages/ui)**: Shared component library.
- **[@hold-yourself/utils](./packages/utils)**: Common utility functions.
- **[@hold-yourself/types](./packages/types)**: Global TypeScript definitions.

### Infrastructure & Tools

- **[infra/](./infra)**: Docker, Kubernetes, and Terraform configurations.
- **[scripts/](./scripts)**: Automation and maintenance scripts.
- **[docs/](./docs)**: Project documentation (Architecture, API specs).

## 🚀 Getting Started

1. **Install Dependencies**: `pnpm install`
2. **Development**:
   - `pnpm dev` # everything
   - `pnpm dev:services` # only services
   - `pnpm dev:apps` # frontend + admin + backend
   - `pnpm dev:gateway` # just backend
3. **Consistency**: `pnpm check:consistency`
4. **Build**: `pnpm build`
5. **Lint**: `pnpm lint`

## 🛠️ Stack Components

- **Orchestration**: Turborepo
- **Package Manager**: PNPM
- **Language**: TypeScript
- **Containerization**: Docker
