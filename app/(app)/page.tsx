"use client";

import { useState, useEffect, useCallback } from "react";
import { FoodEntry } from "@/lib/types";
import { getDayLog, addEntry, deleteEntry } from "@/lib/storage";
import { today, getMondayStr, isMonday } from "@/lib/dates";
import { dayTotalCalories, dayTotalProtein, weekAvgCalories, weekStartWeight } from "@/lib/stats";
import FoodEntryForm from "@/components/FoodEntryForm";
import EntryList from "@/components/EntryList";
import WeighInCard from "@/components/WeighInCard";

export default function TodayPage() {
  const [date] = useState(today);
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [totalCal, setTotalCal] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [weekAvg, setWeekAvg] = useState<number | null>(null);
  const [weekWeight, setWeekWeight] = useState<number | undefined>();
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    const [log, cal, prot, avg, wt] = await Promise.all([
      getDayLog(date),
      dayTotalCalories(date),
      dayTotalProtein(date),
      weekAvgCalories(getMondayStr(date)),
      weekStartWeight(getMondayStr(date)),
    ]);
    setEntries(log.entries);
    setTotalCal(cal);
    setTotalProtein(prot);
    setWeekAvg(avg);
    setWeekWeight(wt);
    setLoaded(true);
  }, [date]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function handleAdd(name: string, calories?: number, protein?: number) {
    const entry: FoodEntry = {
      id: crypto.randomUUID(),
      name,
      calories,
      protein,
      timestamp: Date.now(),
    };
    await addEntry(date, entry);
    refresh();
  }

  async function handleDelete(id: string) {
    await deleteEntry(date, id);
    refresh();
  }

  if (!loaded) return null;

  const mondayStr = getMondayStr(date);
  const showWeighIn = isMonday(date);

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-extrabold tracking-tight text-lime-accent">
        Road to 185lbs
      </h1>

      {weekWeight != null && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface-card rounded-xl border border-border-subtle px-4 py-3">
            <p className="text-xs text-lime-accent uppercase tracking-wider font-medium">This week&apos;s weight</p>
            <p className="text-2xl font-extrabold text-text-primary mt-1 tabular-nums">
              {weekWeight} <span className="text-sm font-medium text-text-secondary">lbs</span>
            </p>
          </div>
          <div className="bg-surface-card rounded-xl border border-border-subtle px-4 py-3">
            <p className="text-xs text-lime-accent uppercase tracking-wider font-medium">Left to lose</p>
            <p className="text-2xl font-extrabold text-text-primary mt-1 tabular-nums">
              {Math.max(0, Math.round((weekWeight - 185) * 10) / 10)} <span className="text-sm font-medium text-text-secondary">lbs</span>
            </p>
          </div>
        </div>
      )}

      <div className="bg-surface-card rounded-2xl border border-border-subtle p-5">
        <p className="text-text-secondary text-sm font-medium uppercase tracking-wider">Today</p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-6xl font-extrabold tracking-tight text-lime-accent tabular-nums">{totalCal}</span>
          <span className="text-xl text-text-secondary font-medium">cal</span>
        </div>
        <div className="mt-1 flex gap-4 text-text-secondary">
          <span className="text-lg font-semibold">
            {totalProtein}g <span className="text-sm font-normal">protein</span>
          </span>
          <span className="text-sm self-center text-text-muted">|</span>
          <span className="text-sm self-center">
            Week avg:{" "}
            <span className="font-semibold text-text-primary">
              {weekAvg != null ? `${weekAvg} cal/day` : "—"}
            </span>
          </span>
        </div>
      </div>

      {showWeighIn && <WeighInCard date={mondayStr} onSaved={refresh} />}

      <div className="bg-surface-card rounded-2xl border border-border-subtle p-5 space-y-4">
        <p className="text-sm font-semibold text-lime-accent uppercase tracking-wider">Calorie Tracker</p>
        <FoodEntryForm onAdd={handleAdd} />
      </div>

      {entries.length > 0 && (
        <div>
          <p className="text-xs text-text-muted uppercase tracking-wider font-medium mb-3">Today&apos;s Entries</p>
          <EntryList entries={entries} onDelete={handleDelete} />
        </div>
      )}
    </div>
  );
}
