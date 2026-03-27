"use client";

import Navbar from "@/components/Navbar";
import Particles from "@/components/Particles";
import Footer from "@/components/Footer";
import { LEAGUES } from "@/lib/leagues";

export default function LeaguesPage() {
  return (
    <>
      <Particles />
      <Navbar />

      <main className="relative z-10 min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-black mb-3">
              Leagues & <span className="text-[var(--accent)]">Ranks</span>
            </h1>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
              Earn XP from views, uploads, and leaderboard placements. Progress through 6 leagues across seasonal competitions.
            </p>
          </div>

          {/* League cards */}
          <div className="space-y-4 mb-20">
            {LEAGUES.map((league) => (
              <div
                key={league.name}
                className="flex items-center gap-6 p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-all hover-tilt"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                  style={{
                    background: `${league.color}15`,
                    boxShadow: `0 0 20px ${league.color}15`,
                  }}
                >
                  {league.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black" style={{ color: league.color }}>
                    {league.display}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] mt-0.5">
                    {league.min.toLocaleString()} — {league.max === Infinity ? "Unlimited" : league.max.toLocaleString()} XP
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">3 divisions per league (III → II → I)</p>
                </div>
                <div className="shrink-0">
                  <div className="w-24 h-2 rounded-full bg-white/[0.04] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: "100%", background: league.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* XP Sources */}
          <div className="mb-20">
            <h2 className="text-2xl sm:text-3xl font-black text-center mb-10">
              How to earn <span className="text-[var(--accent)]">XP</span>
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { action: "Upload a car", xp: "+50 XP", desc: "Per car rated by the AI", icon: "📸" },
                { action: "Daily profile views", xp: "+1 XP/view", desc: "Capped at 500 XP per day", icon: "👁️" },
                { action: "Top 10 leaderboard", xp: "+100 XP/day", desc: "While your car holds top 10", icon: "🏆" },
                { action: "Top 3 leaderboard", xp: "+250 XP/day", desc: "While your car holds top 3", icon: "👑" },
                { action: "Embed clicks", xp: "+5 XP/click", desc: "When people click your embed", icon: "🔗" },
              ].map((item) => (
                <div
                  key={item.action}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm">{item.action}</p>
                      <span className="text-sm font-bold text-[var(--accent)]">{item.xp}</span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seasons */}
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-black mb-4">
              Seasonal <span className="text-[var(--accent)]">Resets</span>
            </h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto mb-6">
              Seasons last 3 months. When a season ends, your seasonal XP soft-resets (keep 30%). 
              Your highest league badge is permanent — flex it forever.
            </p>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
              Levels are permanent and never reset. They represent your lifetime CarMog journey.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
