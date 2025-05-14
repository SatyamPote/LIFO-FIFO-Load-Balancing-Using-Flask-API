// src/server.js
const express = require('express');
const bodyParser = require('body-parser');
const LoadBalancer = require('./loadBalancer');
const { performance } = require('perf_hooks'); // For performance timing

const app = express();
const ports = [5000, 5001, 5002, 5003, 5004, 5005, 5006, 5007, 5008, 5009, 5010]; // Listen on multiple ports

// Middleware
app.use(bodyParser.json());

// Create a LoadBalancer for each port
const loadBalancers = {};
ports.forEach(port => {
    loadBalancers[port] = new LoadBalancer(4, 100); // 4 workers, queue size 100
});
// FIFO Endpoint
app.post('/api/process_fifo', (req, res) => {
    const port = parseInt(req.headers['x-port']) || 3000;  // Get port from header.  Default to 3000
    if (loadBalancers[port]) {
      loadBalancers[port].addRequestFIFO(req.body);
      res.status(202).json({ message: 'Request added to FIFO queue' });
    } else {
        res.status(500).json({ message: 'Server unavailable for this port' });
    }
});

// LIFO Endpoint
app.post('/api/process_lifo', (req, res) => {
    const port = parseInt(req.headers['x-port']) || 3000;
    if (loadBalancers[port]) {
      loadBalancers[port].addRequestLIFO(req.body);
      res.status(202).json({ message: 'Request added to LIFO queue' });
    } else {
        res.status(500).json({ message: 'Server unavailable for this port' });
    }
});

// Metrics Endpoint - FIFO
app.get('/api/metrics_fifo', (req, res) => {
    const port = parseInt(req.headers['x-port']) || 3000;
    if (loadBalancers[port]) {
        const metrics = loadBalancers[port].getMetricsFIFO();
        res.json(metrics);
    } else {
        res.status(500).json({ message: 'Server unavailable for this port' });
    }
});
// Metrics Endpoint - LIFO
app.get('/api/metrics_lifo', (req, res) => {
    const port = parseInt(req.headers['x-port']) || 3000;
    if (loadBalancers[port]) {
        const metrics = loadBalancers[port].getMetricsLIFO();
        res.json(metrics);
    } else {
        res.status(500).json({ message: 'Server unavailable for this port' });
    }
});

// Start servers on multiple ports
ports.forEach(port => {
    const server = express();
    server.use(bodyParser.json());
    server.post('/api/process_fifo', (req, res) => {
      req.headers['x-port'] = port; // Forward the port
      app._router(req, res, () => {});
    });
    server.post('/api/process_lifo', (req, res) => {
      req.headers['x-port'] = port; // Forward the port
      app._router(req, res, () => {});
    });
    server.get('/api/metrics_fifo', (req, res) => {
      req.headers['x-port'] = port; // Forward the port
      app._router(req, res, () => {});
    });
    server.get('/api/metrics_lifo', (req, res) => {
      req.headers['x-port'] = port; // Forward the port
      app._router(req, res, () => {});
    });

    server.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });

});