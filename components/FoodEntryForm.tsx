"use client";

import { useState } from "react";

type Props = {
  onAdd: (name: string, calories?: number, protein?: number) => void;
};

export default function FoodEntryForm({ onAdd }: Props) {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(
      trimmed,
      calories ? parseFloat(calories) : undefined,
      protein ? parseFloat(protein) : undefined
    );
    setName("");
    setCalories("");
    setProtein("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="What did you eat?"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-xl bg-surface-card border border-border-subtle px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-lime-accent transition-colors"
      />
      <div className="flex gap-3">
        <input
          type="number"
          inputMode="decimal"
          placeholder="Calories"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          className="w-0 min-w-0 flex-1 rounded-xl bg-surface-card border border-border-subtle px-3 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-lime-accent transition-colors"
        />
        <input
          type="number"
          inputMode="decimal"
          placeholder="Protein (g)"
          value={protein}
          onChange={(e) => setProtein(e.target.value)}
          className="w-0 min-w-0 flex-1 rounded-xl bg-surface-card border border-border-subtle px-3 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-lime-accent transition-colors"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-xl bg-lime-accent text-surface font-bold py-3 text-base active:scale-[0.98] transition-transform min-h-[48px]"
      >
        Add
      </button>
    </form>
  );
}
