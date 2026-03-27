"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Particles from "@/components/Particles";
import Footer from "@/components/Footer";
import ScoreRing from "@/components/ScoreRing";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { getScoreColor, getScoreLabel } from "@/lib/ai-scoring";
import { MOCK_CARS, type MockCar } from "@/lib/mock-data";

const AXES = ["aura", "larp", "money", "demand", "hype"] as const;
const AXIS_COLORS: Record<string, string> = {
  aura: "#8B5CF6",
  larp: "#10B981",
  money: "#3B82F6",
  demand: "#F59E0B",
  hype: "#EC4899",
};

function DiffBar({ label, valueA, valueB }: { label: string; valueA: number; valueB: number }) {
  const color = AXIS_COLORS[label.toLowerCase()] || "#3b82f6";
  const diff = valueA - valueB;
  const maxVal = Math.max(valueA, valueB);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold uppercase tracking-wider" style={{ color }}>
          {label}
        </span>
        <span className="text-xs font-bold tabular-nums" style={{ color: diff > 0 ? "#10B981" : diff < 0 ? "#EF4444" : "var(--text-muted)" }}>
          {diff > 0 ? "+" : ""}{diff}
        </span>
      </div>
      <div className="flex items-center gap-3">
        {/* Left car bar */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tabular-nums w-8 text-right" style={{ color }}>{valueA}</span>
            <div className="flex-1 h-2.5 rounded-full bg-white/[0.04] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${(valueA / 100) * 100}%`,
                  background: `linear-gradient(90deg, ${color}60, ${color})`,
                  boxShadow: `0 0 8px ${color}30`,
                  opacity: valueA >= valueB ? 1 : 0.5,
                }}
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-[var(--border)]" />

        {/* Right car bar */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2.5 rounded-full bg-white/[0.04] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${(valueB / 100) * 100}%`,
                  background: `linear-gradient(90deg, ${color}60, ${color})`,
                  boxShadow: `0 0 8px ${color}30`,
                  opacity: valueB >= valueA ? 1 : 0.5,
                }}
              />
            </div>
            <span className="text-xs font-bold tabular-nums w-8" style={{ color }}>{valueB}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CarSelector({
  selected,
  onChange,
  excludeId,
  label,
}: {
  selected: MockCar | null;
  onChange: (car: MockCar) => void;
  excludeId: string | null;
  label: string;
}) {
  return (
    <div className="flex-1">
      <label className="block text-xs text-[var(--text-muted)] uppercase tracking-wider font-bold mb-2">{label}</label>
      <select
        value={selected?.id || ""}
        onChange={(e) => {
          const car = MOCK_CARS.find((c) => c.id === e.target.value);
          if (car) onChange(car);
        }}
        className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-white text-sm font-medium appearance-none cursor-pointer hover:border-[var(--border-hover)] transition-all focus:outline-none focus:border-blue-500/40"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238892a4' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
      >
        <option value="" disabled>Select a car</option>
        {MOCK_CARS.filter((c) => c.id !== excludeId).map((car) => (
          <option key={car.id} value={car.id}>{car.carName} ({car.score})</option>
        ))}
      </select>
    </div>
  );
}

export default function ComparePage() {
  const [carA, setCarA] = useState<MockCar | null>(MOCK_CARS[0]);
  const [carB, setCarB] = useState<MockCar | null>(MOCK_CARS[1]);
  useScrollReveal();

  const overallDiff = carA && carB ? carA.score - carB.score : 0;

  return (
    <>
      <Particles />
      <Navbar />

      <main className="relative z-10 min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 scroll-reveal">
            <h1 className="text-4xl sm:text-5xl font-black mb-3">
              Car <span className="text-[var(--accent)]">Compare</span>
            </h1>
            <p className="text-[var(--text-secondary)]">
              Put two cars head-to-head. Every axis, side by side.
            </p>
          </div>

          {/* Selectors */}
          <div className="flex flex-col sm:flex-row items-end gap-4 mb-10 scroll-reveal">
            <CarSelector selected={carA} onChange={setCarA} excludeId={carB?.id || null} label="Car A" />
            <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-[var(--bg-card)] border border-[var(--border)] shrink-0 mb-0.5">
              <span className="text-sm font-black text-[var(--text-muted)]">VS</span>
            </div>
            <CarSelector selected={carB} onChange={setCarB} excludeId={carA?.id || null} label="Car B" />
          </div>

          {carA && carB && (
            <>
              {/* Car cards side by side */}
              <div className="grid md:grid-cols-2 gap-6 mb-8 scroll-reveal">
                {[carA, carB].map((car, idx) => {
                  const color = getScoreColor(car.score);
                  const label = getScoreLabel(car.score);
                  const isWinner = idx === 0 ? carA.score > carB.score : carB.score > carA.score;
                  return (
                    <div
                      key={car.id}
                      className={`rounded-3xl bg-[var(--bg-card)] border overflow-hidden transition-all ${
                        isWinner ? "border-blue-500/30 ring-1 ring-blue-500/10" : "border-[var(--border)]"
                      }`}
                    >
                      <div className="aspect-video overflow-hidden relative">
                        <img
                          src={car.imageUrl}
                          alt={car.carName}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent" />
                        {isWinner && (
                          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-xs font-bold text-blue-400">
                            Winner
                          </div>
                        )}
                      </div>
                      <div className="p-6 flex items-center gap-4">
                        <ScoreRing score={car.score} size={100} strokeWidth={6} delay={200 + idx * 200} />
                        <div>
                          <p className="text-xs uppercase tracking-widest font-bold mb-0.5" style={{ color }}>{label}</p>
                          <h3 className="text-lg font-black">{car.carName}</h3>
                          <p className="text-xs text-[var(--text-muted)] mt-1">@{car.username}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Overall diff */}
              <div className="text-center mb-8 scroll-reveal">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
                  <span className="text-sm text-[var(--text-muted)]">Overall difference</span>
                  <span
                    className="text-2xl font-black tabular-nums"
                    style={{ color: overallDiff > 0 ? "#10B981" : overallDiff < 0 ? "#EF4444" : "var(--text-muted)" }}
                  >
                    {overallDiff > 0 ? "+" : ""}{overallDiff}
                  </span>
                </div>
              </div>

              {/* Axis comparison */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border)] scroll-reveal">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">{carA.carName.split(" ").slice(1).join(" ")}</p>
                  <p className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest">Score Breakdown</p>
                  <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">{carB.carName.split(" ").slice(1).join(" ")}</p>
                </div>
                <div className="space-y-5">
                  {AXES.map((axis) => (
                    <DiffBar
                      key={axis}
                      label={axis.charAt(0).toUpperCase() + axis.slice(1)}
                      valueA={carA[axis]}
                      valueB={carB[axis]}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
