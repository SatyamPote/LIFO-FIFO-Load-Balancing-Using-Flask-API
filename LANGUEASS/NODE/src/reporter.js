// ✅ ES module
import chalk from 'chalk';

function printReport({ url, stats }) {
  console.log(chalk.bold(`\nAPI Endpoint: ${url}`));
  console.log('====================');
  console.log(`  Successful Requests: ${stats.success}`);
  console.log(`  Failed Requests: ${stats.failed}`);
  console.log(`  Total Time: ${stats.totalTime.toFixed(2)} seconds`);
  console.log(`  Average Response Time: ${stats.averageTime.toFixed(4)} seconds`);
  console.log(`  Throughput: ${stats.throughput.toFixed(2)} requests/second`);
  console.log(`  Error Summary: ${JSON.stringify(stats.errors)}\n`);
}

module.exports = { printReport };
