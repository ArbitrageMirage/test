const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

let requestCount = 0;
const maxRequestsPerSecond = 50;

// Endpoint handling
app.post('/api', (req, res) => {
  // Increase request count
  requestCount++;

  // Check if the request rate limit is exceeded
  if (requestCount > maxRequestsPerSecond) {
    return res.status(429).json({ error: 'Too Many Requests' });
  }

  // Random delay between 1ms to 1000ms
  const delay = Math.floor(Math.random() * 1000) + 1;
  setTimeout(() => {
    const index = req.body.index;
    console.log(`Request ${index} processed.`);
    res.json({ index });
  }, delay);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});