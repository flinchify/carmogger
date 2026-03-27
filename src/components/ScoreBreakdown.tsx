'use client';



const metrics = [
  { key: 'aura', label: 'Aura', weight: '25%', desc: 'Visual presence & stance' },
  { key: 'larp', label: 'Larp', weight: '20%', desc: 'Authenticity & credibility' },
  { key: 'money', label: 'Money', weight: '20%', desc: 'Build quality & value' },
  { key: 'demand', label: 'Demand', weight: '20%', desc: 'Market desirability' },
  { key: 'hype', label: 'Hype', weight: '15%', desc: 'Social media appeal' },
] as const;

function getConfidence(value: number): { label: string; color: string } {
  if (value >= 85) return { label: 'High', color: '#22c55e' };
  if (value >= 65) return { label: 'Med', color: '#eab308' };
  return { label: 'Low', color: '#ef4444' };
}

function RadarChart({ data }: { data: Record<string, number> }) {
  const size = 120;
  const center = size / 2;
  const radius = 44;
  const keys = ['aura', 'larp', 'money', 'demand', 'hype'];
  const angleStep = (Math.PI * 2) / keys.length;

  const points = keys.map((key, i) => {
    const angle = angleStep * i - Math.PI / 2;
    const value = (data[key] || 0) / 100;
    const x = center + radius * value * Math.cos(angle);
    const y = center + radius * value * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grid */}
      {gridLevels.map((level) => {
        const gridPoints = keys.map((_, i) => {
          const angle = angleStep * i - Math.PI / 2;
          const x = center + radius * level * Math.cos(angle);
          const y = center + radius * level * Math.sin(angle);
          return `${x},${y}`;
        }).join(' ');
        return <polygon key={level} points={gridPoints} fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="0.5" />;
      })}
      {/* Axes */}
      {keys.map((_, i) => {
        const angle = angleStep * i - Math.PI / 2;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="rgba(148,163,184,0.06)" strokeWidth="0.5" />;
      })}
      {/* Data */}
      <polygon points={points} fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth="1.5" />
      {/* Dots */}
      {keys.map((key, i) => {
        const angle = angleStep * i - Math.PI / 2;
        const value = (data[key] || 0) / 100;
        const x = center + radius * value * Math.cos(angle);
        const y = center + radius * value * Math.sin(angle);
        return <circle key={key} cx={x} cy={y} r="2.5" fill="#3b82f6" />;
      })}
    </svg>
  );
}

export default function ScoreBreakdown() {
  const car = { aura: 0, larp: 0, money: 0, demand: 0, hype: 0, carmog_score: 0, brand: '', model: '', year: 0 };
  const data: Record<string, number> = {
    aura: car.aura,
    larp: car.larp,
    money: car.money,
    demand: car.demand,
    hype: car.hype,
  };

  const aiReasons = [
    'Strong exterior presence with aggressive M-sport bodykit and clean paint correction',
    'Authentic build — no questionable replicas or mismatched parts detected',
    'Current-gen model with competition package commands strong resale value',
  ];

  return (
    <div className="rounded-[20px] p-6"
      style={{ background: '#0f1420', border: '1px solid rgba(148,163,184,0.08)' }}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-[#f0f2f5]" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Score Breakdown
          </h2>
          <p className="text-xs text-[#64748b] mt-1">{car.year} {car.brand} {car.model}</p>
        </div>
        <div className="hidden sm:block">
          <RadarChart data={data} />
        </div>
      </div>

      {/* Score bars */}
      <div className="flex flex-col gap-4 mb-6">
        {metrics.map(({ key, label, weight }) => {
          const value = data[key];
          const conf = getConfidence(value);
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#f0f2f5]">{label}</span>
                  <span className="text-[10px] text-[#64748b]">{weight}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: conf.color }} />
                  <span className="text-sm font-bold text-[#f0f2f5]">{value}</span>
                </div>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(148,163,184,0.08)' }}>
                <div className="h-full rounded-full score-bar-fill"
                  style={{ width: `${value}%`, background: '#3b82f6' }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* AI explanation */}
      <div className="pt-4" style={{ borderTop: '1px solid rgba(148,163,184,0.08)' }}>
        <p className="text-xs font-medium text-[#8892a4] mb-3">AI Analysis</p>
        <div className="flex flex-col gap-2">
          {aiReasons.map((reason, i) => (
            <div key={i} className="flex gap-2">
              <svg className="flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <p className="text-xs text-[#8892a4] leading-relaxed">{reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
