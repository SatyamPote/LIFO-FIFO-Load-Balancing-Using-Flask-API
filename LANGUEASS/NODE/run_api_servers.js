const { spawn } = require('child_process');
const path = require('path');

for (let i = 0; i < 10; i++) {
  const port = 5000 + i;
  const proc = spawn('node', ['src/api_server.js'], {
    env: { ...process.env, PORT: port },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  proc.stdout.on('data', (data) => {
    console.log(`[SERVER ${port}] ${data.toString().trim()}`);
  });

  proc.stderr.on('data', (data) => {
    console.error(`[SERVER ${port} ERROR] ${data.toString().trim()}`);
  });
}
