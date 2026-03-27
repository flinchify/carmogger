import ProfileRankCard from '@/components/ProfileRankCard';
import ScoreHero from '@/components/ScoreHero';
import QuickStats from '@/components/QuickStats';
import CarGrid from '@/components/CarGrid';
import LeaderboardPreview from '@/components/LeaderboardPreview';
import ScoreBreakdown from '@/components/ScoreBreakdown';
import PerformanceChart from '@/components/PerformanceChart';
import ImproveSuggestions from '@/components/ImproveSuggestions';
import ShareTools from '@/components/ShareTools';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* ROW 1 — Above the fold */}
      {/* Mobile: stack score hero first, then rank, then stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ProfileRankCard - hidden on mobile initially, shown after score */}
        <div className="order-2 lg:order-1 lg:col-span-3">
          <ProfileRankCard />
        </div>
        {/* ScoreHero - featured car + giant score */}
        <div className="order-1 lg:order-2 lg:col-span-5 min-h-[340px]">
          <ScoreHero />
        </div>
        {/* QuickStats */}
        <div className="order-3 lg:order-3 lg:col-span-4">
          <QuickStats />
        </div>
      </div>

      {/* ROW 2 — Cars + Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* My Cars */}
        <div className="order-2 lg:order-1 lg:col-span-8">
          <CarGrid />
        </div>
        {/* Leaderboard Preview */}
        <div className="order-1 lg:order-2 lg:col-span-4">
          <LeaderboardPreview />
        </div>
      </div>

      {/* ROW 3 — Score Breakdown + Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <ScoreBreakdown />
        </div>
        <div className="lg:col-span-5">
          <PerformanceChart />
        </div>
      </div>

      {/* ROW 4 — Improve + Share */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <ImproveSuggestions />
        </div>
        <div className="lg:col-span-4">
          <ShareTools />
        </div>
      </div>
    </div>
  );
}
