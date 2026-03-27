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
    <>
      <Navbar />

      <main className="relative z-10 min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-black mb-3">
              Leader<span className="text-[var(--accent)]">board</span>
            </h1>
            <p className="text-[var(--text-secondary)]">
              The highest rated cars on CarMog. Updated in real time.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {[
              { key: "score" as Tab, label: "Top Scores" },
              { key: "views" as Tab, label: "Most Viewed" },
              { key: "xp" as Tab, label: "Top XP" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all press-effect ${
                  tab === t.key
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-white border border-[var(--border)]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* List */}
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="skeleton h-20 rounded-2xl" />
              ))}
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[var(--text-muted)] text-lg">No cars rated yet. Be the first.</p>
              <a href="/rate" className="inline-block mt-4 px-6 py-3 rounded-full bg-[var(--accent)] text-white font-bold press-effect">
                Rate Your Car
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry, i) => {
                const rank = i + 1;
                const color = getScoreColor(entry.carmog_score);
                const isTop3 = rank <= 3;

                return (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg-card)] border transition-all hover-tilt ${
                      isTop3
                        ? "border-[var(--border-hover)]"
                        : "border-[var(--border)]"
                    }`}
                    style={isTop3 ? { boxShadow: `0 0 20px ${color}10` } : {}}
                  >
                    {/* Rank */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0"
                      style={{
                        background: rank === 1 ? "#F59E0B" : rank === 2 ? "#94A3B8" : rank === 3 ? "#CD7F32" : "var(--bg-secondary)",
                        color: isTop3 ? "#000" : "var(--text-muted)",
                      }}
                    >
                      {rank}
                    </div>

                    {/* Car image */}
                    <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0">
                      {entry.images?.[0] ? (
                        <img src={entry.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[var(--bg-secondary)]" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">
                        {entry.year} {entry.brand} {entry.model}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-[var(--text-muted)]">@{entry.username}</span>
                        <LeagueBadge league={entry.league} size="sm" showLabel={false} />
                        <span className="text-xs text-[var(--text-muted)]">Lv.{entry.level}</span>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-right shrink-0">
                      <p className="text-2xl font-black tabular-nums" style={{ color }}>
                        {entry.carmog_score}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)]">
                        {entry.total_views.toLocaleString()} views
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

