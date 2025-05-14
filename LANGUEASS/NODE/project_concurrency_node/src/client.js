// src/client.js
const axios = require('axios');
const { performance } = require('perf_hooks');
const { program } = require('commander');

program
  .option('-u, --api_url <url>', 'API URL (e.g., http://localhost:3000/api/process_fifo)', 'http://localhost:3000/api/process_fifo')
  .option('-n, --num_requests <number>', 'Total number of requests', 1000)
  .option('-c, --concurrency <number>', 'Concurrency level (number of threads)', 10)
  .option('-d, --request_data <data>', 'JSON data for the request', '{"data": "test"}')
  .parse(process.argv);

const options = program.opts();
const { api_url, numRequests, concurrency, request_data } = options;

async function sendRequest() {
  try {
    const start = performance.now();
    const response = await axios.post(api_url, JSON.parse(request_data), {
      timeout: 10000, // 10 second timeout
    });
    const end = performance.now();
    return end - start;
  } catch (error) {
    return -1; // Indicate failure
  }
}

async function runTests() {
  const start = performance.now();
  const results = await Promise.all(
    Array(concurrency)
      .fill(null)
      .map(() =>
        Promise.all(
          Array(Math.floor(numRequests / concurrency))
            .fill(null)
            .map(() => sendRequest())
        )
      )
  );
  const end = performance.now();
  const totalTime = end - start;
  const successfulRequests = results.flat().filter(time => time !== -1).length;
  const failedRequests = results.flat().filter(time => time === -1).length;
  let avgResponseTime = 0;
  const requestTimes = results.flat().filter(time => time !== -1);

  if (successfulRequests > 0) {
    avgResponseTime = requestTimes.reduce((a, b) => a + b, 0) / successfulRequests;
  }
  const throughput = (successfulRequests / (totalTime / 1000)); // Requests per second

  console.log("----------------------------------------");
  console.log(`API Endpoint: ${api_url}`);
  console.log("====================");
  console.log(`  Successful Requests: ${successfulRequests}`);
  console.log(`  Failed Requests: ${failedRequests}`);
  console.log(`  Total Time: ${totalTime / 1000} seconds`);
  console.log(`  Average Response Time: ${avgResponseTime.toFixed(4)} ms`);
  console.log(`  Throughput: ${throughput.toFixed(2)} requests/second`);
  console.log("  Error Summary: {}");  // No specific error tracking in this simplified example
  console.log("----------------------------------------");
}

runTests();