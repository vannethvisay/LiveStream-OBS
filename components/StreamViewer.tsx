'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface StreamViewerProps {
  streamId: string;
}

export default function StreamViewer({ streamId }: StreamViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    // Load the HLS.js library dynamically
    const loadHlsPlayer = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        // In a production app, you would load HLS.js from a CDN or npm package
        // For this example, we'll use a placeholder
        console.log(`Loading stream with ID: ${streamId}`);
        
        // Simulate loading the stream
        setTimeout(() => {
          setIsLoading(false);
          setIsPlaying(true);
        }, 2000);
        
        // In a real implementation, you would:
        // 1. Load HLS.js
        // 2. Check if the stream is active
        // 3. Initialize the player with the stream URL
        // 4. Attach the player to the video element
        
        // Example code for a real implementation:
        /*
        const Hls = (await import('hls.js')).default;
        
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(`http://localhost:8000/live/${streamId}/index.m3u8`);
          hls.attachMedia(videoRef.current!);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoRef.current?.play();
            setIsLoading(false);
            setIsPlaying(true);
          });
          
          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              setError('Stream not available or connection error');
              setIsLoading(false);
            }
          });
        } else if (videoRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
          // For Safari
          videoRef.current.src = `http://localhost:8000/live/${streamId}/index.m3u8`;
          videoRef.current.addEventListener('loadedmetadata', () => {
            videoRef.current?.play();
            setIsLoading(false);
            setIsPlaying(true);
          });
          
          videoRef.current.addEventListener('error', () => {
            setError('Stream not available or connection error');
            setIsLoading(false);
          });
        } else {
          setError('Your browser does not support HLS playback');
          setIsLoading(false);
        }
        */
      } catch (error) {
        console.error('Error loading stream:', error);
        setError('Failed to load stream player');
        setIsLoading(false);
      }
    };
    
    loadHlsPlayer();
    
    // Cleanup function
    return () => {
      // In a real implementation, you would destroy the HLS.js instance
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
        videoRef.current.load();
      }
    };
  }, [streamId]);
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10">
            <div className="text-center p-4">
              <p className="text-white mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        )}
        
        <video
          ref={videoRef}
          className="w-full aspect-video bg-black"
          controls
          playsInline
          poster="/stream-placeholder.jpg"
        />
        
        {!isLoading && !error && !isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <Button size="lg" onClick={() => videoRef.current?.play()}>
              Play Stream
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
