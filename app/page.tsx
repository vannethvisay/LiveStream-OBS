import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Live Streaming Platform</h1>
      <p className="text-xl mb-8 max-w-2xl">
        Stream your content to the world or watch other creators live.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg">
          <Link href="/dashboard">Start Streaming</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/streams">Browse Streams</Link>
        </Button>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Easy to Use</h2>
          <p>
            Get started in minutes with our simple setup process. Just connect your streaming software and go live.
          </p>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">High Quality</h2>
          <p>
            Stream in high definition with low latency. Your viewers will enjoy a smooth experience.
          </p>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Grow Your Audience</h2>
          <p>
            Build your community with interactive features and reach new viewers.
          </p>
        </div>
      </div>
    </main>
  );
}
