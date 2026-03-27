"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Particles from "@/components/Particles";
import Footer from "@/components/Footer";
import ScoreRing from "@/components/ScoreRing";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { getScoreColor, getScoreLabel } from "@/lib/ai-scoring";
import { MOCK_CARS } from "@/lib/mock-data";

const AXES = ["aura", "larp", "money", "demand", "hype"] as const;
const AXIS_WEIGHTS: Record<string, string> = {
  aura: "25%",
  larp: "20%",
  money: "20%",
  demand: "20%",
  hype: "15%",
};

export default function ComparePage() {
  const [carAIndex, setCarAIndex] = useState(0);
  const [carBIndex, setCarBIndex] = useState(1);
  useScrollReveal();

  const carA = MOCK_CARS[carAIndex];
  const carB = MOCK_CARS[carBIndex];

  const getAxisValue = (car: typeof carA, axis: string): number => {
    return car[axis as keyof typeof car] as number;
  };

  return (
    <>
      <Particles />
      <Navbar />

      <main className="relative z-10 min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-10 scroll-reveal">
            <h1 className="text-4xl sm:text-5xl font-black mb-3">
              Com<span className="text-[var(--accent)]">pare</span>
            </h1>
            <p className="text-[var(--text-secondary)] max-w-md mx-auto">
              Put two cars head to head. Every axis, side by side.
            </p>
          </div>

          {/* Car selectors */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {[{ label: "Car A", value: carAIndex, setter: setCarAIndex }, { label: "Car B", value: carBIndex, setter: setCarBIndex }].map((sel) => (
              <div key={sel.label} className="scroll-reveal">
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">{sel.label}</label>
                <select
                  value={sel.value}
                  onChange={(e) => sel.setter(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-[16px] bg-[var(--bg-card)] border border-[var(--border)] text-white text-sm font-medium appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%238892a4' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center" }}
                >
                  {MOCK_CARS.map((car, i) => (
                    <option key={car.id} value={i}>{car.year} {car.brand} {car.model}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Car Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {[carA, carB].map((car, idx) => {
              const color = getScoreColor(car.score);
              const label = getScoreLabel(car.score);
              return (
                <div key={idx} className="scroll-reveal rounded-[20px] bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden">
                  <div className="aspect-[16/9] overflow-hidden relative">
                    <img src={car.imageUrl} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent" />
                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm font-black backdrop-blur-md" style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
                      {label}
                    </div>
                  </div>
                  <div className="p-6 flex items-center gap-5">
                    <ScoreRing score={car.score} size={100} delay={idx * 200 + 300} />
                    <div>
                      <h3 className="text-lg font-black">{car.year} {car.brand} {car.model}</h3>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">@{car.username}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Overall Score Comparison */}
          <div className="scroll-reveal rounded-[20px] bg-[var(--bg-card)] border border-[var(--border)] p-8 mb-8">
            <h2 className="text-center text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-6">Overall Score</h2>
            <div className="flex items-center justify-center gap-8 sm:gap-16">
              <div className="text-center">
                <p className="text-5xl sm:text-6xl font-black tabular-nums" style={{ color: getScoreColor(carA.score) }}>{carA.score}</p>
                <p className="text-sm text-[var(--text-muted)] mt-2">{carA.brand} {carA.model}</p>
              </div>
              <div className="text-2xl font-black text-[var(--text-muted)]">vs</div>
              <div className="text-center">
                <p className="text-5xl sm:text-6xl font-black tabular-nums" style={{ color: getScoreColor(carB.score) }}>{carB.score}</p>
                <p className="text-sm text-[var(--text-muted)] mt-2">{carB.brand} {carB.model}</p>
              </div>
            </div>
            {carA.score !== carB.score && (
              <p className="text-center text-sm mt-4">
                <span className="font-bold" style={{ color: getScoreColor(Math.max(carA.score, carB.score)) }}>
                  {carA.score > carB.score ? `${carA.brand} ${carA.model}` : `${carB.brand} ${carB.model}`}
                </span>
                <span className="text-[var(--text-muted)]"> wins by </span>
                <span className="font-bold text-white">{Math.abs(carA.score - carB.score)} points</span>
              </p>
            )}
          </div>

          {/* Axis-by-axis comparison */}
          <div className="scroll-reveal rounded-[20px] bg-[var(--bg-card)] border border-[var(--border)] p-8">
            <h2 className="text-center text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-8">Score Breakdown</h2>
            <div className="space-y-6">
              {AXES.map((axis) => {
                const valA = getAxisValue(carA, axis);
                const valB = getAxisValue(carB, axis);
                const colorA = getScoreColor(valA);
                const colorB = getScoreColor(valB);
                const winner = valA > valB ? "a" : valB > valA ? "b" : "tie";

                return (
                  <div key={axis}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold tabular-nums" style={{ color: colorA }}>
                        {valA}
                        {winner === "a" && <svg className="inline ml-1 -mt-0.5" width="10" height="10" viewBox="0 0 10 10" fill={colorA}><polygon points="5,0 10,10 0,10" /></svg>}
                      </span>
                      <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                        {axis} <span className="text-[var(--text-muted)] font-normal">({AXIS_WEIGHTS[axis]})</span>
                      </span>
                      <span className="text-sm font-bold tabular-nums" style={{ color: colorB }}>
                        {winner === "b" && <svg className="inline mr-1 -mt-0.5" width="10" height="10" viewBox="0 0 10 10" fill={colorB}><polygon points="5,0 10,10 0,10" /></svg>}
                        {valB}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <div className="flex-1 h-3 rounded-full bg-white/[0.04] overflow-hidden flex justify-end">
                        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${valA}%`, background: `linear-gradient(90deg, ${colorA}60, ${colorA})`, boxShadow: winner === "a" ? `0 0 8px ${colorA}40` : "none" }} />
                      </div>
                      <div className="flex-1 h-3 rounded-full bg-white/[0.04] overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${valB}%`, background: `linear-gradient(90deg, ${colorB}, ${colorB}60)`, boxShadow: winner === "b" ? `0 0 8px ${colorB}40` : "none" }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-8 mt-8 pt-6 border-t border-[var(--border)]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: getScoreColor(carA.score) }} />
                <span className="text-xs text-[var(--text-muted)]">{carA.brand} {carA.model}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: getScoreColor(carB.score) }} />
                <span className="text-xs text-[var(--text-muted)]">{carB.brand} {carB.model}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
