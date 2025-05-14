const { parseCLI } = require('./cliParser');
const chalk = require('chalk');
const axios = require('axios');
const { performance } = require('perf_hooks');

async function sendRequests({ url, num_requests, concurrency, request_data }) {
  let success = 0;
  let fail = 0;
  let totalTime = 0;
  const errors = {};

  const start = performance.now();

  const tasks = Array.from({ length: num_requests }, (_, i) => async () => {
    const reqStart = performance.now();
    try {
      await axios.post(url, JSON.parse(request_data));
      success++;
      totalTime += performance.now() - reqStart;
    } catch (e) {
      fail++;
      const status = e?.response?.status || 'unknown';
      errors[status] = (errors[status] || 0) + 1;
    }
  });

  const runBatch = async (batch) => {
    await Promise.all(batch.map(fn => fn()));
  };

  for (let i = 0; i < tasks.length; i += concurrency) {
    await runBatch(tasks.slice(i, i + concurrency));
  }

  const end = performance.now();
  const totalElapsed = ((end - start) / 1000).toFixed(2);
  const avgResponse = (totalTime / success / 1000).toFixed(4);
  const throughput = (success / totalElapsed).toFixed(2);

  console.log(`\n${chalk.blueBright(`API Endpoint: ${url}`)}\n====================`);
  console.log(`${chalk.green('  Successful Requests:')} ${success}`);
  console.log(`${chalk.red('  Failed Requests:')} ${fail}`);
  console.log(`${chalk.yellow('  Total Time:')} ${totalElapsed} seconds`);
  console.log(`${chalk.magenta('  Average Response Time:')} ${avgResponse} seconds`);
  console.log(`${chalk.cyan('  Throughput:')} ${throughput} requests/second`);
  console.log(`${chalk.redBright('  Error Summary:')} ${JSON.stringify(errors)}\n`);
}

const config = parseCLI();
sendRequests(config);
