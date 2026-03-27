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
import { MOCK_CARS } from "@/lib/mock-data";
import Link from "next/link";

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

// Featured cars for the cards section (top 4)
const FEATURED = MOCK_CARS.slice(0, 4);

// Leaderboard entries (top 8)
const LEADERBOARD = MOCK_CARS.slice(0, 8).map((car, i) => ({
  rank: i + 1,
  car: car.carName,
  user: car.username,
  score: car.score,
  views: car.views,
  league: car.league,
  level: car.level,
  imageUrl: car.imageUrl,
}));

export default function Home() {
  useScrollReveal();

  return (
    <>
      <Particles />
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 pb-10 overflow-hidden">
        {/* Background car image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover opacity-[0.07]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-[var(--bg-primary)]" />
        </div>

        {/* Gradient orbs */}
        <div className="absolute top-20 left-1/3 w-[500px] h-[500px] bg-blue-600 rounded-full opacity-[0.04] blur-[150px] pointer-events-none animate-float-slow" />
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-blue-400 rounded-full opacity-[0.03] blur-[120px] pointer-events-none animate-float" />

        <div className="relative z-10 max-w-[1440px] mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left: Text */}
            <div className="flex-1 text-center lg:text-left">
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

              <h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-black leading-[0.92] tracking-tight animate-slide-up" style={{ animationDelay: "0.1s" }}>
                Does your car
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-300 bg-clip-text text-transparent text-gradient-animate bg-[length:200%_200%]">
                  mog?
                </span>
              </h1>

              <p className="mt-7 text-lg sm:text-xl text-[var(--grey-400)] max-w-xl leading-relaxed animate-slide-up" style={{ animationDelay: "0.2s" }}>
                Upload your car. AI rates it across 5 brutal categories.
                <br className="hidden sm:block" />
                Get your CarMog score. Compete on the global leaderboard.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
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
            </div>

            {/* Right: Score Demo Card */}
            <div className="flex-shrink-0 animate-slide-up" style={{ animationDelay: "0.5s" }}>
              <div className="relative p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--border)]">
                {/* Car image */}
                <div className="w-full max-w-[340px] h-48 rounded-2xl overflow-hidden mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80"
                    alt="Porsche 911 GT3"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-start gap-6">
                  <ScoreRing score={87} size={110} delay={800} />
                  <div className="space-y-2.5 pt-1">
                    {[
                      { label: "Aura", value: 92, color: "#8B5CF6" },
                      { label: "Larp", value: 95, color: "#10B981" },
                      { label: "Money", value: 88, color: "#3B82F6" },
                      { label: "Demand", value: 85, color: "#F59E0B" },
                      { label: "Hype", value: 78, color: "#EC4899" },
                    ].map((item, i) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--grey-500)] w-14">{item.label}</span>
                        <div className="w-24 sm:w-28 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
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
                <p className="mt-4 text-xs text-[var(--grey-500)]">2023 Porsche 911 GT3 RS</p>
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

      {/* ===== SOCIAL PROOF TICKER ===== */}
      <section className="relative z-10 py-8 border-y border-[var(--border)] bg-[var(--bg-secondary)]/50 backdrop-blur-sm">
        <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
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
      <section id="how-it-works" className="relative z-10 py-28 sm:py-36 px-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-20 scroll-reveal">
            <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-[0.2em] mb-3 block">The Process</span>
            <h2 className="text-3xl sm:text-5xl font-black">
              Three steps to your <span className="text-[var(--accent)]">mog score</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto stagger-children">
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

      {/* ===== FEATURED CARS ===== */}
      <section className="relative z-10 py-28 sm:py-36 px-6 bg-gradient-to-b from-transparent via-blue-950/[0.03] to-transparent">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-14 scroll-reveal">
            <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-[0.2em] mb-3 block">Top Rated</span>
            <h2 className="text-3xl sm:text-5xl font-black">
              Featured <span className="text-[var(--accent)]">Cars</span>
            </h2>
            <p className="text-[var(--grey-400)] mt-4 max-w-lg mx-auto">The highest rated cars on CarMogger right now.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto stagger-children">
            {FEATURED.map((car) => {
              const color = getScoreColor(car.score);
              return (
                <div
                  key={car.id}
                  className="scroll-reveal group rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-hover)] overflow-hidden transition-all duration-300 hover-lift"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={car.imageUrl}
                      alt={car.carName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent" />
                    {/* Score badge */}
                    <div
                      className="absolute top-3 right-3 px-2.5 py-1 rounded-lg font-black text-sm backdrop-blur-sm"
                      style={{ color, background: "rgba(15,20,32,0.8)", border: `1px solid ${color}30` }}
                    >
                      {car.score}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm text-white truncate">{car.carName}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-[var(--grey-500)]">@{car.username}</span>
                      <LeagueBadge league={car.league} size="sm" showLabel={false} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== LIVE LEADERBOARD ===== */}
      <section id="leaderboard" className="relative z-10 py-28 sm:py-36 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14 scroll-reveal">
            <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-[0.2em] mb-3 block">Global Rankings</span>
            <h2 className="text-3xl sm:text-5xl font-black">
              Live <span className="text-[var(--accent)]">Leaderboard</span>
            </h2>
            <p className="text-[var(--grey-400)] mt-4 max-w-lg mx-auto">The highest rated cars on CarMogger. Updated in real time. Think your car can compete?</p>
          </div>

          <div className="space-y-2.5 scroll-reveal">
            {LEADERBOARD.map((entry) => {
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

                  {/* Car thumbnail */}
                  <div className="w-14 h-10 sm:w-16 sm:h-11 rounded-xl border border-[var(--border)] shrink-0 overflow-hidden group-hover:border-[var(--border-hover)] transition-colors">
                    <img src={entry.imageUrl} alt="" className="w-full h-full object-cover" />
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
      <section id="scoring" className="relative z-10 py-28 sm:py-36 px-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-16 scroll-reveal">
            <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-[0.2em] mb-3 block">Rating System</span>
            <h2 className="text-3xl sm:text-5xl font-black">
              5 axes. <span className="text-[var(--accent)]">No mercy.</span>
            </h2>
            <p className="text-[var(--grey-400)] mt-4 max-w-lg mx-auto">Each axis is scored 0-100 with anchored references. The AI is brutally consistent.</p>
          </div>

          <div className="max-w-5xl mx-auto space-y-4 stagger-children">
            {[
              { name: "Aura", weight: "25%", desc: "Presence, stance, proportions. The way it makes people stop.", value: 92, color: "#8B5CF6" },
              { name: "Larp", weight: "20%", desc: "Authenticity score. Real parts or all show? M badge on a 320i = zero.", value: 95, color: "#10B981" },
              { name: "Money", weight: "20%", desc: "Build value. Parts quality. How deep are the pockets?", value: 88, color: "#3B82F6" },
              { name: "Demand", weight: "20%", desc: "Market desirability. How badly does everyone want this exact car?", value: 85, color: "#F59E0B" },
              { name: "Hype", weight: "15%", desc: "Social media appeal. Would this break Instagram or get scrolled past?", value: 78, color: "#EC4899" },
            ].map((axis) => (
              <div
                key={axis.name}
                className="scroll-reveal group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-all duration-300"
              >
                <div className="flex items-center gap-3 sm:w-40 shrink-0">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: axis.color, boxShadow: `0 0 12px ${axis.color}50` }} />
                  <div>
                    <h3 className="text-base font-black" style={{ color: axis.color }}>{axis.name}</h3>
                    <span className="text-[10px] text-[var(--grey-600)]">{axis.weight} weight</span>
                  </div>
                </div>
                <p className="text-xs text-[var(--grey-400)] leading-relaxed flex-1">{axis.desc}</p>
                <div className="flex items-center gap-3 w-full sm:w-56 shrink-0">
                  <div className="flex-1 h-2 rounded-full bg-white/[0.04] overflow-hidden">
                    <div
                      className="h-full rounded-full score-bar-fill"
                      style={{
                        width: `${axis.value}%`,
                        background: `linear-gradient(90deg, ${axis.color}60, ${axis.color})`,
                        boxShadow: `0 0 8px ${axis.color}30`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold tabular-nums w-8 text-right" style={{ color: axis.color }}>{axis.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LEAGUES ===== */}
      <section id="leagues" className="relative z-10 py-28 sm:py-36 px-6 bg-gradient-to-b from-transparent via-blue-950/[0.03] to-transparent">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-14 scroll-reveal">
            <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-[0.2em] mb-3 block">Progression</span>
            <h2 className="text-3xl sm:text-5xl font-black">
              Climb the <span className="text-[var(--accent)]">ranks</span>
            </h2>
            <p className="text-[var(--grey-400)] mt-4 max-w-lg mx-auto">
              Earn XP from views, uploads, and leaderboard positions. 6 leagues, 3 divisions each. Seasonal resets every 3 months.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-5xl mx-auto stagger-children">
            {LEAGUES.map((league) => (
              <div
                key={league.name}
                className="scroll-reveal group p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-all duration-300 text-center hover-lift"
              >
                <div className="flex items-center justify-center mb-3">
                  <LeagueBadge league={league.name} size="lg" showLabel={false} />
                </div>
                <h3 className="font-black text-sm" style={{ color: league.color }}>{league.display}</h3>
                <p className="text-[10px] text-[var(--grey-600)] mt-1">{league.min.toLocaleString()}+ XP</p>
                <div className="mt-3 h-1 rounded-full bg-white/[0.04] overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500 group-hover:w-full w-0" style={{ background: league.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* XP sources */}
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto stagger-children">
            {[
              {
                action: "Upload a car", xp: "+50 XP",
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>,
              },
              {
                action: "Profile views", xp: "+1/view",
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
              },
              {
                action: "Top 10 spot", xp: "+100/day",
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 9H4.5a2.5 2.5 0 010-5C7 4 7 7 7 7" /><path d="M18 9h1.5a2.5 2.5 0 000-5C17 4 17 7 17 7" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" /><path d="M18 2H6v7a6 6 0 0012 0V2z" /></svg>,
              },
              {
                action: "Embed clicks", xp: "+5/click",
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>,
              },
            ].map((item) => (
              <div key={item.action} className="scroll-reveal flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-all press-effect hover-scale">
                <div className="text-[var(--accent)] p-2 rounded-lg bg-blue-500/[0.08]">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{item.action}</p>
                  <p className="text-xs font-bold text-[var(--accent)]">{item.xp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="relative z-10 py-28 sm:py-36 px-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-14 scroll-reveal">
            <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-[0.2em] mb-3 block">Pricing</span>
            <h2 className="text-3xl sm:text-5xl font-black">
              Choose your <span className="text-[var(--accent)]">tier</span>
            </h2>
            <p className="text-[var(--grey-400)] mt-4 max-w-lg mx-auto">Start free. Upgrade when you need more.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto stagger-children">
            {[
              {
                name: "Free",
                price: "$0",
                period: "/mo",
                highlight: false,
                features: [
                  "1 active car profile",
                  "3 analyses/month",
                  "Public CarMog page",
                  "Basic score (no full breakdown)",
                  "Share card with watermark",
                  "Leaderboard preview",
                  "7-day basic analytics",
                  "Instagram bio link",
                ],
              },
              {
                name: "Pro",
                price: "$15",
                period: "/mo",
                highlight: true,
                features: [
                  "5 active car profiles",
                  "30 analyses/month",
                  "No watermark",
                  "Full metric breakdown",
                  "Full leaderboard access",
                  "Compare mode",
                  "90-day analytics",
                  "Profile theme customization",
                  "Priority processing",
                ],
              },
              {
                name: "Elite",
                price: "$39",
                period: "/mo",
                highlight: false,
                features: [
                  "Unlimited car profiles",
                  "100 analyses/month",
                  "Verified badge",
                  "Advanced analytics",
                  "Sponsor/media kit exports",
                  "Featured discovery placement",
                  "API access (coming soon)",
                  "Priority support",
                ],
              },
            ].map((tier) => (
              <div
                key={tier.name}
                className={`scroll-reveal rounded-2xl p-6 border transition-all duration-300 hover-lift ${
                  tier.highlight
                    ? "bg-gradient-to-b from-blue-950/40 to-[var(--bg-card)] border-blue-500/30 shadow-lg shadow-blue-500/10"
                    : "bg-[var(--bg-card)] border-[var(--border)]"
                }`}
              >
                {tier.highlight && (
                  <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[var(--accent)] mb-3">Most Popular</span>
                )}
                <h3 className="text-xl font-black text-white">{tier.name}</h3>
                <div className="mt-3 mb-6">
                  <span className="text-4xl font-black text-white">{tier.price}</span>
                  <span className="text-sm text-[var(--grey-500)]">{tier.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--grey-400)]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={tier.highlight ? "#3b82f6" : "var(--grey-600)"} strokeWidth="2" className="mt-0.5 shrink-0">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all press-effect ${
                    tier.highlight
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white btn-shine shadow-lg shadow-blue-500/20"
                      : "border border-[var(--border)] text-[var(--grey-400)] hover:text-white hover:border-[var(--border-hover)] hover:bg-white/[0.03]"
                  }`}
                >
                  {tier.price === "$0" ? "Get Started" : `Upgrade to ${tier.name}`}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="relative z-10 py-28 sm:py-36 px-6">
        <div className="max-w-3xl mx-auto text-center scroll-reveal">
          <h2 className="text-4xl sm:text-6xl font-black mb-5 leading-tight">
            Ready to find out<br />if your car <span className="text-[var(--accent)]">mogs?</span>
          </h2>
          <p className="text-[var(--grey-400)] text-lg mb-10">
            Upload your car. Face the truth. There are no participation trophies here.
          </p>
          <Link
            href="/rate"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xl font-bold hover:from-blue-400 hover:to-blue-500 transition-all press-effect btn-shine shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40"
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
