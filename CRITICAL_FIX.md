# 🔍 Critical Discovery: Next.js Build-Time Environment Variables

## The Real Problem

**Next.js inlines `NEXT_PUBLIC_*` environment variables at BUILD TIME, not runtime!**

This means:

1. ✅ You added `NEXT_PUBLIC_CHAT_API_URL=https://api.webelong.world` to production `.env.local`
2. ❌ But the app was already built BEFORE you added this variable
3. ❌ The built JavaScript still has `undefined` hardcoded in it
4. ❌ Restarting PM2 doesn't help because the build is already done

## Why It Works on Desktop but Not Mobile

- **Desktop/Laptop**: Can access `localhost:3200` (the fallback)
- **Mobile Device**: Cannot access `localhost` → Network Error

## The Fix

You MUST rebuild the Next.js application after adding the environment variable:

```bash
# On production server
cd /path/to/hold-yourself/apps/frontend

# Rebuild with the new environment variable
pnpm build

# Restart PM2
pm2 restart frontend
```

## Verification

After rebuilding, check the built files:

```bash
# Search for the API URL in the built JavaScript
grep -r "api.webelong.world" .next/

# Should find references to your production URL
```

## Alternative: Use Runtime Environment Variables

If you need runtime configuration (without rebuilding), you would need to:

1. Use server-side rendering (SSR) to inject the URL
2. Or use a runtime config endpoint
3. Or use `publicRuntimeConfig` in Next.js

But the simplest solution is: **Rebuild after adding environment variables.**
