"use client";

type WeekPoint = {
  label: string;
  weight?: number;
  avgCal: number | null;
};

type Props = {
  weeks: WeekPoint[];
};

const WEIGHT_COLOR = "#b4f54a";
const CAL_COLOR = "#f5a623";

export default function TrendsChart({ weeks }: Props) {
  const chronological = [...weeks].reverse();

  const combined = chronological.filter(
    (w) => w.weight != null || w.avgCal != null
  );

  if (combined.length === 0) {
    return (
      <div className="bg-surface-card rounded-2xl border border-border-subtle p-4">
        <p className="text-xs text-lime-accent uppercase tracking-wider font-medium mb-3">
          Trends
        </p>
        <p className="text-text-muted text-sm text-center py-6">
          Not enough data yet
        </p>
      </div>
    );
  }

  const weights = combined.filter((w) => w.weight != null);
  const cals = combined.filter((w) => w.avgCal != null);
  const hasWeight = weights.length > 0;
  const hasCals = cals.length > 0;

  function padRange(min: number, max: number) {
    if (min === max) {
      const pad = Math.max(Math.abs(min) * 0.1, 5);
      return { min: min - pad, max: max + pad, range: pad * 2 };
    }
    const r = max - min;
    const pad = r * 0.1;
    return { min: min - pad, max: max + pad, range: r + pad * 2 };
  }

  const wRaw = hasWeight
    ? padRange(
        Math.min(...weights.map((w) => w.weight!)),
        Math.max(...weights.map((w) => w.weight!))
      )
    : { min: 0, max: 1, range: 1 };

  const cRaw = hasCals
    ? padRange(
        Math.min(...cals.map((w) => w.avgCal!)),
        Math.max(...cals.map((w) => w.avgCal!))
      )
    : { min: 0, max: 1, range: 1 };

  const W = 360;
  const H = 200;
  const padL = 44;
  const padR = 44;
  const padTop = 24;
  const padBot = 30;
  const chartW = W - padL - padR;
  const chartH = H - padTop - padBot;
  const isSingle = combined.length === 1;

  function xPos(i: number) {
    return padL + (isSingle ? chartW / 2 : (i / (combined.length - 1)) * chartW);
  }

  function wY(val: number) {
    return padTop + chartH - ((val - wRaw.min) / wRaw.range) * chartH;
  }

  function cY(val: number) {
    return padTop + chartH - ((val - cRaw.min) / cRaw.range) * chartH;
  }

  const weightCoords = combined.map((w, i) => {
    if (w.weight == null) return null;
    return { x: xPos(i), y: wY(w.weight), value: w.weight };
  });

  const calCoords = combined.map((w, i) => {
    if (w.avgCal == null) return null;
    return { x: xPos(i), y: cY(w.avgCal), value: w.avgCal };
  });

  function buildPath(coords: (typeof weightCoords)) {
    const valid = coords.filter((c) => c != null);
    return valid
      .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`)
      .join(" ");
  }

  const weightPath = buildPath(weightCoords);
  const calPath = buildPath(calCoords);

  const dotR = isSingle ? 6 : 4;

  return (
    <div className="space-y-4">
      <div className="bg-surface-card rounded-2xl border border-border-subtle p-4">
        {/* Legend */}
        <div className="flex items-center gap-4 mb-3">
          {hasWeight && (
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-[3px] rounded" style={{ backgroundColor: WEIGHT_COLOR }} />
              <span className="text-xs font-medium" style={{ color: WEIGHT_COLOR }}>
                Weight (lbs)
              </span>
            </div>
          )}
          {hasCals && (
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-[3px] rounded" style={{ backgroundColor: CAL_COLOR }} />
              <span className="text-xs font-medium" style={{ color: CAL_COLOR }}>
                Avg Cal/Day
              </span>
            </div>
          )}
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
            const y = padTop + chartH - frac * chartH;
            return (
              <line key={frac} x1={padL} y1={y} x2={W - padR} y2={y} stroke="#2a2a30" strokeWidth="0.5" />
            );
          })}

          {/* Left axis labels (weight) */}
          {hasWeight &&
            [0, 0.5, 1].map((frac) => {
              const val = Math.round(wRaw.min + frac * wRaw.range);
              const y = padTop + chartH - frac * chartH;
              return (
                <text key={`wt-${frac}`} x={padL - 6} y={y + 3} fill={WEIGHT_COLOR} fontSize="8" textAnchor="end" fontWeight="600" fontFamily="system-ui">
                  {val}
                </text>
              );
            })}

          {/* Right axis labels (calories) */}
          {hasCals &&
            [0, 0.5, 1].map((frac) => {
              const val = Math.round(cRaw.min + frac * cRaw.range);
              const y = padTop + chartH - frac * chartH;
              return (
                <text key={`ct-${frac}`} x={W - padR + 6} y={y + 3} fill={CAL_COLOR} fontSize="8" textAnchor="start" fontWeight="600" fontFamily="system-ui">
                  {val}
                </text>
              );
            })}

          {/* Weight line */}
          {weightPath && (
            <path d={weightPath} fill="none" stroke={WEIGHT_COLOR} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          )}

          {/* Calorie line */}
          {calPath && (
            <path d={calPath} fill="none" stroke={CAL_COLOR} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          )}

          {/* Weight dots + values */}
          {weightCoords.map(
            (c, i) =>
              c && (
                <g key={`wd-${i}`}>
                  <circle cx={c.x} cy={c.y} r={dotR} fill={WEIGHT_COLOR} stroke="#161618" strokeWidth="1.5" />
                  <text x={c.x} y={c.y - dotR - 4} fill={WEIGHT_COLOR} fontSize="9" textAnchor="middle" fontWeight="700" fontFamily="system-ui">
                    {c.value}
                  </text>
                </g>
              )
          )}

          {/* Calorie dots + values */}
          {calCoords.map(
            (c, i) =>
              c && (
                <g key={`cd-${i}`}>
                  <circle cx={c.x} cy={c.y} r={dotR} fill={CAL_COLOR} stroke="#161618" strokeWidth="1.5" />
                  <text x={c.x} y={c.y + dotR + 12} fill={CAL_COLOR} fontSize="9" textAnchor="middle" fontWeight="700" fontFamily="system-ui">
                    {c.value}
                  </text>
                </g>
              )
          )}

          {/* X-axis labels */}
          {combined.map((w, i) => (
            <text key={`xl-${i}`} x={xPos(i)} y={H - 6} fill="#8a8a96" fontSize="8" textAnchor="middle" fontFamily="system-ui">
              {w.label}
            </text>
          ))}
        </svg>
      </div>

      {/* Weekly breakdown below chart */}
      <div className="space-y-2">
        {combined.map((w, i) => (
          <div key={i} className="flex items-center justify-between bg-surface-card rounded-xl border border-border-subtle px-4 py-2.5">
            <span className="text-sm text-text-secondary">{w.label}</span>
            <div className="flex gap-4">
              {w.weight != null ? (
                <span className="text-sm font-semibold" style={{ color: WEIGHT_COLOR }}>
                  {w.weight} lbs
                </span>
              ) : (
                <span className="text-sm text-text-muted">— lbs</span>
              )}
              {w.avgCal != null ? (
                <span className="text-sm font-semibold" style={{ color: CAL_COLOR }}>
                  {w.avgCal} cal
                </span>
              ) : (
                <span className="text-sm text-text-muted">— cal</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
