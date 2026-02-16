# Operations Runbook

This document defines emergency procedures and the runtime topology of the WeBelong ecosystem.

## 1. Emergency Procedures (Chat Service)

| Scenario | Action | Impact |
| :--- | :--- | :--- |
| **High Socket Load** | Disable Typing Indicators | Reduces socket traffic by ~40%. |
| **DB Latency/Locking** | Disable Read Receipts | ~50% reduction in DB writes. |
| **High CPU (>80%)** | Disable Typing Ind. + Scale | Immediate 10-20% CPU reduction. |
| **High Memory (>1GB)** | Restart Service (`pm2`) | Resolves suspected memory leaks. |
| **Outage** | Maintenance Mode + Rollback | Stops user traffic for recovery. |

## 2. Runtime Topology

- **Gateway-First**: Frontend apps must flow through the `backend` gateway (Port 3000).
- **Auth Delegation**: Gateway proxies `/auth/*` to the `auth-service` (Port 3100).
- **Local Validation**: Services validate JWTs locally using `AUTH_PUBLIC_KEY` (RS256).
- **Zero-DB trust**: The Gateway has no database access.

## 3. Communication Rules
1. Services validate JWTs locally to avoid network calls.
2. Only leaf services (Auth, Chat, etc.) have DB connections.
3. Use `pm2 status` to monitor service health.
