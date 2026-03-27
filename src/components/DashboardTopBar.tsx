'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardTopBar() {
  const [user, setUser] = useState<{ username: string; avatar_url: string; display_name: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data?.user) setUser(data.user); })
      .catch(() => {});
  }, []);

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-[88px] h-[72px] flex items-center justify-between px-6 lg:px-8 z-40"
      style={{ background: 'rgba(6,8,13,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(148,163,184,0.08)' }}>
      {/* Left: Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-[#f0f2f5]" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Dashboard
        </h1>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex items-center max-w-md w-full mx-8">
        <div className="relative w-full">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search cars, users, metrics..."
            className="w-full h-10 pl-10 pr-4 rounded-xl text-sm outline-none transition-colors"
            style={{
              background: 'rgba(15,20,32,0.8)',
              border: '1px solid rgba(148,163,184,0.08)',
              color: '#f0f2f5',
            }}
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <button className="relative flex items-center justify-center w-10 h-10 rounded-xl transition-colors hover:bg-[rgba(148,163,184,0.08)]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8892a4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#3b82f6]" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[rgba(148,163,184,0.12)]">
          {user?.avatar_url ? (
            <Image src={user.avatar_url} alt={user.display_name || 'User'} width={36} height={36} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#1e293b] flex items-center justify-center text-xs font-medium text-[#8892a4]">
              {user?.display_name?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
        </div>

        {/* Upgrade button */}
        <Link href="/pricing"
          className="hidden sm:flex items-center h-8 px-4 rounded-full text-xs font-semibold transition-all hover:opacity-90"
          style={{ background: '#3b82f6', color: '#fff' }}>
          Upgrade
        </Link>
      </div>
    </header>
  );
}
