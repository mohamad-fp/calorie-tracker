"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { today, getMondayStr, getWeekDates, dayName, shortDate, weekRangeLabel, addDays } from "@/lib/dates";
import { dayTotalCalories, dayHasEntries, weekAvgCalories, weekStartWeight, weekEndWeight } from "@/lib/stats";

function WeekContent() {
  const searchParams = useSearchParams();
  const startParam = searchParams.get("start");
  const [mondayStr, setMondayStr] = useState(() =>
    startParam || getMondayStr(today())
  );
  const [dates, setDates] = useState<string[]>([]);
  const [avg, setAvg] = useState<number | null>(null);
  const [startW, setStartW] = useState<number | undefined>();
  const [endW, setEndW] = useState<number | undefined>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const d = getWeekDates(mondayStr);
    setDates(d);
    setAvg(weekAvgCalories(mondayStr));
    setStartW(weekStartWeight(mondayStr));
    setEndW(weekEndWeight(mondayStr));
  }, [mondayStr, mounted]);

  function prevWeek() {
    setMondayStr(addDays(mondayStr, -7));
  }
  function nextWeek() {
    setMondayStr(addDays(mondayStr, 7));
  }

  const currentMonday = getMondayStr(today());
  const isCurrentWeek = mondayStr === currentMonday;

  if (!mounted) return null;

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-extrabold tracking-tight text-lime-accent">
        Road to 185lbs
      </h1>

      {startW != null && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface-card rounded-xl border border-border-subtle px-4 py-3">
            <p className="text-xs text-lime-accent uppercase tracking-wider font-medium">This week&apos;s weight</p>
            <p className="text-2xl font-extrabold text-text-primary mt-1 tabular-nums">
              {startW} <span className="text-sm font-medium text-text-secondary">lbs</span>
            </p>
          </div>
          <div className="bg-surface-card rounded-xl border border-border-subtle px-4 py-3">
            <p className="text-xs text-lime-accent uppercase tracking-wider font-medium">Left to lose</p>
            <p className="text-2xl font-extrabold text-text-primary mt-1 tabular-nums">
              {Math.max(0, Math.round((startW - 185) * 10) / 10)} <span className="text-sm font-medium text-text-secondary">lbs</span>
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={prevWeek}
          className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-text-secondary hover:text-text-primary"
          aria-label="Previous week"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="text-center">
          <p className="text-sm text-text-secondary font-medium uppercase tracking-wider">
            {isCurrentWeek ? "This Week" : "Week"}
          </p>
          <p className="text-lg font-semibold">{weekRangeLabel(mondayStr)}</p>
        </div>
        <button
          onClick={nextWeek}
          className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-text-secondary hover:text-text-primary"
          aria-label="Next week"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="bg-surface-card rounded-xl border border-border-subtle p-4 space-y-1">
        {endW != null && (
          <p className="text-sm text-text-secondary">
            End weight: <span className="font-semibold text-text-primary">{endW} lbs</span>
            {startW != null && (
              <span className={`ml-2 font-semibold ${endW < startW ? "text-lime-accent" : endW > startW ? "text-danger" : "text-text-muted"}`}>
                ({endW < startW ? "" : "+"}{endW - startW} lbs)
              </span>
            )}
          </p>
        )}
        <p className="text-sm text-text-secondary">
          Avg calories:{" "}
          <span className="font-semibold text-text-primary">
            {avg != null ? `${avg} cal/day` : "—"}
          </span>
        </p>
      </div>

      <div className="space-y-2">
        {dates.map((d) => {
          const has = dayHasEntries(d);
          const cal = has ? dayTotalCalories(d) : null;
          const isToday = d === today();
          return (
            <Link
              key={d}
              href={`/day/${d}`}
              className={`flex items-center justify-between bg-surface-card rounded-xl px-4 py-3 border transition-colors min-h-[52px] ${
                isToday ? "border-lime-accent/40" : "border-border-subtle"
              } active:bg-surface-hover`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-text-secondary w-8">
                  {dayName(d)}
                </span>
                <span className="text-sm text-text-muted">{shortDate(d)}</span>
                {isToday && (
                  <span className="text-[10px] font-bold text-lime-accent bg-lime-accent/10 px-1.5 py-0.5 rounded">
                    TODAY
                  </span>
                )}
              </div>
              <span className={`font-semibold tabular-nums ${cal != null ? "text-text-primary" : "text-text-muted"}`}>
                {cal != null ? `${cal} cal` : "—"}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function WeekPage() {
  return (
    <Suspense fallback={null}>
      <WeekContent />
    </Suspense>
  );
}
