"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getScoreColor } from "@/lib/ai-scoring";
import Link from "next/link";

/* ===== TYPES ===== */
interface FeaturedCar {
  id: number; brand: string; model: string; year: number;
  carmog_score: number; images: string[]; username: string;
}
interface Stats {
  totalCars: number; totalUsers: number; totalViews: number; avgScore: number;
}

/* ===== SECTION WRAPPER — consistent container ===== */
function Section({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`py-20 sm:py-24 ${className}`}>
      <div className="max-w-[1080px] mx-auto px-6">{children}</div>
    </section>
  );
}

/* ===== SECTION LABEL — mono accent like AgentMail ===== */
function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[12px] text-[var(--text-muted)] font-mono mb-4">{children}</p>;
}

/* ===== CARD — reusable card primitive ===== */
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[var(--radius)] bg-[var(--surface)] border border-[var(--border)] p-5 hover:border-[var(--border-hover)] transition-colors duration-200 ${className}`}>
      {children}
    </div>
  );
}

/* ===== PAGE ===== */
export default function Home() {
  const [featured, setFeatured] = useState<FeaturedCar[]>([]);
  const [stats, setStats] = useState<Stats>({ totalCars: 0, totalUsers: 0, totalViews: 0, avgScore: 0 });
  const [leaderboard, setLeaderboard] = useState<FeaturedCar[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/featured").then(r => r.json()).then(d => setFeatured(d.cars || [])).catch(() => {});
    fetch("/api/stats").then(r => r.json()).then(d => setStats(d)).catch(() => {});
    fetch("/api/leaderboard?sort=score&limit=6").then(r => r.json()).then(d => setLeaderboard(d.entries || d || [])).catch(() => {});
  }, []);

  const hasStats = stats.totalCars > 0 || stats.totalUsers > 0;
  const hasLeaderboard = leaderboard.length > 0;
  const hasFeatured = featured.length > 0;

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="pt-28 pb-16 sm:pt-36 sm:pb-20">
        <div className="max-w-[1080px] mx-auto px-6">
          <div className="max-w-[640px]">
            <div className="fade-up d1">
              <h1 className="text-[40px] sm:text-[56px] font-extrabold text-white leading-[1.05]">
                AI-Powered Ratings<br />for Car Enthusiasts
              </h1>
            </div>
            <p className="fade-up d2 mt-5 text-[16px] text-[var(--text-secondary)] leading-relaxed max-w-[480px]">
              Upload photos of your car. Get scored across 5 axes by AI. Compete on the global leaderboard.
            </p>
            <div className="fade-up d3 mt-8 flex items-center gap-3">
              <Link href="/rate" className="h-10 px-5 rounded-[var(--radius-sm)] bg-white text-[#09090b] text-[14px] font-medium flex items-center hover:bg-zinc-200 transition-colors">
                Upload Your Car
              </Link>
              <a href="#how-it-works" className="h-10 px-5 rounded-[var(--radius-sm)] border border-[var(--border)] text-[14px] text-[var(--text-secondary)] flex items-center hover:text-white hover:border-[var(--border-hover)] transition-all">
                Learn More
              </a>
            </div>
            <p className="fade-up d4 mt-4 text-[12px] text-[var(--text-muted)]">Free to start. No credit card required.</p>
          </div>

          {/* Product visual — score card mockup */}
          <div className="fade-up d5 mt-14 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
              {/* Left: car image area */}
              <div className="sm:w-1/2">
                {hasFeatured && featured[0].images?.[0] ? (
                  <div className="aspect-[16/10] rounded-[var(--radius)] overflow-hidden bg-[var(--surface-hover)]">
                    <img src={featured[0].images[0]} alt={`${featured[0].brand} ${featured[0].model}`} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-[16/10] rounded-[var(--radius)] bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center">
                    <div className="text-center">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" className="mx-auto mb-2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <p className="text-[12px] text-[var(--text-muted)]">Upload a car to see it here</p>
                    </div>
                  </div>
                )}
              </div>
              {/* Right: score breakdown */}
              <div className="sm:w-1/2 flex flex-col justify-center">
                {hasFeatured ? (
                  <>
                    <p className="text-[13px] text-[var(--text-muted)] mb-1">{featured[0].year} {featured[0].brand} {featured[0].model}</p>
                    <p className="text-[36px] font-extrabold text-white leading-none mb-5">{Number(featured[0].carmog_score)}<span className="text-[16px] text-[var(--text-muted)] font-normal ml-1">/ 100</span></p>
                  </>
                ) : (
                  <>
                    <p className="text-[13px] text-[var(--text-muted)] mb-1">Example Score</p>
                    <p className="text-[36px] font-extrabold text-[var(--text-muted)] leading-none mb-5">--<span className="text-[16px] font-normal ml-1">/ 100</span></p>
                  </>
                )}
                <div className="space-y-3">
                  {[
                    { name: "Aura", color: "#8B5CF6", weight: "25%" },
                    { name: "Larp", color: "#10B981", weight: "20%" },
                    { name: "Money", color: "#3B82F6", weight: "20%" },
                    { name: "Demand", color: "#F59E0B", weight: "20%" },
                    { name: "Hype", color: "#EC4899", weight: "15%" },
                  ].map(a => (
                    <div key={a.name} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: a.color }} />
                      <span className="text-[13px] text-[var(--text-secondary)] w-16">{a.name}</span>
                      <div className="flex-1 h-[3px] rounded-full bg-[var(--surface-hover)] overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: "0%", background: a.color }} />
                      </div>
                      <span className="text-[11px] text-[var(--text-muted)] font-mono w-8 text-right">{a.weight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <Section id="how-it-works">
        <Label>How it works</Label>
        <h2 className="text-[28px] sm:text-[36px] font-extrabold text-white mb-10">
          Upload. Get rated. Compete.
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { title: "Upload Photos", desc: "Drop 1-4 images of your car. Front, rear, side, interior." },
            { title: "AI Identifies", desc: "Gemini detects make, model, year, trim, and modifications." },
            { title: "5-Axis Score", desc: "Rated on Aura, Larp, Money, Demand, and Hype. 0-100 each." },
            { title: "Compete", desc: "Climb the leaderboard. Earn XP. Progress through 6 leagues." },
          ].map(item => (
            <Card key={item.title}>
              <h3 className="text-[14px] font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ===== SCORING ===== */}
      <Section id="scoring">
        <Label>Scoring system</Label>
        <h2 className="text-[28px] sm:text-[36px] font-extrabold text-white mb-3">5 axes. No mercy.</h2>
        <p className="text-[14px] text-[var(--text-muted)] mb-10 max-w-[440px]">Each axis is scored 0-100 by Gemini AI. The CarMog Score is the weighted average.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { name: "Aura", weight: "25%", desc: "Presence, stance, proportions", color: "#8B5CF6" },
            { name: "Larp", weight: "20%", desc: "Authenticity vs. fake parts", color: "#10B981" },
            { name: "Money", weight: "20%", desc: "Build value, parts quality", color: "#3B82F6" },
            { name: "Demand", weight: "20%", desc: "Market desirability", color: "#F59E0B" },
            { name: "Hype", weight: "15%", desc: "Social / viral potential", color: "#EC4899" },
          ].map(a => (
            <Card key={a.name}>
              <div className="w-2 h-2 rounded-full mb-3" style={{ background: a.color }} />
              <h3 className="text-[14px] font-semibold text-white">{a.name}</h3>
              <p className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5">{a.weight}</p>
              <p className="text-[13px] text-[var(--text-muted)] mt-2 leading-relaxed">{a.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ===== METRICS — only show if there's real data ===== */}
      {hasStats && (
        <Section>
          <Label>By the numbers</Label>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: stats.totalCars, label: "Cars Rated" },
              { value: stats.totalUsers, label: "Active Users" },
              { value: stats.totalViews, label: "Total Views" },
              { value: stats.avgScore, label: "Avg Score" },
            ].filter(s => s.value > 0).map(s => (
              <div key={s.label}>
                <p className="text-[36px] font-extrabold text-white tracking-tight">{s.value.toLocaleString()}</p>
                <p className="text-[13px] text-[var(--text-muted)] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ===== FEATURED CARS — only if seeded ===== */}
      {hasFeatured && (
        <Section>
          <Label>Featured</Label>
          <h2 className="text-[28px] sm:text-[36px] font-extrabold text-white mb-10">Top builds.</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {featured.slice(0, 8).map(car => {
              const color = getScoreColor(Number(car.carmog_score));
              return (
                <Link href={`/u/${car.username}`} key={car.id} className="group rounded-[var(--radius)] bg-[var(--surface)] border border-[var(--border)] overflow-hidden hover:border-[var(--border-hover)] transition-colors">
                  <div className="aspect-[4/3] overflow-hidden">
                    {car.images?.[0] ? (
                      <img src={car.images[0]} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full bg-[var(--surface-hover)]" />
                    )}
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium text-white truncate">{car.year} {car.brand} {car.model}</p>
                      <p className="text-[11px] text-[var(--text-muted)]">@{car.username}</p>
                    </div>
                    <span className="text-[13px] font-bold tabular-nums shrink-0 ml-2" style={{ color }}>{Number(car.carmog_score)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </Section>
      )}

      {/* ===== LEADERBOARD ===== */}
      <Section id="leaderboard">
        <Label>Leaderboard</Label>
        <h2 className="text-[28px] sm:text-[36px] font-extrabold text-white mb-10">Top rated.</h2>
        {hasLeaderboard ? (
          <div className="space-y-1.5">
            {leaderboard.map((entry, i) => {
              const score = Number(entry.carmog_score);
              const color = getScoreColor(score);
              return (
                <div key={entry.id} className="flex items-center gap-4 h-12 px-4 rounded-[var(--radius)] bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-colors">
                  <span className="text-[12px] font-mono text-[var(--text-muted)] w-4 text-right">{i + 1}</span>
                  <div className="w-8 h-6 rounded-[4px] overflow-hidden shrink-0 bg-[var(--surface-hover)]">
                    {entry.images?.[0] && <img src={entry.images[0]} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-white truncate">{entry.year} {entry.brand} {entry.model}</p>
                  </div>
                  <span className="text-[11px] text-[var(--text-muted)]">@{entry.username}</span>
                  <span className="text-[14px] font-bold tabular-nums ml-2" style={{ color }}>{score}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <Card className="text-center py-10">
            <p className="text-[13px] text-[var(--text-muted)] mb-4">No cars rated yet. Be the first.</p>
            <Link href="/rate" className="inline-block h-9 px-4 rounded-[var(--radius-sm)] bg-white text-[#09090b] text-[13px] font-medium leading-9 hover:bg-zinc-200 transition-colors">Upload Your Car</Link>
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
            { name: "Free", price: "$0", period: "/mo", pop: false, cta: "Get Started", href: "/rate", features: ["1 car profile", "3 analyses/month", "Public page", "Watermarked share card", "7-day analytics"] },
            { name: "Pro", price: "$15", period: "/mo", pop: true, cta: "Upgrade to Pro", href: "/pricing", features: ["5 car profiles", "30 analyses/month", "No watermark", "Full breakdown", "Compare mode", "90-day analytics", "Profile themes", "Priority processing"] },
            { name: "Elite", price: "$39", period: "/mo", pop: false, cta: "Upgrade to Elite", href: "/pricing", features: ["Unlimited profiles", "100 analyses/month", "Verified badge", "Advanced analytics", "Media kit exports", "Featured placement", "API access", "Priority support"] },
          ].map(t => (
            <div key={t.name} className={`rounded-[var(--radius)] border p-5 ${t.pop ? "bg-[var(--surface)] border-[var(--accent)]/20" : "bg-[var(--surface)] border-[var(--border)]"}`}>
              {t.pop && <p className="text-[11px] font-medium text-[var(--accent)] mb-2">Most Popular</p>}
              <p className="text-[15px] font-semibold text-white">{t.name}</p>
              <div className="mt-2 mb-5">
                <span className="text-[28px] font-extrabold text-white">{t.price}</span>
                <span className="text-[13px] text-[var(--text-muted)]">{t.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {t.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-[13px] text-[var(--text-muted)]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.pop ? "var(--accent)" : "var(--text-muted)"} strokeWidth="2" className="mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={t.href} className={`block w-full h-9 rounded-[var(--radius-sm)] text-[13px] font-medium text-center leading-9 transition-colors ${t.pop ? "bg-white text-[#09090b] hover:bg-zinc-200" : "bg-[var(--surface-hover)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--border-hover)]"}`}>
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
        <div className="border-t border-[var(--border)]">
          {[
            { q: "What is CarMogger?", a: "An AI-powered car rating platform. Upload photos and get scored across 5 axes: Aura, Larp, Money, Demand, and Hype." },
            { q: "How does the scoring work?", a: "Gemini AI analyzes your photos, identifies the car, and scores each axis 0-100 using a consistent rubric. The CarMog Score is the weighted average." },
            { q: "Is it free?", a: "Free accounts get 3 analyses per month and 1 car profile. Upgrade to Pro or Elite for more." },
            { q: "What are leagues?", a: "A progression system. Earn XP by uploading, getting views, and ranking. 6 leagues, 3 divisions each, with seasonal resets." },
            { q: "Can I share my score?", a: "Every car gets a shareable score card and public profile. Pro users get watermark-free cards." },
          ].map((item, i) => (
            <div key={i} className="border-b border-[var(--border)]">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full py-4 flex items-center justify-between text-left group">
                <span className="text-[14px] font-medium text-white group-hover:text-[var(--text-secondary)] transition-colors pr-4">{item.q}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" className={`shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-45" : ""}`}><path d="M12 5v14M5 12h14"/></svg>
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${openFaq === i ? "max-h-32 pb-4" : "max-h-0"}`}>
                <p className="text-[13px] text-[var(--text-muted)] leading-relaxed max-w-[600px]">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== FINAL CTA ===== */}
      <Section>
        <div className="text-center">
          <h2 className="text-[28px] sm:text-[36px] font-extrabold text-white mb-3">Get started in seconds</h2>
          <p className="text-[14px] text-[var(--text-muted)] mb-6">Upload your car and get your score.</p>
          <Link href="/rate" className="inline-flex h-10 px-5 rounded-[var(--radius-sm)] bg-white text-[#09090b] text-[14px] font-medium items-center hover:bg-zinc-200 transition-colors">
            Upload Your Car
          </Link>
        </div>
      </Section>

      <Footer />
    </div>
  );
}
