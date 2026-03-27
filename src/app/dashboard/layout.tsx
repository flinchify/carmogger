import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardTopBar from '@/components/DashboardTopBar';
import BottomNav from '@/components/BottomNav';

export const metadata = {
  title: 'Dashboard - CarMogger',
  description: 'Your CarMogger dashboard. View scores, track performance, and manage your cars.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0b" }}>
      <DashboardSidebar />
      <DashboardTopBar />
      <main style={{ paddingLeft: 0, paddingTop: 72, paddingBottom: 88 }}>
        <div className="ctr" style={{ paddingTop: 24, paddingBottom: 24 }}>
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
