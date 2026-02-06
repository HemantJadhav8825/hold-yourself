# Production Server Deployment Checklist

## 🎯 Quick Fix Summary

The mobile network error is caused by the chat service using `localhost:3200` instead of the production API URL. This happens because the environment variable `NEXT_PUBLIC_CHAT_API_URL` is not set on the production server.

---

## 📋 Deployment Steps

### Step 1: Update Production Environment File

SSH into your production server and add the environment variable:

```bash
# Navigate to frontend directory
cd /path/to/hold-yourself/apps/frontend

# Add the environment variable to production env file
echo "NEXT_PUBLIC_CHAT_API_URL=https://api.webelong.world" >> .env.production

# Verify it was added
cat .env.production | grep NEXT_PUBLIC_CHAT_API_URL
```

**Expected output:**

```
NEXT_PUBLIC_CHAT_API_URL=https://api.webelong.world
```

### Step 2: Rebuild the Application

```bash
# Make sure you're in the frontend directory
pnpm build
```

### Step 3: Restart PM2

```bash
# Restart the frontend service
pm2 restart frontend

# Or restart all services
pm2 restart all

# Check status
pm2 status
```

### Step 4: Verify the Deployment

```bash
# Check PM2 logs for the frontend
pm2 logs frontend --lines 50

# Look for successful startup messages
```

---

## ✅ Verification on Mobile

1. **Open your iPhone 15 Plus**
2. **Navigate to** `https://webelong.world/messages`
3. **Check if conversations load** without "Network Error"

### What to Look For:

**Before Fix:**

```
❌ [CHAT] Error: undefined "/v1/conversations" "Network Error"
```

**After Fix:**

```
💬 [CHAT] Request: GET /v1/conversations | Token: ✅ Present
💬 [CHAT] Response: 200 /v1/conversations
```

---

## 🔧 If Still Not Working

### Check Backend CORS

Ensure the chat service allows requests from your domain:

```bash
# Check chat service logs
pm2 logs chat-service --lines 50
```

### Verify Chat Service is Running

```bash
pm2 list | grep chat
```

Should show `chat-service` running on port 3200.

### Test API Directly from Mobile

Open Safari on your iPhone and navigate to:

```
https://api.webelong.world/v1/conversations
```

- ✅ **Good:** 401 Unauthorized (means API is reachable)
- ❌ **Bad:** Connection timeout or SSL error

---

## 📝 Files Changed (Already in Codebase)

These changes are already committed locally and ready to deploy:

1. ✅ `.env.local` - Added `NEXT_PUBLIC_CHAT_API_URL`
2. ✅ `src/api/chat.service.ts` - Improved URL resolution + logging
3. ✅ `src/api/socket.service.ts` - Aligned with chat service

**You only need to update the production environment file on the server.**

---

## 🚨 Important Notes

- The local `.env.local` file already has the correct configuration
- The code changes improve fallback logic and error logging
- **Only the production server** needs the environment variable added
- After adding the env var, you **must rebuild** the Next.js app
- PM2 restart is required to load the new build

---

## 💡 Why This Fixes the Issue

**Before:**

- `NEXT_PUBLIC_CHAT_API_URL` was undefined
- Code fell back to `http://localhost:3200`
- Mobile devices couldn't reach localhost
- Result: "Network Error"

**After:**

- `NEXT_PUBLIC_CHAT_API_URL=https://api.webelong.world`
- Code uses production API URL
- Mobile devices can reach the API
- Result: ✅ Conversations load successfully
