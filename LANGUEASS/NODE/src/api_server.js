const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/process_fifo', (req, res) => {
  return res.status(200).json({ message: 'Processed FIFO', data: req.body });
});

app.post('/api/process_lifo', (req, res) => {
  return res.status(200).json({ message: 'Processed LIFO', data: req.body });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`✅ API server is running on http://localhost:${port}`);
});
