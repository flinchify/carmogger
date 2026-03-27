"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getScoreColor } from "@/lib/ai-scoring";
import Link from "next/link";

/* ===== TYPES ===== */
interface Car { id: number; brand: string; model: string; year: number; carmog_score: number; images: string[]; username: string; }
interface Stats { totalCars: number; totalUsers: number; totalViews: number; avgScore: number; }

/* ===== PRIMITIVES ===== */
function Wrap({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`w-full max-w-[var(--container)] mx-auto px-6 ${className}`}>{children}</div>;
}

function Section({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  return <section id={id} className={`w-full py-20 sm:py-24 ${className}`}><Wrap>{children}</Wrap></section>;
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mono text-[11px] text-[var(--accent)] uppercase tracking-[0.12em] mb-4">[ {children} ]</p>;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[var(--radius)] bg-[var(--surface)] border border-[var(--border)] p-5 hover:border-[var(--border-hover)] transition-colors duration-150 ${className}`}>{children}</div>;
}

function Btn({ href, children, primary = false }: { href: string; children: React.ReactNode; primary?: boolean }) {
  return (
    <Link href={href} className={`inline-flex items-center justify-center h-10 px-5 rounded-lg text-[14px] font-medium transition-all duration-150 active:scale-[0.98] ${primary ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]" : "border border-[var(--border)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--border-hover)]"}`}>
      {children}
    </Link>
  );
}

/* ===== ICONS ===== */
const Icons = {
  upload: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  scan: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  score: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  trophy: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 9H4.5a2.5 2.5 0 010-5C7 4 7 7 7 7"/><path d="M18 9h1.5a2.5 2.5 0 000-5C17 4 17 7 17 7"/><path d="M4 22h16"/><path d="M18 2H6v7a6 6 0 0012 0V2z"/></svg>,
  check: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>,
  checkMuted: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>,
  arrow: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
};

/* ===== PAGE ===== */
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

  const sortedLb = [...leaderboard].sort((a, b) =>
    lbSort === "score" ? Number(b.carmog_score) - Number(a.carmog_score) : 0
  );

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="w-full pt-28 pb-16 sm:pt-36 sm:pb-20">
        <Wrap>
          <div className="text-center max-w-[680px] mx-auto">
            <div className="fade-up d1">
              <p className="mono text-[12px] text-[var(--accent)] mb-5">AI-Powered Car Ratings</p>
            </div>
            <h1 className="fade-up d2 text-[36px] sm:text-[52px] font-extrabold text-white leading-[1.05]">
              Upload your car.<br />
              <span className="text-[var(--text-muted)]">Get your mog score.</span>
            </h1>
            <p className="fade-up d3 mt-5 text-[15px] text-[var(--text-secondary)] leading-relaxed max-w-[480px] mx-auto">
              CarMogger rates your car across 5 axes using Gemini AI. Get your score, climb the leaderboard, flex on everyone.
            </p>
            <div className="fade-up d4 mt-8 flex items-center justify-center gap-3 flex-wrap">
              <Btn href="/rate" primary>Upload Your Car</Btn>
              <Btn href="#how-it-works">Learn More</Btn>
            </div>
            <p className="fade-up d5 mt-4 mono text-[11px] text-[var(--text-muted)]">Free to start &middot; No credit card required</p>
          </div>

          {/* Hero product visual — terminal-style score card */}
          <div className="fade-up d6 mt-14 rounded-[var(--radius)] bg-[var(--surface)] border border-[var(--border)] overflow-hidden max-w-[800px] mx-auto">
            {/* Terminal header bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border)] bg-[var(--surface)]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1" />
              <div className="flex gap-0.5">
                {["Upload", "Analyze", "Score"].map((tab, i) => (
                  <span key={tab} className={`mono text-[10px] px-2.5 py-1 rounded-md ${i === 2 ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "text-[var(--text-muted)]"}`}>{tab}</span>
                ))}
              </div>
            </div>
            {/* Score card content */}
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
                {/* Left: car image */}
                <div className="sm:w-1/2">
                  {hasFeatured && featured[0].images?.[0] ? (
                    <div className="aspect-[16/10] rounded-lg overflow-hidden bg-[var(--surface-hover)]">
                      <img src={featured[0].images[0]} alt={`${featured[0].brand} ${featured[0].model}`} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-[16/10] rounded-lg bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-[var(--text-muted)] mx-auto mb-2">{Icons.upload}</div>
                        <p className="mono text-[11px] text-[var(--text-muted)]">Upload a car to see it here</p>
                      </div>
                    </div>
                  )}
                </div>
                {/* Right: score breakdown */}
                <div className="sm:w-1/2 flex flex-col justify-center">
                  {hasFeatured ? (
                    <>
                      <p className="mono text-[11px] text-[var(--text-muted)] mb-1">{featured[0].year} {featured[0].brand} {featured[0].model}</p>
                      <p className="text-[40px] font-extrabold text-white leading-none">{Number(featured[0].carmog_score)}<span className="text-[14px] text-[var(--text-muted)] font-normal ml-1">/ 100</span></p>
                    </>
                  ) : (
                    <>
                      <p className="mono text-[11px] text-[var(--text-muted)] mb-1">carmog_score</p>
                      <p className="text-[40px] font-extrabold text-[var(--text-muted)] leading-none">--<span className="text-[14px] font-normal ml-1">/ 100</span></p>
                    </>
                  )}
                  <div className="mt-5 space-y-2.5">
                    {[
                      { name: "aura", label: "Aura", color: "#8B5CF6", w: "25%" },
                      { name: "larp", label: "Larp", color: "#10B981", w: "20%" },
                      { name: "money", label: "Money", color: "#3B82F6", w: "20%" },
                      { name: "demand", label: "Demand", color: "#F59E0B", w: "20%" },
                      { name: "hype", label: "Hype", color: "#EC4899", w: "15%" },
                    ].map(a => (
                      <div key={a.name} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: a.color }} />
                        <span className="mono text-[11px] text-[var(--text-secondary)] w-14">{a.label}</span>
                        <div className="flex-1 h-1 rounded-full bg-[var(--surface-hover)] overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: "0%", background: a.color }} />
                        </div>
                        <span className="mono text-[10px] text-[var(--text-muted)] w-7 text-right">{a.w}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Wrap>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <Section id="how-it-works">
        <Label>How it works</Label>
        <h2 className="text-[28px] sm:text-[36px] font-extrabold text-white mb-10">Upload. Rate. Compete.</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: Icons.upload, title: "Upload Photos", desc: "Drop 1-4 images. Front, rear, side, interior." },
            { icon: Icons.scan, title: "AI Identifies", desc: "Gemini detects make, model, year, trim, mods." },
            { icon: Icons.score, title: "5-Axis Score", desc: "Aura, Larp, Money, Demand, Hype. 0-100 each." },
            { icon: Icons.trophy, title: "Compete", desc: "Leaderboard, XP, 6 leagues, seasonal resets." },
          ].map(item => (
            <Card key={item.title}>
              <div className="text-[var(--accent)] mb-3">{item.icon}</div>
              <h3 className="text-[14px] font-semibold text-white mb-1.5">{item.title}</h3>
              <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ===== SCORING ===== */}
      <Section id="scoring">
        <Label>Scoring system</Label>
        <h2 className="text-[28px] sm:text-[36px] font-extrabold text-white mb-3">5 axes. No mercy.</h2>
        <p className="text-[14px] text-[var(--text-muted)] mb-10 max-w-[460px]">Each axis scored 0-100 by Gemini AI. The CarMog Score is the weighted average.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { name: "Aura", w: "25%", desc: "Presence, stance, proportions", color: "#8B5CF6" },
            { name: "Larp", w: "20%", desc: "Authenticity vs. fake parts", color: "#10B981" },
            { name: "Money", w: "20%", desc: "Build value, parts quality", color: "#3B82F6" },
            { name: "Demand", w: "20%", desc: "Market desirability", color: "#F59E0B" },
            { name: "Hype", w: "15%", desc: "Social / viral potential", color: "#EC4899" },
          ].map(a => (
            <Card key={a.name}>
              <div className="w-2 h-2 rounded-full mb-3" style={{ background: a.color }} />
              <h3 className="text-[14px] font-semibold text-white">{a.name}</h3>
              <p className="mono text-[10px] text-[var(--text-muted)] mt-0.5">{a.w}</p>
              <p className="text-[13px] text-[var(--text-muted)] mt-2 leading-relaxed">{a.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ===== METRICS ===== */}
      {hasData && (
        <Section>
          <Label>By the numbers</Label>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-2">
            {[
              { v: stats.totalCars, l: "Cars Rated" },
              { v: stats.totalUsers, l: "Active Users" },
              { v: stats.totalViews, l: "Total Views" },
              { v: stats.avgScore, l: "Avg Score" },
            ].filter(s => s.v > 0).map(s => (
              <div key={s.l}>
                <p className="text-[36px] font-extrabold text-white tracking-tight">{s.v.toLocaleString()}</p>
                <p className="text-[13px] text-[var(--text-muted)] mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ===== FEATURED ===== */}
      {hasFeatured && (
        <Section>
          <Label>Featured</Label>
          <h2 className="text-[28px] sm:text-[36px] font-extrabold text-white mb-10">Top builds.</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {featured.slice(0, 8).map(car => (
              <Link href={`/u/${car.username}`} key={car.id} className="group rounded-[var(--radius)] bg-[var(--surface)] border border-[var(--border)] overflow-hidden hover:border-[var(--border-hover)] transition-colors">
                <div className="aspect-[4/3] overflow-hidden">
                  {car.images?.[0] ? <img src={car.images[0]} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" /> : <div className="w-full h-full bg-[var(--surface-hover)]" />}
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium text-white truncate">{car.year} {car.brand} {car.model}</p>
                    <p className="mono text-[10px] text-[var(--text-muted)]">@{car.username}</p>
                  </div>
                  <span className="text-[13px] font-bold tabular-nums shrink-0 ml-2" style={{ color: getScoreColor(Number(car.carmog_score)) }}>{Number(car.carmog_score)}</span>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* ===== LEADERBOARD ===== */}
      <Section id="leaderboard">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <Label>Leaderboard</Label>
            <h2 className="text-[28px] sm:text-[36px] font-extrabold text-white">Top rated.</h2>
          </div>
          {/* Filter tabs */}
          <div className="flex gap-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] p-0.5">
            {(["score", "views"] as const).map(s => (
              <button key={s} onClick={() => setLbSort(s)} className={`mono text-[11px] px-3 py-1.5 rounded-md transition-colors ${lbSort === s ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "text-[var(--text-muted)] hover:text-white"}`}>
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
                <div key={entry.id} className="flex items-center gap-4 h-12 px-4 rounded-[var(--radius)] bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-colors">
                  <span className="mono text-[11px] text-[var(--text-muted)] w-4 text-right">{i + 1}</span>
                  <div className="w-8 h-6 rounded overflow-hidden shrink-0 bg-[var(--surface-hover)]">
                    {entry.images?.[0] && <img src={entry.images[0]} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <p className="text-[13px] font-medium text-white flex-1 min-w-0 truncate">{entry.year} {entry.brand} {entry.model}</p>
                  <span className="mono text-[11px] text-[var(--text-muted)]">@{entry.username}</span>
                  <span className="text-[14px] font-bold tabular-nums ml-2" style={{ color: getScoreColor(score) }}>{score}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <Card className="text-center py-12">
            <p className="text-[13px] text-[var(--text-muted)] mb-4">No cars rated yet. Be the first.</p>
            <Btn href="/rate" primary>Upload Your Car</Btn>
          </Card>
        )}
      </Section>

      {/* ===== PRICING ===== */}
      <Section id="pricing">
        <Label>Pricing</Label>
        <h2 className="text-[28px] sm:text-[36px] font-extrabold text-white mb-3">Simple pricing.</h2>
        <p className="text-[14px] text-[var(--text-muted)] mb-10">Start free. Upgrade when you need more.</p>
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { name: "Free", price: "$0", pop: false, cta: "Get Started", href: "/rate", features: ["1 car profile", "3 analyses/month", "Public page", "Watermarked share card", "7-day analytics"] },
            { name: "Pro", price: "$15", pop: true, cta: "Upgrade to Pro", href: "/pricing", features: ["5 car profiles", "30 analyses/month", "No watermark", "Full breakdown", "Compare mode", "90-day analytics", "Profile themes", "Priority processing"] },
            { name: "Elite", price: "$39", pop: false, cta: "Upgrade to Elite", href: "/pricing", features: ["Unlimited profiles", "100 analyses/month", "Verified badge", "Advanced analytics", "Media kit exports", "Featured placement", "API access", "Priority support"] },
          ].map(t => (
            <div key={t.name} className={`rounded-[var(--radius)] border p-5 ${t.pop ? "bg-[var(--surface)] border-[var(--accent)]/20" : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--border-hover)]"} transition-colors`}>
              {t.pop && <p className="mono text-[10px] text-[var(--accent)] uppercase tracking-wider mb-2">Most Popular</p>}
              <p className="text-[15px] font-semibold text-white">{t.name}</p>
              <div className="mt-2 mb-5">
                <span className="text-[28px] font-extrabold text-white">{t.price}</span>
                <span className="text-[13px] text-[var(--text-muted)]">/mo</span>
              </div>
              <ul className="space-y-2 mb-6">
                {t.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-[13px] text-[var(--text-muted)]">
                    {t.pop ? Icons.check : Icons.checkMuted}
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={t.href} className={`flex items-center justify-center w-full h-9 rounded-lg text-[13px] font-medium transition-all active:scale-[0.98] ${t.pop ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]" : "bg-[var(--surface-hover)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--border-hover)]"}`}>
                {t.cta}
              </Link>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== FAQ ===== */}
      <Section>
        <Label>FAQ</Label>
        <h2 className="text-[28px] sm:text-[36px] font-extrabold text-white mb-10 leading-tight">
          Frequently asked<br />questions.
        </h2>
        <div className="border-t border-[var(--border)] max-w-[680px]">
          {[
            { q: "What is CarMogger?", a: "An AI-powered car rating platform. Upload photos and get scored across 5 axes: Aura, Larp, Money, Demand, and Hype." },
            { q: "How does the scoring work?", a: "Gemini AI analyzes your photos, identifies the car, and scores each axis 0-100 using a consistent rubric. The CarMog Score is the weighted average." },
            { q: "Is it free?", a: "Free accounts get 3 analyses per month and 1 car profile. Upgrade to Pro or Elite for more." },
            { q: "What are leagues?", a: "A progression system. Earn XP by uploading, getting views, and ranking. 6 leagues, 3 divisions each, with seasonal resets." },
            { q: "Can I share my score?", a: "Every car gets a shareable score card and public profile. Pro users get watermark-free cards." },
          ].map((item, i) => (
            <div key={i} className="border-b border-[var(--border)]">
              <button onClick={() => setFaq(faq === i ? null : i)} className="w-full py-4 flex items-center justify-between text-left group">
                <span className="text-[14px] font-medium text-white group-hover:text-[var(--text-secondary)] transition-colors pr-4">{item.q}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" className={`shrink-0 transition-transform duration-200 ${faq === i ? "rotate-45" : ""}`}><path d="M12 5v14M5 12h14"/></svg>
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${faq === i ? "max-h-40 pb-4" : "max-h-0"}`}>
                <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== FINAL CTA ===== */}
      <Section>
        <div className="text-center">
          <h2 className="text-[28px] sm:text-[36px] font-extrabold text-white mb-3">Get started in seconds</h2>
          <p className="text-[14px] text-[var(--text-muted)] mb-6">Upload your car and get your CarMog Score.</p>
          <Btn href="/rate" primary>Upload Your Car</Btn>
        </div>
      </Section>

      <Footer />
    </div>
  );
}
