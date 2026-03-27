"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScoreRing from "@/components/ScoreRing";
import { getScoreColor, getScoreLabel } from "@/lib/ai-scoring";
import Link from "next/link";

interface Car {
  id: number; brand: string; model: string; year: number; carmog_score: number;
  aura: number; larp: number; money: number; demand: number; hype: number;
  images: string[]; username: string;
}

const AXES = ["aura", "larp", "money", "demand", "hype"] as const;
const AXIS_WEIGHTS: Record<string, string> = { aura: "25%", larp: "20%", money: "20%", demand: "20%", hype: "15%" };
const cardStyle: React.CSSProperties = { borderRadius: 12, background: "#111114", border: "1px solid rgba(255,255,255,0.07)", padding: 20 };

export default function ComparePage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [carAId, setCarAId] = useState<number | null>(null);
  const [carBId, setCarBId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/leaderboard?sort=score&limit=20")
      .then(r => r.json())
      .then(d => {
        const entries = d.entries || d || [];
        setCars(entries);
        if (entries.length >= 2) { setCarAId(entries[0].id); setCarBId(entries[1].id); }
      }).catch(() => {});
  }, []);

  const carA = cars.find(c => c.id === carAId);
  const carB = cars.find(c => c.id === carBId);

  return (
    <div style={{ width: "100%", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero header */}
      <section style={{ width: "100%", paddingTop: 120, paddingBottom: 40, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 600, height: 300, background: "radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="ctr" style={{ textAlign: "center", position: "relative" }}>
          <p className="fade-up d1 mono" style={{ fontSize: 11, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>[ Compare ]</p>
          <h1 className="fade-up d2" style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, color: "white", lineHeight: 1.05 }}>
            Head to head.
          </h1>
          <p className="fade-up d3" style={{ marginTop: 16, fontSize: 14, color: "#a1a1aa", maxWidth: 460, marginLeft: "auto", marginRight: "auto" }}>
            Put two cars head to head. Every axis, side by side.
          </p>
        </div>
      </section>

      <section style={{ width: "100%", paddingBottom: 80 }}>
        <div className="ctr">
          {cars.length < 2 ? (
            <div style={{ ...cardStyle, padding: "64px 20px", textAlign: "center" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="1.5" style={{ margin: "0 auto 16px", display: "block" }}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 8 }}>Need at least 2 cars to compare</h3>
              <p style={{ fontSize: 13, color: "#52525b", marginBottom: 24 }}>Upload your car first, then come back to compare.</p>
              <Link href="/rate" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 40, padding: "0 20px", borderRadius: 8, background: "#3b82f6", color: "white", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>Upload Your Car</Link>
            </div>
          ) : carA && carB ? (
            <>
              {/* Car selectors */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12, marginBottom: 24 }}>
                {[{ label: "Car A", value: carAId, setter: setCarAId }, { label: "Car B", value: carBId, setter: setCarBId }].map((sel) => (
                  <div key={sel.label}>
                    <label className="mono" style={{ display: "block", fontSize: 10, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>{sel.label}</label>
                    <select
                      value={sel.value || ""}
                      onChange={(e) => sel.setter(Number(e.target.value))}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 8, background: "#111114", border: "1px solid rgba(255,255,255,0.07)", color: "white", fontSize: 13, appearance: "none" as const, cursor: "pointer" }}
                    >
                      {cars.map((car) => <option key={car.id} value={car.id}>{car.year} {car.brand} {car.model}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              {/* Car cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12, marginBottom: 24 }}>
                {[carA, carB].map((car, idx) => {
                  const score = Number(car.carmog_score);
                  const color = getScoreColor(score);
                  return (
                    <div key={idx} style={{ borderRadius: 12, background: "#111114", border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
                      <div style={{ aspectRatio: "16/9", overflow: "hidden", position: "relative", background: "#19191d" }}>
                        {car.images?.[0] && <img src={car.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                        <div style={{ position: "absolute", top: 12, right: 12, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 800, background: "rgba(0,0,0,0.6)", color }}>{getScoreLabel(score)}</div>
                      </div>
                      <div style={{ padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
                        <ScoreRing score={score} size={80} delay={idx * 200 + 300} />
                        <div>
                          <h3 style={{ fontSize: 15, fontWeight: 800, color: "white" }}>{car.year} {car.brand} {car.model}</h3>
                          <p className="mono" style={{ fontSize: 11, color: "#3f3f46", marginTop: 2 }}>@{car.username}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Overall Score */}
              <div style={{ ...cardStyle, padding: 32, marginBottom: 16 }}>
                <p className="mono" style={{ fontSize: 10, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 24, textAlign: "center" }}>Overall Score</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 48 }}>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, fontVariantNumeric: "tabular-nums", fontFamily: "Outfit, sans-serif", color: getScoreColor(Number(carA.carmog_score)) }}>{Number(carA.carmog_score)}</p>
                    <p style={{ fontSize: 13, color: "#52525b", marginTop: 8 }}>{carA.brand} {carA.model}</p>
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#3f3f46" }}>vs</div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, fontVariantNumeric: "tabular-nums", fontFamily: "Outfit, sans-serif", color: getScoreColor(Number(carB.carmog_score)) }}>{Number(carB.carmog_score)}</p>
                    <p style={{ fontSize: 13, color: "#52525b", marginTop: 8 }}>{carB.brand} {carB.model}</p>
                  </div>
                </div>
              </div>

              {/* Score Breakdown */}
              <div style={{ ...cardStyle, padding: 32 }}>
                <p className="mono" style={{ fontSize: 10, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 32, textAlign: "center" }}>Score Breakdown</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  {AXES.map((axis) => {
                    const valA = Number((carA as unknown as Record<string, unknown>)[axis]);
                    const valB = Number((carB as unknown as Record<string, unknown>)[axis]);
                    const colorA = getScoreColor(valA);
                    const colorB = getScoreColor(valB);
                    return (
                      <div key={axis}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                          <span className="mono" style={{ fontSize: 12, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: colorA }}>{valA}</span>
                          <span className="mono" style={{ fontSize: 10, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                            {axis} <span style={{ color: "#3f3f46", fontWeight: 400 }}>({AXIS_WEIGHTS[axis]})</span>
                          </span>
                          <span className="mono" style={{ fontSize: 12, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: colorB }}>{valB}</span>
                        </div>
                        <div style={{ display: "flex", gap: 4 }}>
                          <div style={{ flex: 1, height: 8, borderRadius: 4, background: "#19191d", overflow: "hidden", display: "flex", justifyContent: "flex-end" }}>
                            <div style={{ height: "100%", borderRadius: 4, width: `${valA}%`, background: colorA }} />
                          </div>
                          <div style={{ flex: 1, height: 8, borderRadius: 4, background: "#19191d", overflow: "hidden" }}>
                            <div style={{ height: "100%", borderRadius: 4, width: `${valB}%`, background: colorB }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </section>

      <Footer />
    </div>
  );
}
