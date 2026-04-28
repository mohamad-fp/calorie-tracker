export function today(): string {
  return formatDate(new Date());
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

export function getMondayStr(dateStr: string): string {
  return formatDate(getMonday(parseDate(dateStr)));
}

export function getWeekDates(mondayStr: string): string[] {
  const monday = parseDate(mondayStr);
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(formatDate(d));
  }
  return dates;
}

export function isMonday(dateStr: string): boolean {
  return parseDate(dateStr).getDay() === 1;
}

export function dayName(dateStr: string): string {
  return parseDate(dateStr).toLocaleDateString("en-US", { weekday: "short" });
}

export function shortDate(dateStr: string): string {
  const d = parseDate(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function weekRangeLabel(mondayStr: string): string {
  const dates = getWeekDates(mondayStr);
  const start = parseDate(dates[0]);
  const end = parseDate(dates[6]);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}

export function addDays(dateStr: string, days: number): string {
  const d = parseDate(dateStr);
  d.setDate(d.getDate() + days);
  return formatDate(d);
}
