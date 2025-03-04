require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  mediaServer: {
    rtmp: {
      port: process.env.MEDIA_SERVER_RTMP_PORT || 1935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 30,
      ping_timeout: 60
    },
    http: {
      port: process.env.MEDIA_SERVER_HTTP_PORT || 8000,
      allow_origin: '*'
    },
    auth: {
      play: false,
      publish: true,
      secret: process.env.SECRET_KEY || 'nodesecret'
    },
    trans: {
      ffmpeg: process.env.FFMPEG_PATH || 'ffmpeg',
      tasks: [
        {
          app: 'live',
          hls: true,
          hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
          dash: true,
          dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
        }
      ]
    }
  },
  streamServerUrl: process.env.STREAM_SERVER_URL || 'rtmp://localhost:1935/live'
};
