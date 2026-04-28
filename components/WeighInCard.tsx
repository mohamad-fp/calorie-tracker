"use client";

import { useState, useEffect } from "react";
import { getWeight, saveWeight } from "@/lib/storage";

type Props = {
  date: string;
  label?: string;
};

export default function WeighInCard({ date, label = "Monday Weigh-in" }: Props) {
  const [weight, setWeight] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const w = getWeight(date);
    if (w != null) {
      setWeight(String(w));
      setSaved(true);
    }
  }, [date]);

  function handleSave() {
    const val = parseFloat(weight);
    if (!isNaN(val) && val > 0) {
      saveWeight(date, val);
      setSaved(true);
    }
  }

  return (
    <div className="bg-surface-card rounded-xl border border-lime-accent/30 px-4 py-3">
      <p className="text-sm text-lime-accent font-medium mb-2">{label}</p>
      <div className="flex gap-3 items-center">
        <input
          type="number"
          inputMode="decimal"
          placeholder="Weight (lbs)"
          value={weight}
          onChange={(e) => {
            setWeight(e.target.value);
            setSaved(false);
          }}
          className="flex-1 rounded-lg bg-surface border border-border-subtle px-3 py-2 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-lime-accent transition-colors"
        />
        <button
          onClick={handleSave}
          className={`rounded-lg px-4 py-2 font-semibold min-h-[44px] transition-colors ${
            saved
              ? "bg-lime-dim/20 text-lime-dim"
              : "bg-lime-accent text-surface"
          }`}
        >
          {saved ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}
