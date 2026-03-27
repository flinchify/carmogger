"use client";

import { getScoreColor, getScoreLabel } from "@/lib/ai-scoring";
import Link from "next/link";

interface CarCardProps {
  id: number;
  images: string[];
  brand: string;
  model: string;
  year: number;
  carmogScore: number;
  username: string;
  userAvatar?: string;
  league?: string;
  rank?: number;
  views?: number;
}

export default function CarCard({
  id, images, brand, model, year, carmogScore, username, userAvatar, league, rank, views,
}: CarCardProps) {
  const color = getScoreColor(carmogScore);
  const label = getScoreLabel(carmogScore);

  return (
    <Link href={`/car/${id}`}>
      <div className="group relative bg-[var(--bg-card)] rounded-2xl overflow-hidden border border-[var(--border)] hover-tilt press-effect cursor-pointer">
        {/* Rank badge */}
        {rank && rank <= 3 && (
          <div className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black"
            style={{
              background: rank === 1 ? "#F59E0B" : rank === 2 ? "#94A3B8" : "#CD7F32",
              color: "#000",
            }}>
            {rank}
          </div>
        )}

        {/* Score badge */}
        <div
          className="absolute top-3 right-3 z-10 px-3 py-1.5 rounded-full text-sm font-black backdrop-blur-md"
          style={{
            background: `${color}20`,
            color,
            border: `1px solid ${color}40`,
            boxShadow: `0 0 20px ${color}20`,
          }}
        >
          {carmogScore}
        </div>

        {/* Image */}
        <div className="aspect-[16/10] overflow-hidden">
          {images[0] ? (
            <img
              src={images[0]}
              alt={`${brand} ${model}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-[var(--bg-secondary)] flex items-center justify-center">
              <span className="text-[var(--text-muted)]">No image</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>

        {/* Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest font-bold" style={{ color }}>
                {label}
              </p>
              <h3 className="text-lg font-bold mt-0.5">
                {year} {brand} {model}
              </h3>
              <div className="flex items-center gap-2 mt-1.5">
                {userAvatar ? (
                  <img src={userAvatar} alt={username} className="w-5 h-5 rounded-full" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-[var(--border)]" />
                )}
                <span className="text-xs text-[var(--text-secondary)]">@{username}</span>
              </div>
            </div>
            {views !== undefined && (
              <div className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {views.toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
