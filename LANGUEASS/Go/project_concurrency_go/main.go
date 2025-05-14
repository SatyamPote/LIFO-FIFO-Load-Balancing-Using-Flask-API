package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"sync"
	"time"
)

var (
	mutex       sync.Mutex
	requestsLog []string
)

// Simulate FIFO task
func processFIFOHandler(w http.ResponseWriter, r *http.Request) {
	start := time.Now()
	time.Sleep(time.Millisecond * time.Duration(rand.Intn(10)))

	mutex.Lock()
	requestsLog = append(requestsLog, fmt.Sprintf("FIFO: %s", r.RemoteAddr))
	mutex.Unlock()

	duration := time.Since(start)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "processed FIFO",
		"time_ms": duration.Milliseconds(),
	})
}

// Simulate LIFO task
func processLIFOHandler(w http.ResponseWriter, r *http.Request) {
	start := time.Now()
	time.Sleep(time.Millisecond * time.Duration(rand.Intn(10)))

	mutex.Lock()
	requestsLog = append(requestsLog, fmt.Sprintf("LIFO: %s", r.RemoteAddr))
	mutex.Unlock()

	duration := time.Since(start)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "processed LIFO",
		"time_ms": duration.Milliseconds(),
	})
}

// Return metrics
func metricsHandler(w http.ResponseWriter, r *http.Request) {
	mutex.Lock()
	count := len(requestsLog)
	mutex.Unlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"total_requests": count,
	})
}

func main() {
	rand.Seed(time.Now().UnixNano())

	for p := 5000; p <= 5010; p++ {
		portStr := fmt.Sprintf("0.0.0.0:%d", p)

		mux := http.NewServeMux()
		mux.HandleFunc("/api/process_fifo", processFIFOHandler)
		mux.HandleFunc("/api/process_lifo", processLIFOHandler)
		mux.HandleFunc("/api/metrics", metricsHandler)

		go func(pstr string, handler http.Handler, pnum int) {
			fmt.Printf("Server listening on %s\n", pstr)
			if err := http.ListenAndServe(pstr, handler); err != nil {
				log.Printf("Error on port %d: %v", pnum, err)
			}
		}(portStr, mux, p)
	}

	select {} // Keep main alive
}
