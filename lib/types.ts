export type FoodEntry = {
  id: string;
  name: string;
  calories?: number;
  protein?: number;
  timestamp: number;
};

export type DayLog = {
  date: string; // "YYYY-MM-DD"
  entries: FoodEntry[];
};

export type WeekLog = {
  weekStart: string; // "YYYY-MM-DD" always a Monday
  startWeight?: number;
  days: DayLog[];
};
