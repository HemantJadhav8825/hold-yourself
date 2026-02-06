#!/bin/bash

# Diagnostic Script - Check if environment variables are in the built files
# Run this on your production server to verify the issue

echo "🔍 Diagnostic: Checking if NEXT_PUBLIC_CHAT_API_URL is in the built files..."
echo ""

cd "$(dirname "$0")/apps/frontend"

echo "1️⃣ Checking .env.local file:"
echo "----------------------------"
if [ -f .env.local ]; then
  grep "NEXT_PUBLIC_CHAT_API_URL" .env.local || echo "❌ NOT FOUND in .env.local"
else
  echo "❌ .env.local file doesn't exist!"
fi

echo ""
echo "2️⃣ Checking if .next build directory exists:"
echo "----------------------------------------------"
if [ -d .next ]; then
  echo "✅ .next directory exists"
  
  echo ""
  echo "3️⃣ Searching for 'api.webelong.world' in built files:"
  echo "------------------------------------------------------"
  if grep -r "api.webelong.world" .next/ 2>/dev/null | head -5; then
    echo ""
    echo "✅ FOUND production URL in built files - This is GOOD!"
  else
    echo "❌ NOT FOUND in built files"
    echo ""
    echo "🔴 PROBLEM CONFIRMED:"
    echo "   The environment variable exists in .env.local"
    echo "   BUT it's not in the built JavaScript files"
    echo "   This means the app was built BEFORE the env var was added"
    echo ""
    echo "💡 SOLUTION: Run 'pnpm build' to rebuild with the new env var"
  fi
  
  echo ""
  echo "4️⃣ Searching for 'localhost:3200' in built files:"
  echo "---------------------------------------------------"
  if grep -r "localhost:3200" .next/ 2>/dev/null | head -3; then
    echo ""
    echo "⚠️  Found localhost:3200 in built files"
    echo "   This confirms the app is using the fallback URL"
  fi
else
  echo "❌ .next directory doesn't exist - app hasn't been built yet!"
  echo "   Run 'pnpm build' first"
fi

echo ""
echo "5️⃣ Checking PM2 status:"
echo "------------------------"
pm2 list | grep frontend || echo "❌ Frontend not running in PM2"

echo ""
echo "================================"
echo "📊 DIAGNOSIS COMPLETE"
echo "================================"
