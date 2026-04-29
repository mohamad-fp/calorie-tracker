"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { today, getMondayStr, getWeekDates, dayName, shortDate, weekRangeLabel, addDays } from "@/lib/dates";
import { getDayLog } from "@/lib/storage";
import { weekAvgCalories, weekStartWeight, weekEndWeight } from "@/lib/stats";

type DaySummary = { date: string; hasCal: boolean; cal: number };

function WeekContent() {
  const searchParams = useSearchParams();
  const startParam = searchParams.get("start");
  const [mondayStr, setMondayStr] = useState(() => startParam || getMondayStr(today()));
  const [days, setDays] = useState<DaySummary[]>([]);
  const [avg, setAvg] = useState<number | null>(null);
  const [startW, setStartW] = useState<number | undefined>();
  const [endW, setEndW] = useState<number | undefined>();
  const [loaded, setLoaded] = useState(false);

  const loadWeek = useCallback(async () => {
    const dates = getWeekDates(mondayStr);
    const [avgVal, sw, ew, ...logs] = await Promise.all([
      weekAvgCalories(mondayStr),
      weekStartWeight(mondayStr),
      weekEndWeight(mondayStr),
      ...dates.map((d) => getDayLog(d)),
    ]);
    setAvg(avgVal);
    setStartW(sw);
    setEndW(ew);
    setDays(dates.map((d, i) => ({
      date: d,
      hasCal: logs[i].entries.length > 0,
      cal: logs[i].entries.reduce((s, e) => s + (e.calories ?? 0), 0),
    })));
    setLoaded(true);
  }, [mondayStr]);

  useEffect(() => { setLoaded(false); loadWeek(); }, [loadWeek]);

  const currentMonday = getMondayStr(today());
  const isCurrentWeek = mondayStr === currentMonday;

  if (!loaded) return null;

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-extrabold tracking-tight text-lime-accent">Road to 185lbs</h1>

      {startW != null && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface-card rounded-xl border border-border-subtle px-4 py-3">
            <p className="text-xs text-lime-accent uppercase tracking-wider font-medium">This week&apos;s weight</p>
            <p className="text-2xl font-extrabold text-text-primary mt-1 tabular-nums">{startW} <span className="text-sm font-medium text-text-secondary">lbs</span></p>
          </div>
          <div className="bg-surface-card rounded-xl border border-border-subtle px-4 py-3">
            <p className="text-xs text-lime-accent uppercase tracking-wider font-medium">Left to lose</p>
            <p className="text-2xl font-extrabold text-text-primary mt-1 tabular-nums">{Math.max(0, Math.round((startW - 185) * 10) / 10)} <span className="text-sm font-medium text-text-secondary">lbs</span></p>
          </div>
        </div>
      )}

      <div className="bg-surface-card rounded-2xl border border-border-subtle p-4 space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={() => setMondayStr(addDays(mondayStr, -7))} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-text-secondary hover:text-text-primary" aria-label="Previous week">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <div className="text-center">
            <p className="text-sm text-text-secondary font-medium uppercase tracking-wider">{isCurrentWeek ? "This Week" : "Week"}</p>
            <p className="text-lg font-semibold">{weekRangeLabel(mondayStr)}</p>
          </div>
          <button onClick={() => setMondayStr(addDays(mondayStr, 7))} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-text-secondary hover:text-text-primary" aria-label="Next week">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
        <div className="border-t border-border-subtle pt-3 space-y-1">
          {endW != null && (
            <p className="text-sm text-text-secondary">
              End weight: <span className="font-semibold text-text-primary">{endW} lbs</span>
              {startW != null && <span className={`ml-2 font-semibold ${endW < startW ? "text-lime-accent" : endW > startW ? "text-danger" : "text-text-muted"}`}>({endW < startW ? "" : "+"}{endW - startW} lbs)</span>}
            </p>
          )}
          <p className="text-sm text-text-secondary">Avg calories: <span className="font-semibold text-text-primary">{avg != null ? `${avg} cal/day` : "—"}</span></p>
        </div>
      </div>

      <div>
        <p className="text-xs text-text-muted uppercase tracking-wider font-medium mb-3">Daily Logs</p>
        <div className="space-y-2">
          {days.map((d) => {
            const isToday = d.date === today();
            return (
              <Link key={d.date} href={`/day/${d.date}`} className={`flex items-center justify-between bg-surface-card rounded-xl px-4 py-3 border transition-colors min-h-[52px] ${isToday ? "border-lime-accent/40" : "border-border-subtle"} active:bg-surface-hover`}>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-text-secondary w-8">{dayName(d.date)}</span>
                  <span className="text-sm text-text-muted">{shortDate(d.date)}</span>
                  {isToday && <span className="text-[10px] font-bold text-lime-accent bg-lime-accent/10 px-1.5 py-0.5 rounded">TODAY</span>}
                </div>
                <span className={`font-semibold tabular-nums ${d.hasCal ? "text-text-primary" : "text-text-muted"}`}>{d.hasCal ? `${d.cal} cal` : "—"}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function WeekPage() {
  return <Suspense fallback={null}><WeekContent /></Suspense>;
}
