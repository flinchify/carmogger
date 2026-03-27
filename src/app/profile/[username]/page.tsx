"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Particles from "@/components/Particles";
import ScoreRing from "@/components/ScoreRing";
import ScoreBar from "@/components/ScoreBar";
import LeagueBadge from "@/components/LeagueBadge";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { getScoreColor, getScoreLabel } from "@/lib/ai-scoring";
import { getLevel, getXpForNextLevel } from "@/lib/leagues";

interface ProfileData {
  user: {
    id: number;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
    bio: string | null;
    instagramHandle: string | null;
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

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<number | null>(null);
  useScrollReveal();

  useEffect(() => {
    fetch(`/api/profile/${username}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
        if (d.cars.length > 0) setSelectedCar(0);
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="relative z-10 min-h-screen pt-28 pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="skeleton h-48 rounded-2xl mb-6" />
            <div className="skeleton h-96 rounded-2xl" />
          </div>
        </main>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Particles />
        <Navbar />
        <main className="relative z-10 min-h-screen pt-28 pb-16 px-4 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-black mb-3">User not found</h1>
            <p className="text-[var(--grey-400)] mb-6">@{username} doesn&apos;t exist on CarMogger.</p>
            <a href="/rate" className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold press-effect btn-shine">
              Rate Your Car Instead
            </a>
          </div>
        </main>
      </>
    );
  }

  const { user, cars, stats } = data;
  const nextLevelXp = getXpForNextLevel(user.level);
  const currentLevelXp = user.level > 1 ? getXpForNextLevel(user.level - 1) : 0;
  const levelProgress = nextLevelXp === Infinity ? 100 : Math.min(100, ((user.lifetimeXp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100);
  const activeCar = selectedCar !== null ? cars[selectedCar] : null;

  return (
    <>
      <Particles />
      <Navbar />

      <main className="relative z-10 min-h-screen pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="scroll-reveal p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border)] mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-[var(--border)]"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-2 border-[var(--border)] flex items-center justify-center text-3xl font-black text-blue-400">
                    {user.username[0].toUpperCase()}
                  </div>
                )}
                {/* Level badge */}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[var(--bg-primary)] border-2 border-blue-500 flex items-center justify-center text-xs font-black text-blue-400">
                  {user.level}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-1">
                  <h1 className="text-2xl font-black">{user.displayName || user.username}</h1>
                  {user.plan !== "free" && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">
                      Pro
                    </span>
                  )}
                </div>
                <p className="text-sm text-[var(--grey-500)] mb-3">@{user.username}</p>

                {user.bio && <p className="text-sm text-[var(--grey-400)] mb-3 max-w-md">{user.bio}</p>}

                <div className="flex items-center justify-center sm:justify-start gap-4">
                  <LeagueBadge league={user.league} division={user.division} size="md" />
                  {user.instagramHandle && (
                    <a
                      href={`https://instagram.com/${user.instagramHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[var(--grey-500)] hover:text-white transition-colors flex items-center gap-1"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                      @{user.instagramHandle}
                    </a>
                  )}
                </div>

                {/* Level progress */}
                <div className="mt-4 max-w-xs">
                  <div className="flex justify-between text-[10px] text-[var(--grey-600)] mb-1">
                    <span>Level {user.level}</span>
                    <span>{user.lifetimeXp.toLocaleString()} XP</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 score-bar-fill"
                      style={{ width: `${levelProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 shrink-0">
                {[
                  { label: "Cars", value: stats.totalCars },
                  { label: "Views", value: stats.totalViews },
                  { label: "Best", value: stats.bestScore },
                  { label: "Avg", value: stats.avgScore },
                ].map((s) => (
                  <div key={s.label} className="text-center p-3 rounded-xl bg-white/[0.02] border border-[var(--border)]">
                    <p className="text-xl font-black text-white">{typeof s.value === "number" && s.value > 999 ? `${(s.value / 1000).toFixed(1)}k` : s.value}</p>
                    <p className="text-[10px] text-[var(--grey-600)] uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cars Grid */}
          {cars.length === 0 ? (
            <div className="scroll-reveal text-center py-20 rounded-3xl bg-[var(--bg-card)] border border-[var(--border)]">
              <p className="text-[var(--grey-500)] text-lg mb-4">No cars rated yet</p>
              <a href="/rate" className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold press-effect btn-shine">
                Rate Your First Car
              </a>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cars.map((car, i) => {
                const color = getScoreColor(car.carmog_score);
                const label = getScoreLabel(car.carmog_score);

                return (
                  <div
                    key={car.id}
                    className="scroll-reveal group relative rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden hover-lift press-effect cursor-pointer"
                    onClick={() => setSelectedCar(i === selectedCar ? null : i)}
                  >
                    {/* Image */}
                    <div className="aspect-[16/10] overflow-hidden">
                      {car.images?.[0] ? (
                        <img
                          src={car.images[0]}
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[var(--grey-800)] to-[var(--grey-900)] flex items-center justify-center">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--grey-600)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    </div>

                    {/* Score badge */}
                    <div
                      className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-sm font-black backdrop-blur-md transition-transform group-hover:scale-110"
                      style={{
                        background: `${color}15`,
                        color,
                        border: `1px solid ${color}30`,
                        boxShadow: `0 0 16px ${color}15`,
                      }}
                    >
                      {car.carmog_score}
                    </div>

                    {/* Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color }}>{label}</p>
                      <h3 className="text-sm font-bold mt-0.5">{car.year} {car.brand} {car.model}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-[var(--grey-500)] flex items-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                          {car.total_views.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Selected car detail */}
          {activeCar && (
            <div className="mt-6 p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border)] animate-slide-up">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <ScoreRing score={activeCar.carmog_score} size={140} delay={200} />
                <div className="flex-1">
                  <h3 className="text-xl font-black mb-1">{activeCar.year} {activeCar.brand} {activeCar.model}</h3>
                  {activeCar.ai_roast && (
                    <p className="text-sm text-[var(--grey-400)] mb-4 leading-relaxed">{activeCar.ai_roast}</p>
                  )}
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
    </>
  );
}
