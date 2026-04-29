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

  // Only include weeks that have at least one metric
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

  const wMin = weights.length ? Math.min(...weights.map((w) => w.weight!)) : 0;
  const wMax = weights.length ? Math.max(...weights.map((w) => w.weight!)) : 0;
  const wRange = wMax - wMin || 1;

  const cMin = cals.length ? Math.min(...cals.map((w) => w.avgCal!)) : 0;
  const cMax = cals.length ? Math.max(...cals.map((w) => w.avgCal!)) : 0;
  const cRange = cMax - cMin || 1;

  const W = 320;
  const H = 180;
  const padL = 36;
  const padR = 36;
  const padTop = 16;
  const padBot = 28;
  const chartW = W - padL - padR;
  const chartH = H - padTop - padBot;

  function xPos(i: number) {
    return padL + (combined.length === 1 ? chartW / 2 : (i / (combined.length - 1)) * chartW);
  }

  // Build weight line coords
  const weightCoords = combined.map((w, i) => {
    if (w.weight == null) return null;
    return {
      x: xPos(i),
      y: padTop + chartH - ((w.weight - wMin) / wRange) * chartH,
      value: w.weight,
    };
  });

  // Build calorie line coords
  const calCoords = combined.map((w, i) => {
    if (w.avgCal == null) return null;
    return {
      x: xPos(i),
      y: padTop + chartH - ((w.avgCal - cMin) / cRange) * chartH,
      value: w.avgCal,
    };
  });

  function buildPath(coords: (typeof weightCoords)) {
    const valid = coords.filter((c) => c != null);
    return valid
      .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`)
      .join(" ");
  }

  const weightPath = buildPath(weightCoords);
  const calPath = buildPath(calCoords);

  // Y-axis ticks
  const wTicks = [0, 0.5, 1].map((f) => ({
    y: padTop + chartH - f * chartH,
    label: Math.round(wMin + f * wRange),
  }));
  const cTicks = [0, 0.5, 1].map((f) => ({
    y: padTop + chartH - f * chartH,
    label: Math.round(cMin + f * cRange),
  }));

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
        {weights.length > 0 &&
          wTicks.map((t, i) => (
            <text
              key={`wt-${i}`}
              x={padL - 4}
              y={t.y + 3}
              fill={WEIGHT_COLOR}
              fontSize="7"
              textAnchor="end"
              fontFamily="system-ui"
              opacity="0.7"
            >
              {t.label}
            </text>
          ))}

        {/* Right axis labels (calories) */}
        {cals.length > 0 &&
          cTicks.map((t, i) => (
            <text
              key={`ct-${i}`}
              x={W - padR + 4}
              y={t.y + 3}
              fill={CAL_COLOR}
              fontSize="7"
              textAnchor="start"
              fontFamily="system-ui"
              opacity="0.7"
            >
              {t.label}
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
                <circle cx={c.x} cy={c.y} r="3" fill={WEIGHT_COLOR} />
                <text
                  x={c.x}
                  y={c.y - 7}
                  fill={WEIGHT_COLOR}
                  fontSize="7"
                  textAnchor="middle"
                  fontWeight="600"
                  fontFamily="system-ui"
                >
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
                <circle cx={c.x} cy={c.y} r="3" fill={CAL_COLOR} />
                <text
                  x={c.x}
                  y={c.y + 14}
                  fill={CAL_COLOR}
                  fontSize="7"
                  textAnchor="middle"
                  fontWeight="600"
                  fontFamily="system-ui"
                >
                  {c.value}
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
