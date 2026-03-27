import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardTopBar from '@/components/DashboardTopBar';
import BottomNav from '@/components/BottomNav';

export const metadata = {
  title: 'Dashboard - CarMogger',
  description: 'Your CarMogger dashboard. View scores, track performance, and manage your cars.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: '#06080d' }}>
      <DashboardSidebar />
      <DashboardTopBar />
      <main className="lg:pl-[88px] pt-[72px] pb-[88px] lg:pb-0">
        <div className="max-w-[1440px] mx-auto p-6">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
