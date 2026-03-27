"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeagueBadge from "@/components/LeagueBadge";
import { LEAGUES } from "@/lib/leagues";
import { getScoreColor } from "@/lib/ai-scoring";
import Link from "next/link";

interface FeaturedCar {
  id: number;
  brand: string;
  model: string;
  year: number;
  carmog_score: number;
  images: string[];
  username: string;
  league: string;
  level: number;
  total_views: number;
}

interface Stats {
  totalCars: number;
  totalUsers: number;
  totalViews: number;
  avgScore: number;
}

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const step = target / (duration / 16);
    const interval = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(interval); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(interval);
  }, [target, duration]);
  return <span className="tabular-nums">{count.toLocaleString()}</span>;
}

export default function Home() {
  const [featured, setFeatured] = useState<FeaturedCar[]>([]);
  const [stats, setStats] = useState<Stats>({ totalCars: 0, totalUsers: 0, totalViews: 0, avgScore: 0 });
  const [leaderboard, setLeaderboard] = useState<FeaturedCar[]>([]);

  useEffect(() => {
    fetch("/api/featured").then(r => r.json()).then(d => setFeatured(d.cars || [])).catch(() => {});
    fetch("/api/stats").then(r => r.json()).then(d => setStats(d)).catch(() => {});
    fetch("/api/leaderboard?sort=score&limit=8").then(r => r.json()).then(d => setLeaderboard(d.entries || d || [])).catch(() => {});
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#4a9ade] via-[#7ab8e8] to-[#d4ecfa]" />

        {/* Soft clouds */}
        <div className="absolute top-[8%] left-[5%] w-72 h-20 bg-white/20 rounded-full blur-3xl" style={{ animation: "cloudDrift 24s ease-in-out infinite alternate" }} />
        <div className="absolute top-[18%] right-[8%] w-56 h-16 bg-white/15 rounded-full blur-2xl" style={{ animation: "cloudDrift 30s ease-in-out infinite alternate-reverse" }} />
        <div className="absolute top-[5%] left-[40%] w-40 h-12 bg-white/10 rounded-full blur-xl" style={{ animation: "cloudDrift 20s ease-in-out infinite alternate" }} />

        {/* Palm silhouettes — subtle */}
        <svg className="absolute bottom-0 left-[3%] w-28 h-44 opacity-[0.05]" viewBox="0 0 100 200" fill="#000">
          <path d="M45 200V100c0-20 5-35 5-50s-10-25-10-25c15 10 20 25 20 25s5-20 20-30c-10 15-12 30-12 30s15-10 25-10c-12 8-18 18-18 18s20 0 25-5c-10 10-25 12-25 12V200z"/>
        </svg>
        <svg className="absolute bottom-0 right-[3%] w-24 h-40 opacity-[0.04]" viewBox="0 0 100 200" fill="#000">
          <path d="M55 200V110c0-15 5-30 5-45s-8-20-8-20c12 8 15 20 15 20s5-15 18-25c-8 12-10 25-10 25s12-8 20-8c-10 6-14 14-14 14s16 0 20-4c-8 8-20 10-20 10V200z"/>
        </svg>

        {/* Fade to white at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />

        <div className="relative z-10 max-w-3xl mx-auto w-full px-6 pt-32 pb-20 text-center">
          {/* Badge */}
          <div className="fade-up fade-up-1 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/25 backdrop-blur-sm border border-white/30 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            <span className="text-xs font-semibold text-white/80 tracking-wide">AI-Powered Car Rating</span>
          </div>

          {/* Headline */}
          <h1 className="fade-up fade-up-2 text-5xl sm:text-7xl font-black text-white leading-[0.92] tracking-tight drop-shadow-md">
            Does your car<br />mog?
          </h1>

          {/* Subhead */}
          <p className="fade-up fade-up-3 mt-6 text-base sm:text-lg text-white/70 max-w-md mx-auto leading-relaxed">
            Upload your car. AI rates it across 5 brutal categories.<br className="hidden sm:block" />
            Get your CarMog score. Compete globally.
          </p>

          {/* CTAs */}
          <div className="fade-up fade-up-4 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/rate" className="group px-8 py-4 rounded-2xl bg-white text-[#0f172a] text-lg font-bold shadow-xl shadow-black/10 hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300">
              <span className="flex items-center gap-2">
                Upload Your Car
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform duration-200"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </Link>
            <a href="#leaderboard" className="px-8 py-4 rounded-2xl border-2 border-white/30 text-white text-lg font-medium hover:bg-white/10 hover:border-white/50 transition-all duration-300">
              View Leaderboard
            </a>
          </div>

          {/* Featured cars — clean slots */}
          <div className="fade-up fade-up-5 mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {featured.length > 0
              ? featured.slice(0, 4).map((car) => {
                  const color = getScoreColor(Number(car.carmog_score));
                  return (
                    <Link href={`/u/${car.username}`} key={car.id} className="group rounded-2xl bg-white shadow-lg overflow-hidden hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300">
                      <div className="relative h-28 sm:h-32 overflow-hidden">
                        {car.images?.[0] ? (
                          <img src={car.images[0]} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[11px] font-black text-white" style={{ background: color }}>{Number(car.carmog_score)}</div>
                      </div>
                      <div className="p-2.5">
                        <p className="text-[11px] font-bold text-[#0f172a] truncate">{car.year} {car.brand} {car.model}</p>
                        <p className="text-[10px] text-gray-400">@{car.username}</p>
                      </div>
                    </Link>
                  );
                })
              : [1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 flex flex-col items-center justify-center min-h-[160px] sm:min-h-[180px]">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" className="opacity-40"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                    <p className="text-[10px] text-gray-400 mt-2 font-medium">Coming soon</p>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { label: "Cars Rated", value: stats.totalCars },
            { label: "Total Views", value: stats.totalViews },
            { label: "Active Users", value: stats.totalUsers },
            { label: "Avg Score", value: stats.avgScore },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl sm:text-3xl font-black text-[#0f172a]">
                <AnimatedCounter target={stat.value} />
              </p>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-20 sm:py-24 bg-[#f8fafc]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] block mb-3">The Process</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a]">
              Three steps to your <span className="text-blue-500">mog score</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { step: "01", title: "Upload", desc: "Drop 1-4 photos of your car. More angles means a more accurate score.", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> },
              { step: "02", title: "AI Rates", desc: "AI identifies your car to the trim. Scores across 5 axes. No participation trophies.", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> },
              { step: "03", title: "Compete", desc: "Climb the leaderboard. Progress through leagues. Embed your score. Mog on everyone.", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
            ].map((item) => (
              <div key={item.step} className="group p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-blue-500 p-2.5 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors">{item.icon}</div>
                  <span className="text-[10px] font-black text-blue-500/40 tracking-wider">{item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-[#0f172a] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SCORING SYSTEM ===== */}
      <section id="scoring" className="py-20 sm:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] block mb-3">Rating System</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a]">5 axes. <span className="text-blue-500">No mercy.</span></h2>
            <p className="text-gray-500 mt-3 max-w-md mx-auto text-sm">Each axis is scored 0-100 by AI. The CarMog Score is the weighted average.</p>
          </div>

          <div className="space-y-3">
            {[
              { name: "Aura", weight: "25%", desc: "Presence, stance, proportions", color: "#8B5CF6" },
              { name: "Larp", weight: "20%", desc: "Authenticity — real parts or all show?", color: "#10B981" },
              { name: "Money", weight: "20%", desc: "Build value, parts quality", color: "#3B82F6" },
              { name: "Demand", weight: "20%", desc: "Market desirability", color: "#F59E0B" },
              { name: "Hype", weight: "15%", desc: "Social media viral potential", color: "#EC4899" },
            ].map((axis) => (
              <div key={axis.name} className="group flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-[#f8fafc] border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: axis.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-sm font-black" style={{ color: axis.color }}>{axis.name}</h3>
                    <span className="text-[10px] text-gray-400">{axis.weight}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{axis.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LEADERBOARD ===== */}
      <section id="leaderboard" className="py-20 sm:py-24 bg-[#f8fafc]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] block mb-3">Global Rankings</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a]">Live <span className="text-blue-500">Leaderboard</span></h2>
            <p className="text-gray-500 mt-3 text-sm">The highest rated cars. Updated in real time.</p>
          </div>

          {leaderboard.length > 0 ? (
            <div className="space-y-2">
              {leaderboard.map((entry, i) => {
                const rank = i + 1;
                const score = Number(entry.carmog_score);
                const color = getScoreColor(score);
                return (
                  <div key={entry.id} className="group flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0" style={{
                      background: rank === 1 ? "linear-gradient(135deg, #F59E0B, #D97706)" : rank === 2 ? "linear-gradient(135deg, #94A3B8, #64748B)" : rank === 3 ? "linear-gradient(135deg, #CD7F32, #A0522D)" : "#f1f5f9",
                      color: rank <= 3 ? "#fff" : "#64748b",
                    }}>{rank}</div>
                    <div className="w-12 h-9 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      {entry.images?.[0] && <img src={entry.images[0]} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-[#0f172a] truncate">{entry.year} {entry.brand} {entry.model}</p>
                      <span className="text-[10px] text-gray-400">@{entry.username}</span>
                    </div>
                    <p className="text-lg font-black tabular-nums" style={{ color }}>{score}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-14 rounded-2xl bg-white border border-gray-100">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" className="mx-auto mb-3">
                <path d="M6 9H4.5a2.5 2.5 0 010-5C7 4 7 7 7 7"/><path d="M18 9h1.5a2.5 2.5 0 000-5C17 4 17 7 17 7"/><path d="M4 22h16"/><path d="M18 2H6v7a6 6 0 0012 0V2z"/>
              </svg>
              <h3 className="text-base font-bold text-[#0f172a] mb-1.5">No cars rated yet</h3>
              <p className="text-sm text-gray-400 mb-5">Be the first to claim the top spot.</p>
              <Link href="/rate" className="inline-block px-6 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 active:scale-[0.97] transition-all duration-200">Upload Your Car</Link>
            </div>
          )}
        </div>
      </section>

      {/* ===== LEAGUES ===== */}
      <section id="leagues" className="py-20 sm:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] block mb-3">Progression</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a]">Climb the <span className="text-blue-500">ranks</span></h2>
            <p className="text-gray-500 mt-3 text-sm">6 leagues, 3 divisions each. Seasonal resets every 3 months.</p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 max-w-2xl mx-auto">
            {LEAGUES.map((league) => (
              <div key={league.name} className="group text-center p-3 rounded-2xl bg-[#f8fafc] border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-center mb-2">
                  <LeagueBadge league={league.name} size="lg" showLabel={false} />
                </div>
                <h3 className="font-bold text-[11px]" style={{ color: league.color }}>{league.display}</h3>
                <p className="text-[9px] text-gray-400 mt-0.5">{league.min.toLocaleString()}+ XP</p>
              </div>
            ))}
          </div>

          {/* XP sources */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {[
              { action: "Upload a car", xp: "+50 XP" },
              { action: "Profile views", xp: "+1/view" },
              { action: "Top 10 spot", xp: "+100/day" },
              { action: "Embed clicks", xp: "+5/click" },
            ].map((item) => (
              <div key={item.action} className="p-3 rounded-xl bg-[#f8fafc] border border-gray-100 hover:shadow-sm transition-all duration-200">
                <p className="text-xs font-bold text-[#0f172a]">{item.action}</p>
                <p className="text-[10px] font-bold text-blue-500 mt-0.5">{item.xp}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="py-20 sm:py-24 bg-[#f8fafc]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] block mb-3">Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a]">Choose your <span className="text-blue-500">tier</span></h2>
            <p className="text-gray-500 mt-3 text-sm">Start free. Upgrade when you need more.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 items-start">
            {[
              { name: "Free", price: "$0", period: "/mo", highlight: false, features: ["1 active car profile", "3 analyses/month", "Public CarMog page", "Basic score", "Share card with watermark", "7-day analytics", "Instagram bio link"] },
              { name: "Pro", price: "$15", period: "/mo", highlight: true, features: ["5 active car profiles", "30 analyses/month", "No watermark", "Full metric breakdown", "Full leaderboard access", "Compare mode", "90-day analytics", "Profile customization", "Priority processing"] },
              { name: "Elite", price: "$39", period: "/mo", highlight: false, features: ["Unlimited car profiles", "100 analyses/month", "Verified badge", "Advanced analytics", "Media kit exports", "Featured placement", "API access (coming soon)", "Priority support"] },
            ].map((tier) => (
              <div key={tier.name} className={`rounded-2xl p-6 border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${tier.highlight ? "bg-white border-blue-500 ring-1 ring-blue-500 shadow-md" : "bg-white border-gray-100"}`}>
                {tier.highlight && <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-2">Most Popular</span>}
                <h3 className="text-lg font-black text-[#0f172a]">{tier.name}</h3>
                <div className="mt-2 mb-5">
                  <span className="text-3xl font-black text-[#0f172a]">{tier.price}</span>
                  <span className="text-sm text-gray-400">{tier.period}</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-500">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={tier.highlight ? "#3b82f6" : "#94a3b8"} strokeWidth="2" className="mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={tier.price === "$0" ? "/rate" : "/pricing"} className={`block w-full py-2.5 rounded-xl font-bold text-sm text-center active:scale-[0.97] transition-all duration-200 ${tier.highlight ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-[#f8fafc] text-[#0f172a] hover:bg-gray-100 border border-gray-200"}`}>
                  {tier.price === "$0" ? "Get Started Free" : `Upgrade to ${tier.name}`}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-24 sm:py-28 bg-white">
        <div className="max-w-2xl mx-auto text-center px-6">
          <h2 className="text-3xl sm:text-5xl font-black text-[#0f172a] mb-4 leading-tight">
            Ready to find out<br />if your car <span className="text-blue-500">mogs?</span>
          </h2>
          <p className="text-gray-500 mb-8">Upload your car. Face the truth. No participation trophies.</p>
          <Link href="/rate" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-blue-500 text-white text-lg font-bold hover:bg-blue-600 hover:scale-[1.03] active:scale-[0.97] shadow-lg shadow-blue-500/20 transition-all duration-300">
            Get Your CarMog Score
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
