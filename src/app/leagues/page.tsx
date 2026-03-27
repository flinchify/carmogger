"use client";

import Navbar from "@/components/Navbar";
import Particles from "@/components/Particles";
import Footer from "@/components/Footer";
import LeagueBadge from "@/components/LeagueBadge";
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
                <div className="shrink-0">
                  <LeagueBadge league={league.name} size="lg" showLabel={false} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black" style={{ color: league.color }}>
                    {league.display}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] mt-0.5">
                    {league.min.toLocaleString()} — {league.max === Infinity ? "Unlimited" : league.max.toLocaleString()} XP
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">3 divisions per league (III, II, I)</p>
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
                { action: "Upload a car", xp: "+50 XP", desc: "Per car rated by the AI", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg> },
                { action: "Daily profile views", xp: "+1 XP/view", desc: "Capped at 500 XP per day", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg> },
                { action: "Top 10 leaderboard", xp: "+100 XP/day", desc: "While your car holds top 10", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 9H4.5a2.5 2.5 0 010-5C7 4 7 7 7 7" /><path d="M18 9h1.5a2.5 2.5 0 000-5C17 4 17 7 17 7" /><path d="M4 22h16" /><path d="M18 2H6v7a6 6 0 0012 0V2z" /></svg> },
                { action: "Top 3 leaderboard", xp: "+250 XP/day", desc: "While your car holds top 3", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3 6.5L22 10l-5 5 1.2 7L12 18.5 5.8 22 7 15 2 10l7-1.5L12 2z" /></svg> },
                { action: "Embed clicks", xp: "+5 XP/click", desc: "When people click your embed", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg> },
              ].map((item) => (
                <div
                  key={item.action}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]"
                >
                  <div className="text-[var(--accent)] p-2 rounded-lg bg-blue-500/[0.08] shrink-0">
                    {item.icon}
                  </div>
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
