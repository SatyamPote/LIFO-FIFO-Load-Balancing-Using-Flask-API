package main

import (
	"fmt"
	"os"
)

func main() {
	startPort := 5000
	endPort := 5010
	numRequests := 1000
	concurrency := 50
	requestData := `{"data": "hello satyam"}`

	for port := startPort; port <= endPort; port++ {
		// FIFO
		apiURLFIFO := fmt.Sprintf("http://localhost:%d/api/process_fifo", port)
		commandFIFO := fmt.Sprintf("go run src/client/client.go --api_url %s --num_requests %d --concurrency %d --request_data '%s'", apiURLFIFO, numRequests, concurrency, requestData)
		fmt.Println(commandFIFO)

		// LIFO
		apiURLLIFO := fmt.Sprintf("http://localhost:%d/api/process_lifo", port)
		commandLIFO := fmt.Sprintf("go run src/client/client.go --api_url %s --num_requests %d --concurrency %d --request_data '%s'", apiURLLIFO, numRequests, concurrency, requestData)
		fmt.Println(commandLIFO)
	}
}