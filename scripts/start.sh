#!/bin/sh
# Start the Next.js server with proxychains for proxy support
echo "Starting Next.js server..."
exec proxychains4 -q node server.js
