const axios = require('axios');

const NUM_SERVERS = 10;
const BASE_PORT = 5000;
const REQUESTS_PER_SERVER = 1000;

(async () => {
  for (let i = 0; i < NUM_SERVERS; i++) {
    const port = BASE_PORT + i;
    const url = `http://localhost:${port}/api/process_fifo`;

    let success = 0;
    let failed = 0;
    const startTime = Date.now();

    const promises = Array.from({ length: REQUESTS_PER_SERVER }, async () => {
      try {
        await axios.post(url, { value: Math.random() });
        success++;
      } catch {
        failed++;
      }
    });

    await Promise.all(promises);

    const totalTime = (Date.now() - startTime) / 1000;
    const throughput = (success / totalTime).toFixed(2);
    const avgTime = totalTime / (success || 1);

    console.log(`\n[PORT ${port}]`);
    console.log(`  Successful Requests: ${success}`);
    console.log(`  Failed Requests: ${failed}`);
    console.log(`  Total Time: ${totalTime.toFixed(2)} seconds`);
    console.log(`  Average Response Time: ${avgTime.toFixed(4)} seconds`);
    console.log(`  Throughput: ${throughput} requests/second`);
    console.log(`  Error Summary: ${JSON.stringify({ unknown: failed })}`);
  }
})();
