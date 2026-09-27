"use client";

import React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { RANGE_OPTIONS } from "@/utils/analytics/range";
import type { AnalyticsRange, RangeKey } from "@/utils/analytics/types";

type RangePickerProps = {
  range: AnalyticsRange;
  onKeyChange: (key: RangeKey) => void;
  onBoundChange: (bound: "from" | "to", value: string) => void;
};

export const RangePicker = ({
  range,
  onKeyChange,
  onBoundChange,
}: RangePickerProps) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
    {/* A filter, not a set of panels: aria-pressed toggles, not tablist roles. */}
    <div
      role="group"
      aria-label="Zakres dat"
      className="flex w-full gap-1 rounded-full border border-border bg-surface p-1 sm:w-auto"
    >
      {RANGE_OPTIONS.map((option) => {
        const active = option.key === range.key;
        return (
          <button
            key={option.key}
            type="button"
            aria-pressed={active}
            onClick={() => onKeyChange(option.key)}
            className={cn(
              // Five segments do not fit 375px at the desktop padding, and the
              // group must never be what makes the page scroll sideways.
              "flex-1 whitespace-nowrap rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors sm:flex-none sm:px-4 sm:text-sm",
              active
                ? "bg-surface-2 text-ink"
                : "text-muted hover:text-ink"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>

    {range.key === "custom" && (
      <div className="flex gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="range-from" className="text-xs text-muted">
            Od
          </label>
          <Input
            id="range-from"
            type="date"
            value={range.from ?? ""}
            max={range.to ?? undefined}
            onChange={(e) => onBoundChange("from", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="range-to" className="text-xs text-muted">
            Do
          </label>
          <Input
            id="range-to"
            type="date"
            value={range.to ?? ""}
            min={range.from ?? undefined}
            onChange={(e) => onBoundChange("to", e.target.value)}
          />
        </div>
      </div>
    )}
  </div>
);
