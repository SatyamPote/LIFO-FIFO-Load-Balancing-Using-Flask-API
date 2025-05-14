#!/bin/bash

# Start the Node.js API in the background
node src/server.js &
API_PID=$!

# Wait for the server to start (adjust the sleep time as needed)
sleep 2  # Give the server time to start

# Run the client tests

node src/client.js --api_url http://localhost:3000/api/process_fifo --num_requests 1000 --concurrency 50  &
node src/client.js --api_url http://localhost:3000/api/process_lifo --num_requests 1000 --concurrency 50 &

wait # Wait for all client tests to complete
# Stop the Node.js API
kill "$API_PID"
echo "Tests completed. Server stopped."