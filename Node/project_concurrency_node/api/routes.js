// api/routes.js
const express = require('express');
const LoadBalancer = require('./loadBalancer');
const router = express.Router();

const loadBalancerFIFO = new LoadBalancer(4, 100); // Number of workers, queue size

// FIFO Process
router.post('/api/process_fifo', (req, res) => {
    loadBalancerFIFO.addRequest(req.body);
    res.status(202).json({ message: 'Request added to FIFO queue' }); // 202 Accepted
});

// Metrics
router.get('/api/metrics', (req, res) => {
    const metrics = loadBalancerFIFO.getMetrics();
    res.json(metrics);
});

module.exports = router;