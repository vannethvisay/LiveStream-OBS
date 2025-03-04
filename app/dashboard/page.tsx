import { Metadata } from 'next';
import StreamDashboard from '@/components/StreamDashboard';

export const metadata: Metadata = {
  title: 'Streaming Dashboard',
  description: 'Manage your live streams'
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Streaming Dashboard</h1>
      <StreamDashboard />
    </div>
  );
}
