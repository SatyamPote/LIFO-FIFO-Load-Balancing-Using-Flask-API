package main

import (
	"bytes"
	"flag"
	"fmt"
	"io"
	"net/http"
	"strings"
	"sync"
	"time"
)

type Result struct {
	success    int
	failure    int
	totalTime  time.Duration
	errors     []string
}

func sendRequest(client *http.Client, apiURL, requestData string) error {
	req, err := http.NewRequest("POST", apiURL, bytes.NewBuffer([]byte(requestData)))
	if err != nil {
		return fmt.Errorf("error creating request: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("error sending request: %v", err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	// ✅ Accept both 200 (OK) and 202 (Accepted) as success
	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusAccepted {
		return fmt.Errorf("HTTPError: %d: status code: %d, body: %s", resp.StatusCode, resp.StatusCode, string(body))
	}

	return nil
}

func worker(wg *sync.WaitGroup, client *http.Client, apiURL, requestData string, requests int, result *Result, mu *sync.Mutex) {
	defer wg.Done()

	for i := 0; i < requests; i++ {
		start := time.Now()
		err := sendRequest(client, apiURL, requestData)
		elapsed := time.Since(start)

		mu.Lock()
		result.totalTime += elapsed
		if err != nil {
			result.failure++
			result.errors = append(result.errors, err.Error())
		} else {
			result.success++
		}
		mu.Unlock()
	}
}

func main() {
	apiURL := flag.String("api_url", "", "API endpoint URL")
	numRequests := flag.Int("num_requests", 100, "Total number of requests")
	concurrency := flag.Int("concurrency", 10, "Number of concurrent goroutines")
	requestData := flag.String("request_data", `{"data": "hello"}`, "JSON data to send in request body")
	flag.Parse()

	if *apiURL == "" {
		fmt.Println("Error: --api_url is required")
		return
	}

	client := &http.Client{}
	var wg sync.WaitGroup
	var mu sync.Mutex
	result := Result{}

	requestsPerWorker := *numRequests / *concurrency
	startTime := time.Now()

	for i := 0; i < *concurrency; i++ {
		wg.Add(1)
		go worker(&wg, client, *apiURL, *requestData, requestsPerWorker, &result, &mu)
	}

	wg.Wait()
	totalDuration := time.Since(startTime)

	fmt.Println("----------------------------------------")
	fmt.Printf("API Endpoint: %s\n", *apiURL)
	fmt.Println("====================")
	fmt.Printf("  Successful Requests: %d\n", result.success)
	fmt.Printf("  Failed Requests: %d\n", result.failure)
	fmt.Printf("  Total Time: %v\n", totalDuration)
	avgResp := time.Duration(0)
	if result.success > 0 {
		avgResp = result.totalTime / time.Duration(result.success)
	}
	fmt.Printf("  Average Response Time: %v\n", avgResp)
	tput := float64(*numRequests) / totalDuration.Seconds()
	fmt.Printf("  Throughput: %.2f requests/second\n", tput)
	if result.failure > 0 {
		fmt.Println("  Error Summary:")
		uniqueErrors := make(map[string]int)
		for _, err := range result.errors {
			uniqueErrors[err]++
		}
		for errStr, count := range uniqueErrors {
			fmt.Printf("    %s (x%d)\n", strings.TrimSpace(errStr), count)
		}
	}
	fmt.Println("----------------------------------------")
}
