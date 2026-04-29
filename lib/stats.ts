import { getDayLog, getWeight } from "./storage";
import { getWeekDates, addDays } from "./dates";

export async function dayTotalCalories(date: string): Promise<number> {
  const log = await getDayLog(date);
  return log.entries.reduce((sum, e) => sum + (e.calories ?? 0), 0);
}

export async function dayTotalProtein(date: string): Promise<number> {
  const log = await getDayLog(date);
  return log.entries.reduce((sum, e) => sum + (e.protein ?? 0), 0);
}

export async function dayHasEntries(date: string): Promise<boolean> {
  const log = await getDayLog(date);
  return log.entries.length > 0;
}

export async function weekAvgCalories(mondayStr: string): Promise<number | null> {
  const dates = getWeekDates(mondayStr);
  let totalCal = 0;
  let daysWithEntries = 0;

  const logs = await Promise.all(dates.map((d) => getDayLog(d)));

  for (const log of logs) {
    if (log.entries.length > 0) {
      totalCal += log.entries.reduce((sum, e) => sum + (e.calories ?? 0), 0);
      daysWithEntries++;
    }
  }
  if (daysWithEntries === 0) return null;
  return Math.round(totalCal / daysWithEntries);
}

export async function weekStartWeight(mondayStr: string): Promise<number | undefined> {
  return getWeight(mondayStr);
}

export async function weekEndWeight(mondayStr: string): Promise<number | undefined> {
  const nextMonday = addDays(mondayStr, 7);
  return getWeight(nextMonday);
}
