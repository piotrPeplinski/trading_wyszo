"use client";

import { cn } from "@/lib/utils";

type InstrumentChipProps = {
  name: string;
  active: boolean;
  disabled?: boolean;
  /** Set for the multi-select filter; omitted where the chip is a plain choice. */
  pressed?: boolean;
  onClick: () => void;
};

export const InstrumentChip = ({
  name,
  active,
  disabled,
  pressed,
  onClick,
}: InstrumentChipProps) => (
  <button
    type="button"
    disabled={disabled}
    aria-pressed={pressed}
    onClick={onClick}
    className={cn(
      "rounded-full border px-2.5 py-1 text-xs transition-colors disabled:pointer-events-none disabled:opacity-50",
      active
        ? "border-green/60 bg-surface-2 text-green-ink"
        : "border-border bg-surface-2 text-muted hover:border-green/50 hover:text-ink"
    )}
  >
    {name}
  </button>
);
