"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeagueBadge from "@/components/LeagueBadge";
import { getScoreColor } from "@/lib/ai-scoring";
import Link from "next/link";

interface Entry {
  id: number; brand: string; model: string; year: number; carmog_score: number;
  images: string[]; username: string; league: string; level: number; total_views: number;
}

type Tab = "global" | "weekly" | "local" | "brand";

export default function LeaderboardsPage() {
  const [tab, setTab] = useState<Tab>("global");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?sort=score&limit=20`)
      .then(r => r.json())
      .then(d => setEntries(d.entries || d || []))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [tab]);

  return (
    <div style={{ width: "100%", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero header */}
      <section style={{ width: "100%", paddingTop: 120, paddingBottom: 40, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 600, height: 300, background: "radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="ctr" style={{ textAlign: "center", position: "relative" }}>
          <p className="fade-up d1 mono" style={{ fontSize: 11, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>[ Leaderboards ]</p>
          <h1 className="fade-up d2" style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, color: "white", lineHeight: 1.05 }}>
            Top rated.
          </h1>
          <p className="fade-up d3" style={{ marginTop: 16, fontSize: 14, color: "#a1a1aa", maxWidth: 460, marginLeft: "auto", marginRight: "auto" }}>
            The highest rated cars on CarMogger. Compete for the top spot.
          </p>
        </div>
      </section>

      {/* Filter tabs */}
      <section style={{ width: "100%", paddingBottom: 16 }}>
        <div className="ctr" style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ display: "flex", gap: 4, borderRadius: 8, background: "#111114", border: "1px solid rgba(255,255,255,0.07)", padding: 2 }}>
            {(["global", "weekly", "local", "brand"] as Tab[]).map((t) => (
              <button key={t} className="mono" onClick={() => setTab(t)} style={{ fontSize: 11, padding: "6px 14px", borderRadius: 6, background: tab === t ? "rgba(59,130,246,0.1)" : "transparent", color: tab === t ? "#60a5fa" : "#3f3f46", border: "none", cursor: "pointer", transition: "all 0.15s", textTransform: "capitalize" }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* List */}
      <section style={{ width: "100%", paddingTop: 24, paddingBottom: 80 }}>
        <div className="ctr">
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{ height: 64, borderRadius: 12, background: "#111114", border: "1px solid rgba(255,255,255,0.07)" }} />
              ))}
            </div>
          ) : entries.length === 0 ? (
            <div style={{ borderRadius: 12, background: "#111114", border: "1px solid rgba(255,255,255,0.07)", padding: "64px 20px", textAlign: "center" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="1.5" style={{ margin: "0 auto 16px", display: "block" }}><path d="M18 2H6v7a6 6 0 0012 0V2z" /><path d="M4 22h16" /></svg>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 8 }}>No cars rated yet</h3>
              <p style={{ fontSize: 13, color: "#52525b", marginBottom: 24 }}>Be the first to claim the top spot.</p>
              <Link href="/rate" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 40, padding: "0 20px", borderRadius: 8, background: "#3b82f6", color: "white", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>Upload Your Car</Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {entries.map((entry, i) => {
                const rank = i + 1;
                const score = Number(entry.carmog_score);
                const color = getScoreColor(score);
                const isTop3 = rank <= 3;
                return (
                  <div key={entry.id} style={{ display: "flex", alignItems: "center", gap: 16, height: 56, padding: "0 16px", borderRadius: 12, background: "#111114", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, flexShrink: 0, background: rank === 1 ? "linear-gradient(135deg, #F59E0B, #D97706)" : rank === 2 ? "linear-gradient(135deg, #94A3B8, #64748B)" : rank === 3 ? "linear-gradient(135deg, #CD7F32, #A0522D)" : "#19191d", color: isTop3 ? "#fff" : "#52525b" }}>
                      {rank}
                    </div>
                    <div style={{ width: 48, height: 36, borderRadius: 6, overflow: "hidden", flexShrink: 0, background: "#19191d" }}>
                      {entry.images?.[0] && <img src={entry.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.year} {entry.brand} {entry.model}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                        <span className="mono" style={{ fontSize: 11, color: "#3f3f46" }}>@{entry.username}</span>
                        {entry.league && <LeagueBadge league={entry.league} size="sm" showLabel={false} />}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontSize: 18, fontWeight: 800, fontVariantNumeric: "tabular-nums", color }}>{score}</p>
                      <p className="mono" style={{ fontSize: 10, color: "#3f3f46" }}>{Number(entry.total_views || 0).toLocaleString()} views</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
