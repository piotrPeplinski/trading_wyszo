"use client";

import { useEffect, useState } from "react";

import { useApi } from "@/hooks/useApi";
import { cn } from "@/lib/utils";

type InstrumentFilterProps = {
  /** Currently selected instruments. Empty means "all". */
  selected: string[];
  onChange: (next: string[]) => void;
};

/**
 * Multi-select chips. Chips-only, no free-text box: the list is built from this
 * user's own trades, so every value worth filtering by is already a chip, and a
 * text field would only invite typos that match nothing.
 */
export function InstrumentFilter({ selected, onChange }: InstrumentFilterProps) {
  const api = useApi();
  const [instruments, setInstruments] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    api
      .get<string[]>("/trades/instruments")
      .then((res) => !cancelled && setInstruments(res.data))
      .catch(() => !cancelled && setInstruments([]));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (instruments.length === 0) return null;

  const toggle = (name: string) =>
    onChange(
      selected.includes(name)
        ? selected.filter((i) => i !== name)
        : [...selected, name]
    );

  return (
    <div className="flex flex-wrap gap-1.5">
      {instruments.map((name) => {
        const active = selected.includes(name);
        return (
          <button
            key={name}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(name)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs transition-colors",
              active
                ? "border-green/60 bg-surface-2 text-green-ink"
                : "border-border bg-surface-2 text-muted hover:border-green/50 hover:text-ink"
            )}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
}
