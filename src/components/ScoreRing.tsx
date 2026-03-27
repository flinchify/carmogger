"use client";

import { useEffect, useState } from "react";
import { getScoreColor, getScoreLabel } from "@/lib/ai-scoring";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  animate?: boolean;
  delay?: number;
}

export default function ScoreRing({ score, size = 160, strokeWidth = 8, animate = true, delay = 0 }: ScoreRingProps) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);
  const [mounted, setMounted] = useState(!animate);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (displayScore / 100) * circumference;
  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  useEffect(() => {
    if (!animate) return;

    const timer = setTimeout(() => {
      setMounted(true);
      let current = 0;
      const step = score / 60;
      const interval = setInterval(() => {
        current += step;
        if (current >= score) {
          current = score;
          clearInterval(interval);
        }
        setDisplayScore(Math.round(current));
      }, 16);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [score, animate, delay]);

  return (
    <div className="relative inline-flex items-center justify-center group" style={{ width: size, height: size }}>
      {/* Glow effect behind the ring */}
      <div
        className="absolute inset-0 rounded-full opacity-20 blur-xl transition-opacity group-hover:opacity-30"
        style={{ background: color }}
      />

      <svg width={size} height={size} className="transform -rotate-90 relative z-10">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(148, 163, 184, 0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Score ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          style={{
            transition: mounted ? "stroke-dashoffset 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)" : "none",
            filter: `drop-shadow(0 0 10px ${color}40)`,
          }}
        />
      </svg>

      <div className="absolute flex flex-col items-center z-10">
        <span
          className="font-black tabular-nums transition-transform group-hover:scale-110"
          style={{ color, fontSize: size * 0.22 }}
        >
          {displayScore}
        </span>
        <span
          className="uppercase tracking-[0.15em] font-bold"
          style={{ color, fontSize: Math.max(8, size * 0.06) }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
