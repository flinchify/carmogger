"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Particles from "@/components/Particles";
import Footer from "@/components/Footer";
import LeagueBadge from "@/components/LeagueBadge";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { getScoreColor } from "@/lib/ai-scoring";
import { MOCK_CARS, type MockCar } from "@/lib/mock-data";

type MacroTab = "global" | "weekly" | "local" | "brand";

const CURRENT_USER = {
  username: "you_demo",
  displayName: "You",
  rank: 43,
  score: 74,
  league: "street",
  level: 15,
  imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
  carName: "2019 Honda Civic Type R",
  brand: "Honda",
};

function getWeeklyData(): MockCar[] {
  return [...MOCK_CARS].sort((a, b) => b.hype - a.hype).slice(0, 8);
}

function getLocalData(): MockCar[] {
  return [...MOCK_CARS].slice(2, 8);
}

function getBrandData(): { brand: string; cars: MockCar[] }[] {
  const brands = [...new Set(MOCK_CARS.map((c) => c.brand))];
  return brands.map((brand) => ({
    brand,
    cars: MOCK_CARS.filter((c) => c.brand === brand).sort((a, b) => b.score - a.score),
  })).filter((b) => b.cars.length > 0).sort((a, b) => b.cars.length - a.cars.length);
}

function LeaderboardRow({ car, rank }: { car: MockCar; rank: number }) {
  const color = getScoreColor(car.score);
  const isTop3 = rank <= 3;

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg-card)] border transition-all hover-tilt ${
        isTop3 ? "border-[var(--border-hover)]" : "border-[var(--border)]"
      }`}
      style={isTop3 ? { boxShadow: `0 0 20px ${color}10` } : {}}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0"
        style={{
          background: rank === 1 ? "#F59E0B" : rank === 2 ? "#94A3B8" : rank === 3 ? "#CD7F32" : "var(--bg-secondary)",
          color: isTop3 ? "#000" : "var(--text-muted)",
        }}
      >
        {rank}
      </div>

      <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0">
        <img src={car.imageUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm truncate">{car.carName}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-[var(--text-muted)]">@{car.username}</span>
          <LeagueBadge league={car.league} size="sm" showLabel={false} />
          <span className="text-xs text-[var(--text-muted)]">Lv.{car.level}</span>
        </div>
      </div>

      <div className="text-right shrink-0">
        <p className="text-2xl font-black tabular-nums" style={{ color }}>
          {car.score}
        </p>
        <p className="text-[10px] text-[var(--text-muted)]">
          {car.views.toLocaleString()} views
        </p>
      </div>
    </div>
  );
}

function YourPositionRow() {
  const color = getScoreColor(CURRENT_USER.score);
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-500/[0.06] border border-blue-500/20">
      <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0 bg-blue-500/20 text-blue-400">
        {CURRENT_USER.rank}
      </div>
      <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0">
        <img src={CURRENT_USER.imageUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm truncate text-blue-400">{CURRENT_USER.carName}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-blue-400/70">@{CURRENT_USER.username}</span>
          <LeagueBadge league={CURRENT_USER.league} size="sm" showLabel={false} />
          <span className="text-xs text-[var(--text-muted)]">Lv.{CURRENT_USER.level}</span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-2xl font-black tabular-nums" style={{ color }}>
          {CURRENT_USER.score}
        </p>
        <p className="text-[10px] text-blue-400/60">Your position</p>
      </div>
    </div>
  );
}

export default function LeaderboardsPage() {
  const [macroTab, setMacroTab] = useState<MacroTab>("global");
  const [showMicro, setShowMicro] = useState(false);
  useScrollReveal();

  const globalData = [...MOCK_CARS].sort((a, b) => b.score - a.score);
  const weeklyData = getWeeklyData();
  const localData = getLocalData();
  const brandData = getBrandData();

  const nearbyRanks = MOCK_CARS.slice(4, 8);

  return (
    <>
      <Particles />
      <Navbar />

      <main className="relative z-10 min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 scroll-reveal">
            <h1 className="text-4xl sm:text-5xl font-black mb-3">
              Leader<span className="text-[var(--accent)]">boards</span>
            </h1>
            <p className="text-[var(--text-secondary)]">
              The highest rated cars on CarMogger. See where you stack up.
            </p>
          </div>

          {/* Macro / Micro toggle */}
          <div className="flex items-center justify-center gap-2 mb-6 scroll-reveal">
            <button
              onClick={() => setShowMicro(false)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all press-effect ${
                !showMicro
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-white border border-[var(--border)]"
              }`}
            >
              Leaderboards
            </button>
            <button
              onClick={() => setShowMicro(true)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all press-effect ${
                showMicro
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-white border border-[var(--border)]"
              }`}
            >
              Near You
            </button>
          </div>

          {!showMicro ? (
            <>
              {/* Macro tabs */}
              <div className="flex items-center justify-center gap-2 mb-8 scroll-reveal">
                {(
                  [
                    { key: "global", label: "Global" },
                    { key: "weekly", label: "Weekly" },
                    { key: "local", label: "Local" },
                    { key: "brand", label: "By Brand" },
                  ] as { key: MacroTab; label: string }[]
                ).map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setMacroTab(t.key)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all press-effect ${
                      macroTab === t.key
                        ? "bg-white/[0.08] text-white border border-[var(--border-hover)]"
                        : "text-[var(--text-muted)] hover:text-white hover:bg-white/[0.03]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Global */}
              {macroTab === "global" && (
                <div className="space-y-3">
                  {globalData.map((car, i) => (
                    <LeaderboardRow key={car.id} car={car} rank={i + 1} />
                  ))}
                  <div className="my-4 flex items-center gap-3">
                    <div className="flex-1 h-px bg-[var(--border)]" />
                    <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Your position</span>
                    <div className="flex-1 h-px bg-[var(--border)]" />
                  </div>
                  <YourPositionRow />
                </div>
              )}

              {/* Weekly */}
              {macroTab === "weekly" && (
                <div className="space-y-3">
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-4">This week&apos;s top performers</p>
                  {weeklyData.map((car, i) => (
                    <LeaderboardRow key={car.id} car={car} rank={i + 1} />
                  ))}
                  <div className="my-4 flex items-center gap-3">
                    <div className="flex-1 h-px bg-[var(--border)]" />
                    <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Your position</span>
                    <div className="flex-1 h-px bg-[var(--border)]" />
                  </div>
                  <YourPositionRow />
                </div>
              )}

              {/* Local */}
              {macroTab === "local" && (
                <div className="space-y-3">
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-4">Top cars in your area</p>
                  {localData.map((car, i) => (
                    <LeaderboardRow key={car.id} car={car} rank={i + 1} />
                  ))}
                  <div className="my-4 flex items-center gap-3">
                    <div className="flex-1 h-px bg-[var(--border)]" />
                    <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Your position</span>
                    <div className="flex-1 h-px bg-[var(--border)]" />
                  </div>
                  <YourPositionRow />
                </div>
              )}

              {/* Brand */}
              {macroTab === "brand" && (
                <div className="space-y-8">
                  {brandData.map((group) => (
                    <div key={group.brand}>
                      <h3 className="text-lg font-bold mb-3">{group.brand}</h3>
                      <div className="space-y-3">
                        {group.cars.map((car, i) => (
                          <LeaderboardRow key={car.id} car={car} rank={i + 1} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Micro leaderboard */
            <div className="space-y-6">
              {/* Nearby rank */}
              <div>
                <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4">People near your rank</h3>
                <div className="space-y-3">
                  {nearbyRanks.map((car, i) => (
                    <LeaderboardRow key={car.id} car={car} rank={CURRENT_USER.rank - 3 + i} />
                  ))}
                  <YourPositionRow />
                  {MOCK_CARS.slice(0, 3).map((car, i) => (
                    <LeaderboardRow key={`below-${car.id}`} car={car} rank={CURRENT_USER.rank + 1 + i} />
                  ))}
                </div>
              </div>

              {/* Same brand */}
              <div>
                <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4">Same brand as you ({CURRENT_USER.brand})</h3>
                <div className="text-center py-10 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
                  <p className="text-[var(--text-muted)]">No other {CURRENT_USER.brand} owners ranked yet.</p>
                  <p className="text-xs text-[var(--text-muted)] mt-2">Be the first to claim the top spot for {CURRENT_USER.brand}.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
