const NodeMediaServer = require('node-media-server');
const config = require('./config');
const fs = require('fs');
const path = require('path');

// Ensure media directory exists
const mediaDir = path.join(__dirname, '../media');
if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir, { recursive: true });
}

// Configure the Node Media Server
const nms = new NodeMediaServer({
  rtmp: config.mediaServer.rtmp,
  http: config.mediaServer.http,
  auth: config.mediaServer.auth,
  trans: {
    ffmpeg: false, // Disable ffmpeg since it's not available in WebContainer
    tasks: []
  }
});

// Handle authentication for publishing streams
nms.on('prePublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on prePublish]', StreamPath);
  
  // Extract stream key from path
  const streamKey = StreamPath.split('/')[2];
  
  // In a real app, you would validate the stream key against your database
  // For now, we'll allow all streams with a key that starts with 'stream-'
  if (!streamKey || !streamKey.startsWith('stream-')) {
    const session = nms.getSession(id);
    session.reject();
    console.log('Stream rejected: Invalid stream key');
  } else {
    console.log('Stream authorized');
  }
});

// Handle stream start
nms.on('postPublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on postPublish]', StreamPath);
  // In a real app, you would update your database to mark the stream as live
});

// Handle stream end
nms.on('donePublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on donePublish]', StreamPath);
  // In a real app, you would update your database to mark the stream as ended
});

module.exports = { nms };
