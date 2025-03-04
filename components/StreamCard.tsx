import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface StreamCardProps {
  id: string;
  title: string;
  username: string;
  viewers: number;
  thumbnailUrl?: string;
}

export default function StreamCard({ id, title, username, viewers, thumbnailUrl }: StreamCardProps) {
  return (
    <Link href={`/streams/${id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow">
        <div className="aspect-video bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
          {thumbnailUrl ? (
            <img 
              src={thumbnailUrl} 
              alt={title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No Preview
            </div>
          )}
          
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded flex items-center">
            <div className="w-2 h-2 rounded-full bg-white mr-1 animate-pulse"></div>
            LIVE
          </div>
          
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {viewers} {viewers === 1 ? 'viewer' : 'viewers'}
          </div>
        </div>
        
        <CardHeader className="pb-2">
          <CardTitle className="text-lg truncate">{title}</CardTitle>
        </CardHeader>
        
        <CardFooter className="pt-0 text-sm text-gray-500">
          Streamed by {username}
        </CardFooter>
      </Card>
    </Link>
  );
}
