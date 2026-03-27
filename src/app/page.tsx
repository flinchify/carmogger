"use client";

import { useEffect, useState } from "react";
import Particles from "@/components/Particles";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScoreRing from "@/components/ScoreRing";
import LeagueBadge from "@/components/LeagueBadge";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { LEAGUES } from "@/lib/leagues";
import { getScoreColor } from "@/lib/ai-scoring";
import Link from "next/link";

// Mock leaderboard data for launch
const MOCK_LEADERBOARD = [
  { rank: 1, car: "R34 GT-R V-Spec II", user: "midnight_r34", score: 97, views: 14200, league: "apex", level: 42, img: "" },
  { rank: 2, car: "993 GT2 Clubsport", user: "luftgekuhlt", score: 95, views: 11800, league: "elite", level: 38, img: "" },
  { rank: 3, car: "F80 M3 Widebody", user: "m3mog", score: 93, views: 9400, league: "elite", level: 31, img: "" },
  { rank: 4, car: "A80 Supra RZ", user: "2jz_no_sh", score: 91, views: 8100, league: "track", level: 27, img: "" },
  { rank: 5, car: "997.2 GT3 RS", user: "rslife", score: 89, views: 7200, league: "track", level: 25, img: "" },
  { rank: 6, car: "R35 GT-R Nismo", user: "godzilla_au", score: 87, views: 6500, league: "track", level: 22, img: "" },
  { rank: 7, car: "E46 M3 CSL", user: "csl_purist", score: 86, views: 5800, league: "street", level: 19, img: "" },
  { rank: 8, car: "GR Corolla Morizo", user: "jdm_ozzy", score: 84, views: 4900, league: "street", level: 16, img: "" },
];

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    const el = document.getElementById(`counter-${target}`);
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const interval = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(interval); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(interval);
  }, [started, target, duration]);

  return <span id={`counter-${target}`} className="tabular-nums">{count.toLocaleString()}</span>;
}

export default function Home() {
  useScrollReveal();
  const [heroScore, setHeroScore] = useState(0);

  // Animate hero score on mount
  useEffect(() => {
    let current = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        current += 1.5;
        if (current >= 87) { setHeroScore(87); clearInterval(interval); }
        else setHeroScore(Math.floor(current));
      }, 16);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Particles />
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 pb-10 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-20 left-1/3 w-[500px] h-[500px] bg-blue-600 rounded-full opacity-[0.04] blur-[150px] pointer-events-none animate-float-slow" />
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-blue-400 rounded-full opacity-[0.03] blur-[120px] pointer-events-none animate-float" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[var(--border)] bg-white/[0.02] backdrop-blur-sm mb-8 animate-slide-up">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
            </span>
            <span className="text-xs font-semibold text-[var(--grey-400)] uppercase tracking-[0.15em]">
              AI-Powered Car Rating
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-black leading-[0.92] tracking-tight animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Does your car
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-300 bg-clip-text text-transparent text-gradient-animate bg-[length:200%_200%]">
              mog?
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-7 text-lg sm:text-xl text-[var(--grey-400)] max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Upload your car. AI rates it across 5 brutal categories.
            <br className="hidden sm:block" />
            Get your CarMog score. Compete on the global leaderboard.
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <Link
              href="/rate"
              className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-lg font-bold hover:from-blue-400 hover:to-blue-500 transition-all press-effect btn-shine shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              <span className="flex items-center gap-2">
                Get Your CarMog Score
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
            <a
              href="#leaderboard"
              className="px-8 py-4 rounded-2xl border border-[var(--border)] text-[var(--grey-400)] text-lg font-medium hover:bg-white/[0.03] hover:text-white hover:border-[var(--border-hover)] transition-all press-effect"
            >
              View Leaderboard
            </a>
          </div>

          {/* Floating Score Demo */}
          <div className="mt-16 animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <div className="inline-flex items-center gap-8 sm:gap-12 p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--border)] animate-border-glow">
              <ScoreRing score={87} size={130} delay={800} />
              <div className="text-left space-y-2.5">
                {[
                  { label: "Aura", value: 92, color: "#8B5CF6" },
                  { label: "Larp", value: 95, color: "#10B981" },
                  { label: "Money", value: 88, color: "#3B82F6" },
                  { label: "Demand", value: 85, color: "#F59E0B" },
                  { label: "Hype", value: 78, color: "#EC4899" },
                ].map((item, i) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--grey-500)] w-14">{item.label}</span>
                    <div className="w-28 sm:w-36 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                      <div
                        className="h-full rounded-full score-bar-fill"
                        style={{
                          width: `${item.value}%`,
                          background: `linear-gradient(90deg, ${item.color}80, ${item.color})`,
                          animationDelay: `${1 + i * 0.15}s`,
                          boxShadow: `0 0 8px ${item.color}30`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold tabular-nums" style={{ color: item.color }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-[var(--grey-700)] flex items-start justify-center p-1.5">
            <div className="w-1 h-2.5 rounded-full bg-[var(--grey-500)] animate-bounce" />
          </div>
        </div>
      </section>

      {/* ===== STATS TICKER ===== */}
      <section className="relative z-10 py-8 border-y border-[var(--border)] bg-[var(--bg-secondary)]/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { label: "Cars Rated", value: 2847 },
            { label: "Total Views", value: 184200 },
            { label: "Active Users", value: 1253 },
            { label: "Avg Score", value: 62 },
          ].map((stat) => (
            <div key={stat.label} className="scroll-reveal">
              <p className="text-2xl sm:text-3xl font-black text-white">
                <AnimatedCounter target={stat.value} />
                {stat.label === "Avg Score" ? "" : "+"}
              </p>
              <p className="text-xs text-[var(--grey-500)] mt-1 uppercase tracking-wider font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="relative z-10 py-28 sm:py-36 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20 scroll-reveal">
            <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-[0.2em] mb-3 block">The Process</span>
            <h2 className="text-3xl sm:text-5xl font-black">
              Three steps to your <span className="text-[var(--accent)]">mog score</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 stagger-children">
            {[
              {
                step: "01",
                title: "Upload",
                desc: "Drop 1-4 photos of your car. Front, side, interior, engine — more angles means a more accurate score.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "AI Rates",
                desc: "Our AI identifies your car down to the trim level. Scores across 5 axes. No BS, no participation trophies.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Compete",
                desc: "Climb the leaderboard. Progress through leagues. Embed your score on Instagram. Mog on everyone.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.step}
                className="scroll-reveal group relative p-7 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)]/30 transition-all duration-400 hover-lift"
              >
                {/* Step number */}
                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 flex items-center justify-center text-xs font-black text-blue-400">
                  {item.step}
                </div>
                <div className="text-[var(--accent)] mb-5 p-3 rounded-xl bg-blue-500/[0.06] w-fit group-hover:bg-blue-500/[0.12] transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
                <p className="text-sm text-[var(--grey-400)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LIVE LEADERBOARD ===== */}
      <section id="leaderboard" className="relative z-10 py-28 sm:py-36 px-4 bg-gradient-to-b from-transparent via-blue-950/[0.03] to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14 scroll-reveal">
            <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-[0.2em] mb-3 block">Global Rankings</span>
            <h2 className="text-3xl sm:text-5xl font-black">
              Live <span className="text-[var(--accent)]">Leaderboard</span>
            </h2>
            <p className="text-[var(--grey-400)] mt-4 max-w-lg mx-auto">The highest rated cars on CarMogger. Updated in real time. Think your car can compete?</p>
          </div>

          {/* Leaderboard table */}
          <div className="space-y-2.5 scroll-reveal">
            {MOCK_LEADERBOARD.map((entry) => {
              const color = getScoreColor(entry.score);
              const isTop3 = entry.rank <= 3;

              return (
                <div
                  key={entry.rank}
                  className={`group flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 hover-lift press-effect ${
                    isTop3
                      ? "bg-gradient-to-r from-[var(--bg-card)] to-blue-950/20 border-blue-500/15 hover:border-blue-500/30"
                      : "bg-[var(--bg-card)] border-[var(--border)] hover:border-[var(--border-hover)]"
                  }`}
                >
                  {/* Rank */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-black text-xs shrink-0 transition-transform group-hover:scale-110"
                    style={{
                      background: entry.rank === 1 ? "linear-gradient(135deg, #F59E0B, #D97706)" : entry.rank === 2 ? "linear-gradient(135deg, #94A3B8, #64748B)" : entry.rank === 3 ? "linear-gradient(135deg, #CD7F32, #A0522D)" : "var(--bg-secondary)",
                      color: isTop3 ? "#000" : "var(--grey-500)",
                      boxShadow: isTop3 ? `0 4px 12px ${entry.rank === 1 ? "rgba(245,158,11,0.3)" : entry.rank === 2 ? "rgba(148,163,184,0.3)" : "rgba(205,127,50,0.3)"}` : "none",
                    }}
                  >
                    {entry.rank}
                  </div>

                  {/* Car thumb placeholder */}
                  <div className="w-14 h-10 sm:w-16 sm:h-11 rounded-xl bg-gradient-to-br from-[var(--grey-800)] to-[var(--grey-900)] border border-[var(--border)] shrink-0 flex items-center justify-center overflow-hidden group-hover:border-[var(--border-hover)] transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--grey-600)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-white truncate group-hover:text-blue-100 transition-colors">{entry.car}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-[var(--grey-500)]">@{entry.user}</span>
                      <LeagueBadge league={entry.league} size="sm" showLabel={false} />
                      <span className="text-[10px] text-[var(--grey-600)]">Lv.{entry.level}</span>
                    </div>
                  </div>

                  {/* Views */}
                  <div className="hidden sm:flex items-center gap-1 text-xs text-[var(--grey-500)]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    {entry.views.toLocaleString()}
                  </div>

                  {/* Score */}
                  <div className="text-right shrink-0">
                    <p className="text-xl sm:text-2xl font-black tabular-nums transition-transform group-hover:scale-110" style={{ color }}>
                      {entry.score}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA under leaderboard */}
          <div className="mt-10 text-center scroll-reveal">
            <Link
              href="/rate"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold hover:from-blue-400 hover:to-blue-500 transition-all press-effect btn-shine shadow-lg shadow-blue-500/20"
            >
              Think you can beat them?
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 5 SCORING AXES ===== */}
      <section id="scoring" className="relative z-10 py-28 sm:py-36 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 scroll-reveal">
            <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-[0.2em] mb-3 block">Rating System</span>
            <h2 className="text-3xl sm:text-5xl font-black">
              5 axes. <span className="text-[var(--accent)]">No mercy.</span>
            </h2>
            <p className="text-[var(--grey-400)] mt-4 max-w-lg mx-auto">Each axis is scored 0-100 with anchored references. The AI is brutally consistent.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 stagger-children">
            {[
              { name: "Aura", desc: "Presence, stance, proportions. The way it makes people stop.", color: "#8B5CF6", high: "Widebody GT3 RS", low: "Beige Camry" },
              { name: "Larp", desc: "Authenticity score. Real parts or all show? M badge on a 320i = zero.", color: "#10B981", high: "Full forged build", low: "Fake M badge" },
              { name: "Money", desc: "Build value. Parts quality. How deep are the pockets?", color: "#3B82F6", high: "$200K+ build", low: "eBay specials" },
              { name: "Demand", desc: "Market desirability. How badly does everyone want this exact car?", color: "#F59E0B", high: "R34 GT-R", low: "Depreciation king" },
              { name: "Hype", desc: "Social media appeal. Would this break Instagram or get scrolled past?", color: "#EC4899", high: "TikTok bait", low: "No screenshots" },
            ].map((axis) => (
              <div
                key={axis.name}
                className="scroll-reveal group p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-all duration-300 hover-lift"
              >
                <div className="w-3 h-3 rounded-full mb-4 transition-transform group-hover:scale-150" style={{ background: axis.color, boxShadow: `0 0 12px ${axis.color}50` }} />
                <h3 className="text-lg font-black mb-1.5" style={{ color: axis.color }}>{axis.name}</h3>
                <p className="text-xs text-[var(--grey-400)] leading-relaxed mb-3">{axis.desc}</p>
                <div className="text-[10px] space-y-1 border-t border-[var(--border)] pt-2.5 mt-auto">
                  <p className="text-emerald-400">90+: {axis.high}</p>
                  <p className="text-red-400">&lt;20: {axis.low}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LEAGUES ===== */}
      <section id="leagues" className="relative z-10 py-28 sm:py-36 px-4 bg-gradient-to-b from-transparent via-blue-950/[0.03] to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 scroll-reveal">
            <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-[0.2em] mb-3 block">Progression</span>
            <h2 className="text-3xl sm:text-5xl font-black">
              Climb the <span className="text-[var(--accent)]">ranks</span>
            </h2>
            <p className="text-[var(--grey-400)] mt-4 max-w-lg mx-auto">
              Earn XP from views, uploads, and leaderboard positions. 6 leagues, 3 divisions each. Seasonal resets every 3 months.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 stagger-children">
            {LEAGUES.map((league) => (
              <div
                key={league.name}
                className="scroll-reveal group p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-all duration-300 text-center hover-lift"
              >
                <div className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-300">{league.emoji}</div>
                <h3 className="font-black text-sm" style={{ color: league.color }}>{league.display}</h3>
                <p className="text-[10px] text-[var(--grey-600)] mt-1">{league.min.toLocaleString()}+ XP</p>
                <div className="mt-3 h-1 rounded-full bg-white/[0.04] overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500 group-hover:w-full w-0" style={{ background: league.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* XP sources */}
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 stagger-children">
            {[
              { action: "Upload a car", xp: "+50 XP", icon: "📸" },
              { action: "Profile views", xp: "+1/view", icon: "👁️" },
              { action: "Top 10 spot", xp: "+100/day", icon: "🏆" },
              { action: "Embed clicks", xp: "+5/click", icon: "🔗" },
            ].map((item) => (
              <div key={item.action} className="scroll-reveal flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-all press-effect hover-scale">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-bold text-white">{item.action}</p>
                  <p className="text-xs font-bold text-[var(--accent)]">{item.xp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="relative z-10 py-28 sm:py-36 px-4">
        <div className="max-w-3xl mx-auto text-center scroll-reveal">
          <h2 className="text-4xl sm:text-6xl font-black mb-5 leading-tight">
            Ready to find out<br />if your car <span className="text-[var(--accent)]">mogs?</span>
          </h2>
          <p className="text-[var(--grey-400)] text-lg mb-10">
            Upload your car. Face the truth. There are no participation trophies here.
          </p>
          <Link
            href="/rate"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xl font-bold hover:from-blue-400 hover:to-blue-500 transition-all press-effect btn-shine shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 animate-pulse-glow"
          >
            Get Your CarMog Score
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
