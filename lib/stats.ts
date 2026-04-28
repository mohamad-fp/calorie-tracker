import { getDayLog, getWeight } from "./storage";
import { getWeekDates, addDays } from "./dates";

export function dayTotalCalories(date: string): number {
  const log = getDayLog(date);
  return log.entries.reduce((sum, e) => sum + (e.calories ?? 0), 0);
}

export function dayTotalProtein(date: string): number {
  const log = getDayLog(date);
  return log.entries.reduce((sum, e) => sum + (e.protein ?? 0), 0);
}

export function dayHasEntries(date: string): boolean {
  return getDayLog(date).entries.length > 0;
}

export function weekAvgCalories(mondayStr: string): number | null {
  const dates = getWeekDates(mondayStr);
  let totalCal = 0;
  let daysWithEntries = 0;
  for (const date of dates) {
    const log = getDayLog(date);
    if (log.entries.length > 0) {
      totalCal += log.entries.reduce((sum, e) => sum + (e.calories ?? 0), 0);
      daysWithEntries++;
    }
  }
  if (daysWithEntries === 0) return null;
  return Math.round(totalCal / daysWithEntries);
}

export function weekStartWeight(mondayStr: string): number | undefined {
  return getWeight(mondayStr);
}

export function weekEndWeight(mondayStr: string): number | undefined {
  const nextMonday = addDays(mondayStr, 7);
  return getWeight(nextMonday);
}
