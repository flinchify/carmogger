"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScoreRing from "@/components/ScoreRing";
import { getScoreColor, getScoreLabel } from "@/lib/ai-scoring";
import Link from "next/link";

interface Car {
  id: number; brand: string; model: string; year: number; carmog_score: number;
  aura: number; larp: number; money: number; demand: number; hype: number;
  images: string[]; username: string;
}

const AXES = ["aura", "larp", "money", "demand", "hype"] as const;
const AXIS_WEIGHTS: Record<string, string> = { aura: "25%", larp: "20%", money: "20%", demand: "20%", hype: "15%" };

export default function ComparePage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [carAId, setCarAId] = useState<number | null>(null);
  const [carBId, setCarBId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/leaderboard?sort=score&limit=20")
      .then(r => r.json())
      .then(d => {
        const entries = d.entries || d || [];
        setCars(entries);
        if (entries.length >= 2) { setCarAId(entries[0].id); setCarBId(entries[1].id); }
      }).catch(() => {});
  }, []);

  const carA = cars.find(c => c.id === carAId);
  const carB = cars.find(c => c.id === carBId);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-black text-[#1a1a2e] mb-3">Com<span className="text-blue-500">pare</span></h1>
            <p className="text-gray-500 max-w-md mx-auto">Put two cars head to head. Every axis, side by side.</p>
          </div>

          {cars.length < 2 ? (
            <div className="max-w-md mx-auto text-center py-20 rounded-[20px] bg-[#f8fafc] border border-gray-100">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" className="mx-auto mb-4"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
              <h3 className="text-lg font-bold text-[#1a1a2e] mb-2">Need at least 2 cars to compare</h3>
              <p className="text-sm text-gray-500 mb-6">Upload your car first, then come back to compare.</p>
              <Link href="/rate" className="px-6 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors">Upload Your Car</Link>
            </div>
          ) : carA && carB ? (
            <>
              <div className="grid md:grid-cols-2 gap-6 mb-10">
                {[{ label: "Car A", value: carAId, setter: setCarAId }, { label: "Car B", value: carBId, setter: setCarBId }].map((sel) => (
                  <div key={sel.label}>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{sel.label}</label>
                    <select value={sel.value || ""} onChange={(e) => sel.setter(Number(e.target.value))} className="w-full px-4 py-3 rounded-[16px] bg-[#f8fafc] border border-gray-200 text-[#1a1a2e] text-sm font-medium appearance-none cursor-pointer hover:border-gray-300 transition-colors">
                      {cars.map((car) => <option key={car.id} value={car.id}>{car.year} {car.brand} {car.model}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-10">
                {[carA, carB].map((car, idx) => {
                  const score = Number(car.carmog_score);
                  const color = getScoreColor(score);
                  return (
                    <div key={idx} className="rounded-[20px] bg-[#f8fafc] border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
                      <div className="aspect-[16/9] overflow-hidden relative bg-gray-200">
                        {car.images?.[0] && <img src={car.images[0]} alt="" className="w-full h-full object-cover" />}
                        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm font-black bg-white shadow-md" style={{ color }}>{getScoreLabel(score)}</div>
                      </div>
                      <div className="p-6 flex items-center gap-5">
                        <ScoreRing score={score} size={100} delay={idx * 200 + 300} />
                        <div>
                          <h3 className="text-lg font-black text-[#1a1a2e]">{car.year} {car.brand} {car.model}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">@{car.username}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-[20px] bg-[#f8fafc] border border-gray-100 p-8 mb-8">
                <h2 className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Overall Score</h2>
                <div className="flex items-center justify-center gap-8 sm:gap-16">
                  <div className="text-center">
                    <p className="text-5xl sm:text-6xl font-black tabular-nums" style={{ color: getScoreColor(Number(carA.carmog_score)) }}>{Number(carA.carmog_score)}</p>
                    <p className="text-sm text-gray-500 mt-2">{carA.brand} {carA.model}</p>
                  </div>
                  <div className="text-2xl font-black text-gray-300">vs</div>
                  <div className="text-center">
                    <p className="text-5xl sm:text-6xl font-black tabular-nums" style={{ color: getScoreColor(Number(carB.carmog_score)) }}>{Number(carB.carmog_score)}</p>
                    <p className="text-sm text-gray-500 mt-2">{carB.brand} {carB.model}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[20px] bg-[#f8fafc] border border-gray-100 p-8">
                <h2 className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Score Breakdown</h2>
                <div className="space-y-6">
                  {AXES.map((axis) => {
                    const valA = Number((carA as Record<string, unknown>)[axis]);
                    const valB = Number((carB as Record<string, unknown>)[axis]);
                    const colorA = getScoreColor(valA);
                    const colorB = getScoreColor(valB);
                    return (
                      <div key={axis}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold tabular-nums" style={{ color: colorA }}>{valA}</span>
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{axis} <span className="text-gray-400 font-normal">({AXIS_WEIGHTS[axis]})</span></span>
                          <span className="text-sm font-bold tabular-nums" style={{ color: colorB }}>{valB}</span>
                        </div>
                        <div className="flex gap-1">
                          <div className="flex-1 h-3 rounded-full bg-gray-200 overflow-hidden flex justify-end">
                            <div className="h-full rounded-full" style={{ width: `${valA}%`, background: colorA }} />
                          </div>
                          <div className="flex-1 h-3 rounded-full bg-gray-200 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${valB}%`, background: colorB }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}
