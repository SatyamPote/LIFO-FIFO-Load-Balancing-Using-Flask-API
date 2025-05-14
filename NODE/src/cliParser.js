function parseCLI() {
  const args = process.argv.slice(2);
  const config = {
    url: '',
    num_requests: 1000,
    concurrency: 50,
    request_data: '{}',
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--url':
        config.url = args[++i];
        break;
      case '--num_requests':
        config.num_requests = parseInt(args[++i], 10);
        break;
      case '--concurrency':
        config.concurrency = parseInt(args[++i], 10);
        break;
      case '--request_data':
        config.request_data = args[++i];
        break;
    }
  }

  return config;
}

module.exports = { parseCLI };
