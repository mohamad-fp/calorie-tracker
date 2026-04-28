"use client";

import { FoodEntry } from "@/lib/types";

type Props = {
  entries: FoodEntry[];
  onDelete: (id: string) => void;
};

export default function EntryList({ entries, onDelete }: Props) {
  if (entries.length === 0) {
    return (
      <p className="text-center text-text-muted py-8">
        No entries yet. Add something above!
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="flex items-center justify-between bg-surface-card rounded-xl px-4 py-3 border border-border-subtle"
        >
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{entry.name}</p>
            <div className="flex gap-3 text-sm text-text-secondary">
              {entry.calories != null && <span>{entry.calories} cal</span>}
              {entry.protein != null && <span>{entry.protein}g protein</span>}
              {entry.calories == null && entry.protein == null && (
                <span className="text-text-muted">no macros</span>
              )}
            </div>
          </div>
          <button
            onClick={() => onDelete(entry.id)}
            className="ml-3 p-2 text-text-muted hover:text-danger active:text-danger transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={`Delete ${entry.name}`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
