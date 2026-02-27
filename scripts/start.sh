#!/bin/sh
# Start the Next.js server with proxychains for proxy support

echo "Pushing database schema..."
npx prisma@5.22.0 db push --accept-data-loss

echo "Starting Next.js server..."
exec proxychains4 -q node server.js
