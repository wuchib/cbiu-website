#!/bin/sh
# Auto-sync database schema before starting the app
echo "Running prisma db push to sync database schema..."
./node_modules/.bin/prisma db push --skip-generate 2>&1 || echo "Warning: prisma db push failed, continuing anyway..."
echo "Starting Next.js server..."
exec proxychains4 -q node server.js
