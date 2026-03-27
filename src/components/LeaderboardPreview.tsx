'use client';

import { useState } from 'react';
import Image from 'next/image';


const tabs = ['Global', 'Weekly', 'Local', 'Brand'];

export default function LeaderboardPreview() {
  const [activeTab, setActiveTab] = useState('Global');
  const top5: Array<{ id: number; imageUrl: string; carName: string; displayName: string; score: number }> = [];

  return (
    <div className="h-full rounded-[20px] p-6 flex flex-col"
      style={{ background: '#0f1420', border: '1px solid rgba(148,163,184,0.08)' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-[#f0f2f5]" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Leaderboard
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 p-1 rounded-xl" style={{ background: 'rgba(148,163,184,0.06)' }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 py-1.5 rounded-lg text-[10px] font-medium transition-all"
            style={{
              background: activeTab === tab ? 'rgba(59,130,246,0.15)' : 'transparent',
              color: activeTab === tab ? '#3b82f6' : '#64748b',
            }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Entries */}
      <div className="flex flex-col gap-2 flex-1">
        {top5.map((car, i) => (
          <div key={car.id} className="flex items-center gap-3 py-2 px-2 rounded-xl transition-colors hover:bg-[rgba(148,163,184,0.04)]">
            <span className="text-xs font-bold w-5 text-center"
              style={{ color: i < 3 ? '#3b82f6' : '#64748b' }}>
              {i + 1}
            </span>
            <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
              <Image src={car.imageUrl} alt={car.carName} width={28} height={28} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#f0f2f5] truncate">{car.displayName}</p>
            </div>
            <span className="text-xs font-bold text-[#f0f2f5]">{car.score}</span>
          </div>
        ))}
      </div>

      {/* Your position */}
      <div className="mt-3 pt-3 flex items-center gap-3 px-2"
        style={{ borderTop: '1px solid rgba(148,163,184,0.08)' }}>
        <span className="text-xs font-bold w-5 text-center text-[#3b82f6]">43</span>
        <div className="w-7 h-7 rounded-full bg-[#1e293b] flex items-center justify-center text-[10px] font-bold text-[#3b82f6] flex-shrink-0">
          M
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-[#3b82f6]">You</p>
        </div>
        <span className="text-xs font-bold text-[#3b82f6]">87</span>
      </div>
    </div>
  );
}
