"use client";

import { useState, useCallback, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ScoreRing from "@/components/ScoreRing";
import ScoreBar from "@/components/ScoreBar";
import Confetti from "@/components/Confetti";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import ReelCard from "@/components/ReelCard";
import { getScoreLabel, getScoreColor } from "@/lib/ai-scoring";

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
  interior: number;
  sound: number;
  carmogScore: number;
  roast: string;
  highlights: string[];
  lowlights: string[];
  detailed_breakdown: Record<string, string>;
}

const LOADING_STEPS = [
  "Uploading images...",
  "AI is analyzing your car...",
  "Calculating scores...",
  "Generating roast...",
];

const CATEGORY_LABELS: Record<string, string> = {
  aura: "Aura",
  larp: "Larp",
  money: "Money",
  demand: "Demand",
  hype: "Hype",
  interior: "Interior",
  sound: "Sound",
};

const cardStyle: React.CSSProperties = { borderRadius: 12, background: "#111114", border: "1px solid rgba(255,255,255,0.07)", padding: 20 };

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
  const [shareCopied, setShareCopied] = useState(false);

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

  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

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

  const handleShare = async () => {
    if (!result) return;
    const text = `Check out my CarMogger score! ${result.carmogScore.toFixed(2)} on carmogger.com`;
    try {
      await navigator.clipboard.writeText(text);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  const reset = () => {
    setImages([]);
    setPreviews([]);
    setResult(null);
    setError(null);
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh" }}>
      <Navbar />
      <Confetti trigger={showConfetti} />
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />

      {/* Hero header */}
      <section style={{ width: "100%", paddingTop: 120, paddingBottom: 40, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 600, height: 300, background: "radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="ctr" style={{ textAlign: "center", position: "relative" }}>
          <p className="fade-up d1 mono" style={{ fontSize: 11, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>[ Rate your car ]</p>
          <h1 className="fade-up d2" style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, color: "white", lineHeight: 1.05, margin: "0 auto", maxWidth: 600 }}>
            Upload your car.<br />
            <span style={{ color: "#52525b" }}>Get your mog score.</span>
          </h1>
          <p className="fade-up d3" style={{ marginTop: 16, fontSize: 14, color: "#a1a1aa", lineHeight: 1.6, maxWidth: 460, marginLeft: "auto", marginRight: "auto" }}>
            Upload 1-4 photos. More angles = more accurate score.
          </p>
        </div>
      </section>

      <section style={{ width: "100%", paddingBottom: 80 }}>
        <div className="ctr">
          {loading ? (
            /* LOADING STATE */
            <div className="fade-up d1" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0" }}>
              <div style={{ marginBottom: 40, opacity: 0.5 }}>
                <svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 40 C15 40 18 28 30 24 C38 21 48 18 60 18 C72 18 82 21 90 24 C102 28 105 40 105 40" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                  <path d="M8 42 L15 40 L105 40 L112 42 L112 46 C112 48 110 50 108 50 L12 50 C10 50 8 48 8 46 Z" stroke="#3b82f6" strokeWidth="2" fill="#3b82f6" fillOpacity="0.05" />
                  <circle cx="30" cy="50" r="7" stroke="#3b82f6" strokeWidth="2" fill="none" />
                  <circle cx="90" cy="50" r="7" stroke="#3b82f6" strokeWidth="2" fill="none" />
                  <path d="M35 30 L50 24 L75 24 L85 30" stroke="#3b82f6" strokeWidth="1.5" opacity="0.4" />
                </svg>
              </div>

              <div style={{ width: "100%", maxWidth: 400, marginBottom: 32 }}>
                <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 3, background: "#3b82f6", transition: "width 0.3s ease-out", width: `${loadingProgress}%` }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                  <span className="mono" style={{ fontSize: 11, color: "#52525b" }}>{Math.round(loadingProgress)}%</span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 340 }}>
                {LOADING_STEPS.map((step, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, transition: "all 0.3s", color: i < loadingStep ? "#34d399" : i === loadingStep ? "white" : "#52525b" }}>
                    <div style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {i < loadingStep ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                      ) : i === loadingStep ? (
                        <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", display: "block", animation: "spin 1s linear infinite" }} />
                      ) : (
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", opacity: 0.4 }} />
                      )}
                    </div>
                    <span style={{ fontWeight: i === loadingStep ? 500 : 400 }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : !result ? (
            <>
              {/* UPLOAD AREA */}
              <div
                style={{ ...cardStyle, padding: 48, textAlign: "center", cursor: "pointer", transition: "border-color 0.2s", borderColor: dragOver ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.07)" }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <input id="file-input" type="file" accept="image/*" multiple style={{ display: "none" }} onChange={(e) => e.target.files && handleFiles(e.target.files)} />

                {previews.length > 0 ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }} onClick={(e) => e.stopPropagation()}>
                    {previews.map((src, i) => (
                      <div key={i} style={{ position: "relative", aspectRatio: "16/9", borderRadius: 8, overflow: "hidden" }}>
                        <img src={src} alt={`Preview ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <button
                          onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                          style={{ position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: 8, background: "rgba(0,0,0,0.6)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.7)" }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                    {previews.length < 4 && (
                      <div
                        style={{ aspectRatio: "16/9", borderRadius: 8, border: "1px dashed rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                        onClick={() => document.getElementById("file-input")?.click()}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#52525b" strokeWidth="1.5"><path d="M12 5v14M5 12h14" /></svg>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div style={{ width: 64, height: 64, margin: "0 auto 16px", borderRadius: 16, background: "rgba(59,130,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "white" }}>Drag & drop your car photos</p>
                    <p style={{ fontSize: 13, color: "#52525b", marginTop: 4 }}>or click to browse — max 4 images</p>
                    <p className="mono" style={{ fontSize: 11, color: "#3f3f46", marginTop: 12 }}>Supported: JPG, PNG, WebP</p>
                  </div>
                )}
              </div>

              {images.length > 0 && (
                <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{ flex: 1, height: 48, borderRadius: 8, background: "#3b82f6", color: "white", fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer", opacity: loading ? 0.5 : 1 }}
                  >
                    Get Mog Score
                  </button>
                  <button
                    onClick={reset}
                    style={{ padding: "0 24px", height: 48, borderRadius: 8, border: "1px solid rgba(255,255,255,0.07)", background: "transparent", color: "#a1a1aa", fontSize: 14, fontWeight: 500, cursor: "pointer" }}
                  >
                    Clear
                  </button>
                </div>
              )}

              {error && (
                <div style={{ marginTop: 16, padding: 16, borderRadius: 12, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontSize: 13 }}>
                  {error}
                </div>
              )}
            </>
          ) : (
            /* RESULTS */
            <>
              <div className="fade-up d1" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, marginBottom: 40 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <p className="mono" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#52525b", marginBottom: 16 }}>Your Mog Score</p>
                  <ScoreRing score={result.carmogScore} size={240} strokeWidth={10} delay={300} />
                  <p style={{ marginTop: 16, fontSize: 18, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: getScoreColor(result.carmogScore) }}>
                    {getScoreLabel(result.carmogScore)}
                  </p>
                </div>

                <div style={{ textAlign: "center" }}>
                  <h2 style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 800, color: "white", marginBottom: 8 }}>
                    {result.year} {result.make} {result.model}
                  </h2>
                  <p style={{ fontSize: 15, color: "#a1a1aa" }}>
                    {result.color} &middot; {result.condition}
                    {result.mods.length > 0 && ` · ${result.mods.length} mods detected`}
                  </p>
                  {result.mods.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16, justifyContent: "center" }}>
                      {result.mods.slice(0, 6).map((mod, i) => (
                        <span key={i} className="mono" style={{ fontSize: 11, padding: "4px 12px", borderRadius: 20, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#52525b" }}>
                          {mod}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Roast */}
              <div className="fade-up d2" style={{ ...cardStyle, marginBottom: 16 }}>
                <p className="mono" style={{ fontSize: 10, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>The Verdict</p>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "#a1a1aa" }}>{result.roast}</p>
              </div>

              {/* Score bars */}
              <div className="fade-up d3" style={{ ...cardStyle, marginBottom: 16 }}>
                <p className="mono" style={{ fontSize: 10, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 20 }}>Score Breakdown</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <ScoreBar label="Aura" value={result.aura} delay={500} />
                  <ScoreBar label="Larp" value={result.larp} delay={600} />
                  <ScoreBar label="Money" value={result.money} delay={700} />
                  <ScoreBar label="Demand" value={result.demand} delay={800} />
                  <ScoreBar label="Hype" value={result.hype} delay={900} />
                  <ScoreBar label="Interior" value={result.interior} delay={1000} />
                  <ScoreBar label="Sound" value={result.sound} delay={1100} />
                </div>
              </div>

              {/* Detailed Breakdown */}
              {result.detailed_breakdown && (
                <div className="fade-up d4" style={{ ...cardStyle, marginBottom: 16 }}>
                  <p className="mono" style={{ fontSize: 10, fontWeight: 700, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>Detailed Breakdown</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {Object.entries(result.detailed_breakdown).map(([key, explanation]) => (
                      <div key={key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                          {CATEGORY_LABELS[key] || key}
                        </span>
                        <p style={{ fontSize: 13, lineHeight: 1.6, color: "#a1a1aa", margin: 0 }}>
                          {explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Highlights / Lowlights */}
              <div className="fade-up d4" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12, marginBottom: 16 }}>
                <div style={cardStyle}>
                  <p className="mono" style={{ fontSize: 10, fontWeight: 700, color: "#34d399", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>Highlights</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {result.highlights.map((h, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#a1a1aa" }}>
                        <span style={{ color: "#34d399", marginTop: 2 }}>+</span>
                        {h}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={cardStyle}>
                  <p className="mono" style={{ fontSize: 10, fontWeight: 700, color: "#f87171", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>Lowlights</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {result.lowlights.map((l, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#a1a1aa" }}>
                        <span style={{ color: "#f87171", marginTop: 2 }}>-</span>
                        {l}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sign up CTA */}
              {isLoggedIn === false && (
                <div className="fade-up d5" style={{ ...cardStyle, borderColor: "rgba(59,130,246,0.2)", background: "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, transparent 60%)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 16 }}>
                  <div>
                    <p style={{ fontWeight: 700, color: "white", fontSize: 14 }}>Sign up to save your score</p>
                    <p style={{ fontSize: 12, color: "#52525b", marginTop: 2 }}>Track your ratings, climb the leaderboard, and earn XP.</p>
                  </div>
                  <button onClick={() => setShowAuth(true)} style={{ padding: "10px 20px", borderRadius: 8, background: "#3b82f6", color: "white", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>
                    Create Account
                  </button>
                </div>
              )}

              {/* Actions */}
              <div className="fade-up d6" style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <button onClick={reset} style={{ flex: 1, minWidth: 200, height: 48, borderRadius: 8, background: "#3b82f6", color: "white", fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer" }}>
                  Rate Another Car
                </button>
                <button
                  onClick={handleShare}
                  style={{ flex: 1, minWidth: 200, height: 48, borderRadius: 8, border: "1px solid rgba(255,255,255,0.07)", background: shareCopied ? "rgba(52,211,153,0.1)" : "transparent", color: shareCopied ? "#34d399" : "#a1a1aa", fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }}
                >
                  {shareCopied ? "Copied!" : "Share Score"}
                </button>
                {previews.length > 0 && (
                  <ReelCard result={result} carImageSrc={previews[0]} />
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
