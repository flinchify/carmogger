"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScoreRing from "@/components/ScoreRing";
import ScoreBar from "@/components/ScoreBar";
import LeagueBadge from "@/components/LeagueBadge";
import { getScoreColor, getScoreLabel } from "@/lib/ai-scoring";
import { getXpForNextLevel } from "@/lib/leagues";

interface ProfileData {
  user: {
    id: number;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
    bio: string | null;
    instagramHandle: string | null;
    twitterHandle: string | null;
    youtubeHandle: string | null;
    lifetimeXp: number;
    seasonalXp: number;
    level: number;
    league: string;
    division: number;
    plan: string;
    createdAt: string;
  };
  cars: Array<{
    id: number;
    images: string[];
    brand: string;
    model: string;
    year: number;
    carmog_score: number;
    aura: number;
    larp: number;
    money: number;
    demand: number;
    hype: number;
    ai_roast: string;
    total_views: number;
    created_at: string;
  }>;
  stats: {
    totalCars: number;
    totalViews: number;
    bestScore: number;
    avgScore: number;
  };
}

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<number | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/profile/${username}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
        if (d.cars.length > 0) setSelectedCar(0);
      })
      .catch(() => {
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <main className="min-h-screen pt-28 pb-16 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="h-48 rounded-[20px] bg-gray-100 animate-pulse mb-6" />
            <div className="h-96 rounded-[20px] bg-gray-100 animate-pulse" />
          </div>
        </main>
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <main className="min-h-screen pt-28 pb-16 px-6 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-black text-[#1a1a2e] mb-3">User not found</h1>
            <p className="text-gray-500 mb-6">@{username} doesn&apos;t exist on CarMogger.</p>
            <a href="/rate" className="px-6 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors">
              Rate Your Car Instead
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { user, cars, stats } = data;
  const nextLevelXp = getXpForNextLevel(user.level);
  const currentLevelXp = user.level > 1 ? getXpForNextLevel(user.level - 1) : 0;
  const levelProgress = nextLevelXp === Infinity ? 100 : Math.min(100, ((user.lifetimeXp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100);
  const activeCar = selectedCar !== null ? cars[selectedCar] : null;
  const featuredCar = cars[0];

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <main className="min-h-screen pt-28 pb-16 px-6">
        <div className="max-w-[1200px] mx-auto">
          {/* Profile Header */}
          <div className="p-8 sm:p-10 rounded-[20px] bg-[#f8fafc] border border-gray-100 mb-6">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 flex-1">
                <div className="relative shrink-0">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.username} className="w-28 h-28 rounded-[20px] object-cover border-2 border-gray-200" />
                  ) : (
                    <div className="w-28 h-28 rounded-[20px] bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-gray-200 flex items-center justify-center text-4xl font-black text-blue-500">
                      {user.username[0].toUpperCase()}
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center text-xs font-black text-blue-500">
                    {user.level}
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-3 mb-1">
                    <h1 className="text-3xl font-black text-[#1a1a2e]">{user.displayName || user.username}</h1>
                    {user.plan !== "free" && (
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-500 text-[10px] font-bold uppercase tracking-wider border border-blue-200">
                        Pro
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mb-3">@{user.username}</p>
                  {user.bio && <p className="text-sm text-gray-500 mb-4 max-w-lg leading-relaxed">{user.bio}</p>}

                  <div className="flex items-center justify-center sm:justify-start gap-4 mb-4">
                    <LeagueBadge league={user.league} division={user.division} size="md" />
                    <div className="flex items-center gap-3">
                      {user.instagramHandle && (
                        <a href={`https://instagram.com/${user.instagramHandle}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:text-[#1a1a2e] hover:bg-gray-200 transition-all">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                        </a>
                      )}
                      {user.twitterHandle && (
                        <a href={`https://twitter.com/${user.twitterHandle}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:text-[#1a1a2e] hover:bg-gray-200 transition-all">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </a>
                      )}
                      {user.youtubeHandle && (
                        <a href={`https://youtube.com/@${user.youtubeHandle}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:text-[#1a1a2e] hover:bg-gray-200 transition-all">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="max-w-xs">
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                      <span>Level {user.level}</span>
                      <span>{user.lifetimeXp.toLocaleString()} XP</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 score-bar-fill" style={{ width: `${levelProgress}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 shrink-0 self-center">
                {[
                  { label: "Total Views", value: stats.totalViews, format: true },
                  { label: "Best Score", value: stats.bestScore, format: false },
                  { label: "Avg Score", value: stats.avgScore, format: false },
                  { label: "Cars", value: stats.totalCars, format: false },
                ].map((s) => (
                  <div key={s.label} className="text-center p-4 rounded-[16px] bg-white border border-gray-100 min-w-[100px] hover:shadow-md transition-shadow">
                    <p className="text-2xl font-black text-[#1a1a2e]">{s.format && s.value > 999 ? `${(s.value / 1000).toFixed(1)}k` : s.value}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Car */}
          {featuredCar && (
            <div className="mb-6 rounded-[20px] bg-[#f8fafc] border border-gray-100 overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-3/5 aspect-[16/10] md:aspect-auto overflow-hidden relative">
                  <img src={featuredCar.images[0]} alt={`${featuredCar.brand} ${featuredCar.model}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#f8fafc] hidden md:block" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] to-transparent md:hidden" />
                </div>
                <div className="md:w-2/5 p-8 flex flex-col items-center justify-center">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-4">Featured Car</p>
                  <ScoreRing score={featuredCar.carmog_score} size={160} delay={300} />
                  <h3 className="text-xl font-black text-[#1a1a2e] mt-4 text-center">{featuredCar.year} {featuredCar.brand} {featuredCar.model}</h3>
                  <p className="text-xs font-bold uppercase tracking-widest mt-2" style={{ color: getScoreColor(featuredCar.carmog_score) }}>
                    {getScoreLabel(featuredCar.carmog_score)}
                  </p>
                  <span className="flex items-center gap-1 mt-4 text-xs text-gray-400">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    {featuredCar.total_views.toLocaleString()} views
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Cars Grid */}
          {cars.length > 1 && (
            <>
              <h2 className="text-xl font-black text-[#1a1a2e] mb-4">All Cars</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {cars.map((car, i) => {
                  const color = getScoreColor(car.carmog_score);
                  const label = getScoreLabel(car.carmog_score);
                  const isSelected = selectedCar === i;
                  return (
                    <div
                      key={car.id}
                      className={`group relative rounded-[20px] bg-white border overflow-hidden cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ${isSelected ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-100"}`}
                      onClick={() => setSelectedCar(i === selectedCar ? null : i)}
                    >
                      <div className="aspect-[16/10] overflow-hidden">
                        {car.images?.[0] ? (
                          <img src={car.images[0]} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      </div>
                      <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-sm font-black backdrop-blur-md transition-transform group-hover:scale-110" style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
                        {car.carmog_score}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color }}>{label}</p>
                        <h3 className="text-sm font-bold text-white mt-0.5">{car.year} {car.brand} {car.model}</h3>
                        <span className="text-[10px] text-white/60 flex items-center gap-1 mt-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                          {car.total_views.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* No cars */}
          {cars.length === 0 && (
            <div className="text-center py-16 rounded-[20px] bg-[#f8fafc] border border-gray-100">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" className="mx-auto mb-4"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
              <h3 className="text-lg font-bold text-[#1a1a2e] mb-2">No cars yet</h3>
              <p className="text-sm text-gray-500">This user hasn&apos;t uploaded any cars.</p>
            </div>
          )}

          {/* Selected car detail */}
          {activeCar && (
            <div className="p-8 rounded-[20px] bg-[#f8fafc] border border-gray-100">
              <div className="flex flex-col sm:flex-row items-start gap-8">
                <ScoreRing score={activeCar.carmog_score} size={140} delay={200} />
                <div className="flex-1 w-full">
                  <h3 className="text-xl font-black text-[#1a1a2e] mb-1">{activeCar.year} {activeCar.brand} {activeCar.model}</h3>
                  {activeCar.ai_roast && <p className="text-sm text-gray-500 mb-5 leading-relaxed">{activeCar.ai_roast}</p>}
                  <div className="space-y-3">
                    <ScoreBar label="Aura" value={activeCar.aura} delay={300} />
                    <ScoreBar label="Larp" value={activeCar.larp} delay={450} />
                    <ScoreBar label="Money" value={activeCar.money} delay={600} />
                    <ScoreBar label="Demand" value={activeCar.demand} delay={750} />
                    <ScoreBar label="Hype" value={activeCar.hype} delay={900} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
