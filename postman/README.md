# Postman Collections: Hold Yourself

This directory contains standardized Postman collections and environment templates for the 'Hold Yourself' monorepo.

## 📁 Structure

- `gateway/`: Collections for the backend-gateway (BFF), which is the primary entry point for client applications.
- `services/`: Specific collections for internal microservices.
- `environments/`: Template environment variables for different deployment stages.

## 📜 Rules

1. **One Collection Per Service**: Each microservice must have its own separate collection file.
2. **Gateway Centric**: The backend gateway collection should reflect the outward-facing API consumed by apps.
3. **No Sensitive Data**: Never commit actual API keys or credentials to this folder. Use environment placeholders.
4. **Kebab-Case**: All files must follow `kebab-case.postman_collection.json` naming conventions.

## 🚀 How to Import

1. Open Postman.
2. Click **Import**.
3. Select the collection or environment file from this directory.
4. Update the environment variables with your local or stage-specific values.
