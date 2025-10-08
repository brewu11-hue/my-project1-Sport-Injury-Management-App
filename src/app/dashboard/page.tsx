import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardClientPage = dynamic(
  () => import('./dashboard-client-page'),
  {
    ssr: false,
    loading: () => (
        <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-2">
                <Skeleton className="h-[calc(100vh-10rem)] w-full" />
            </div>
            <div className="lg:col-span-3 grid auto-rows-max gap-6">
                 <Skeleton className="h-[300px] w-full" />
                 <Skeleton className="h-[300px] w-full" />
            </div>
        </div>
    ),
  }
);

export default function DashboardPage() {
  return <DashboardClientPage />;
}
