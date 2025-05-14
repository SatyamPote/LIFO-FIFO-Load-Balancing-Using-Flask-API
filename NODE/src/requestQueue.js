const axios = require('axios');

async function processQueue({ url, totalRequests, concurrency, data, mode }) {
  const queue = Array.from({ length: totalRequests }, (_, i) => i);
  if (mode === 'LIFO') queue.reverse();

  let success = 0, failed = 0, errors = {}, timings = [];

  const sendRequest = async (id) => {
    const start = Date.now();
    try {
      await axios.post(url, JSON.parse(data));
      success++;
    } catch (err) {
      failed++;
      const msg = err.code || err.message;
      errors[msg] = (errors[msg] || 0) + 1;
    } finally {
      const time = (Date.now() - start) / 1000;
      timings.push(time);
    }
  };

  const runBatch = async () => {
    while (queue.length) {
      const batch = queue.splice(0, concurrency);
      await Promise.all(batch.map(sendRequest));
    }
  };

  const startTime = Date.now();
  await runBatch();
  const totalTime = (Date.now() - startTime) / 1000;

  return {
    success,
    failed,
    errors,
    totalTime,
    averageTime: timings.reduce((a, b) => a + b, 0) / timings.length,
    throughput: success / totalTime,
  };
}

module.exports = { processQueue };
