"use client";

import { useEffect, useState } from "react";
import { getScoreColor } from "@/lib/ai-scoring";

interface ScoreBarProps {
  label: string;
  value: number;
  delay?: number;
}

export default function ScoreBar({ label, value, delay = 0 }: ScoreBarProps) {
  const [show, setShow] = useState(false);
  const color = getScoreColor(value);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">{label}</span>
        <span className="text-sm font-bold tabular-nums" style={{ color }}>{value.toFixed(1)}</span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: show ? `${value}%` : "0%",
            background: `linear-gradient(90deg, ${color}80, ${color})`,
            boxShadow: `0 0 12px ${color}40`,
          }}
        />
      </div>
    </div>
  );
}
