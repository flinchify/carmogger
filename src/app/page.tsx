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

export default function Home() {
  const [featured, setFeatured] = useState<FeaturedCar[]>([]);
  const [stats, setStats] = useState<Stats>({ totalCars: 0, totalUsers: 0, totalViews: 0, avgScore: 0 });
  const [leaderboard, setLeaderboard] = useState<FeaturedCar[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/featured").then(r => r.json()).then(d => setFeatured(d.cars || [])).catch(() => {});
    fetch("/api/stats").then(r => r.json()).then(d => setStats(d)).catch(() => {});
    fetch("/api/leaderboard?sort=score&limit=8").then(r => r.json()).then(d => setLeaderboard(d.entries || d || [])).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28">
        {/* Subtle grid background */}
        <div className="absolute inset-0 grid-bg opacity-50" />
        {/* Blue glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/[0.07] rounded-full blur-[120px]" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="fade-up fade-up-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/[0.06] bg-white/[0.03] mb-8">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            <span className="text-xs text-zinc-400">Powered by Gemini AI</span>
          </div>

          {/* Headline */}
          <h1 className="fade-up fade-up-2 text-5xl sm:text-7xl lg:text-[80px] font-black text-white leading-[0.95] tracking-tight">
            AI Car Ratings<br />
            <span className="text-zinc-500">for Car Enthusiasts</span>
          </h1>

          {/* Subhead */}
          <p className="fade-up fade-up-3 mt-6 text-base sm:text-lg text-zinc-500 max-w-lg mx-auto leading-relaxed">
            CarMogger rates your car across 5 brutal axes using AI. Upload photos, get your score, and compete on the global leaderboard.
          </p>

          {/* CTAs */}
          <div className="fade-up fade-up-4 mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/rate" className="px-6 py-3 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-200 active:scale-[0.98] transition-all duration-200">
              Upload Your Car
            </Link>
            <a href="#how-it-works" className="px-6 py-3 rounded-lg border border-white/[0.1] text-sm text-zinc-400 hover:text-white hover:border-white/[0.2] transition-all duration-200">
              How it Works
            </a>
          </div>

          {/* No credit card note */}
          <p className="fade-up fade-up-5 mt-4 text-xs text-zinc-600">Free to start. No credit card required.</p>
        </div>
      </section>

      {/* ===== FEATURED CARS GRID ===== */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {featured.length > 0
              ? featured.slice(0, 8).map((car) => {
                  const color = getScoreColor(Number(car.carmog_score));
                  return (
                    <Link href={`/u/${car.username}`} key={car.id} className="group relative aspect-[4/5] rounded-xl overflow-hidden bg-[#111113] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300">
                      {car.images?.[0] ? (
                        <img src={car.images[0]} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                      ) : (
                        <div className="w-full h-full bg-[#111113]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-[11px] font-bold text-white truncate">{car.year} {car.brand} {car.model}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-zinc-400">@{car.username}</span>
                          <span className="text-xs font-black" style={{ color }}>{Number(car.carmog_score)}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })
              : Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[4/5] rounded-xl bg-[#111113] border border-white/[0.06]" />
                ))}
          </div>
        </div>
      </section>

      {/* ===== WHAT WE OFFER — Feature grid ===== */}
      <section id="how-it-works" className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-14">
            <span className="text-xs text-zinc-500 font-mono">[ How it works ]</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white leading-tight">
              Upload your car.<br />
              <span className="text-zinc-500">Get rated by AI.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { title: "Upload Photos", desc: "Drop 1-4 images. Front, side, interior, engine bay." },
              { title: "AI Identifies", desc: "Gemini detects make, model, year, trim, and mods." },
              { title: "5-Axis Score", desc: "Rated on Aura, Larp, Money, Demand, and Hype." },
              { title: "Compete", desc: "Climb the leaderboard. Earn XP. Progress through leagues." },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-xl bg-[#111113] border border-white/[0.06] hover:border-white/[0.12] hover:bg-[#18181b] transition-all duration-300">
                <h3 className="text-sm font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SCORING AXES ===== */}
      <section id="scoring" className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-14">
            <span className="text-xs text-zinc-500 font-mono">[ Scoring system ]</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white leading-tight">
              5 axes. No mercy.
            </h2>
            <p className="text-zinc-500 mt-3 text-sm max-w-md">Each axis is scored 0-100 by Gemini AI. The CarMog Score is the weighted average.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { name: "Aura", weight: "25%", desc: "Presence, stance, proportions", color: "#8B5CF6" },
              { name: "Larp", weight: "20%", desc: "Authenticity vs fake parts", color: "#10B981" },
              { name: "Money", weight: "20%", desc: "Build value, parts quality", color: "#3B82F6" },
              { name: "Demand", weight: "20%", desc: "Market desirability", color: "#F59E0B" },
              { name: "Hype", weight: "15%", desc: "Viral / social potential", color: "#EC4899" },
            ].map((axis) => (
              <div key={axis.name} className="p-5 rounded-xl bg-[#111113] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300">
                <div className="w-2 h-2 rounded-full mb-3" style={{ background: axis.color }} />
                <h3 className="text-sm font-bold text-white">{axis.name}</h3>
                <span className="text-[10px] text-zinc-600 font-mono">{axis.weight}</span>
                <p className="text-xs text-zinc-500 mt-2 leading-relaxed">{axis.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BY THE NUMBERS ===== */}
      <section className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-14">
            <span className="text-xs text-zinc-500 font-mono">[ By the numbers ]</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">Built for scale.</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: stats.totalCars || "0", label: "Cars rated", sub: "And counting." },
              { value: stats.totalUsers || "0", label: "Active Users", sub: "Car enthusiasts worldwide." },
              { value: stats.totalViews || "0", label: "Total Views", sub: "Profiles viewed globally." },
              { value: stats.avgScore || "0", label: "Avg Score", sub: "The AI doesn't go easy." },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-4xl sm:text-5xl font-black text-white tracking-tight">{typeof item.value === "number" ? item.value.toLocaleString() : item.value}</p>
                <p className="text-sm font-semibold text-white mt-2">{item.label}</p>
                <p className="text-sm text-zinc-500 mt-1">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LEADERBOARD ===== */}
      <section id="leaderboard" className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-14">
            <span className="text-xs text-zinc-500 font-mono">[ Leaderboard ]</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">Top rated cars.</h2>
            <p className="text-zinc-500 mt-3 text-sm">Updated in real time.</p>
          </div>

          {leaderboard.length > 0 ? (
            <div className="space-y-2">
              {leaderboard.map((entry, i) => {
                const rank = i + 1;
                const score = Number(entry.carmog_score);
                const color = getScoreColor(score);
                return (
                  <div key={entry.id} className="group flex items-center gap-4 p-4 rounded-xl bg-[#111113] border border-white/[0.06] hover:border-white/[0.12] hover:bg-[#18181b] transition-all duration-300">
                    <span className="w-6 text-center text-xs font-bold text-zinc-600">{rank}</span>
                    <div className="w-10 h-8 rounded-md overflow-hidden shrink-0 bg-zinc-800">
                      {entry.images?.[0] && <img src={entry.images[0]} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{entry.year} {entry.brand} {entry.model}</p>
                      <span className="text-xs text-zinc-600">@{entry.username}</span>
                    </div>
                    <span className="text-lg font-black tabular-nums" style={{ color }}>{score}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 rounded-xl bg-[#111113] border border-white/[0.06]">
              <p className="text-sm text-zinc-500 mb-4">No cars rated yet. Be the first.</p>
              <Link href="/rate" className="inline-block px-5 py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-colors">Upload Your Car</Link>
            </div>
          )}
        </div>
      </section>

      {/* ===== LEAGUES ===== */}
      <section id="leagues" className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-14">
            <span className="text-xs text-zinc-500 font-mono">[ Leagues ]</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">Climb the ranks.</h2>
            <p className="text-zinc-500 mt-3 text-sm">6 leagues. 3 divisions each. Seasonal resets every 3 months.</p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {LEAGUES.map((league) => (
              <div key={league.name} className="p-4 rounded-xl bg-[#111113] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 text-center">
                <div className="flex items-center justify-center mb-2">
                  <LeagueBadge league={league.name} size="lg" showLabel={false} />
                </div>
                <h3 className="text-xs font-bold" style={{ color: league.color }}>{league.display}</h3>
                <p className="text-[9px] text-zinc-600 mt-0.5 font-mono">{league.min.toLocaleString()}+ XP</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-14">
            <span className="text-xs text-zinc-500 font-mono">[ Pricing ]</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">Simple pricing.</h2>
            <p className="text-zinc-500 mt-3 text-sm">Start free. Upgrade when you need more.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-3 items-start">
            {[
              { name: "Free", price: "$0", period: "/mo", highlight: false, features: ["1 car profile", "3 analyses/month", "Public CarMog page", "Basic score", "Watermarked share card", "7-day analytics"] },
              { name: "Pro", price: "$15", period: "/mo", highlight: true, features: ["5 car profiles", "30 analyses/month", "No watermark", "Full metric breakdown", "Compare mode", "90-day analytics", "Profile customization", "Priority processing"] },
              { name: "Elite", price: "$39", period: "/mo", highlight: false, features: ["Unlimited profiles", "100 analyses/month", "Verified badge", "Advanced analytics", "Media kit exports", "Featured placement", "API access", "Priority support"] },
            ].map((tier) => (
              <div key={tier.name} className={`rounded-xl p-6 border transition-all duration-300 ${tier.highlight ? "bg-[#111113] border-blue-500/30 ring-1 ring-blue-500/20" : "bg-[#111113] border-white/[0.06] hover:border-white/[0.12]"}`}>
                {tier.highlight && <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">Most Popular</span>}
                <h3 className="text-lg font-bold text-white mt-1">{tier.name}</h3>
                <div className="mt-2 mb-5">
                  <span className="text-3xl font-black text-white">{tier.price}</span>
                  <span className="text-sm text-zinc-600">{tier.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-zinc-500">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={tier.highlight ? "#3b82f6" : "#3f3f46"} strokeWidth="2" className="mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={tier.price === "$0" ? "/rate" : "/pricing"} className={`block w-full py-2.5 rounded-lg text-sm font-semibold text-center transition-all duration-200 active:scale-[0.98] ${tier.highlight ? "bg-white text-black hover:bg-zinc-200" : "bg-white/[0.04] text-zinc-300 border border-white/[0.06] hover:bg-white/[0.08]"}`}>
                  {tier.price === "$0" ? "Get Started" : `Upgrade to ${tier.name}`}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-14">
            <span className="text-xs text-zinc-500 font-mono">[ FAQ ]</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white leading-tight">
              Frequently asked<br />questions.
            </h2>
          </div>

          <div className="space-y-0 border-t border-white/[0.06]">
            {[
              { q: "What is CarMogger?", a: "CarMogger is an AI-powered car rating platform. Upload photos of your car and our AI rates it across 5 axes: Aura, Larp, Money, Demand, and Hype. Your CarMog Score is the weighted average." },
              { q: "How does the AI scoring work?", a: "We use Gemini AI to analyze your car photos. It identifies the make, model, year, and modifications, then scores each axis 0-100 based on a consistent rubric. No human bias." },
              { q: "Is it free?", a: "Yes. Free accounts get 3 analyses per month and 1 car profile. Upgrade to Pro or Elite for more analyses, profiles, and features." },
              { q: "What are leagues?", a: "Leagues are our progression system. Earn XP by uploading cars, getting views, and ranking on the leaderboard. 6 leagues, 3 divisions each, with seasonal resets every 3 months." },
              { q: "Can I share my score?", a: "Yes. Every car gets a shareable score card and a public profile page. Pro users get watermark-free cards and custom profile themes." },
              { q: "How do I climb the leaderboard?", a: "Upload cars with high scores. The leaderboard ranks by CarMog Score. Top 10 earns bonus XP daily. Upload multiple cars to increase your chances." },
            ].map((item, i) => (
              <div key={i} className="border-b border-white/[0.06]">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full py-5 flex items-center justify-between text-left hover:text-zinc-300 transition-colors"
                >
                  <span className="text-sm font-semibold text-white pr-4">{item.q}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`shrink-0 text-zinc-500 transition-transform duration-300 ${openFaq === i ? "rotate-45" : ""}`}><path d="M12 5v14M5 12h14"/></svg>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-40 pb-5" : "max-h-0"}`}>
                  <p className="text-sm text-zinc-500 leading-relaxed">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">Get started in seconds</h2>
          <p className="text-zinc-500 mb-8 text-sm">Upload your car and get your CarMog Score.</p>
          <Link href="/rate" className="inline-block px-6 py-3 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-200 active:scale-[0.98] transition-all duration-200">
            Upload Your Car
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
