'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function StreamDashboard() {
  const [streamTitle, setStreamTitle] = useState('');
  const [streamDescription, setStreamDescription] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamKey, setStreamKey] = useState('');
  const [serverUrl, setServerUrl] = useState('');
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewers, setViewers] = useState(0);
  const [error, setError] = useState('');
  
  // Fetch stream credentials on component mount
  useEffect(() => {
    fetchCredentials();
  }, []);
  
  // Poll for stream status when streaming
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isStreaming) {
      interval = setInterval(fetchStreamStatus, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStreaming]);
  
  const fetchCredentials = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch('/api/stream-credentials');
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      
      const data = await response.json();
      
      setServerUrl(data.serverUrl);
      setStreamKey(data.streamKey);
      setIsStreaming(data.isLive);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching stream credentials:', error);
      setError('Failed to load stream credentials. Please try again.');
      setIsLoading(false);
    }
  };
  
  const fetchStreamStatus = async () => {
    try {
      const response = await fetch('/api/stream-status');
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      
      const data = await response.json();
      
      setIsStreaming(data.isLive);
      setViewers(data.viewers);
    } catch (error) {
      console.error('Error fetching stream status:', error);
    }
  };
  
  const startStream = () => {
    if (!streamTitle.trim()) {
      alert('Please enter a stream title');
      return;
    }
    
    // In a real app, you would save the stream title and description to the server
    // For now, we'll just update the local state
    setIsStreaming(true);
    
    // Start polling for stream status
    fetchStreamStatus();
  };
  
  const endStream = () => {
    // In a real app, you would send a request to the server to end the stream
    // For now, we'll just update the local state
    setIsStreaming(false);
    setViewers(0);
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };
  
  const refreshStreamKey = async () => {
    if (confirm('Are you sure you want to generate a new stream key? This will invalidate your current key and disconnect any active streams.')) {
      await fetchCredentials();
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="stream">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stream">Stream</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stream" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stream Setup</CardTitle>
              <CardDescription>
                Configure your stream settings and go live
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Stream Title</Label>
                <Input 
                  id="title" 
                  placeholder="Enter your stream title" 
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  disabled={isStreaming}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Stream Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe your stream content" 
                  value={streamDescription}
                  onChange={(e) => setStreamDescription(e.target.value)}
                  disabled={isStreaming}
                />
              </div>
            </CardContent>
            <CardFooter>
              {!isStreaming ? (
                <Button onClick={startStream} className="w-full">Start Streaming</Button>
              ) : (
                <Button onClick={endStream} variant="destructive" className="w-full">End Stream</Button>
              )}
            </CardFooter>
          </Card>
          
          {isStreaming && (
            <Alert className="bg-green-50 dark:bg-green-900/20 border-green-500">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></div>
                <AlertTitle>You are live!</AlertTitle>
              </div>
              <AlertDescription>
                Your stream is now visible to viewers. {viewers > 0 ? `Current viewers: ${viewers}` : 'Waiting for viewers to join.'}
              </AlertDescription>
            </Alert>
          )}
          
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Stream Connection</CardTitle>
              <CardDescription>
                Use these details in OBS Studio or your preferred streaming software
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="py-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading stream credentials...</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>Server URL</Label>
                    <div className="flex">
                      <Input value={serverUrl} readOnly className="flex-1" />
                      <Button 
                        variant="outline" 
                        className="ml-2"
                        onClick={() => copyToClipboard(serverUrl)}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Stream Key</Label>
                    <div className="flex">
                      <Input 
                        type={showStreamKey ? "text" : "password"} 
                        value={streamKey} 
                        readOnly 
                        className="flex-1"
                      />
                      <Button 
                        variant="outline" 
                        className="ml-2"
                        onClick={() => setShowStreamKey(!showStreamKey)}
                      >
                        {showStreamKey ? "Hide" : "Show"}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="ml-2"
                        onClick={() => copyToClipboard(streamKey)}
                      >
                        Copy
                      </Button>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Keep your stream key private! Anyone with this key can stream to your channel.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={refreshStreamKey}
                        disabled={isStreaming}
                      >
                        Reset Key
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stream Settings</CardTitle>
              <CardDescription>
                Configure your stream preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Stream Quality</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="justify-start">720p 30fps</Button>
                  <Button variant="outline" className="justify-start">1080p 30fps</Button>
                  <Button variant="outline" className="justify-start">720p 60fps</Button>
                  <Button variant="outline" className="justify-start">1080p 60fps</Button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Recommended: 720p 30fps for most reliable streaming experience
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Privacy Settings</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="save-recordings" className="rounded" />
                    <Label htmlFor="save-recordings">Save recordings after stream</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="allow-chat" className="rounded" defaultChecked />
                    <Label htmlFor="allow-chat">Enable chat during stream</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stream Analytics</CardTitle>
              <CardDescription>
                View statistics from your previous streams
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isStreaming ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold">{viewers}</div>
                      <div className="text-sm text-gray-500">Current Viewers</div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold">00:00:00</div>
                      <div className="text-sm text-gray-500">Stream Duration</div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold">0</div>
                      <div className="text-sm text-gray-500">Peak Viewers</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    No previous streams found. Analytics will appear here after your first stream.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
