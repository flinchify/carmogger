"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getScoreColor } from "@/lib/ai-scoring";
import Link from "next/link";

interface Car { id: number; brand: string; model: string; year: number; carmog_score: number; images: string[]; username: string; }
interface Stats { totalCars: number; totalUsers: number; totalViews: number; avgScore: number; }

const cardStyle: React.CSSProperties = { borderRadius: 12, background: "#111114", border: "1px solid rgba(255,255,255,0.07)", padding: 20, transition: "border-color 0.15s" };
const sectionStyle: React.CSSProperties = { width: "100%", paddingTop: 80, paddingBottom: 80 };

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

  return (
    <div style={{ width: "100%", minHeight: "100vh" }}>
      <Navbar />

      {/* ===== HERO ===== */}
      <section style={{ width: "100%", paddingTop: 144, paddingBottom: 64 }}>
        <div className="ctr" style={{ textAlign: "center" }}>
          <p className="fade-up d1 mono" style={{ fontSize: 12, color: "#3b82f6", marginBottom: 20 }}>Mog Scores by CarMogger</p>
          <h1 className="fade-up d2" style={{ fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 800, color: "white", lineHeight: 1.05, margin: "0 auto", maxWidth: 680 }}>
            Upload your car.<br />
            <span style={{ color: "#52525b" }}>Get your mog score.</span>
          </h1>
          <p className="fade-up d3" style={{ marginTop: 20, fontSize: 15, color: "#a1a1aa", lineHeight: 1.6, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
            CarMogger rates your car across 5 brutal axes using AI. Get your mog score, climb the leaderboard, flex on everyone.
          </p>
          <div className="fade-up d4" style={{ marginTop: 32, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <Link href="/rate" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 40, padding: "0 20px", borderRadius: 8, background: "#3b82f6", color: "white", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>Upload Your Car</Link>
            <a href="#how-it-works" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 40, padding: "0 20px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", color: "#a1a1aa", fontSize: 14, textDecoration: "none" }}>Learn More</a>
          </div>
          <p className="fade-up d5 mono" style={{ marginTop: 16, fontSize: 11, color: "#3f3f46" }}>Free to start · No credit card required</p>

          {/* Terminal product demo */}
          <div className="fade-up d6" style={{ marginTop: 56, borderRadius: 12, background: "#111114", border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden", maxWidth: 820, marginLeft: "auto", marginRight: "auto", textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ display: "flex", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
              </div>
              <div style={{ flex: 1 }} />
              <div style={{ display: "flex", gap: 4 }}>
                {["Upload", "Analyze", "Score"].map((tab, i) => (
                  <span key={tab} className="mono" style={{ fontSize: 10, padding: "4px 10px", borderRadius: 6, background: i === 2 ? "rgba(59,130,246,0.1)" : "transparent", color: i === 2 ? "#60a5fa" : "#3f3f46" }}>{tab}</span>
                ))}
              </div>
            </div>
            <div style={{ padding: "24px 32px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 32 }}>
                <div style={{ flex: "1 1 300px" }}>
                  {hasFeatured && featured[0].images?.[0] ? (
                    <div style={{ aspectRatio: "16/10", borderRadius: 8, overflow: "hidden", background: "#19191d" }}>
                      <img src={featured[0].images[0]} alt={`${featured[0].brand} ${featured[0].model}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ) : (
                    <div style={{ aspectRatio: "16/10", borderRadius: 8, background: "#19191d", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ textAlign: "center" }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="1.5" style={{ margin: "0 auto 8px" }}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        <p className="mono" style={{ fontSize: 11, color: "#3f3f46" }}>Upload a car to see it here</p>
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ flex: "1 1 260px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  {hasFeatured ? (
                    <>
                      <p className="mono" style={{ fontSize: 11, color: "#52525b", marginBottom: 4 }}>{featured[0].year} {featured[0].brand} {featured[0].model}</p>
                      <p style={{ fontSize: 40, fontWeight: 800, color: "white", lineHeight: 1, fontFamily: "Outfit, sans-serif" }}>{Number(featured[0].carmog_score)}<span style={{ fontSize: 14, color: "#52525b", fontWeight: 400, marginLeft: 4 }}>/ 100</span></p>
                    </>
                  ) : (
                    <>
                      <p className="mono" style={{ fontSize: 11, color: "#3f3f46", marginBottom: 4 }}>mog_score</p>
                      <p style={{ fontSize: 40, fontWeight: 800, color: "#3f3f46", lineHeight: 1, fontFamily: "Outfit, sans-serif" }}>--<span style={{ fontSize: 14, fontWeight: 400, marginLeft: 4 }}>/ 100</span></p>
                    </>
                  )}
                  <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { l: "Aura", c: "#8B5CF6", w: "25%" },
                      { l: "Larp", c: "#10B981", w: "20%" },
                      { l: "Money", c: "#3B82F6", w: "20%" },
                      { l: "Demand", c: "#F59E0B", w: "20%" },
                      { l: "Hype", c: "#EC4899", w: "15%" },
                    ].map(a => (
                      <div key={a.l} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: a.c, flexShrink: 0 }} />
                        <span className="mono" style={{ fontSize: 11, color: "#a1a1aa", width: 56 }}>{a.l}</span>
                        <div style={{ flex: 1, height: 3, borderRadius: 2, background: "#19191d", overflow: "hidden" }}>
                          <div style={{ height: "100%", borderRadius: 2, width: "0%", background: a.c }} />
                        </div>
                        <span className="mono" style={{ fontSize: 10, color: "#3f3f46", width: 28, textAlign: "right" }}>{a.w}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" style={sectionStyle}>
        <div className="ctr">
          <p className="mono" style={{ fontSize: 11, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16, textAlign: "center" }}>[ How it works ]</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 800, color: "white", marginBottom: 40, textAlign: "center" }}>Upload. Rate. Compete.</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
            {[
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>, title: "Upload Photos", desc: "Drop 1-4 images. Front, rear, side, interior." },
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5"><path d="M2 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>, title: "AI Identifies", desc: "Gemini detects make, model, year, trim, mods." },
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>, title: "5-Axis Mog Score", desc: "Aura, Larp, Money, Demand, Hype. 0-100 each." },
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5"><path d="M6 9H4.5a2.5 2.5 0 010-5C7 4 7 7 7 7"/><path d="M18 9h1.5a2.5 2.5 0 000-5C17 4 17 7 17 7"/><path d="M4 22h16"/><path d="M18 2H6v7a6 6 0 0012 0V2z"/></svg>, title: "Compete", desc: "Leaderboard, XP, 6 leagues, seasonal resets." },
            ].map(item => (
              <div key={item.title} style={cardStyle}>
                <div style={{ marginBottom: 12 }}>{item.icon}</div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 6 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: "#52525b", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SCORING ===== */}
      <section id="scoring" style={sectionStyle}>
        <div className="ctr">
          <p className="mono" style={{ fontSize: 11, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16, textAlign: "center" }}>[ Scoring system ]</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 800, color: "white", marginBottom: 12, textAlign: "center" }}>5 axes. No mercy.</h2>
          <p style={{ fontSize: 14, color: "#52525b", marginBottom: 40, maxWidth: 460, marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>Each axis scored 0-100 by Gemini AI. Your Mog Score is the weighted average.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
            {[
              { name: "Aura", w: "25%", desc: "Presence, stance, proportions", color: "#8B5CF6" },
              { name: "Larp", w: "20%", desc: "Authenticity vs. fake parts", color: "#10B981" },
              { name: "Money", w: "20%", desc: "Build value, parts quality", color: "#3B82F6" },
              { name: "Demand", w: "20%", desc: "Market desirability", color: "#F59E0B" },
              { name: "Hype", w: "15%", desc: "Social / viral potential", color: "#EC4899" },
            ].map(a => (
              <div key={a.name} style={cardStyle}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.color, marginBottom: 12 }} />
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "white" }}>{a.name}</h3>
                <p className="mono" style={{ fontSize: 10, color: "#3f3f46", marginTop: 2 }}>{a.w}</p>
                <p style={{ fontSize: 13, color: "#52525b", marginTop: 8, lineHeight: 1.6 }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== METRICS ===== */}
      {hasData && (
        <section style={sectionStyle}>
          <div className="ctr">
            <p className="mono" style={{ fontSize: 11, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16, textAlign: "center" }}>[ By the numbers ]</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32, marginTop: 8, textAlign: "center" }}>
              {[
                { v: stats.totalCars, l: "Cars Rated" },
                { v: stats.totalUsers, l: "Active Users" },
                { v: stats.totalViews, l: "Total Views" },
                { v: stats.avgScore, l: "Avg Mog Score" },
              ].filter(s => s.v > 0).map(s => (
                <div key={s.l}>
                  <p style={{ fontSize: 36, fontWeight: 800, color: "white", letterSpacing: "-0.02em", fontFamily: "Outfit, sans-serif" }}>{s.v.toLocaleString()}</p>
                  <p style={{ fontSize: 13, color: "#52525b", marginTop: 4 }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== FEATURED ===== */}
      {hasFeatured && (
        <section style={sectionStyle}>
          <div className="ctr">
            <p className="mono" style={{ fontSize: 11, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16, textAlign: "center" }}>[ Featured ]</p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 800, color: "white", marginBottom: 40, textAlign: "center" }}>Top builds.</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
              {featured.slice(0, 8).map(car => (
                <Link href={`/u/${car.username}`} key={car.id} style={{ borderRadius: 12, background: "#111114", border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden", textDecoration: "none", transition: "border-color 0.15s" }}>
                  <div style={{ aspectRatio: "4/3", overflow: "hidden" }}>
                    {car.images?.[0] ? <img src={car.images[0]} alt={`${car.brand} ${car.model}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", background: "#19191d" }} />}
                  </div>
                  <div style={{ padding: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 500, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{car.year} {car.brand} {car.model}</p>
                      <p className="mono" style={{ fontSize: 10, color: "#3f3f46" }}>@{car.username}</p>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, fontVariantNumeric: "tabular-nums", flexShrink: 0, marginLeft: 8, color: getScoreColor(Number(car.carmog_score)) }}>{Number(car.carmog_score)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== LEADERBOARD ===== */}
      <section id="leaderboard" style={sectionStyle}>
        <div className="ctr">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
            <div style={{ textAlign: "center", width: "100%" }}>
              <p className="mono" style={{ fontSize: 11, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>[ Leaderboard ]</p>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 800, color: "white" }}>Top rated.</h2>
            </div>
            <div style={{ display: "flex", gap: 4, borderRadius: 8, background: "#111114", border: "1px solid rgba(255,255,255,0.07)", padding: 2, marginLeft: "auto", marginRight: "auto" }}>
              {(["score", "views"] as const).map(s => (
                <button key={s} className="mono" onClick={() => setLbSort(s)} style={{ fontSize: 11, padding: "6px 12px", borderRadius: 6, background: lbSort === s ? "rgba(59,130,246,0.1)" : "transparent", color: lbSort === s ? "#60a5fa" : "#3f3f46", border: "none", cursor: "pointer", transition: "all 0.15s" }}>
                  {s === "score" ? "By Score" : "By Views"}
                </button>
              ))}
            </div>
          </div>
          {hasLb ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {sortedLb.map((entry, i) => {
                const score = Number(entry.carmog_score);
                return (
                  <div key={entry.id} style={{ display: "flex", alignItems: "center", gap: 16, height: 48, padding: "0 16px", borderRadius: 12, background: "#111114", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <span className="mono" style={{ fontSize: 11, color: "#3f3f46", width: 16, textAlign: "right" }}>{i + 1}</span>
                    <div style={{ width: 32, height: 24, borderRadius: 4, overflow: "hidden", flexShrink: 0, background: "#19191d" }}>
                      {entry.images?.[0] && <img src={entry.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "white", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.year} {entry.brand} {entry.model}</p>
                    <span className="mono" style={{ fontSize: 11, color: "#3f3f46" }}>@{entry.username}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, fontVariantNumeric: "tabular-nums", marginLeft: 8, color: getScoreColor(score) }}>{score}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ ...cardStyle, textAlign: "center", padding: "48px 20px" }}>
              <p style={{ fontSize: 13, color: "#52525b", marginBottom: 16 }}>No cars rated yet. Be the first.</p>
              <Link href="/rate" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 40, padding: "0 20px", borderRadius: 8, background: "#3b82f6", color: "white", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>Upload Your Car</Link>
            </div>
          )}
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" style={sectionStyle}>
        <div className="ctr">
          <p className="mono" style={{ fontSize: 11, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16, textAlign: "center" }}>[ Pricing ]</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 800, color: "white", marginBottom: 12, textAlign: "center" }}>Simple pricing.</h2>
          <p style={{ fontSize: 14, color: "#52525b", marginBottom: 40, textAlign: "center" }}>Start free. Upgrade when you need more.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
            {[
              { name: "Free", price: "$0", pop: false, cta: "Get Started", href: "/rate", features: ["1 car profile", "3 analyses/month", "Public page", "Watermarked share card", "7-day analytics"] },
              { name: "Pro", price: "$15", pop: true, cta: "Upgrade to Pro", href: "/pricing", features: ["5 car profiles", "30 analyses/month", "No watermark", "Full breakdown", "Compare mode", "90-day analytics", "Profile themes", "Priority processing"] },
              { name: "Elite", price: "$39", pop: false, cta: "Upgrade to Elite", href: "/pricing", features: ["Unlimited profiles", "100 analyses/month", "Verified badge", "Advanced analytics", "Media kit exports", "Featured placement", "API access", "Priority support"] },
            ].map(t => (
              <div key={t.name} style={{ borderRadius: 12, border: t.pop ? "1px solid rgba(59,130,246,0.2)" : "1px solid rgba(255,255,255,0.07)", background: "#111114", padding: 20, transition: "border-color 0.15s" }}>
                {t.pop && <p className="mono" style={{ fontSize: 10, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Most Popular</p>}
                <p style={{ fontSize: 15, fontWeight: 600, color: "white" }}>{t.name}</p>
                <div style={{ marginTop: 8, marginBottom: 20 }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: "white", fontFamily: "Outfit, sans-serif" }}>{t.price}</span>
                  <span style={{ fontSize: 13, color: "#3f3f46" }}>/mo</span>
                </div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                  {t.features.map(f => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#52525b" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.pop ? "#3b82f6" : "#52525b"} strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}><polyline points="20 6 9 17 4 12"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={t.href} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: 36, borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: "none", background: t.pop ? "#3b82f6" : "#19191d", color: t.pop ? "white" : "#a1a1aa", border: t.pop ? "none" : "1px solid rgba(255,255,255,0.07)" }}>
                  {t.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section style={sectionStyle}>
        <div className="ctr">
          <p className="mono" style={{ fontSize: 11, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16, textAlign: "center" }}>[ FAQ ]</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 800, color: "white", marginBottom: 40, lineHeight: 1.1, textAlign: "center" }}>
            Frequently asked<br />questions.
          </h2>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", maxWidth: 680, marginLeft: "auto", marginRight: "auto" }}>
            {[
              { q: "What is CarMogger?", a: "An AI-powered car rating platform. Upload photos and get your mog score across 5 axes: Aura, Larp, Money, Demand, and Hype." },
              { q: "How does the scoring work?", a: "Gemini AI analyzes your photos, identifies the car, and scores each axis 0-100 using a consistent rubric. Your Mog Score is the weighted average." },
              { q: "Is it free?", a: "Free accounts get 3 analyses per month and 1 car profile. Upgrade to Pro or Elite for more." },
              { q: "What are leagues?", a: "A progression system. Earn XP by uploading, getting views, and ranking. 6 leagues, 3 divisions each, with seasonal resets." },
              { q: "Can I share my mog score?", a: "Every car gets a shareable score card and public profile. Pro users get watermark-free cards." },
            ].map((item, i) => (
              <div key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <button onClick={() => setFaq(faq === i ? null : i)} style={{ width: "100%", padding: "16px 0", display: "flex", alignItems: "center", justifyContent: "space-between", textAlign: "left", background: "none", border: "none", cursor: "pointer" }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "white", paddingRight: 16 }}>{item.q}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="2" style={{ flexShrink: 0, transition: "transform 0.2s", transform: faq === i ? "rotate(45deg)" : "none" }}><path d="M12 5v14M5 12h14"/></svg>
                </button>
                <div style={{ overflow: "hidden", maxHeight: faq === i ? 160 : 0, paddingBottom: faq === i ? 16 : 0, transition: "all 0.2s" }}>
                  <p style={{ fontSize: 13, color: "#52525b", lineHeight: 1.6 }}>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section style={sectionStyle}>
        <div className="ctr" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 800, color: "white", marginBottom: 12 }}>Get your mog score</h2>
          <p style={{ fontSize: 14, color: "#52525b", marginBottom: 24 }}>Upload your car and see where you rank.</p>
          <Link href="/rate" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 40, padding: "0 20px", borderRadius: 8, background: "#3b82f6", color: "white", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>Upload Your Car</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
