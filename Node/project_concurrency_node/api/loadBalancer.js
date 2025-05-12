// api/loadBalancer.js
class LoadBalancer {
    constructor(numWorkers = 2, queueSize = 100) {
        this.numWorkers = numWorkers;
        this.queueSize = queueSize;
        this.requestQueue = [];
        this.workers = [];
        this.totalRequestsProcessed = 0;
        this.startTime = Date.now();
        this.processedData = []; // Store processed data
        this.setupWorkers();
    }

    setupWorkers() {
        for (let i = 0; i < this.numWorkers; i++) {
            const worker = this.workerThread(i);
            this.workers.push(worker);
        }
    }

    addRequest(requestData) {
        this.requestQueue.push(requestData);
        this.processQueue();
    }

    processQueue() {
        // Process tasks in the queue.
        if (this.requestQueue.length === 0) {
            return; // No requests to process
        }

        const requestData = this.requestQueue.shift();  // FIFO

        // Simulate request processing (replace with your actual logic)
        const startTime = Date.now();
        setTimeout(() => {
            const data = requestData.data;
            this.processedData.push({ data, timestamp: startTime });
            this.totalRequestsProcessed++;
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            //console.log(`Worker processed request. Response time: ${responseTime}ms`); // Uncomment for debugging

            // Signal Completion (Not strictly needed in this simple case)
            //if (job.done) {
            //    job.done();
            //}
        }, 10); // Simulate 10ms processing time
    }
    // Function for worker threads.
    workerThread(workerId) {
        //The workers do not have to loop and run.
        //They run automatically via the processQueue() function.

    }

    getMetrics() {
        const elapsedTime = (Date.now() - this.startTime) / 1000; // in seconds
        const throughput = this.totalRequestsProcessed / elapsedTime;

        return {
            total_requests_processed: this.totalRequestsProcessed,
            elapsed_time: elapsedTime,
            throughput: throughput,
            processed_data_count: this.processedData.length,
            processed_data: this.processedData.slice(-5), // Last 5 elements
        };
    }
}

module.exports = LoadBalancer;