// src/loadBalancer.js
class LoadBalancer {
    constructor(numWorkers = 2, queueSize = 100) {
        this.numWorkers = numWorkers;
        this.queueSize = queueSize;
        this.requestQueueFIFO = [];  // FIFO queue
        this.requestQueueLIFO = [];  // LIFO queue
        this.workers = [];
        this.totalRequestsProcessedFIFO = 0;
        this.totalRequestsProcessedLIFO = 0;
        this.startTime = Date.now();
        this.setupWorkers();
    }

    setupWorkers() {
        // No worker threads needed in this basic example.
        // The server will handle the load.
    }

    addRequestFIFO(requestData) {
        this.requestQueueFIFO.push(requestData);
        this.processQueueFIFO();
    }

    addRequestLIFO(requestData) {
        this.requestQueueLIFO.unshift(requestData);  // LIFO: Add to the beginning
        this.processQueueLIFO();
    }

    processQueueFIFO() {
        if (this.requestQueueFIFO.length === 0) {
            return;
        }
        const requestData = this.requestQueueFIFO.shift(); // FIFO
        this.simulateWorkAndReport(requestData, 'FIFO');
    }

    processQueueLIFO() {
        if (this.requestQueueLIFO.length === 0) {
            return;
        }
        const requestData = this.requestQueueLIFO.shift(); // LIFO
        this.simulateWorkAndReport(requestData, 'LIFO');
    }

    simulateWorkAndReport(requestData, queueType) {
        const startTime = performance.now();
        setTimeout(() => {
            const endTime = performance.now();
            const responseTime = endTime - startTime;
            if (queueType === 'FIFO') {
                this.totalRequestsProcessedFIFO++;
                //console.log(`FIFO: Worker processed request. Response time: ${responseTime}ms`); // Uncomment for debugging
            } else if (queueType === 'LIFO') {
                this.totalRequestsProcessedLIFO++;
                //console.log(`LIFO: Worker processed request. Response time: ${responseTime}ms`); // Uncomment for debugging
            }

        }, 10); // Simulate 10ms of work (adjust for load)
    }

    getMetricsFIFO() {
        const elapsedTime = (Date.now() - this.startTime) / 1000; // in seconds
        const throughput = this.totalRequestsProcessedFIFO / elapsedTime;
        return {
            total_requests_processed: this.totalRequestsProcessedFIFO,
            elapsed_time: elapsedTime,
            throughput: throughput,
            queue_length: this.requestQueueFIFO.length,
        };
    }

    getMetricsLIFO() {
        const elapsedTime = (Date.now() - this.startTime) / 1000; // in seconds
        const throughput = this.totalRequestsProcessedLIFO / elapsedTime;

        return {
            total_requests_processed: this.totalRequestsProcessedLIFO,
            elapsed_time: elapsedTime,
            throughput: throughput,
            queue_length: this.requestQueueLIFO.length,
        };
    }
}

module.exports = LoadBalancer;