const express = require('express');
const path = require('path');
const { nms } = require('./media-server');
const apiRoutes = require('./api-routes');
const config = require('./config');

// Create Express server
const server = express();

// Serve static files from the media server (HLS/DASH segments)
server.use('/media', express.static(path.join(__dirname, '../media')));

// API routes
server.use('/api', apiRoutes);

// Serve static files from the public directory
server.use(express.static(path.join(__dirname, '../public')));

// Simple route for the home page
server.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Live Streaming App</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            color: #333;
          }
          .card {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            background-color: #f9f9f9;
          }
          .button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 10px 15px;
            text-decoration: none;
            border-radius: 4px;
            margin-right: 10px;
          }
        </style>
      </head>
      <body>
        <h1>Live Streaming App</h1>
        
        <div class="card">
          <h2>Stream Dashboard</h2>
          <p>Manage your streams and view analytics</p>
          <a href="/dashboard" class="button">Go to Dashboard</a>
        </div>
        
        <div class="card">
          <h2>Active Streams</h2>
          <p>Watch currently active live streams</p>
          <a href="/streams" class="button">View Streams</a>
        </div>
        
        <div class="card">
          <h2>Stream Setup</h2>
          <p>RTMP URL: ${config.streamServerUrl}</p>
          <p>Use OBS Studio or similar software to stream to this URL with your stream key</p>
        </div>
      </body>
    </html>
  `);
});

// Dashboard route
server.get('/dashboard', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Stream Dashboard</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            color: #333;
          }
          .card {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            background-color: #f9f9f9;
          }
          .button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 10px 15px;
            text-decoration: none;
            border-radius: 4px;
          }
          .stream-key {
            background-color: #eee;
            padding: 10px;
            border-radius: 4px;
            font-family: monospace;
          }
        </style>
      </head>
      <body>
        <h1>Stream Dashboard</h1>
        
        <div class="card">
          <h2>Your Stream Key</h2>
          <div class="stream-key">stream-${Math.random().toString(36).substring(2, 10)}</div>
          <p>Keep this key secret! Use it with your streaming software.</p>
        </div>
        
        <div class="card">
          <h2>Stream Status</h2>
          <p id="status">Checking status...</p>
          <script>
            // Simple script to check stream status
            fetch('/api/stream-status')
              .then(response => response.json())
              .then(data => {
                document.getElementById('status').textContent = 
                  data.isLive ? 'Your stream is LIVE!' : 'You are not currently streaming';
              })
              .catch(err => {
                document.getElementById('status').textContent = 'Error checking stream status';
              });
          </script>
        </div>
        
        <div class="card">
          <h2>Stream Settings</h2>
          <p>RTMP URL: ${config.streamServerUrl}</p>
          <p>Recommended Settings:</p>
          <ul>
            <li>Video: H.264, 720p or 1080p</li>
            <li>Audio: AAC, 128kbps or higher</li>
            <li>Bitrate: 2500-6000 kbps depending on resolution</li>
          </ul>
        </div>
        
        <a href="/" class="button">Back to Home</a>
      </body>
    </html>
  `);
});

// Streams list route
server.get('/streams', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Live Streams</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            color: #333;
          }
          .stream-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
          }
          .stream-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
          }
          .stream-thumbnail {
            width: 100%;
            height: 150px;
            background-color: #333;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
          }
          .stream-info {
            padding: 15px;
          }
          .button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 10px 15px;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 20px;
          }
          #no-streams {
            padding: 40px;
            text-align: center;
            background-color: #f9f9f9;
            border-radius: 8px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <h1>Live Streams</h1>
        
        <div id="streams-container">
          <div id="no-streams">
            <h2>No active streams</h2>
            <p>There are currently no live streams available to watch.</p>
            <p>Start streaming with OBS or check back later!</p>
          </div>
          
          <div class="stream-grid" id="stream-grid" style="display: none;">
            <!-- Stream cards will be added here dynamically -->
          </div>
        </div>
        
        <a href="/" class="button">Back to Home</a>
        
        <script>
          // Simple script to fetch active streams
          fetch('/api/stream-status')
            .then(response => response.json())
            .then(data => {
              if (data.activeStreams && data.activeStreams.length > 0) {
                document.getElementById('no-streams').style.display = 'none';
                document.getElementById('stream-grid').style.display = 'grid';
                
                const streamGrid = document.getElementById('stream-grid');
                data.activeStreams.forEach(stream => {
                  const streamCard = document.createElement('div');
                  streamCard.className = 'stream-card';
                  streamCard.innerHTML = \`
                    <div class="stream-thumbnail">LIVE</div>
                    <div class="stream-info">
                      <h3>\${stream.name || 'Live Stream'}</h3>
                      <p>Started: \${new Date(stream.startTime).toLocaleTimeString()}</p>
                      <a href="/streams/\${stream.id}" style="color: #4CAF50;">Watch Stream</a>
                    </div>
                  \`;
                  streamGrid.appendChild(streamCard);
                });
              }
            })
            .catch(err => {
              console.error('Error fetching streams:', err);
            });
        </script>
      </body>
    </html>
  `);
});

// Individual stream view route
server.get('/streams/:id', (req, res) => {
  const streamId = req.params.id;
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Watching Stream</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            color: #333;
          }
          .video-container {
            width: 100%;
            background-color: #000;
            aspect-ratio: 16 / 9;
            margin-bottom: 20px;
          }
          .button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 10px 15px;
            text-decoration: none;
            border-radius: 4px;
          }
          .stream-info {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <h1>Live Stream</h1>
        
        <div class="stream-info">
          <h2>Stream ID: ${streamId}</h2>
          <p id="viewers">Viewers: --</p>
          <p id="duration">Duration: --</p>
        </div>
        
        <div class="video-container">
          <video id="video-player" controls style="width: 100%; height: 100%;">
            <source src="/media/${streamId}.m3u8" type="application/x-mpegURL">
            Your browser does not support the video tag.
          </video>
        </div>
        
        <a href="/streams" class="button">Back to Streams</a>
        <a href="/" class="button">Home</a>
        
        <script>
          // Simple viewer count simulation
          let viewers = Math.floor(Math.random() * 50) + 1;
          document.getElementById('viewers').textContent = \`Viewers: \${viewers}\`;
          
          // Simple duration counter
          let seconds = 0;
          setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            document.getElementById('duration').textContent = 
              \`Duration: \${minutes}:\${remainingSeconds < 10 ? '0' : ''}\${remainingSeconds}\`;
          }, 1000);
        </script>
      </body>
    </html>
  `);
});

// Start the server
server.listen(config.port, (err) => {
  if (err) throw err;
  console.log(`> Server ready on http://localhost:${config.port}`);
});

// Start the media server
nms.run();
console.log(`> Media server ready on RTMP port ${config.mediaServer.rtmp.port} and HTTP port ${config.mediaServer.http.port}`);

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  nms.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  nms.stop();
  process.exit(0);
});
