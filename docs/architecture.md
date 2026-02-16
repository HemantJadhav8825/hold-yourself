# Architecture Overview

Webelong is built as a high-performance monorepo using **Turborepo** and **PNPM Workspaces**. It follows a microservices-inspired architecture where the frontend communicates with a central gateway that proxies requests to specialized leaf services.

## 🏗️ Monorepo Structure

- **`apps/`**: Client-facing applications (Frontend, Admin).
- **`services/`**: Specialized backend logic (Auth, Chat, Payment).
- **`packages/`**: Shared code (UI, Types, Utils).
- **`docs/`**: Minimum viable documentation.

## 🛡️ Core Principles

1. **Belonging-First**: Every feature is weighed against its impact on user safety and mental well-being.
2. **Stateless Gateway**: The `backend` app handles routing and auth validation but has no direct database access.
3. **Internalized Logic**: Leaf services own their data and logic boundaries completely.
4. **Code as Truth**: We prefer self-documenting code and automated tests over heavy prose.

## 🔗 Key Documentation

Refer to the **[Docs Index](./README.md)** for detailed guides on Onboarding, Infrastructure, and Operations.
