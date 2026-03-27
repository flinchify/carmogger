"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeagueBadge from "@/components/LeagueBadge";
import { getScoreColor } from "@/lib/ai-scoring";

interface LeaderboardEntry {
  id: number;
  username: string;
  avatar_url: string | null;
  carmog_score: number;
  brand: string;
  model: string;
  year: number;
  images: string[];
  total_views: number;
  league: string;
  division: number;
  level: number;
}

type Tab = "score" | "views" | "xp";

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("score");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?sort=${tab}`)
      .then((r) => r.json())
      .then((data) => {
        setEntries(data.entries || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [tab]);

  return (
    <div style={{ width: "100%", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero header */}
      <section style={{ width: "100%", paddingTop: 120, paddingBottom: 40, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 600, height: 300, background: "radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="ctr" style={{ textAlign: "center", position: "relative" }}>
          <p className="fade-up d1 mono" style={{ fontSize: 11, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>[ Leaderboard ]</p>
          <h1 className="fade-up d2" style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, color: "white", lineHeight: 1.05 }}>
            Top rated.
          </h1>
          <p className="fade-up d3" style={{ marginTop: 16, fontSize: 14, color: "#a1a1aa", maxWidth: 460, marginLeft: "auto", marginRight: "auto" }}>
            The highest rated cars on CarMogger. Updated in real time.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section style={{ width: "100%", paddingBottom: 16 }}>
        <div className="ctr" style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ display: "flex", gap: 4, borderRadius: 8, background: "#111114", border: "1px solid rgba(255,255,255,0.07)", padding: 2 }}>
            {[
              { key: "score" as Tab, label: "Top Scores" },
              { key: "views" as Tab, label: "Most Viewed" },
              { key: "xp" as Tab, label: "Top XP" },
            ].map((t) => (
              <button key={t.key} className="mono" onClick={() => setTab(t.key)} style={{ fontSize: 11, padding: "6px 14px", borderRadius: 6, background: tab === t.key ? "rgba(59,130,246,0.1)" : "transparent", color: tab === t.key ? "#60a5fa" : "#3f3f46", border: "none", cursor: "pointer", transition: "all 0.15s" }}>
                {t.label}
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
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} style={{ height: 64, borderRadius: 12, background: "#111114", border: "1px solid rgba(255,255,255,0.07)" }} />
              ))}
            </div>
          ) : entries.length === 0 ? (
            <div style={{ borderRadius: 12, background: "#111114", border: "1px solid rgba(255,255,255,0.07)", padding: "64px 20px", textAlign: "center" }}>
              <p style={{ fontSize: 15, color: "#52525b", marginBottom: 16 }}>No cars rated yet. Be the first.</p>
              <a href="/rate" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 40, padding: "0 20px", borderRadius: 8, background: "#3b82f6", color: "white", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
                Rate Your Car
              </a>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {entries.map((entry, i) => {
                const rank = i + 1;
                const color = getScoreColor(entry.carmog_score);
                const isTop3 = rank <= 3;
                return (
                  <div key={entry.id} style={{ display: "flex", alignItems: "center", gap: 16, height: 56, padding: "0 16px", borderRadius: 12, background: "#111114", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, flexShrink: 0, background: rank === 1 ? "#F59E0B" : rank === 2 ? "#94A3B8" : rank === 3 ? "#CD7F32" : "#19191d", color: isTop3 ? "#000" : "#52525b" }}>
                      {rank}
                    </div>
                    <div style={{ width: 48, height: 36, borderRadius: 6, overflow: "hidden", flexShrink: 0, background: "#19191d" }}>
                      {entry.images?.[0] ? (
                        <img src={entry.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", background: "#19191d" }} />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {entry.year} {entry.brand} {entry.model}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                        <span className="mono" style={{ fontSize: 11, color: "#3f3f46" }}>@{entry.username}</span>
                        <LeagueBadge league={entry.league} size="sm" showLabel={false} />
                        <span className="mono" style={{ fontSize: 11, color: "#3f3f46" }}>Lv.{entry.level}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontSize: 18, fontWeight: 800, fontVariantNumeric: "tabular-nums", color }}>
                        {entry.carmog_score}
                      </p>
                      <p className="mono" style={{ fontSize: 10, color: "#3f3f46" }}>
                        {entry.total_views.toLocaleString()} views
                      </p>
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
