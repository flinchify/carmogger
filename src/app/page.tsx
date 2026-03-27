"use client";

import Particles from "@/components/Particles";
import Navbar from "@/components/Navbar";
import ScoreRing from "@/components/ScoreRing";
import Link from "next/link";
import { LEAGUES } from "@/lib/leagues";

export default function Home() {
  return (
    <>
      <Particles />
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border)] bg-white/[0.03] backdrop-blur-sm mb-8 animate-slide-up">
            <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-widest">
              AI-Powered Car Rating
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Does your car
            <br />
            <span className="bg-gradient-to-r from-[var(--accent)] via-orange-400 to-[var(--accent)] bg-clip-text text-transparent">
              mog?
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Upload your car. AI rates it across Aura, Larp, Money, Demand and Hype.
            Get your CarMog score. Compete on the leaderboard. Flex it everywhere.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <Link
              href="/rate"
              className="px-8 py-4 rounded-full bg-[var(--accent)] text-white text-lg font-bold hover:brightness-110 transition-all press-effect animate-pulse-glow"
            >
              Rate Your Car
            </Link>
            <Link
              href="/leaderboard"
              className="px-8 py-4 rounded-full border border-[var(--border)] text-[var(--text-secondary)] text-lg font-medium hover:bg-white/[0.03] hover:text-white transition-all press-effect"
            >
              View Leaderboard
            </Link>
          </div>

          {/* Score Preview */}
          <div className="mt-16 flex items-center justify-center gap-8 animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <ScoreRing score={87} size={120} delay={800} />
            <div className="hidden sm:block text-left">
              <div className="space-y-2">
                {[
                  { label: "AURA", value: 92 },
                  { label: "LARP", value: 95 },
                  { label: "MONEY", value: 88 },
                  { label: "DEMAND", value: 85 },
                  { label: "HYPE", value: 78 },
                ].map((item, i) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] w-16">
                      {item.label}
                    </span>
                    <div className="w-32 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[var(--accent)] score-bar-fill"
                        style={{ width: `${item.value}%`, animationDelay: `${0.8 + i * 0.15}s` }}
                      />
                    </div>
                    <span className="text-xs font-bold tabular-nums text-[var(--text-secondary)]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--accent)] rounded-full opacity-[0.03] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500 rounded-full opacity-[0.03] blur-[120px] pointer-events-none" />
      </section>

      {/* How it works */}
      <section className="relative z-10 py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-black text-center mb-20">
            How it <span className="text-[var(--accent)]">works</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload",
                desc: "Drop 1-4 photos of your car. Front, side, interior, engine bay — the more angles, the better the score.",
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "AI Rates",
                desc: "Our AI identifies your car and scores it across 5 axes — Aura, Larp, Money, Demand, Hype. No BS, no participation trophies.",
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2a10 10 0 0110 10 10 10 0 01-10 10A10 10 0 012 12 10 10 0 0112 2z" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Compete",
                desc: "Climb the leaderboard. Level up through leagues. Embed your score on Instagram. Flex on everyone.",
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 9l6-6 6 6M6 15l6 6 6-6" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.step} className="group relative p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-all hover-tilt">
                <div className="text-[var(--accent)] mb-4 opacity-60 group-hover:opacity-100 transition-opacity">
                  {item.icon}
                </div>
                <div className="text-[var(--accent)] text-xs font-bold uppercase tracking-widest mb-2">
                  Step {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leagues Preview */}
      <section className="relative z-10 py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-black text-center mb-6">
            Climb the <span className="text-[var(--accent)]">ranks</span>
          </h2>
          <p className="text-center text-[var(--text-secondary)] mb-16 max-w-xl mx-auto">
            Earn XP from views, uploads, and leaderboard positions. Progress through 6 leagues with seasonal resets.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {LEAGUES.map((league) => (
              <div
                key={league.name}
                className="group p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-all text-center hover-tilt"
              >
                <div className="text-4xl mb-3">{league.emoji}</div>
                <h3 className="font-bold text-sm" style={{ color: league.color }}>
                  {league.display}
                </h3>
                <p className="text-[10px] text-[var(--text-muted)] mt-1">
                  {league.min.toLocaleString()}+ XP
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/leagues"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors"
            >
              Learn more about leagues
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Scoring axes */}
      <section className="relative z-10 py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-black text-center mb-16">
            5 axes. <span className="text-[var(--accent)]">No mercy.</span>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { name: "Aura", desc: "Presence. Stance. The way it makes people stop and stare.", color: "#8B5CF6" },
              { name: "Larp", desc: "Is it real or is it fake? M badge on a 320i = instant zero.", color: "#EF4444" },
              { name: "Money", desc: "Build quality. Parts. How deep are the pockets behind this build?", color: "#10B981" },
              { name: "Demand", desc: "How badly does the market want this car? R34 tax is real.", color: "#3B82F6" },
              { name: "Hype", desc: "Would this break Instagram? TikTok engagement bait or scroll-past?", color: "#F59E0B" },
            ].map((axis) => (
              <div
                key={axis.name}
                className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-all hover-tilt"
              >
                <h3 className="text-lg font-black mb-2" style={{ color: axis.color }}>
                  {axis.name}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{axis.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-32 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-6xl font-black mb-6">
            Ready to find out?
          </h2>
          <p className="text-[var(--text-secondary)] text-lg mb-10">
            Upload your car. Face the truth. There are no participation trophies here.
          </p>
          <Link
            href="/rate"
            className="inline-flex px-10 py-5 rounded-full bg-[var(--accent)] text-white text-xl font-bold hover:brightness-110 transition-all press-effect animate-pulse-glow"
          >
            Rate Your Car Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--border)] py-12 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center font-black text-[10px]">
              M
            </div>
            <span className="text-sm font-bold">CarMog</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-[var(--text-muted)]">
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <span>2026 CarMog</span>
          </div>
        </div>
      </footer>
    </>
  );
}
