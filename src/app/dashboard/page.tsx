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
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ROW 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 24 }}>
        <div style={{ gridColumn: "span 12" }}>
          <ProfileRankCard />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        <ScoreHero />
        <QuickStats />
      </div>

      {/* ROW 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        <div style={{ gridColumn: "span 1" }}>
          <CarGrid />
        </div>
        <div>
          <LeaderboardPreview />
        </div>
      </div>

      {/* ROW 3 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        <ScoreBreakdown />
        <PerformanceChart />
      </div>

      {/* ROW 4 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        <ImproveSuggestions />
        <ShareTools />
      </div>
    </div>
  );
}
