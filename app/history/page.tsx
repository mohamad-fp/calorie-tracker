"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllStoredDates } from "@/lib/storage";
import { getMondayStr, weekRangeLabel, shortDate } from "@/lib/dates";
import { weekAvgCalories, weekStartWeight, weekEndWeight } from "@/lib/stats";
import TrendsChart from "@/components/TrendsChart";

type WeekSummary = {
  monday: string;
  label: string;
  shortLabel: string;
  avg: number | null;
  startW?: number;
  endW?: number;
};

export default function HistoryPage() {
  const [weeks, setWeeks] = useState<WeekSummary[]>([]);
  const [tab, setTab] = useState<"list" | "trends">("list");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const dates = getAllStoredDates();
    const mondaySet = new Set<string>();
    for (const d of dates) {
      mondaySet.add(getMondayStr(d));
    }
    const sorted = Array.from(mondaySet).sort().reverse();
    const summaries: WeekSummary[] = sorted.map((m) => ({
      monday: m,
      label: weekRangeLabel(m),
      shortLabel: shortDate(m),
      avg: weekAvgCalories(m),
      startW: weekStartWeight(m),
      endW: weekEndWeight(m),
    }));
    setWeeks(summaries);
  }, []);

  if (!mounted) return null;

  if (weeks.length === 0) {
    return (
      <div className="text-center py-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-lime-accent mb-4">
          Road to 185lbs
        </h1>
        <p className="text-text-secondary text-sm font-medium uppercase tracking-wider mb-2">
          History
        </p>
        <p className="text-text-muted">No logged weeks yet. Start tracking today!</p>
      </div>
    );
  }

  const trendData = weeks.map((w) => ({
    label: w.shortLabel,
    weight: w.startW,
    avgCal: w.avg,
  }));

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-extrabold tracking-tight text-lime-accent">
        Road to 185lbs
      </h1>

      {/* Sub-tabs */}
      <div className="flex bg-surface-card rounded-xl border border-border-subtle p-1">
        <button
          onClick={() => setTab("list")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors min-h-[44px] ${
            tab === "list"
              ? "bg-lime-accent text-surface"
              : "text-text-secondary"
          }`}
        >
          List
        </button>
        <button
          onClick={() => setTab("trends")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors min-h-[44px] ${
            tab === "trends"
              ? "bg-lime-accent text-surface"
              : "text-text-secondary"
          }`}
        >
          Trends
        </button>
      </div>

      {tab === "list" ? (
        <div className="space-y-3">
          {weeks.map((w) => (
            <Link
              key={w.monday}
              href={`/week?start=${w.monday}`}
              className="block bg-surface-card rounded-xl border border-border-subtle p-4 active:bg-surface-hover transition-colors"
            >
              <p className="font-semibold text-base">{w.label}</p>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-secondary">
                <span>
                  Avg:{" "}
                  <span className="font-semibold text-text-primary">
                    {w.avg != null ? `${w.avg} cal/day` : "—"}
                  </span>
                </span>
                {w.startW != null && (
                  <span>
                    {w.startW} lbs
                    {w.endW != null && (
                      <>
                        {" → "}{w.endW} lbs
                        <span className={`ml-1 font-semibold ${w.endW < w.startW ? "text-lime-accent" : w.endW > w.startW ? "text-danger" : ""}`}>
                          ({w.endW < w.startW ? "" : "+"}{w.endW - w.startW})
                        </span>
                      </>
                    )}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <TrendsChart weeks={trendData} />
      )}
    </div>
  );
}
