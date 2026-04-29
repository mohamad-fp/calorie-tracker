"use client";

import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { FoodEntry } from "@/lib/types";
import { getDayLog, addEntry, deleteEntry } from "@/lib/storage";
import { dayTotalCalories, dayTotalProtein } from "@/lib/stats";
import { dayName, shortDate, isMonday, getMondayStr } from "@/lib/dates";
import FoodEntryForm from "@/components/FoodEntryForm";
import EntryList from "@/components/EntryList";
import WeighInCard from "@/components/WeighInCard";

export default function DayDetailPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = use(params);
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [totalCal, setTotalCal] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    const [log, cal, prot] = await Promise.all([
      getDayLog(date),
      dayTotalCalories(date),
      dayTotalProtein(date),
    ]);
    setEntries(log.entries);
    setTotalCal(cal);
    setTotalProtein(prot);
    setLoaded(true);
  }, [date]);

  useEffect(() => { refresh(); }, [refresh]);

  async function handleAdd(name: string, calories?: number, protein?: number) {
    await addEntry(date, { id: crypto.randomUUID(), name, calories, protein, timestamp: Date.now() });
    refresh();
  }

  async function handleDelete(id: string) {
    await deleteEntry(date, id);
    refresh();
  }

  if (!loaded) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-lime-accent">Road to 185lbs</h1>
      <div className="flex items-center gap-3">
        <Link href="/week" className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-text-secondary hover:text-text-primary" aria-label="Back to week">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
        </Link>
        <p className="text-lg font-semibold">{dayName(date)}, {shortDate(date)}</p>
      </div>
      <div className="flex items-baseline gap-4">
        <div>
          <span className="text-4xl font-extrabold tracking-tight text-lime-accent tabular-nums">{totalCal}</span>
          <span className="text-lg text-text-secondary ml-1">cal</span>
        </div>
        <div>
          <span className="text-xl font-semibold text-text-primary tabular-nums">{totalProtein}g</span>
          <span className="text-sm text-text-secondary ml-1">protein</span>
        </div>
      </div>
      {isMonday(date) && <WeighInCard date={getMondayStr(date)} />}
      <FoodEntryForm onAdd={handleAdd} />
      <EntryList entries={entries} onDelete={handleDelete} />
    </div>
  );
}
