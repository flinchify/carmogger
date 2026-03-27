'use client';

import Image from 'next/image';


function getScoreLabel(score: number) {
  if (score >= 90) return 'APEX MOG';
  if (score >= 75) return 'MOG MACHINE';
  if (score >= 60) return 'SHOW STOPPER';
  if (score >= 40) return 'CLEAN BUILD';
  if (score >= 20) return 'STREET SLEEPER';
  return 'STOCK ANDY';
}

export default function ScoreHero() {
  const car = { carName: 'Upload your first car', score: 0, imageUrl: '' };

  return (
    <div className="relative h-full overflow-hidden rounded-[20px]"
      style={{ background: '#0f1420', border: '1px solid rgba(148,163,184,0.08)' }}>
      {/* Car image */}
      <div className="absolute inset-0">
        <Image
          src={car.imageUrl}
          alt={car.carName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 42vw"
          priority
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, rgba(6,8,13,0.85) 0%, rgba(6,8,13,0.5) 40%, rgba(6,8,13,0.75) 100%)',
        }} />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-6 lg:p-8">
        {/* Top: Car name + percentile */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-[#8892a4] mb-1">{car.carName}</p>
            <p className="text-xs font-medium px-2.5 py-1 rounded-full inline-block"
              style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>
              Top 7% this week
            </p>
          </div>
        </div>

        {/* Center: GIANT score */}
        <div className="flex items-center justify-center py-4">
          <div className="text-center">
            <p className="text-[96px] lg:text-[120px] font-black leading-none tracking-tight text-[#f0f2f5]"
              style={{ fontFamily: 'Outfit, sans-serif', textShadow: '0 0 60px rgba(59,130,246,0.2)' }}>
              {car.score}
            </p>
            <p className="text-sm font-bold tracking-[0.2em] mt-1"
              style={{ color: '#3b82f6' }}>
              {getScoreLabel(car.score)}
            </p>
          </div>
        </div>

        {/* Bottom: Actions */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-medium transition-all hover:opacity-90 btn-shine"
            style={{ background: '#3b82f6', color: '#fff' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            Share Score
          </button>
          <button className="flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-medium transition-all hover:bg-[rgba(148,163,184,0.12)]"
            style={{ border: '1px solid rgba(148,163,184,0.12)', color: '#8892a4' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
            </svg>
            Re-analyze
          </button>
        </div>
      </div>
    </div>
  );
}
