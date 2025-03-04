import { Metadata } from 'next';
import StreamViewer from '@/components/StreamViewer';

interface StreamPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: StreamPageProps): Promise<Metadata> {
  // In a real app, you would fetch stream details from the API
  return {
    title: `Watching Stream - ${params.id}`,
    description: 'Live stream viewer'
  };
}

export default function StreamPage({ params }: StreamPageProps) {
  const { id } = params;
  
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-4">Live Stream</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StreamViewer streamId={id} />
          
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Stream Title</h2>
            <p className="text-gray-600 dark:text-gray-400">
              This is a live stream by a content creator. Enjoy watching!
            </p>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 h-[600px]">
            <h2 className="text-lg font-semibold mb-2">Live Chat</h2>
            <div className="h-[500px] overflow-y-auto mb-4 bg-white dark:bg-gray-900 rounded p-2">
              <p className="text-gray-500 dark:text-gray-400 text-center mt-20">
                Chat messages will appear here
              </p>
            </div>
            <div className="flex">
              <input 
                type="text" 
                placeholder="Type a message..." 
                className="flex-1 rounded-l-md border border-gray-300 dark:border-gray-700 p-2"
              />
              <button className="bg-blue-500 text-white px-4 rounded-r-md">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
