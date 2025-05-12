package api

import (
	"sync"
	"time"
)

type RequestData struct {
	ID   int         `json:"id,omitempty"`
	Data interface{} `json:"data"`
}

type LoadBalancer struct {
	fifoQueue []RequestData
	lifoQueue []RequestData
	mutex     sync.Mutex

	maxQueueSize    int
	processingDelay time.Duration
}

// NewLoadBalancer initializes a new load balancer
func NewLoadBalancer(queueSize int, delay time.Duration) *LoadBalancer {
	lb := &LoadBalancer{
		fifoQueue:        make([]RequestData, 0, queueSize),
		lifoQueue:        make([]RequestData, 0, queueSize),
		maxQueueSize:     queueSize,
		processingDelay:  delay,
	}

	// Start background processors
	go lb.processFIFO()
	go lb.processLIFO()

	return lb
}

func (lb *LoadBalancer) AddFIFORequest(req RequestData) {
	lb.mutex.Lock()
	defer lb.mutex.Unlock()
	if len(lb.fifoQueue) < lb.maxQueueSize {
		lb.fifoQueue = append(lb.fifoQueue, req)
	}
}

func (lb *LoadBalancer) AddLIFORequest(req RequestData) {
	lb.mutex.Lock()
	defer lb.mutex.Unlock()
	if len(lb.lifoQueue) < lb.maxQueueSize {
		lb.lifoQueue = append(lb.lifoQueue, req)
	}
}

func (lb *LoadBalancer) processFIFO() {
	for {
		time.Sleep(lb.processingDelay)
		lb.mutex.Lock()
		if len(lb.fifoQueue) > 0 {
			_ = lb.fifoQueue[0]                      // simulate processing
			lb.fifoQueue = lb.fifoQueue[1:]         // dequeue FIFO
		}
		lb.mutex.Unlock()
	}
}

func (lb *LoadBalancer) processLIFO() {
	for {
		time.Sleep(lb.processingDelay)
		lb.mutex.Lock()
		if len(lb.lifoQueue) > 0 {
			_ = lb.lifoQueue[len(lb.lifoQueue)-1]   // simulate processing
			lb.lifoQueue = lb.lifoQueue[:len(lb.lifoQueue)-1] // pop LIFO
		}
		lb.mutex.Unlock()
	}
}

func (lb *LoadBalancer) GetMetrics() map[string]interface{} {
	lb.mutex.Lock()
	defer lb.mutex.Unlock()
	return map[string]interface{}{
		"fifo_queue_length": len(lb.fifoQueue),
		"lifo_queue_length": len(lb.lifoQueue),
	}
}
