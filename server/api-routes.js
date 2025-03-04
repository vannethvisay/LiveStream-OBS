const express = require('express');
const crypto = require('crypto');
const config = require('./config');

const router = express.Router();

// Middleware to parse JSON bodies
router.use(express.json());

// Generate stream credentials
router.get('/stream-credentials', (req, res) => {
  // In a real app, you would authenticate the user here
  const streamKey = `stream-${crypto.randomBytes(4).toString('hex')}`;
  
  // Generate a token that expires in 24 hours
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  const token = crypto.createHmac('sha256', config.mediaServer.auth.secret)
    .update(`${streamKey}-${expiresAt}`)
    .digest('hex');
  
  res.json({
    streamKey,
    rtmpUrl: config.streamServerUrl,
    expiresAt,
    token
  });
});

// Check stream status
router.get('/stream-status', (req, res) => {
  // In a real app, you would check the actual stream status from the media server
  // For now, we'll return mock data
  const isLive = Math.random() > 0.5; // Randomly determine if stream is live
  
  // Mock active streams
  const activeStreams = [];
  if (isLive) {
    activeStreams.push({
      id: 'stream1',
      name: 'Test Stream',
      startTime: Date.now() - Math.floor(Math.random() * 3600000),
      viewers: Math.floor(Math.random() * 100)
    });
  }
  
  res.json({
    isLive,
    activeStreams
  });
});

module.exports = router;
