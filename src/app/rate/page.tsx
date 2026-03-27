"use client";

import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Particles from "@/components/Particles";
import ScoreRing from "@/components/ScoreRing";
import ScoreBar from "@/components/ScoreBar";
import Confetti from "@/components/Confetti";
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
  carmogScore: number;
  roast: string;
  highlights: string[];
  lowlights: string[];
}

export default function RatePage() {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files).slice(0, 4);
    setImages(fileArray);
    setPreviews(fileArray.map((f) => URL.createObjectURL(f)));
    setResult(null);
    setError(null);
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

    try {
      const formData = new FormData();
      images.forEach((img) => formData.append("images", img));

      const res = await fetch("/api/rate", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Rating failed");

      setResult(data);
      if (data.carmogScore >= 90) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImages([]);
    setPreviews([]);
    setResult(null);
    setError(null);
  };

  return (
    <>
      <Particles />
      <Navbar />
      <Confetti trigger={showConfetti} />

      <main className="relative z-10 min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {!result ? (
            <>
              {/* Upload area */}
              <div className="text-center mb-10">
                <h1 className="text-4xl sm:text-5xl font-black mb-3">
                  Rate your <span className="text-[var(--accent)]">ride</span>
                </h1>
                <p className="text-[var(--text-secondary)]">
                  Upload 1-4 photos. More angles = more accurate score.
                </p>
              </div>

              <div
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                  dragOver
                    ? "border-[var(--accent)] bg-[var(--accent)]/5"
                    : "border-[var(--border)] hover:border-[var(--border-hover)] bg-[var(--bg-card)]"
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                />

                {previews.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {previews.map((src, i) => (
                      <div key={i} className="aspect-video rounded-xl overflow-hidden">
                        <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-white/[0.04] flex items-center justify-center">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Drop your car photos here</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">or click to browse (max 4 images)</p>
                    </div>
                  </div>
                )}
              </div>

              {images.length > 0 && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 py-4 rounded-xl bg-[var(--accent)] text-white font-bold text-lg hover:brightness-110 transition-all press-effect disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        AI is judging your car...
                      </span>
                    ) : (
                      "Get CarMog Score"
                    )}
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
                <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}
            </>
          ) : (
            /* Results */
            <>
              <div className="text-center mb-10 animate-slide-up">
                <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">Your CarMog Score</p>
                <ScoreRing score={result.carmogScore} size={200} strokeWidth={10} delay={300} />
              </div>

              {/* Car info */}
              <div className="text-center mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <h2 className="text-2xl sm:text-3xl font-black">
                  {result.year} {result.make} {result.model}
                </h2>
                <p className="text-[var(--text-secondary)] mt-1">
                  {result.color} · {result.condition}
                  {result.mods.length > 0 && ` · ${result.mods.length} mods detected`}
                </p>
              </div>

              {/* Roast */}
              <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] mb-8 animate-slide-up" style={{ animationDelay: "0.3s" }}>
                <p className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">The Verdict</p>
                <p className="text-lg leading-relaxed">{result.roast}</p>
              </div>

              {/* Score bars */}
              <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] mb-8 space-y-4 animate-slide-up" style={{ animationDelay: "0.4s" }}>
                <ScoreBar label="Aura" value={result.aura} delay={500} />
                <ScoreBar label="Larp" value={result.larp} delay={650} />
                <ScoreBar label="Money" value={result.money} delay={800} />
                <ScoreBar label="Demand" value={result.demand} delay={950} />
                <ScoreBar label="Hype" value={result.hype} delay={1100} />
              </div>

              {/* Highlights / Lowlights */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8 animate-slide-up" style={{ animationDelay: "0.5s" }}>
                <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
                  <p className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-3">Highlights</p>
                  <ul className="space-y-2">
                    {result.highlights.map((h, i) => (
                      <li key={i} className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5">+</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
                  <p className="text-sm font-bold text-red-400 uppercase tracking-widest mb-3">Lowlights</p>
                  <ul className="space-y-2">
                    {result.lowlights.map((l, i) => (
                      <li key={i} className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                        <span className="text-red-400 mt-0.5">-</span>
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 animate-slide-up" style={{ animationDelay: "0.6s" }}>
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
    </>
  );
}
