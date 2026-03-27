'use client';

import { useState } from 'react';

export default function ShareTools() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('https://carmogger.com/u/boost_szn').catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full rounded-[20px] p-6 flex flex-col"
      style={{ background: '#0f1420', border: '1px solid rgba(148,163,184,0.08)' }}>
      <h2 className="text-base font-semibold text-[#f0f2f5] mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>
        Share & Integrations
      </h2>

      <div className="flex flex-col gap-3 flex-1">
        {/* Copy profile link */}
        <button onClick={handleCopy}
          className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-[rgba(148,163,184,0.06)]"
          style={{ border: '1px solid rgba(148,163,184,0.06)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(59,130,246,0.08)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-[#f0f2f5]">{copied ? 'Copied!' : 'Copy Profile Link'}</p>
            <p className="text-[10px] text-[#64748b]">carmogger.com/u/boost_szn</p>
          </div>
        </button>

        {/* Download share card */}
        <button className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-[rgba(148,163,184,0.06)]"
          style={{ border: '1px solid rgba(148,163,184,0.06)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(59,130,246,0.08)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-[#f0f2f5]">Download Share Card</p>
            <p className="text-[10px] text-[#64748b]">PNG for stories & posts</p>
          </div>
        </button>

        {/* Instagram bio */}
        <button className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-[rgba(148,163,184,0.06)]"
          style={{ border: '1px solid rgba(148,163,184,0.06)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(59,130,246,0.08)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1.5" fill="#3b82f6" stroke="none" />
            </svg>
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-[#f0f2f5]">Instagram Bio Link</p>
            <p className="text-[10px] text-[#64748b]">Add score widget to your bio</p>
          </div>
        </button>

        {/* HireACreator sync */}
        <button className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-[rgba(148,163,184,0.06)]"
          style={{ border: '1px solid rgba(148,163,184,0.06)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(59,130,246,0.08)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-[#f0f2f5]">HireACreator Sync</p>
            <p className="text-[10px] text-[#64748b]">Link your creator profile</p>
          </div>
        </button>
      </div>

      {/* Subscription status */}
      <div className="mt-4 pt-4 flex items-center justify-between"
        style={{ borderTop: '1px solid rgba(148,163,184,0.08)' }}>
        <span className="text-xs text-[#64748b]">Current plan</span>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
          Free
        </span>
      </div>
    </div>
  );
}
