package main

import (
	"fmt"
)

func main() {
	startPort := 5000
	endPort := 5010
	apiPathFIFO := "/api/process_fifo"  // FIFO endpoint
	apiPathLIFO := "/api/process_lifo"  // LIFO endpoint
	requestData := `{"data": "hello satyam"}`
	numRequests := 1000
	concurrency := 50

	// Header
	fmt.Println("Id     Name            PSJobTypeName   State         HasMoreData     Location             Command")
	fmt.Println("--     ----            -------------   -----         -----------     --------             -------")
	jobIDCounter := 23
	for port := startPort; port <= endPort; port++ {
		// FIFO Command
		apiURLFIFO := fmt.Sprintf("http://localhost:%d%s", port, apiPathFIFO)
		commandFIFO := fmt.Sprintf("go run src/client/client.go --api_url %s --num_requests %d --concurrency %d --request_data '%s'", apiURLFIFO, numRequests, concurrency, requestData)
		fmt.Printf("%-5d Job%-2d          BackgroundJob   Running       True            localhost            %s...\n", jobIDCounter, jobIDCounter, commandFIFO[:40])
		jobIDCounter += 2

		// LIFO Command
		apiURLLIFO := fmt.Sprintf("http://localhost:%d%s", port, apiPathLIFO)
		commandLIFO := fmt.Sprintf("go run src/client/client.go --api_url %s --num_requests %d --concurrency %d --request_data '%s'", apiURLLIFO, numRequests, concurrency, requestData)
		fmt.Printf("%-5d Job%-2d          BackgroundJob   Running       True            localhost            %s...\n", jobIDCounter, jobIDCounter, commandLIFO[:40])
		jobIDCounter += 2
	}
}