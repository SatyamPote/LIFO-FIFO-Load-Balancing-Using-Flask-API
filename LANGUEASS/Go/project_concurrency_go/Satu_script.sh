#!/bin/bash
start_port=5000
end_port=5010
num_requests=1000
concurrency=50
request_data='{"data": "hello satyam"}'

for port in $(seq $start_port $end_port); do
    echo "go run src/client/client.go --api_url http://localhost:${port}/api/process_fifo --num_requests ${num_requests} --concurrency ${concurrency} --request_data '${request_data}'"
    echo "go run src/client/client.go --api_url http://localhost:${port}/api/process_lifo --num_requests ${num_requests} --concurrency ${concurrency} --request_data '${request_data}'"
done