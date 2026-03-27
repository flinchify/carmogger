"use client";

import { useState, useCallback, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Particles from "@/components/Particles";
import ScoreRing from "@/components/ScoreRing";
import ScoreBar from "@/components/ScoreBar";
import Confetti from "@/components/Confetti";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { getScoreLabel, getScoreColor } from "@/lib/ai-scoring";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface ScoreResult {
  make: string;
  model: string;
  year: string | number;
  color: string;
  mods: string[];
  condition: string;
  aura: number;
  larp: number;
  money: number;
  demand: number;
  hype: number;
  carmogScore: number;
  roast: string;
  highlights: string[];
  lowlights: string[];
}

const LOADING_STEPS = [
  "Uploading images...",
  "AI is analyzing your car...",
  "Calculating scores...",
  "Generating roast...",
];

export default function RatePage() {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setIsLoggedIn(!!d?.user))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files).slice(0, 4);
    setImages(fileArray);
    setPreviews(fileArray.map((f) => URL.createObjectURL(f)));
    setResult(null);
    setError(null);
  }, []);

  const removeImage = useCallback(
    (index: number) => {
      setImages((prev) => prev.filter((_, i) => i !== index));
      setPreviews((prev) => {
        URL.revokeObjectURL(prev[index]);
        return prev.filter((_, i) => i !== index);
      });
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleSubmit = async () => {
    if (images.length === 0) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setLoadingStep(0);
    setLoadingProgress(0);

    // Simulate progress steps while the API call runs in the background
    const stepTimers: ReturnType<typeof setTimeout>[] = [];
    let progressInterval: ReturnType<typeof setInterval> = undefined as unknown as ReturnType<typeof setInterval>;
    let currentProgress = 0;

    const advanceProgress = () => {
      progressInterval = setInterval(() => {
        currentProgress += 0.5;
        if (currentProgress > 95) {
          clearInterval(progressInterval);
          return;
        }
        setLoadingProgress(Math.min(currentProgress, 95));

        if (currentProgress >= 20 && currentProgress < 21) setLoadingStep(1);
        if (currentProgress >= 55 && currentProgress < 56) setLoadingStep(2);
        if (currentProgress >= 80 && currentProgress < 81) setLoadingStep(3);
      }, 100);
    };

    advanceProgress();

    try {
      const formData = new FormData();
      images.forEach((img) => formData.append("images", img));

      const res = await fetch("/api/rate", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Rating failed");

      // Finish progress bar
      clearInterval(progressInterval);
      setLoadingProgress(100);
      setLoadingStep(3);

      await new Promise((r) => setTimeout(r, 400));

      setResult(data);
      if (data.carmogScore >= 90) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }
    } catch (err: unknown) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      stepTimers.forEach(clearTimeout);
      setLoading(false);
      setLoadingStep(0);
      setLoadingProgress(0);
    }
  };

  const reset = () => {
    setImages([]);
    setPreviews([]);
    setResult(null);
    setError(null);
  };

  useScrollReveal();

  return (
    <>
      <Particles />
      <Navbar />
      <Confetti trigger={showConfetti} />
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />

      <main className="relative z-10 min-h-screen pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            /* ── LOADING STATE ── */
            <div className="flex flex-col items-center justify-center py-20 animate-slide-up">
              {/* Pulsing car silhouette */}
              <div className="mb-10 animate-pulse">
                <svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M15 40 C15 40 18 28 30 24 C38 21 48 18 60 18 C72 18 82 21 90 24 C102 28 105 40 105 40"
                    stroke="var(--accent)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.5"
                  />
                  <path
                    d="M8 42 L15 40 L105 40 L112 42 L112 46 C112 48 110 50 108 50 L12 50 C10 50 8 48 8 46 Z"
                    stroke="var(--accent)"
                    strokeWidth="2"
                    fill="var(--accent)"
                    fillOpacity="0.05"
                  />
                  <circle cx="30" cy="50" r="7" stroke="var(--accent)" strokeWidth="2" fill="none" />
                  <circle cx="90" cy="50" r="7" stroke="var(--accent)" strokeWidth="2" fill="none" />
                  <path d="M35 30 L50 24 L75 24 L85 30" stroke="var(--accent)" strokeWidth="1.5" opacity="0.4" />
                </svg>
              </div>

              {/* Progress bar */}
              <div className="w-full max-w-md mb-8">
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--accent)] transition-all duration-300 ease-out"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-[var(--text-muted)]">{Math.round(loadingProgress)}%</span>
                </div>
              </div>

              {/* Step indicators */}
              <div className="space-y-3 w-full max-w-sm">
                {LOADING_STEPS.map((step, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                      i < loadingStep
                        ? "text-emerald-400"
                        : i === loadingStep
                        ? "text-white"
                        : "text-[var(--text-muted)]"
                    }`}
                  >
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                      {i < loadingStep ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      ) : i === loadingStep ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
                      )}
                    </div>
                    <span className={i === loadingStep ? "font-medium" : ""}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : !result ? (
            <>
              {/* ── UPLOAD AREA ── */}
              <div className="text-center mb-10">
                <h1 className="text-4xl sm:text-5xl font-black mb-3">
                  Rate your <span className="text-[var(--accent)]">ride</span>
                </h1>
                <p className="text-[var(--text-secondary)]">
                  Upload 1-4 photos. More angles = more accurate score.
                </p>
              </div>

              {/* Upload box with background car image */}
              <div className="relative rounded-2xl overflow-hidden">
                {/* Faded background car image */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-[0.06] pointer-events-none"
                  style={{
                    backgroundImage:
                      "url(https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80)",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-card)]/80 to-[var(--bg-card)] pointer-events-none" />

                {/* Gradient border effect */}
                <div
                  className={`relative rounded-2xl p-[1px] transition-all duration-300 ${
                    dragOver ? "bg-gradient-to-br from-[var(--accent)] via-blue-400 to-[var(--accent)]" : "bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-white/[0.08]"
                  }`}
                >
                  <div
                    className={`relative rounded-[15px] p-12 text-center cursor-pointer transition-all bg-[var(--bg-card)]/90 backdrop-blur-sm ${
                      dragOver ? "bg-[var(--accent)]/5" : "hover:bg-white/[0.02]"
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() =>
                      document.getElementById("file-input")?.click()
                    }
                  >
                    <input
                      id="file-input"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) =>
                        e.target.files && handleFiles(e.target.files)
                      }
                    />

                    {previews.length > 0 ? (
                      <div
                        className="grid grid-cols-2 gap-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {previews.map((src, i) => (
                          <div
                            key={i}
                            className="relative aspect-video rounded-xl overflow-hidden group/img"
                          >
                            <img
                              src={src}
                              alt={`Preview ${i + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(i);
                              }}
                              className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-red-500/80 transition-all opacity-0 group-hover/img:opacity-100"
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                              >
                                <path d="M18 6L6 18M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                        {previews.length < 4 && (
                          <div
                            className="aspect-video rounded-xl border border-dashed border-white/[0.08] flex items-center justify-center cursor-pointer hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/5 transition-all"
                            onClick={() =>
                              document.getElementById("file-input")?.click()
                            }
                          >
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="var(--text-muted)"
                              strokeWidth="1.5"
                            >
                              <path d="M12 5v14M5 12h14" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center">
                          <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--accent)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-base font-semibold text-white">
                            Drag &amp; drop your car photos
                          </p>
                          <p className="text-sm text-[var(--text-muted)] mt-1">
                            or click to browse -- max 4 images
                          </p>
                          <p className="text-xs text-[var(--text-muted)] mt-3 opacity-60">
                            Supported: JPG, PNG, WebP
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {images.length > 0 && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 py-4 rounded-xl bg-[var(--accent)] text-white font-bold text-lg hover:brightness-110 transition-all press-effect disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Get CarMog Score
                  </button>
                  <button
                    onClick={reset}
                    className="px-6 py-4 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] font-medium hover:bg-white/[0.03] transition-all press-effect"
                  >
                    Clear
                  </button>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-slide-up">
                  {error}
                </div>
              )}
            </>
          ) : (
            /* ── RESULTS ── */
            <>
              {/* Score ring + car info row */}
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-10 animate-slide-up">
                <div className="flex flex-col items-center flex-shrink-0">
                  <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-4">
                    Your CarMog Score
                  </p>
                  <ScoreRing
                    score={result.carmogScore}
                    size={240}
                    strokeWidth={10}
                    delay={300}
                  />
                  <p
                    className="mt-4 text-lg font-black uppercase tracking-wider"
                    style={{ color: getScoreColor(result.carmogScore) }}
                  >
                    {getScoreLabel(result.carmogScore)}
                  </p>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl sm:text-4xl font-black mb-2">
                    {result.year} {result.make} {result.model}
                  </h2>
                  <p className="text-[var(--text-secondary)] text-lg">
                    {result.color} &middot; {result.condition}
                    {result.mods.length > 0 &&
                      ` \u00B7 ${result.mods.length} mods detected`}
                  </p>

                  {result.mods.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                      {result.mods.slice(0, 6).map((mod, i) => (
                        <span
                          key={i}
                          className="text-xs px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-[var(--text-muted)]"
                        >
                          {mod}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Roast */}
              <div
                className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] mb-8 animate-slide-up"
                style={{ animationDelay: "0.2s" }}
              >
                <p className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">
                  The Verdict
                </p>
                <p className="text-lg leading-relaxed">{result.roast}</p>
              </div>

              {/* Score bars */}
              <div
                className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] mb-8 animate-slide-up"
                style={{ animationDelay: "0.3s" }}
              >
                <p className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest mb-5">
                  Score Breakdown
                </p>
                <div className="space-y-5">
                  <ScoreBar label="Aura" value={result.aura} delay={500} />
                  <ScoreBar label="Larp" value={result.larp} delay={650} />
                  <ScoreBar label="Money" value={result.money} delay={800} />
                  <ScoreBar label="Demand" value={result.demand} delay={950} />
                  <ScoreBar label="Hype" value={result.hype} delay={1100} />
                </div>
              </div>

              {/* Highlights / Lowlights */}
              <div
                className="grid sm:grid-cols-2 gap-4 mb-8 animate-slide-up"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
                  <p className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-3">
                    Highlights
                  </p>
                  <ul className="space-y-2">
                    {result.highlights.map((h, i) => (
                      <li
                        key={i}
                        className="text-sm text-[var(--text-secondary)] flex items-start gap-2"
                      >
                        <span className="text-emerald-400 mt-0.5">+</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
                  <p className="text-sm font-bold text-red-400 uppercase tracking-widest mb-3">
                    Lowlights
                  </p>
                  <ul className="space-y-2">
                    {result.lowlights.map((l, i) => (
                      <li
                        key={i}
                        className="text-sm text-[var(--text-secondary)] flex items-start gap-2"
                      >
                        <span className="text-red-400 mt-0.5">-</span>
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sign up CTA */}
              {isLoggedIn === false && (
                <div
                  className="p-5 rounded-2xl bg-gradient-to-r from-[var(--accent)]/10 to-transparent border border-[var(--accent)]/20 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 animate-slide-up"
                  style={{ animationDelay: "0.45s" }}
                >
                  <div>
                    <p className="font-bold text-white text-sm">
                      Sign up to save your score
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      Track your ratings, climb the leaderboard, and earn XP.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAuth(true)}
                    className="px-5 py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-semibold hover:brightness-110 transition-all press-effect flex-shrink-0"
                  >
                    Create Account
                  </button>
                </div>
              )}

              {/* Actions */}
              <div
                className="flex flex-col sm:flex-row gap-3 animate-slide-up"
                style={{ animationDelay: "0.5s" }}
              >
                <button
                  onClick={reset}
                  className="flex-1 py-4 rounded-xl bg-[var(--accent)] text-white font-bold text-lg hover:brightness-110 transition-all press-effect"
                >
                  Rate Another Car
                </button>
                <button className="flex-1 py-4 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] font-medium hover:bg-white/[0.03] transition-all press-effect">
                  Share Score
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
