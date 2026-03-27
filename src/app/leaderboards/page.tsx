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
    <div className="bg-white min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-black text-[#1a1a2e] mb-3">Leader<span className="text-blue-500">boards</span></h1>
            <p className="text-gray-500 max-w-md mx-auto">The highest rated cars on CarMogger. Compete for the top spot.</p>
          </div>

          <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
            {(["global", "weekly", "local", "brand"] as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${tab === t ? "bg-blue-500 text-white shadow-md" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3 max-w-3xl mx-auto">
              {[1,2,3,4,5].map(i => <div key={i} className="h-20 rounded-[16px] bg-gray-100 animate-pulse" />)}
            </div>
          ) : entries.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-20 rounded-[20px] bg-[#f8fafc] border border-gray-100">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" className="mx-auto mb-4"><path d="M18 2H6v7a6 6 0 0012 0V2z" /><path d="M4 22h16" /></svg>
              <h3 className="text-lg font-bold text-[#1a1a2e] mb-2">No cars rated yet</h3>
              <p className="text-sm text-gray-500 mb-6">Be the first to claim the top spot.</p>
              <Link href="/rate" className="px-6 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors">Upload Your Car</Link>
            </div>
          ) : (
            <div className="space-y-3 max-w-3xl mx-auto">
              {entries.map((entry, i) => {
                const rank = i + 1;
                const score = Number(entry.carmog_score);
                const color = getScoreColor(score);
                const isTop3 = rank <= 3;
                return (
                  <div key={entry.id} className={`flex items-center gap-4 p-4 rounded-[16px] bg-white border border-gray-100 hover:shadow-md hover:scale-[1.01] transition-all duration-200 ${isTop3 ? "shadow-sm" : ""}`}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0" style={{
                      background: rank === 1 ? "linear-gradient(135deg, #F59E0B, #D97706)" : rank === 2 ? "linear-gradient(135deg, #94A3B8, #64748B)" : rank === 3 ? "linear-gradient(135deg, #CD7F32, #A0522D)" : "#f1f5f9",
                      color: isTop3 ? "#fff" : "#64748b",
                    }}>{rank}</div>
                    <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                      {entry.images?.[0] && <img src={entry.images[0]} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-[#1a1a2e] truncate">{entry.year} {entry.brand} {entry.model}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-500">@{entry.username}</span>
                        {entry.league && <LeagueBadge league={entry.league} size="sm" showLabel={false} />}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-2xl font-black tabular-nums" style={{ color }}>{score}</p>
                      <p className="text-[10px] text-gray-400">{Number(entry.total_views || 0).toLocaleString()} views</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
