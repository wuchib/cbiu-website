#!/bin/sh
# Start the Next.js server with proxychains for proxy support

echo "Pushing database schema..."
npx prisma db push --accept-data-loss

echo "Starting Next.js server..."
exec proxychains4 -q node server.js
