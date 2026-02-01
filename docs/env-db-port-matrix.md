# ENV + DB + PORT MATRIX: Hold Yourself

## 1. Overview

This document provides a low-level, factual mapping of environment configurations, database connections, and runtime ports across the "Hold Yourself" monorepo. It serves as a source of truth for system synchronization and deployment planning.

---

## 2. Environment Variables by Workspace

| Workspace Name                | Path                    | Environment Variable    | Required | Source                            |
| :---------------------------- | :---------------------- | :---------------------- | :------: | :-------------------------------- |
| `@hold-yourself/backend`      | `apps/backend`          | `PORT`                  |   Yes    | `validateEnv.ts` / `.env`         |
| `@hold-yourself/backend`      | `apps/backend`          | `AUTH_SERVICE_BASE_URL` |   Yes    | `validateEnv.ts` / `.env`         |
| `@hold-yourself/backend`      | `apps/backend`          | `AUTH_PUBLIC_KEY`       |   Yes    | `validateEnv.ts` / `.env`         |
| `@hold-yourself/backend`      | `apps/backend`          | `AUTH_ISSUER`           |    No    | `.env`                            |
| `@hold-yourself/auth-service` | `services/auth-service` | `PORT`                  |   Yes    | `validateEnv.ts` / `.env`         |
| `@hold-yourself/auth-service` | `services/auth-service` | `DATABASE_URL`          |   Yes    | `validateEnv.ts` / `.env`         |
| `@hold-yourself/auth-service` | `services/auth-service` | `JWT_PRIVATE_KEY`       |   Yes    | `validateEnv.ts` / `.env`         |
| `@hold-yourself/auth-service` | `services/auth-service` | `JWT_PUBLIC_KEY`        |   Yes    | `validateEnv.ts` / `.env`         |
| `@hold-yourself/auth-service` | `services/auth-service` | `NODE_ENV`              |    No    | `env.ts` (fallback 'development') |

---

## 3. Database Mapping per Service

| Service Name           | Database Type | Database Name        | Connection Env Var | Status             |
| :--------------------- | :------------ | :------------------- | :----------------- | :----------------- |
| `auth-service`         | MongoDB       | `hold_yourself_auth` | `DATABASE_URL`     | **ACTIVE**         |
| `payment-service`      | Postgres      | UNKNOWN              | UNKNOWN            | **NOT SET UP YET** |
| `notification-service` | None          | N/A                  | N/A                | **NOT SET UP YET** |
| `backend`              | None          | N/A                  | N/A                | **NO ACCESS**      |
| `admin-panel`          | None          | N/A                  | N/A                | **NO ACCESS**      |
| `frontend`             | None          | N/A                  | N/A                | **NO ACCESS**      |

> [!NOTE]
> `payment-service` is planned to use Postgres but currently exists as a skeleton with no database configuration implemented.
> `backend` (Gateway) and frontend apps are stateless in terms of direct database access.

---

## 4. Runtime Ports & URLs

| Component Name         | Type    | Port Number | Port Source  | Base URL (Local)        |
| :--------------------- | :------ | :---------- | :----------- | :---------------------- |
| `backend`              | Gateway | 3000        | env (`PORT`) | `http://localhost:3000` |
| `auth-service`         | Service | 3001        | env (`PORT`) | `http://localhost:3001` |
| `frontend`             | UI      | **UNKNOWN** | N/A          | **AMBIGUOUS**           |
| `admin-panel`          | UI      | **UNKNOWN** | N/A          | **AMBIGUOUS**           |
| `notification-service` | Service | **UNKNOWN** | N/A          | **AMBIGUOUS**           |
| `payment-service`      | Service | **UNKNOWN** | N/A          | **AMBIGUOUS**           |

---

## 5. Explicit UNKNOWN / AMBIGUOUS ITEMS

- **.env.example Presence:** No `.env.example` files were detected in any workspace.
- **Skeleton Ports:** `frontend`, `admin-panel`, `notification-service`, and `payment-service` do not have ports defined in their `package.json` or `.env` files as they are currently skeleton directories.
- **Postgres Details:** Exact database name and connection variable for `payment-service` are **UNKNOWN** due to pending implementation.
- **Frontend/Admin Entry Points:** Specific entry points (e.g., `index.html`, `main.tsx`) are **UNKNOWN** as the directories contain no application code yet.

---

ENV_DB_PORT_MATRIX_COMPLETE
