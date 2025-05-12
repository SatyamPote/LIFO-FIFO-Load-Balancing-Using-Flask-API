// src/server.js
const express = require('express');
const bodyParser = require('body-parser');
const LoadBalancer = require('./loadBalancer');
const { performance } = require('perf_hooks'); // For performance timing

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

const loadBalancer = new LoadBalancer(4, 100); // Number of workers, queue size

// FIFO Endpoint
app.post('/api/process_fifo', (req, res) => {
    loadBalancer.addRequestFIFO(req.body);
    res.status(202).json({ message: 'Request added to FIFO queue' }); // 202 Accepted
});

// LIFO Endpoint
app.post('/api/process_lifo', (req, res) => {
    loadBalancer.addRequestLIFO(req.body);
    res.status(202).json({ message: 'Request added to LIFO queue' }); // 202 Accepted
});

// Metrics Endpoint - FIFO
app.get('/api/metrics_fifo', (req, res) => {
    const metrics = loadBalancer.getMetricsFIFO();
    res.json(metrics);
});
// Metrics Endpoint - LIFO
app.get('/api/metrics_lifo', (req, res) => {
    const metrics = loadBalancer.getMetricsLIFO();
    res.json(metrics);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});