import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Live Streams',
  description: 'Browse all live streams'
};

// This would be fetched from the API in a real application
const mockStreams = [
  { id: 'stream1', title: 'Gaming Stream', username: 'gamer123', viewers: 42 },
  { id: 'stream2', title: 'Coding Session', username: 'devmaster', viewers: 15 },
  { id: 'stream3', title: 'Music Performance', username: 'musician', viewers: 78 }
];

export default function StreamsPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Live Streams</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockStreams.map((stream) => (
          <Link href={`/streams/${stream.id}`} key={stream.id}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 dark:bg-gray-800 relative">
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  LIVE
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  {stream.viewers} viewers
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{stream.title}</CardTitle>
              </CardHeader>
              <CardFooter className="pt-0 text-sm text-gray-500">
                Streamed by {stream.username}
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
      
      {mockStreams.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No Live Streams</h2>
          <p className="text-gray-500">
            There are no active streams right now. Check back later or start your own stream!
          </p>
        </div>
      )}
    </div>
  );
}
