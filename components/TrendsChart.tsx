"use client";

type WeekPoint = {
  label: string;
  weight?: number;
  avgCal: number | null;
};

type Props = {
  weeks: WeekPoint[];
};

function MiniChart({
  points,
  color,
  label,
  unit,
}: {
  points: { label: string; value: number }[];
  color: string;
  label: string;
  unit: string;
}) {
  if (points.length === 0) {
    return (
      <div className="bg-surface-card rounded-2xl border border-border-subtle p-4">
        <p className="text-xs text-lime-accent uppercase tracking-wider font-medium mb-3">{label}</p>
        <p className="text-text-muted text-sm text-center py-6">Not enough data yet</p>
      </div>
    );
  }

  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const W = 320;
  const H = 140;
  const padX = 10;
  const padTop = 10;
  const padBot = 24;
  const chartW = W - padX * 2;
  const chartH = H - padTop - padBot;

  const coords = points.map((p, i) => ({
    x: padX + (points.length === 1 ? chartW / 2 : (i / (points.length - 1)) * chartW),
    y: padTop + chartH - ((p.value - min) / range) * chartH,
    ...p,
  }));

  const pathD = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`)
    .join(" ");

  return (
    <div className="bg-surface-card rounded-2xl border border-border-subtle p-4">
      <p className="text-xs text-lime-accent uppercase tracking-wider font-medium mb-3">{label}</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
          const y = padTop + chartH - frac * chartH;
          const val = Math.round(min + frac * range);
          return (
            <g key={frac}>
              <line x1={padX} y1={y} x2={W - padX} y2={y} stroke="#2a2a30" strokeWidth="0.5" />
              <text x={W - padX + 2} y={y + 3} fill="#5a5a66" fontSize="7" fontFamily="system-ui">
                {val}
              </text>
            </g>
          );
        })}
        {/* Line */}
        <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {/* Dots + labels */}
        {coords.map((c, i) => (
          <g key={i}>
            <circle cx={c.x} cy={c.y} r="3.5" fill={color} />
            <text x={c.x} y={H - 4} fill="#8a8a96" fontSize="7" textAnchor="middle" fontFamily="system-ui">
              {c.label}
            </text>
            <text x={c.x} y={c.y - 8} fill="#f0f0f0" fontSize="7" textAnchor="middle" fontWeight="600" fontFamily="system-ui">
              {c.value}{unit}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function TrendsChart({ weeks }: Props) {
  const chronological = [...weeks].reverse();

  const weightPoints = chronological
    .filter((w) => w.weight != null)
    .map((w) => ({ label: w.label, value: w.weight! }));

  const calPoints = chronological
    .filter((w) => w.avgCal != null)
    .map((w) => ({ label: w.label, value: w.avgCal! }));

  return (
    <div className="space-y-4">
      <MiniChart points={weightPoints} color="#b4f54a" label="Weight (lbs)" unit="" />
      <MiniChart points={calPoints} color="#f5a623" label="Avg Calories / Day" unit="" />
    </div>
  );
}
