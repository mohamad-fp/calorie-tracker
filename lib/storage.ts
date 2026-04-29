import { FoodEntry, DayLog } from "./types";

const STORAGE_PREFIX = "cal_";

function dayKey(date: string): string {
  return `${STORAGE_PREFIX}day_${date}`;
}

function weightKey(date: string): string {
  return `${STORAGE_PREFIX}weight_${date}`;
}

export function getDayLog(date: string): DayLog {
  if (typeof window === "undefined") return { date, entries: [] };
  const raw = localStorage.getItem(dayKey(date));
  if (!raw) return { date, entries: [] };
  try {
    return JSON.parse(raw) as DayLog;
  } catch {
    return { date, entries: [] };
  }
}

export function saveDayLog(log: DayLog): void {
  localStorage.setItem(dayKey(log.date), JSON.stringify(log));
}

export function addEntry(date: string, entry: FoodEntry): DayLog {
  const log = getDayLog(date);
  log.entries.push(entry);
  saveDayLog(log);
  return log;
}

export function deleteEntry(date: string, entryId: string): DayLog {
  const log = getDayLog(date);
  log.entries = log.entries.filter((e) => e.id !== entryId);
  saveDayLog(log);
  return log;
}

export function getWeight(date: string): number | undefined {
  if (typeof window === "undefined") return undefined;
  const raw = localStorage.getItem(weightKey(date));
  if (!raw) return undefined;
  return parseFloat(raw);
}

export function saveWeight(date: string, weight: number): void {
  localStorage.setItem(weightKey(date), String(weight));
}

export function getAllStoredDates(): string[] {
  if (typeof window === "undefined") return [];
  const dateSet = new Set<string>();
  const dayPrefix = `${STORAGE_PREFIX}day_`;
  const weightPrefix = `${STORAGE_PREFIX}weight_`;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(dayPrefix)) {
      dateSet.add(key.slice(dayPrefix.length));
    } else if (key?.startsWith(weightPrefix)) {
      dateSet.add(key.slice(weightPrefix.length));
    }
  }
  return Array.from(dateSet).sort();
}
