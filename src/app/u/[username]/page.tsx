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

const cardStyle: React.CSSProperties = { borderRadius: 12, background: "#111114", border: "1px solid rgba(255,255,255,0.07)", padding: 20 };

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
      <div style={{ width: "100%", minHeight: "100vh" }}>
        <Navbar />
        <section style={{ width: "100%", paddingTop: 120, paddingBottom: 80 }}>
          <div className="ctr">
            <div style={{ height: 180, borderRadius: 12, background: "#111114", border: "1px solid rgba(255,255,255,0.07)", marginBottom: 24 }} />
            <div style={{ height: 360, borderRadius: 12, background: "#111114", border: "1px solid rgba(255,255,255,0.07)" }} />
          </div>
        </section>
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div style={{ width: "100%", minHeight: "100vh" }}>
        <Navbar />
        <section style={{ width: "100%", paddingTop: 120, paddingBottom: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: 36, fontWeight: 800, color: "white", marginBottom: 12 }}>User not found</h1>
            <p style={{ fontSize: 14, color: "#52525b", marginBottom: 24 }}>@{username} doesn&apos;t exist on CarMogger.</p>
            <a href="/rate" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 40, padding: "0 20px", borderRadius: 8, background: "#3b82f6", color: "white", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>
              Rate Your Car Instead
            </a>
          </div>
        </section>
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
    <div style={{ width: "100%", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero header */}
      <section style={{ width: "100%", paddingTop: 120, paddingBottom: 40, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 600, height: 300, background: "radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="ctr" style={{ position: "relative" }}>
          <p className="fade-up d1 mono" style={{ fontSize: 11, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16, textAlign: "center" }}>[ Profile ]</p>
        </div>
      </section>

      <section style={{ width: "100%", paddingBottom: 80 }}>
        <div className="ctr">
          {/* Profile Header */}
          <div className="fade-up d2" style={{ ...cardStyle, padding: 32, marginBottom: 24 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 32 }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 24, flex: 1, minWidth: 280 }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.username} style={{ width: 96, height: 96, borderRadius: 16, objectFit: "cover", border: "2px solid rgba(255,255,255,0.07)" }} />
                  ) : (
                    <div style={{ width: 96, height: 96, borderRadius: 16, background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.05))", border: "2px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800, color: "#3b82f6" }}>
                      {user.username[0].toUpperCase()}
                    </div>
                  )}
                  <div style={{ position: "absolute", bottom: -6, right: -6, width: 28, height: 28, borderRadius: "50%", background: "#111114", border: "2px solid #3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#3b82f6" }}>
                    {user.level}
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: "white" }}>{user.displayName || user.username}</h1>
                    {user.plan !== "free" && (
                      <span className="mono" style={{ fontSize: 9, padding: "2px 8px", borderRadius: 20, background: "rgba(59,130,246,0.1)", color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.05em" }}>Pro</span>
                    )}
                  </div>
                  <p className="mono" style={{ fontSize: 12, color: "#3f3f46", marginBottom: 12 }}>@{user.username}</p>
                  {user.bio && <p style={{ fontSize: 13, color: "#a1a1aa", marginBottom: 16, maxWidth: 400, lineHeight: 1.6 }}>{user.bio}</p>}

                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                    <LeagueBadge league={user.league} division={user.division} size="md" />
                    <div style={{ display: "flex", gap: 8 }}>
                      {user.instagramHandle && (
                        <a href={`https://instagram.com/${user.instagramHandle}`} target="_blank" rel="noopener noreferrer" style={{ width: 32, height: 32, borderRadius: 8, background: "#19191d", display: "flex", alignItems: "center", justifyContent: "center", color: "#52525b", textDecoration: "none" }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                        </a>
                      )}
                      {user.twitterHandle && (
                        <a href={`https://twitter.com/${user.twitterHandle}`} target="_blank" rel="noopener noreferrer" style={{ width: 32, height: 32, borderRadius: 8, background: "#19191d", display: "flex", alignItems: "center", justifyContent: "center", color: "#52525b", textDecoration: "none" }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </a>
                      )}
                      {user.youtubeHandle && (
                        <a href={`https://youtube.com/@${user.youtubeHandle}`} target="_blank" rel="noopener noreferrer" style={{ width: 32, height: 32, borderRadius: 8, background: "#19191d", display: "flex", alignItems: "center", justifyContent: "center", color: "#52525b", textDecoration: "none" }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                        </a>
                      )}
                    </div>
                  </div>

                  <div style={{ maxWidth: 240 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span className="mono" style={{ fontSize: 10, color: "#3f3f46" }}>Level {user.level}</span>
                      <span className="mono" style={{ fontSize: 10, color: "#3f3f46" }}>{user.lifetimeXp.toLocaleString()} XP</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 2, background: "#19191d", overflow: "hidden" }}>
                      <div className="score-bar-fill" style={{ height: "100%", borderRadius: 2, background: "linear-gradient(90deg, #3b82f6, #60a5fa)", width: `${levelProgress}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, flexShrink: 0, alignSelf: "center" }}>
                {[
                  { label: "Total Views", value: stats.totalViews, format: true },
                  { label: "Best Score", value: stats.bestScore, format: false },
                  { label: "Avg Score", value: stats.avgScore, format: false },
                  { label: "Cars", value: stats.totalCars, format: false },
                ].map((s) => (
                  <div key={s.label} style={{ textAlign: "center", padding: 16, borderRadius: 12, background: "#19191d", minWidth: 90 }}>
                    <p style={{ fontSize: 20, fontWeight: 800, color: "white", fontFamily: "Outfit, sans-serif" }}>{s.format && s.value > 999 ? `${(s.value / 1000).toFixed(1)}k` : s.value}</p>
                    <p className="mono" style={{ fontSize: 9, color: "#3f3f46", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2 }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Car */}
          {featuredCar && (
            <div className="fade-up d3" style={{ marginBottom: 24, borderRadius: 12, background: "#111114", border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <div style={{ flex: "3 1 300px", aspectRatio: "16/10", overflow: "hidden", position: "relative", background: "#19191d" }}>
                  <img src={featuredCar.images[0]} alt={`${featuredCar.brand} ${featuredCar.model}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ flex: "2 1 240px", padding: 32, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <p className="mono" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#52525b", marginBottom: 16 }}>Featured Car</p>
                  <ScoreRing score={featuredCar.carmog_score} size={140} delay={300} />
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "white", marginTop: 16, textAlign: "center" }}>{featuredCar.year} {featuredCar.brand} {featuredCar.model}</h3>
                  <p className="mono" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 8, color: getScoreColor(featuredCar.carmog_score) }}>
                    {getScoreLabel(featuredCar.carmog_score)}
                  </p>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 16, fontSize: 12, color: "#52525b" }}>
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
              <p className="fade-up d4 mono" style={{ fontSize: 11, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>[ All Cars ]</p>
              <div className="fade-up d4" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12, marginBottom: 24 }}>
                {cars.map((car, i) => {
                  const color = getScoreColor(car.carmog_score);
                  const label = getScoreLabel(car.carmog_score);
                  const isSelected = selectedCar === i;
                  return (
                    <div
                      key={car.id}
                      onClick={() => setSelectedCar(i === selectedCar ? null : i)}
                      style={{ position: "relative", borderRadius: 12, background: "#111114", border: isSelected ? "1px solid rgba(59,130,246,0.3)" : "1px solid rgba(255,255,255,0.07)", overflow: "hidden", cursor: "pointer", transition: "border-color 0.15s" }}
                    >
                      <div style={{ aspectRatio: "16/10", overflow: "hidden", position: "relative" }}>
                        {car.images?.[0] ? (
                          <img src={car.images[0]} alt={`${car.brand} ${car.model}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", background: "#19191d", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3f3f46" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                          </div>
                        )}
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }} />
                      </div>
                      <div style={{ position: "absolute", top: 8, right: 8, padding: "2px 10px", borderRadius: 16, fontSize: 12, fontWeight: 800, background: `${color}15`, color, border: `1px solid ${color}30` }}>
                        {car.carmog_score}
                      </div>
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 12 }}>
                        <p className="mono" style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", color }}>{label}</p>
                        <h3 style={{ fontSize: 12, fontWeight: 700, color: "white", marginTop: 2 }}>{car.year} {car.brand} {car.model}</h3>
                        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
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
            <div style={{ ...cardStyle, textAlign: "center", padding: "64px 20px" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="1.5" style={{ margin: "0 auto 16px", display: "block" }}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 8 }}>No cars yet</h3>
              <p style={{ fontSize: 13, color: "#52525b" }}>This user hasn&apos;t uploaded any cars.</p>
            </div>
          )}

          {/* Selected car detail */}
          {activeCar && (
            <div className="fade-up d5" style={{ ...cardStyle, padding: 32 }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 32 }}>
                <ScoreRing score={activeCar.carmog_score} size={120} delay={200} />
                <div style={{ flex: 1, minWidth: 240 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "white", marginBottom: 4 }}>{activeCar.year} {activeCar.brand} {activeCar.model}</h3>
                  {activeCar.ai_roast && <p style={{ fontSize: 13, color: "#a1a1aa", marginBottom: 20, lineHeight: 1.6 }}>{activeCar.ai_roast}</p>}
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
      </section>

      <Footer />
    </div>
  );
}
