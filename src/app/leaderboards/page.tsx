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

function weeklyScore(car: MockCar): number {
  return Math.max(0, Math.min(100, car.score + Math.round(Math.sin(car.score * 7) * 8)));
}

const BRANDS = [...new Set(MOCK_CARS.map((c) => c.brand))].sort();

const YOUR_RANK = {
  rank: 43,
  username: "you_demo",
  displayName: "Your Name",
  score: 71,
  views: 1200,
  league: "street",
  level: 12,
  imageUrl: "https://images.unsplash.com/photo-1525609004556-c46c6c5104b8?w=800&q=80",
  brand: "Honda",
  model: "Civic Type R",
  year: 2024,
};

export default function LeaderboardsPage() {
  const [macroTab, setMacroTab] = useState<MacroTab>("global");
  const [brandFilter, setBrandFilter] = useState("all");
  const [showMicro, setShowMicro] = useState(false);
  useScrollReveal();

  const getSortedCars = (): MockCar[] => {
    let filtered = [...MOCK_CARS];
    if (macroTab === "brand" && brandFilter !== "all") {
      filtered = filtered.filter((c) => c.brand === brandFilter);
    }
    if (macroTab === "weekly") {
      return filtered.sort((a, b) => weeklyScore(b) - weeklyScore(a));
    }
    return filtered.sort((a, b) => b.score - a.score);
  };

  const getMicroEntries = () => {
    const sorted = [...MOCK_CARS].sort((a, b) => b.score - a.score);
    return sorted.slice(3, 8).map((c, i) => ({ ...c, simulatedRank: YOUR_RANK.rank - 2 + i }));
  };

  const sortedCars = getSortedCars();
  const microEntries = getMicroEntries();

  return (
    <>
      <Particles />
      <Navbar />

      <main className="relative z-10 min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-10 scroll-reveal">
            <h1 className="text-4xl sm:text-5xl font-black mb-3">
              Leader<span className="text-[var(--accent)]">boards</span>
            </h1>
            <p className="text-[var(--text-secondary)] max-w-md mx-auto">
              The highest rated cars on CarMogger. Compete for the top spot.
            </p>
          </div>

          {/* Macro / Micro toggle */}
          <div className="flex items-center justify-center gap-3 mb-8 scroll-reveal">
            <button
              onClick={() => setShowMicro(false)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all press-effect ${!showMicro ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)] hover:text-white"}`}
            >
              Macro
            </button>
            <button
              onClick={() => setShowMicro(true)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all press-effect ${showMicro ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border)] hover:text-white"}`}
            >
              Micro
            </button>
          </div>

          {!showMicro ? (
            <>
              {/* Macro Tabs */}
              <div className="flex items-center justify-center gap-2 mb-6 scroll-reveal flex-wrap">
                {([
                  { key: "global" as MacroTab, label: "Global" },
                  { key: "weekly" as MacroTab, label: "Weekly" },
                  { key: "local" as MacroTab, label: "Local" },
                  { key: "brand" as MacroTab, label: "By Brand" },
                ]).map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setMacroTab(t.key)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all press-effect ${macroTab === t.key ? "bg-white/10 text-white border border-white/20" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-white/[0.03]"}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Brand filter */}
              {macroTab === "brand" && (
                <div className="flex justify-center mb-6 scroll-reveal">
                  <select
                    value={brandFilter}
                    onChange={(e) => setBrandFilter(e.target.value)}
                    className="px-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-sm text-white appearance-none cursor-pointer pr-8"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%238892a4' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
                  >
                    <option value="all">All Brands</option>
                    {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              )}

              {/* Leaderboard list */}
              <div className="space-y-3 mb-6">
                {sortedCars.map((car, i) => {
                  const rank = i + 1;
                  const displayScore = macroTab === "weekly" ? weeklyScore(car) : car.score;
                  const color = getScoreColor(displayScore);
                  const isTop3 = rank <= 3;

                  return (
                    <div
                      key={car.id}
                      className={`scroll-reveal flex items-center gap-4 p-4 rounded-[20px] bg-[var(--bg-card)] border transition-all hover:bg-[var(--bg-card-hover)] ${isTop3 ? "border-[var(--border-hover)]" : "border-[var(--border)]"}`}
                      style={isTop3 ? { boxShadow: `0 0 24px ${color}10` } : {}}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0"
                        style={{ background: rank === 1 ? "#F59E0B" : rank === 2 ? "#94A3B8" : rank === 3 ? "#CD7F32" : "var(--bg-secondary)", color: isTop3 ? "#000" : "var(--text-muted)" }}
                      >
                        {rank}
                      </div>
                      <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0">
                        <img src={car.imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{car.year} {car.brand} {car.model}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-[var(--text-muted)]">@{car.username}</span>
                          <LeagueBadge league={car.league} size="sm" showLabel={false} />
                          <span className="text-xs text-[var(--text-muted)]">Lv.{car.level}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-2xl font-black tabular-nums" style={{ color }}>{displayScore}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">{car.views.toLocaleString()} views</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Your position */}
              <div className="scroll-reveal p-4 rounded-[20px] border flex items-center gap-4" style={{ background: "rgba(59,130,246,0.05)", borderColor: "rgba(59,130,246,0.2)" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0" style={{ background: "rgba(59,130,246,0.2)", color: "#3b82f6" }}>
                  {YOUR_RANK.rank}
                </div>
                <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0">
                  <img src={YOUR_RANK.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-[var(--accent)]">You</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-[var(--text-muted)]">@{YOUR_RANK.username}</span>
                    <LeagueBadge league={YOUR_RANK.league} size="sm" showLabel={false} />
                    <span className="text-xs text-[var(--text-muted)]">Lv.{YOUR_RANK.level}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-black tabular-nums text-[var(--accent)]">{YOUR_RANK.score}</p>
                  <p className="text-[10px] text-[var(--text-muted)]">{YOUR_RANK.views.toLocaleString()} views</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-8 scroll-reveal">
                <h2 className="text-xl font-black mb-2">People Near You</h2>
                <p className="text-sm text-[var(--text-muted)]">Competitors within 5 places of your rank</p>
              </div>

              <div className="space-y-3 mb-6">
                {microEntries.map((entry) => {
                  const color = getScoreColor(entry.score);
                  const isYou = entry.simulatedRank === YOUR_RANK.rank;
                  return (
                    <div
                      key={entry.id}
                      className="scroll-reveal flex items-center gap-4 p-4 rounded-[20px] border transition-all hover:bg-[var(--bg-card-hover)]"
                      style={isYou ? { background: "rgba(59,130,246,0.05)", borderColor: "rgba(59,130,246,0.2)" } : { background: "var(--bg-card)", borderColor: "rgba(148,163,184,0.08)" }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0"
                        style={{ background: isYou ? "rgba(59,130,246,0.2)" : "var(--bg-secondary)", color: isYou ? "#3b82f6" : "var(--text-muted)" }}
                      >
                        #{entry.simulatedRank}
                      </div>
                      <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0">
                        <img src={entry.imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">
                          {isYou && <span className="text-[var(--accent)]">(You) </span>}
                          {entry.year} {entry.brand} {entry.model}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-[var(--text-muted)]">@{entry.username}</span>
                          <LeagueBadge league={entry.league} size="sm" showLabel={false} />
                        </div>
                      </div>
                      <p className="text-2xl font-black tabular-nums shrink-0" style={{ color }}>{entry.score}</p>
                    </div>
                  );
                })}
              </div>

              {/* Same brand section */}
              <div className="mt-10 scroll-reveal">
                <h2 className="text-xl font-black mb-2">Same Brand</h2>
                <p className="text-sm text-[var(--text-muted)] mb-6">Other Toyota owners near your rank</p>
                <div className="space-y-3">
                  {MOCK_CARS.filter((c) => c.brand === "Toyota").slice(0, 3).map((car, i) => {
                    const color = getScoreColor(car.score);
                    return (
                      <div key={car.id} className="flex items-center gap-4 p-4 rounded-[20px] bg-[var(--bg-card)] border border-[var(--border)] transition-all hover:bg-[var(--bg-card-hover)]">
                        <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center font-black text-sm text-[var(--text-muted)] shrink-0">#{i + 1}</div>
                        <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0">
                          <img src={car.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{car.year} {car.brand} {car.model}</p>
                          <span className="text-xs text-[var(--text-muted)]">@{car.username}</span>
                        </div>
                        <p className="text-2xl font-black tabular-nums shrink-0" style={{ color }}>{car.score}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
