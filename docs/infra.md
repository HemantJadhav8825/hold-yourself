# Infrastructure & Environment

This document serves as the source of truth for system synchronization, environment configurations, and deployment planning.

## 1. Network & Ports

### Active Production Ports (Server: hemant)
| Port | Protocol | Service | Listening Address |
| :--- | :--- | :--- | :--- |
| **80/443** | TCP | HTTP/S (Nginx) | `0.0.0.0` |
| **3000** | TCP | Backend Gateway | `0.0.0.0` |
| **3100** | TCP | Auth Service | `127.0.0.1` |
| **3200** | TCP | Chat Service | `127.0.0.1` |
| **6379** | TCP | Redis | `127.0.0.1` |
| **27017** | TCP | MongoDB | `127.0.0.1` (Internal) |

> [!CAUTION]
> **Security Audit (2026-02-03)**: MongoDB (27017) must be restricted to internal interfaces. Dev ports (5173/5174) must not be exposed in production.

## 2. Environment Matrix

| Component | Port | DB Type | Primary Env Vars |
| :--- | :--- | :--- | :--- |
| `backend` | 3000 | N/A | `PORT`, `AUTH_SERVICE_BASE_URL`, `AUTH_PUBLIC_KEY` |
| `auth-service` | 3100 | MongoDB | `PORT`, `DATABASE_URL`, `JWT_PRIVATE_KEY` |
| `chat-service` | 3200 | MongoDB | `PORT`, `MONGO_URI`, `JWT_PUBLIC_KEY` |
| `frontend` | 3002 | N/A | `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_CHAT_API_URL` |
| `admin-panel` | 3001 | N/A | `PORT`, `NEXT_PUBLIC_API_URL` |

## 3. Local Development

Each service uses a `.env.local` file. Service-to-service communication relies on the **Shared Port Matrix**.

### Security Best Practices
1. **Never commit `.env` files**.
2. **Use `openssl`** for JWT key generation.
3. **Strict Validation**: Apps must crash if required variables are missing.
4. **Zero-DB trust**: Only leaf services access databases; the Gateway is stateless.
