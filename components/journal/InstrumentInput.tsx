"use client";

import { useEffect, useState } from "react";

import { useApi } from "@/hooks/useApi";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type InstrumentInputProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  id?: string;
  disabled?: boolean;
};

/**
 * Free-text instrument with the user's own history as one-tap chips. Chips beat a
 * <datalist> here: they're visible without focusing the field and they work on touch.
 */
export function InstrumentInput({
  value,
  onChange,
  error,
  id,
  disabled,
}: InstrumentInputProps) {
  const api = useApi();
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    api
      .get<string[]>("/trades/instruments")
      .then((res) => {
        if (!cancelled) setSuggestions(res.data);
      })
      .catch(() => {
        if (!cancelled) setSuggestions([]);
      });
    return () => {
      cancelled = true;
    };
    // Fetch once on mount: the list only changes after a save, and the dialog
    // remounts this component each time it opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {/* A brand-new user has no history — render nothing rather than an empty row. */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((name) => (
            <button
              key={name}
              type="button"
              disabled={disabled}
              onClick={() => onChange(name)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs transition-colors disabled:pointer-events-none disabled:opacity-50",
                name === value
                  ? "border-green/60 bg-surface-2 text-green-ink"
                  : "border-border bg-surface-2 text-muted hover:border-green/50 hover:text-ink"
              )}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      <Input
        id={id}
        value={value}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        onChange={(e) => onChange(e.target.value)}
        placeholder="EURUSD, BTCUSD…"
      />
    </div>
  );
}
