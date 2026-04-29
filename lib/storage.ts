import { supabase } from "./supabase";
import { FoodEntry, DayLog } from "./types";

export async function getDayLog(date: string): Promise<DayLog> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { date, entries: [] };

  const { data } = await supabase
    .from("food_entries")
    .select("id, name, calories, protein, timestamp")
    .eq("user_id", user.id)
    .eq("date", date)
    .order("timestamp", { ascending: true });

  return {
    date,
    entries: (data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      calories: row.calories ?? undefined,
      protein: row.protein ?? undefined,
      timestamp: row.timestamp,
    })),
  };
}

export async function addEntry(date: string, entry: FoodEntry): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("food_entries").insert({
    id: entry.id,
    user_id: user.id,
    date,
    name: entry.name,
    calories: entry.calories ?? null,
    protein: entry.protein ?? null,
    timestamp: entry.timestamp,
  });
}

export async function deleteEntry(date: string, entryId: string): Promise<void> {
  await supabase.from("food_entries").delete().eq("id", entryId);
}

export async function getWeight(date: string): Promise<number | undefined> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return undefined;

  const { data } = await supabase
    .from("weights")
    .select("weight")
    .eq("user_id", user.id)
    .eq("date", date)
    .single();

  return data?.weight ?? undefined;
}

export async function saveWeight(date: string, weight: number): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("weights").upsert(
    { user_id: user.id, date, weight },
    { onConflict: "user_id,date" }
  );
}

export async function getAllStoredDates(): Promise<string[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const [{ data: entries }, { data: weightRows }] = await Promise.all([
    supabase
      .from("food_entries")
      .select("date")
      .eq("user_id", user.id),
    supabase
      .from("weights")
      .select("date")
      .eq("user_id", user.id),
  ]);

  const dateSet = new Set<string>();
  for (const row of entries ?? []) dateSet.add(row.date);
  for (const row of weightRows ?? []) dateSet.add(row.date);

  return Array.from(dateSet).sort();
}
