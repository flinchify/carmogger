"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getScoreColor } from "@/lib/ai-scoring";
import Link from "next/link";

interface Car { id: number; brand: string; model: string; year: number; carmog_score: number; images: string[]; username: string; }
interface Stats { totalCars: number; totalUsers: number; totalViews: number; avgScore: number; }

/* Container — 1100px centered, used everywhere */
function C({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`w-full max-w-[1100px] mx-auto px-6 ${className}`}>{children}</div>;
}

export default function Home() {
  const [featured, setFeatured] = useState<Car[]>([]);
  const [stats, setStats] = useState<Stats>({ totalCars: 0, totalUsers: 0, totalViews: 0, avgScore: 0 });
  const [leaderboard, setLeaderboard] = useState<Car[]>([]);
  const [lbSort, setLbSort] = useState<"score" | "views">("score");
  const [faq, setFaq] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/featured").then(r => r.json()).then(d => setFeatured(d.cars || [])).catch(() => {});
    fetch("/api/stats").then(r => r.json()).then(d => setStats(d)).catch(() => {});
    fetch("/api/leaderboard?sort=score&limit=8").then(r => r.json()).then(d => setLeaderboard(d.entries || d || [])).catch(() => {});
  }, []);

  const hasData = stats.totalCars > 0;
  const hasFeatured = featured.length > 0;
  const hasLb = leaderboard.length > 0;
  const sortedLb = [...leaderboard].sort((a, b) => lbSort === "score" ? Number(b.carmog_score) - Number(a.carmog_score) : 0);

  /* Shared card style */
  const card = "rounded-xl bg-[#111114] border border-white/[0.07] p-5 hover:border-white/[0.14] transition-colors duration-150";

  return (
    <div className="w-full min-h-screen">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="w-full pt-28 pb-16 sm:pt-36 sm:pb-20">
        <C>
          <div className="text-center mx-auto" style={{ maxWidth: 680 }}>
            <p className="fade-up d1 mono text-[12px] text-blue-500 mb-5">AI-Powered Car Ratings</p>
            <h1 className="fade-up d2 text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-white leading-[1.05]">
              Upload your car.<br />
              <span className="text-zinc-500">Get your mog score.</span>
            </h1>
            <p className="fade-up d3 mt-5 text-[15px] text-zinc-400 leading-relaxed mx-auto" style={{ maxWidth: 480 }}>
              CarMogger rates your car across 5 axes using Gemini AI. Get your score, climb the leaderboard, flex on everyone.
            </p>
            <div className="fade-up d4 mt-8 flex items-center justify-center gap-3 flex-wrap">
              <Link href="/rate" className="inline-flex items-center justify-center h-10 px-5 rounded-lg bg-blue-500 text-white text-[14px] font-medium hover:bg-blue-600 active:scale-[0.98] transition-all">Upload Your Car</Link>
              <a href="#how-it-works" className="inline-flex items-center justify-center h-10 px-5 rounded-lg border border-white/[0.1] text-[14px] text-zinc-400 hover:text-white hover:border-white/[0.2] transition-all">Learn More</a>
            </div>
            <p className="fade-up d5 mt-4 mono text-[11px] text-zinc-600">Free to start &middot; No credit card required</p>
          </div>

          {/* Terminal-style product demo */}
          <div className="fade-up d6 mt-14 rounded-xl bg-[#111114] border border-white/[0.07] overflow-hidden mx-auto" style={{ maxWidth: 820 }}>
            {/* Window bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.07]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1" />
              <div className="flex gap-1">
                {["Upload", "Analyze", "Score"].map((tab, i) => (
                  <span key={tab} className={`mono text-[10px] px-2.5 py-1 rounded-md ${i === 2 ? "bg-blue-500/10 text-blue-400" : "text-zinc-600"}`}>{tab}</span>
                ))}
              </div>
            </div>
            {/* Content */}
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
                <div className="sm:w-1/2">
                  {hasFeatured && featured[0].images?.[0] ? (
                    <div className="aspect-[16/10] rounded-lg overflow-hidden bg-[#19191d]">
                      <img src={featured[0].images[0]} alt={`${featured[0].brand} ${featured[0].model}`} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-[16/10] rounded-lg bg-[#19191d] border border-white/[0.07] flex items-center justify-center">
                      <div className="text-center">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="1.5" className="mx-auto mb-2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        <p className="mono text-[11px] text-zinc-600">Upload a car to see it here</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="sm:w-1/2 flex flex-col justify-center">
                  {hasFeatured ? (
                    <>
                      <p className="mono text-[11px] text-zinc-500 mb-1">{featured[0].year} {featured[0].brand} {featured[0].model}</p>
                      <p className="text-[40px] font-extrabold text-white leading-none">{Number(featured[0].carmog_score)}<span className="text-[14px] text-zinc-500 font-normal ml-1">/ 100</span></p>
                    </>
                  ) : (
                    <>
                      <p className="mono text-[11px] text-zinc-600 mb-1">carmog_score</p>
                      <p className="text-[40px] font-extrabold text-zinc-600 leading-none">--<span className="text-[14px] font-normal ml-1">/ 100</span></p>
                    </>
                  )}
                  <div className="mt-5 space-y-2.5">
                    {[
                      { l: "Aura", c: "#8B5CF6", w: "25%" },
                      { l: "Larp", c: "#10B981", w: "20%" },
                      { l: "Money", c: "#3B82F6", w: "20%" },
                      { l: "Demand", c: "#F59E0B", w: "20%" },
                      { l: "Hype", c: "#EC4899", w: "15%" },
                    ].map(a => (
                      <div key={a.l} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: a.c }} />
                        <span className="mono text-[11px] text-zinc-400 w-14">{a.l}</span>
                        <div className="flex-1 h-1 rounded-full bg-[#19191d] overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: "0%", background: a.c }} />
                        </div>
                        <span className="mono text-[10px] text-zinc-600 w-7 text-right">{a.w}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </C>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="w-full py-20 sm:py-24">
        <C>
          <p className="mono text-[11px] text-blue-500 uppercase tracking-[0.12em] mb-4">[ How it works ]</p>
          <h2 className="text-[28px] sm:text-[36px] font-extrabold text-white mb-10">Upload. Rate. Compete.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>, title: "Upload Photos", desc: "Drop 1-4 images. Front, rear, side, interior." },
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>, title: "AI Identifies", desc: "Gemini detects make, model, year, trim, mods." },
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>, title: "5-Axis Score", desc: "Aura, Larp, Money, Demand, Hype. 0-100 each." },
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 9H4.5a2.5 2.5 0 010-5C7 4 7 7 7 7"/><path d="M18 9h1.5a2.5 2.5 0 000-5C17 4 17 7 17 7"/><path d="M4 22h16"/><path d="M18 2H6v7a6 6 0 0012 0V2z"/></svg>, title: "Compete", desc: "Leaderboard, XP, 6 leagues, seasonal resets." },
            ].map(item => (
              <div key={item.title} className={card}>
                <div className="text-blue-500 mb-3">{item.icon}</div>
                <h3 className="text-[14px] font-semibold text-white mb-1.5">{item.title}</h3>
                <p className="text-[13px] text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </C>
      </section>

      {/* ===== SCORING ===== */}
      <section id="scoring" className="w-full py-20 sm:py-24">
        <C>
          <p className="mono text-[11px] text-blue-500 uppercase tracking-[0.12em] mb-4">[ Scoring system ]</p>
          <h2 className="text-[28px] sm:text-[36px] font-extrabold text-white mb-3">5 axes. No mercy.</h2>
          <p className="text-[14px] text-zinc-500 mb-10" style={{ maxWidth: 460 }}>Each axis scored 0-100 by Gemini AI. The CarMog Score is the weighted average.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { name: "Aura", w: "25%", desc: "Presence, stance, proportions", color: "#8B5CF6" },
              { name: "Larp", w: "20%", desc: "Authenticity vs. fake parts", color: "#10B981" },
              { name: "Money", w: "20%", desc: "Build value, parts quality", color: "#3B82F6" },
              { name: "Demand", w: "20%", desc: "Market desirability", color: "#F59E0B" },
              { name: "Hype", w: "15%", desc: "Social / viral potential", color: "#EC4899" },
            ].map(a => (
              <div key={a.name} className={card}>
                <div className="w-2 h-2 rounded-full mb-3" style={{ background: a.color }} />
                <h3 className="text-[14px] font-semibold text-white">{a.name}</h3>
                <p className="mono text-[10px] text-zinc-600 mt-0.5">{a.w}</p>
                <p className="text-[13px] text-zinc-500 mt-2 leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </C>
      </section>

      {/* ===== METRICS ===== */}
      {hasData && (
        <section className="w-full py-20 sm:py-24">
          <C>
            <p className="mono text-[11px] text-blue-500 uppercase tracking-[0.12em] mb-4">[ By the numbers ]</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-2">
              {[
                { v: stats.totalCars, l: "Cars Rated" },
                { v: stats.totalUsers, l: "Active Users" },
                { v: stats.totalViews, l: "Total Views" },
                { v: stats.avgScore, l: "Avg Score" },
              ].filter(s => s.v > 0).map(s => (
                <div key={s.l}>
                  <p className="text-[36px] font-extrabold text-white tracking-tight">{s.v.toLocaleString()}</p>
                  <p className="text-[13px] text-zinc-500 mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          </C>
        </section>
      )}

      {/* ===== FEATURED ===== */}
      {hasFeatured && (
        <section className="w-full py-20 sm:py-24">
          <C>
            <p className="mono text-[11px] text-blue-500 uppercase tracking-[0.12em] mb-4">[ Featured ]</p>
            <h2 className="text-[28px] sm:text-[36px] font-extrabold text-white mb-10">Top builds.</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {featured.slice(0, 8).map(car => (
                <Link href={`/u/${car.username}`} key={car.id} className="group rounded-xl bg-[#111114] border border-white/[0.07] overflow-hidden hover:border-white/[0.14] transition-colors">
                  <div className="aspect-[4/3] overflow-hidden">
                    {car.images?.[0] ? <img src={car.images[0]} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" /> : <div className="w-full h-full bg-[#19191d]" />}
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium text-white truncate">{car.year} {car.brand} {car.model}</p>
                      <p className="mono text-[10px] text-zinc-600">@{car.username}</p>
                    </div>
                    <span className="text-[13px] font-bold tabular-nums shrink-0 ml-2" style={{ color: getScoreColor(Number(car.carmog_score)) }}>{Number(car.carmog_score)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </C>
        </section>
      )}

      {/* ===== LEADERBOARD ===== */}
      <section id="leaderboard" className="w-full py-20 sm:py-24">
        <C>
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <p className="mono text-[11px] text-blue-500 uppercase tracking-[0.12em] mb-4">[ Leaderboard ]</p>
              <h2 className="text-[28px] sm:text-[36px] font-extrabold text-white">Top rated.</h2>
            </div>
            <div className="flex gap-1 rounded-lg bg-[#111114] border border-white/[0.07] p-0.5">
              {(["score", "views"] as const).map(s => (
                <button key={s} onClick={() => setLbSort(s)} className={`mono text-[11px] px-3 py-1.5 rounded-md transition-colors ${lbSort === s ? "bg-blue-500/10 text-blue-400" : "text-zinc-600 hover:text-white"}`}>
                  {s === "score" ? "By Score" : "By Views"}
                </button>
              ))}
            </div>
          </div>
          {hasLb ? (
            <div className="space-y-1.5">
              {sortedLb.map((entry, i) => {
                const score = Number(entry.carmog_score);
                return (
                  <div key={entry.id} className="flex items-center gap-4 h-12 px-4 rounded-xl bg-[#111114] border border-white/[0.07] hover:border-white/[0.14] transition-colors">
                    <span className="mono text-[11px] text-zinc-600 w-4 text-right">{i + 1}</span>
                    <div className="w-8 h-6 rounded overflow-hidden shrink-0 bg-[#19191d]">
                      {entry.images?.[0] && <img src={entry.images[0]} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <p className="text-[13px] font-medium text-white flex-1 min-w-0 truncate">{entry.year} {entry.brand} {entry.model}</p>
                    <span className="mono text-[11px] text-zinc-600 hidden sm:block">@{entry.username}</span>
                    <span className="text-[14px] font-bold tabular-nums ml-2" style={{ color: getScoreColor(score) }}>{score}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={`${card} text-center py-12`}>
              <p className="text-[13px] text-zinc-500 mb-4">No cars rated yet. Be the first.</p>
              <Link href="/rate" className="inline-flex items-center justify-center h-10 px-5 rounded-lg bg-blue-500 text-white text-[14px] font-medium hover:bg-blue-600 transition-colors">Upload Your Car</Link>
            </div>
          )}
        </C>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="w-full py-20 sm:py-24">
        <C>
          <p className="mono text-[11px] text-blue-500 uppercase tracking-[0.12em] mb-4">[ Pricing ]</p>
          <h2 className="text-[28px] sm:text-[36px] font-extrabold text-white mb-3">Simple pricing.</h2>
          <p className="text-[14px] text-zinc-500 mb-10">Start free. Upgrade when you need more.</p>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { name: "Free", price: "$0", pop: false, cta: "Get Started", href: "/rate", features: ["1 car profile", "3 analyses/month", "Public page", "Watermarked share card", "7-day analytics"] },
              { name: "Pro", price: "$15", pop: true, cta: "Upgrade to Pro", href: "/pricing", features: ["5 car profiles", "30 analyses/month", "No watermark", "Full breakdown", "Compare mode", "90-day analytics", "Profile themes", "Priority processing"] },
              { name: "Elite", price: "$39", pop: false, cta: "Upgrade to Elite", href: "/pricing", features: ["Unlimited profiles", "100 analyses/month", "Verified badge", "Advanced analytics", "Media kit exports", "Featured placement", "API access", "Priority support"] },
            ].map(t => (
              <div key={t.name} className={`rounded-xl border p-5 transition-colors ${t.pop ? "bg-[#111114] border-blue-500/20" : "bg-[#111114] border-white/[0.07] hover:border-white/[0.14]"}`}>
                {t.pop && <p className="mono text-[10px] text-blue-400 uppercase tracking-wider mb-2">Most Popular</p>}
                <p className="text-[15px] font-semibold text-white">{t.name}</p>
                <div className="mt-2 mb-5">
                  <span className="text-[28px] font-extrabold text-white">{t.price}</span>
                  <span className="text-[13px] text-zinc-600">/mo</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {t.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-[13px] text-zinc-500">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.pop ? "#3b82f6" : "#52525b"} strokeWidth="2" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={t.href} className={`flex items-center justify-center w-full h-9 rounded-lg text-[13px] font-medium transition-all active:scale-[0.98] ${t.pop ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-[#19191d] text-zinc-400 border border-white/[0.07] hover:border-white/[0.14]"}`}>
                  {t.cta}
                </Link>
              </div>
            ))}
          </div>
        </C>
      </section>

      {/* ===== FAQ ===== */}
      <section className="w-full py-20 sm:py-24">
        <C>
          <p className="mono text-[11px] text-blue-500 uppercase tracking-[0.12em] mb-4">[ FAQ ]</p>
          <h2 className="text-[28px] sm:text-[36px] font-extrabold text-white mb-10 leading-tight">
            Frequently asked<br />questions.
          </h2>
          <div className="border-t border-white/[0.07]" style={{ maxWidth: 680 }}>
            {[
              { q: "What is CarMogger?", a: "An AI-powered car rating platform. Upload photos and get scored across 5 axes: Aura, Larp, Money, Demand, and Hype." },
              { q: "How does the scoring work?", a: "Gemini AI analyzes your photos, identifies the car, and scores each axis 0-100 using a consistent rubric. The CarMog Score is the weighted average." },
              { q: "Is it free?", a: "Free accounts get 3 analyses per month and 1 car profile. Upgrade to Pro or Elite for more." },
              { q: "What are leagues?", a: "A progression system. Earn XP by uploading, getting views, and ranking. 6 leagues, 3 divisions each, with seasonal resets." },
              { q: "Can I share my score?", a: "Every car gets a shareable score card and public profile. Pro users get watermark-free cards." },
            ].map((item, i) => (
              <div key={i} className="border-b border-white/[0.07]">
                <button onClick={() => setFaq(faq === i ? null : i)} className="w-full py-4 flex items-center justify-between text-left group">
                  <span className="text-[14px] font-medium text-white group-hover:text-zinc-400 transition-colors pr-4">{item.q}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="2" className={`shrink-0 transition-transform duration-200 ${faq === i ? "rotate-45" : ""}`}><path d="M12 5v14M5 12h14"/></svg>
                </button>
                <div className={`overflow-hidden transition-all duration-200 ${faq === i ? "max-h-40 pb-4" : "max-h-0"}`}>
                  <p className="text-[13px] text-zinc-500 leading-relaxed">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </C>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="w-full py-20 sm:py-24">
        <C className="text-center">
          <h2 className="text-[28px] sm:text-[36px] font-extrabold text-white mb-3">Get started in seconds</h2>
          <p className="text-[14px] text-zinc-500 mb-6">Upload your car and get your CarMog Score.</p>
          <Link href="/rate" className="inline-flex items-center justify-center h-10 px-5 rounded-lg bg-blue-500 text-white text-[14px] font-medium hover:bg-blue-600 active:scale-[0.98] transition-all">Upload Your Car</Link>
        </C>
      </section>

      <Footer />
    </div>
  );
}
