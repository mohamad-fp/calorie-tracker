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

  // Add 5% padding to ranges so single points don't sit on the edge
  function padRange(min: number, max: number) {
    if (min === max) {
      const pad = Math.max(Math.abs(min) * 0.1, 5);
      return { min: min - pad, max: max + pad, range: pad * 2 };
    }
    const r = max - min;
    const pad = r * 0.08;
    return { min: min - pad, max: max + pad, range: r + pad * 2 };
  }

  const wRaw = weights.length
    ? padRange(
        Math.min(...weights.map((w) => w.weight!)),
        Math.max(...weights.map((w) => w.weight!))
      )
    : { min: 0, max: 1, range: 1 };

  const cRaw = cals.length
    ? padRange(
        Math.min(...cals.map((w) => w.avgCal!)),
        Math.max(...cals.map((w) => w.avgCal!))
      )
    : { min: 0, max: 1, range: 1 };

  const W = 320;
  const H = 180;
  const padL = 36;
  const padR = 36;
  const padTop = 20;
  const padBot = 28;
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

  const dotR = isSingle ? 5 : 3.5;

  // Y-axis ticks — use actual min/max for labels
  const wTickVals = weights.length
    ? [
        Math.round(wRaw.min + wRaw.range * 0.05),
        Math.round(wRaw.min + wRaw.range * 0.5),
        Math.round(wRaw.min + wRaw.range * 0.95),
      ]
    : [];
  const cTickVals = cals.length
    ? [
        Math.round(cRaw.min + cRaw.range * 0.05),
        Math.round(cRaw.min + cRaw.range * 0.5),
        Math.round(cRaw.min + cRaw.range * 0.95),
      ]
    : [];

  return (
    <div className="bg-surface-card rounded-2xl border border-border-subtle p-4">
      {/* Legend */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: WEIGHT_COLOR }}
          />
          <span className="text-xs text-text-secondary font-medium">
            Weight (lbs)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: CAL_COLOR }}
          />
          <span className="text-xs text-text-secondary font-medium">
            Avg Cal/Day
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
          const y = padTop + chartH - frac * chartH;
          return (
            <line
              key={frac}
              x1={padL}
              y1={y}
              x2={W - padR}
              y2={y}
              stroke="#2a2a30"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Left axis labels (weight) */}
        {wTickVals.map((val, i) => (
          <text
            key={`wt-${i}`}
            x={padL - 4}
            y={wY(val) + 3}
            fill={WEIGHT_COLOR}
            fontSize="7"
            textAnchor="end"
            fontFamily="system-ui"
            opacity="0.7"
          >
            {val}
          </text>
        ))}

        {/* Right axis labels (calories) */}
        {cTickVals.map((val, i) => (
          <text
            key={`ct-${i}`}
            x={W - padR + 4}
            y={cY(val) + 3}
            fill={CAL_COLOR}
            fontSize="7"
            textAnchor="start"
            fontFamily="system-ui"
            opacity="0.7"
          >
            {val}
          </text>
        ))}

        {/* Weight line */}
        {weightPath && (
          <path
            d={weightPath}
            fill="none"
            stroke={WEIGHT_COLOR}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {/* Calorie line */}
        {calPath && (
          <path
            d={calPath}
            fill="none"
            stroke={CAL_COLOR}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {/* Weight dots + values */}
        {weightCoords.map(
          (c, i) =>
            c && (
              <g key={`wd-${i}`}>
                <circle cx={c.x} cy={c.y} r={dotR} fill={WEIGHT_COLOR} />
                <text
                  x={c.x}
                  y={c.y - 9}
                  fill={WEIGHT_COLOR}
                  fontSize={isSingle ? "9" : "7"}
                  textAnchor="middle"
                  fontWeight="700"
                  fontFamily="system-ui"
                >
                  {c.value} lbs
                </text>
              </g>
            )
        )}

        {/* Calorie dots + values */}
        {calCoords.map(
          (c, i) =>
            c && (
              <g key={`cd-${i}`}>
                <circle cx={c.x} cy={c.y} r={dotR} fill={CAL_COLOR} />
                <text
                  x={c.x}
                  y={c.y + 16}
                  fill={CAL_COLOR}
                  fontSize={isSingle ? "9" : "7"}
                  textAnchor="middle"
                  fontWeight="700"
                  fontFamily="system-ui"
                >
                  {c.value} cal
                </text>
              </g>
            )
        )}

        {/* X-axis labels */}
        {combined.map((w, i) => (
          <text
            key={`xl-${i}`}
            x={xPos(i)}
            y={H - 4}
            fill="#8a8a96"
            fontSize="7"
            textAnchor="middle"
            fontFamily="system-ui"
          >
            {w.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
