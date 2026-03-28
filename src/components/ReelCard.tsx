"use client";

import { useRef, useCallback } from "react";
import { getScoreLabel, getScoreColor } from "@/lib/ai-scoring";

interface ScoreResult {
  make: string;
  model: string;
  year: string | number;
  color: string;
  aura: number;
  larp: number;
  money: number;
  demand: number;
  hype: number;
  interior: number;
  sound: number;
  carmogScore: number;
  roast: string;
  detailed_breakdown?: Record<string, string>;
}

interface ReelCardProps {
  result: ScoreResult;
  carImageSrc: string;
}

const CATEGORIES = [
  { key: "aura", label: "AURA" },
  { key: "larp", label: "LARP" },
  { key: "money", label: "MONEY" },
  { key: "demand", label: "DEMAND" },
  { key: "hype", label: "HYPE" },
  { key: "interior", label: "INTERIOR" },
  { key: "sound", label: "SOUND" },
] as const;

function getBarColor(value: number): string {
  if (value >= 90) return "#60a5fa";
  if (value >= 75) return "#3b82f6";
  if (value >= 60) return "#8B5CF6";
  if (value >= 40) return "#10B981";
  if (value >= 20) return "#94a3b8";
  return "#64748b";
}

export default function ReelCard({ result, carImageSrc }: ReelCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const downloadReel = useCallback(async () => {
    if (!cardRef.current) return;
    const html2canvas = (await import("html2canvas-pro")).default;
    const canvas = await html2canvas(cardRef.current, {
      width: 1080,
      height: 1920,
      scale: 1,
      useCORS: true,
      backgroundColor: "#0a0a0b",
    });
    const link = document.createElement("a");
    link.download = `carmogger-${result.year}-${result.make}-${result.model}.png`.replace(/\s+/g, "-").toLowerCase();
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [result]);

  const scoreLabel = getScoreLabel(result.carmogScore);
  const scoreColor = getScoreColor(result.carmogScore);

  // Get top 2-3 categories by score for detailed breakdown display
  const topCategories = [...CATEGORIES]
    .map((c) => ({ ...c, value: result[c.key] as number }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  return (
    <>
      {/* Hidden off-screen card for rendering */}
      <div style={{ position: "fixed", left: "-9999px", top: 0, zIndex: -1 }}>
        <div
          ref={cardRef}
          style={{
            width: 1080,
            height: 1920,
            background: "linear-gradient(180deg, #0a0a0b 0%, #111114 100%)",
            position: "relative",
            overflow: "hidden",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          {/* Car image - top portion */}
          <div style={{ position: "relative", width: 1080, height: 660 }}>
            <img
              src={carImageSrc}
              alt="Car"
              crossOrigin="anonymous"
              style={{ width: 1080, height: 660, objectFit: "cover", display: "block" }}
            />
            {/* Gradient fade at bottom of image */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 200,
              background: "linear-gradient(transparent, #0a0a0b)",
            }} />
            {/* Logo overlay top-left */}
            <div style={{ position: "absolute", top: 40, left: 40, display: "flex", alignItems: "center", gap: 12 }}>
              <img src="/logo-header.png" alt="CarMogger" style={{ height: 36, width: "auto" }} />
            </div>
          </div>

          {/* Score section */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 80px", marginTop: -20 }}>
            {/* Giant score */}
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 150,
              fontWeight: 900,
              color: "white",
              lineHeight: 1,
              letterSpacing: "-4px",
              textShadow: `0 0 80px ${scoreColor}40`,
            }}>
              {result.carmogScore.toFixed(2)}
            </div>

            {/* Score label */}
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 26,
              fontWeight: 700,
              color: scoreColor,
              textTransform: "uppercase" as const,
              letterSpacing: "0.15em",
              marginTop: -8,
            }}>
              {scoreLabel}
            </div>

            {/* Car name */}
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 34,
              fontWeight: 800,
              color: "white",
              marginTop: 20,
              textAlign: "center" as const,
              lineHeight: 1.2,
            }}>
              {result.year} {result.make} {result.model}
            </div>

            {/* Score bars */}
            <div style={{ width: "100%", marginTop: 32, display: "flex", flexDirection: "column", gap: 16 }}>
              {CATEGORIES.map(({ key, label }) => {
                const value = result[key] as number;
                const barColor = getBarColor(value);
                return (
                  <div key={key} style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <div style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#52525b",
                      textTransform: "uppercase" as const,
                      width: 120,
                      letterSpacing: "0.08em",
                    }}>
                      {label}
                    </div>
                    <div style={{ flex: 1, height: 22, borderRadius: 11, background: "rgba(255,255,255,0.06)", overflow: "hidden", position: "relative" }}>
                      <div style={{
                        width: `${value}%`,
                        height: "100%",
                        borderRadius: 11,
                        background: `linear-gradient(90deg, ${barColor}cc, ${barColor})`,
                        boxShadow: `0 0 20px ${barColor}40`,
                      }} />
                    </div>
                    <div style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 18,
                      fontWeight: 700,
                      color: "white",
                      width: 60,
                      textAlign: "right" as const,
                    }}>
                      {value.toFixed(1)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Top category breakdowns */}
            {result.detailed_breakdown && (
              <div style={{ width: "100%", marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>
                {topCategories.map(({ key, label }) => {
                  const breakdown = result.detailed_breakdown?.[key];
                  if (!breakdown) return null;
                  return (
                    <div key={key} style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 17,
                      lineHeight: 1.4,
                      color: "#71717a",
                      padding: "0 10px",
                    }}>
                      <span style={{ color: "#a1a1aa", fontWeight: 700 }}>{label}:</span>{" "}
                      {breakdown.length > 80 ? breakdown.slice(0, 80) + "…" : breakdown}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Verdict/roast */}
            <div style={{
              marginTop: 28,
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 20,
              lineHeight: 1.5,
              color: "#a1a1aa",
              textAlign: "center" as const,
              padding: "0 20px",
            }}>
              &ldquo;{result.roast}&rdquo;
            </div>
          </div>

          {/* Watermark */}
          <div style={{
            position: "absolute",
            bottom: 40,
            left: 0,
            right: 0,
            textAlign: "center" as const,
            fontFamily: "'Space Mono', monospace",
            fontSize: 18,
            color: "#3f3f46",
            letterSpacing: "0.1em",
          }}>
            carmogger.com
          </div>
        </div>
      </div>

      {/* Download button */}
      <button
        onClick={downloadReel}
        style={{
          flex: 1,
          minWidth: 200,
          height: 48,
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.07)",
          background: "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, transparent 60%)",
          color: "#3b82f6",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download Reel
      </button>
    </>
  );
}
