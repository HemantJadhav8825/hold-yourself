#!/bin/bash

# Production Server Fix Script
# This script rebuilds the frontend with the correct environment variables

set -e  # Exit on error

echo "🔧 Starting production fix for mobile network error..."

# Navigate to frontend directory
cd "$(dirname "$0")/apps/frontend"

echo "📋 Current environment variables:"
grep NEXT_PUBLIC .env.local || echo "No NEXT_PUBLIC vars found in .env.local"

echo ""
echo "✅ Verifying NEXT_PUBLIC_CHAT_API_URL is set..."
if grep -q "NEXT_PUBLIC_CHAT_API_URL" .env.local; then
  echo "✅ Found: $(grep NEXT_PUBLIC_CHAT_API_URL .env.local)"
else
  echo "❌ NEXT_PUBLIC_CHAT_API_URL not found!"
  echo "Adding it now..."
  echo "NEXT_PUBLIC_CHAT_API_URL=https://api.webelong.world" >> .env.local
  echo "✅ Added NEXT_PUBLIC_CHAT_API_URL to .env.local"
fi

echo ""
echo "🏗️  Rebuilding Next.js application..."
pnpm build

echo ""
echo "🔄 Starting/Restarting PM2 services..."
pm2 restart hold-yourself-frontend || pm2 start hold-yourself-frontend

echo ""
echo "✅ Fix complete!"
echo ""
echo "📱 Test on your iPhone:"
echo "   1. Open https://webelong.world/messages"
echo "   2. Check if conversations load without 'Network Error'"
echo ""
echo "🔍 Check logs:"
echo "   pm2 logs frontend --lines 50"
