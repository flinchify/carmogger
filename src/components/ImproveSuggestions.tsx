'use client';

const suggestions = [
  {
    title: 'Link Instagram to unlock Hype verification',
    description: 'Verified social presence boosts your Hype score by up to 15 points.',
    action: 'Connect Instagram',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="#3b82f6" stroke="none" />
      </svg>
    ),
  },
  {
    title: 'Upload interior photos to improve confidence',
    description: 'Interior shots increase AI confidence and can bump your Money score.',
    action: 'Upload Photos',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    title: 'Add wheel specs for better accuracy',
    description: 'Listing your wheel setup helps the AI evaluate your build authenticity.',
    action: 'Add Specs',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
        <line x1="12" y1="2" x2="12" y2="5" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="2" y1="12" x2="5" y2="12" />
        <line x1="19" y1="12" x2="22" y2="12" />
      </svg>
    ),
  },
  {
    title: 'Upload more angles for better accuracy',
    description: 'Multiple angles give the AI a complete picture. Aim for 3-4 shots.',
    action: 'Upload More',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
  },
];

export default function ImproveSuggestions() {
  return (
    <div className="rounded-[20px] p-6"
      style={{ background: '#0f1420', border: '1px solid rgba(148,163,184,0.08)' }}>
      <h2 className="text-base font-semibold text-[#f0f2f5] mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>
        How to Improve
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {suggestions.map((s) => (
          <div key={s.title}
            className="flex flex-col gap-3 p-4 rounded-2xl transition-colors hover:bg-[rgba(148,163,184,0.04)]"
            style={{ border: '1px solid rgba(148,163,184,0.06)' }}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(59,130,246,0.08)' }}>
                {s.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#f0f2f5] leading-snug">{s.title}</p>
                <p className="text-xs text-[#64748b] mt-1 leading-relaxed">{s.description}</p>
              </div>
            </div>
            <button className="self-start h-7 px-3 rounded-lg text-xs font-medium transition-colors hover:bg-[rgba(59,130,246,0.2)]"
              style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
              {s.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
