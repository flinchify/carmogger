'use client';

import Link from 'next/link';

const stats = [
  {
    label: 'Page Views',
    value: '9,412',
    trend: '+12%',
    up: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    label: 'Leaderboard',
    value: '#43',
    trend: '+5',
    up: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    label: 'Followers',
    value: '284',
    trend: '+18',
    up: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="23" y1="11" x2="17" y2="11" />
      </svg>
    ),
  },
];

export default function QuickStats() {
  return (
    <div className="h-full flex flex-col gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="flex-1 flex items-center gap-3 p-4 rounded-[20px]"
          style={{ background: '#0f1420', border: '1px solid rgba(148,163,184,0.08)' }}>
          <div className="flex items-center justify-center w-10 h-10 rounded-xl"
            style={{ background: 'rgba(59,130,246,0.08)' }}>
            {stat.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#64748b] mb-0.5">{stat.label}</p>
            <p className="text-lg font-bold text-[#f0f2f5]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {stat.value}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke={stat.up ? '#22c55e' : '#ef4444'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points={stat.up ? '18 15 12 9 6 15' : '6 9 12 15 18 9'} />
            </svg>
            <span className="text-xs font-medium" style={{ color: stat.up ? '#22c55e' : '#ef4444' }}>
              {stat.trend}
            </span>
          </div>
        </div>
      ))}

      {/* Upload button */}
      <Link href="/rate"
        className="flex items-center justify-center gap-2 h-11 rounded-[20px] text-sm font-semibold transition-all hover:opacity-90 btn-shine"
        style={{ background: '#3b82f6', color: '#fff' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Upload New Car
      </Link>
    </div>
  );
}
