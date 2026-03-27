'use client';

const LEAGUE_LABELS: Record<string, string> = {
  apex: 'Apex',
  elite: 'Elite',
  track: 'Track',
  street: 'Street',
  garage: 'Garage',
  junkyard: 'Junkyard',
};

export default function ProfileRankCard() {
  const username = 'boost_szn';
  const displayName = 'Marcus T.';
  const league = 'elite';
  const level = 31;
  const xp = 2480;
  const xpNext = 3000;
  const rank = 43;
  const progress = Math.round((xp / xpNext) * 100);

  return (
    <div className="h-full flex flex-col p-6 rounded-[20px]"
      style={{ background: '#0f1420', border: '1px solid rgba(148,163,184,0.08)' }}>
      {/* Avatar + handle */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-14 h-14 rounded-full bg-[#1e293b] flex items-center justify-center text-lg font-bold text-[#3b82f6]"
          style={{ border: '2px solid rgba(59,130,246,0.3)' }}>
          {displayName[0]}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#f0f2f5]">{displayName}</p>
          <p className="text-xs text-[#64748b]">@{username}</p>
        </div>
      </div>

      {/* Social icons */}
      <div className="flex items-center gap-3 mb-5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#64748b">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#64748b">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#64748b">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.18z" />
        </svg>
      </div>

      {/* Rank badge */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(59,130,246,0.1)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span className="text-xs font-semibold text-[#3b82f6]">{LEAGUE_LABELS[league]} League</span>
        </div>
        <span className="text-xs text-[#64748b]">#{rank}</span>
      </div>

      {/* Level progress */}
      <div className="mt-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#8892a4]">Level {level}</span>
          <span className="text-xs text-[#64748b]">{xp.toLocaleString()} / {xpNext.toLocaleString()} XP</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(148,163,184,0.08)' }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #3b82f6, #60a5fa)' }} />
        </div>
        <p className="text-xs text-[#64748b] mt-2">Next rank in {(xpNext - xp).toLocaleString()} points</p>
      </div>
    </div>
  );
}
