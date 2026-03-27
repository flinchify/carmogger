'use client';

// Generate mock 30-day data
const viewsData = [
  120, 145, 132, 168, 155, 189, 201, 178, 220, 195,
  245, 260, 238, 275, 290, 310, 285, 325, 340, 315,
  360, 375, 350, 390, 405, 380, 420, 440, 425, 460,
];

const sources = [
  { label: 'Direct link', count: 3420, pct: 36 },
  { label: 'Instagram bio', count: 2840, pct: 30 },
  { label: 'Leaderboard', count: 1890, pct: 20 },
  { label: 'Shared cards', count: 1262, pct: 14 },
];

function MiniLineChart({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 360;
  const height = 100;
  const padding = 4;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = padding + (1 - (v - min) / range) * (height - padding * 2);
    return { x, y };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#chartGrad)" />
      <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* End dot */}
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="3" fill="#3b82f6" />
    </svg>
  );
}

export default function PerformanceChart() {
  const totalViews = viewsData.reduce((a, b) => a + b, 0);
  const sharesClicked = 847;

  return (
    <div className="h-full rounded-[20px] p-6 flex flex-col"
      style={{ background: '#0f1420', border: '1px solid rgba(148,163,184,0.08)' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-[#f0f2f5]" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Performance
        </h2>
        <span className="text-xs text-[#64748b]">30 days</span>
      </div>

      {/* Total views */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-2xl font-bold text-[#f0f2f5]" style={{ fontFamily: 'Outfit, sans-serif' }}>
          {totalViews.toLocaleString()}
        </span>
        <span className="text-xs text-[#64748b]">views</span>
        <span className="text-xs font-medium text-[#22c55e] ml-auto">+24%</span>
      </div>

      {/* Chart */}
      <div className="h-[100px] mb-5">
        <MiniLineChart data={viewsData} />
      </div>

      {/* Traffic sources */}
      <div className="flex flex-col gap-2.5 flex-1">
        <p className="text-xs font-medium text-[#8892a4] mb-1">Traffic Sources</p>
        {sources.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[#f0f2f5]">{s.label}</span>
                <span className="text-[10px] text-[#64748b]">{s.pct}%</span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(148,163,184,0.08)' }}>
                <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: '#3b82f6', opacity: 0.7 + (s.pct / 100) * 0.3 }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Shares */}
      <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: '1px solid rgba(148,163,184,0.08)' }}>
        <span className="text-xs text-[#64748b]">Shares clicked</span>
        <span className="text-sm font-bold text-[#f0f2f5]">{sharesClicked}</span>
      </div>
    </div>
  );
}
