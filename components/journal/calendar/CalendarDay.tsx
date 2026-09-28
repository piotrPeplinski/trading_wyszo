"use client";

import { Plus } from "lucide-react";

import { CalendarDayDot } from "@/components/journal/calendar/CalendarDayDot";
import { CalendarDayNumber } from "@/components/journal/calendar/CalendarDayNumber";
import { ResultBadge } from "@/components/reusable/ResultBadge";
import { formatFullDate, toIso } from "@/utils/calendar";
import type { CalendarMode } from "@/utils/calendarView";
import { VISIBLE_TRADES } from "@/utils/calendarView";
import {
  formatPercent,
  formatPercentShort,
  percentTone,
} from "@/utils/trades/format";
import type { Trade } from "@/utils/trades/types";
import { cn } from "@/lib/utils";

type CalendarDayProps = {
  date: Date;
  trades: Trade[];
  mode: CalendarMode;
  isCurrentPeriod: boolean;
  isToday: boolean;
  onOpenDay: (iso: string) => void;
  onAdd: (iso: string) => void;
};

export const CalendarDay = ({
  date,
  trades,
  mode,
  isCurrentPeriod,
  isToday,
  onOpenDay,
  onAdd,
}: CalendarDayProps) => {
  const iso = toIso(date);
  const sum = trades.reduce((acc, t) => acc + t.result_percentage, 0);
  const limit = VISIBLE_TRADES[mode];
  const overflow = trades.length - limit;

  const label = `${formatFullDate(date)}, ${
    trades.length === 1 ? "1 pozycja" : `${trades.length} pozycji`
  }${trades.length > 0 ? `, ${formatPercent(sum)}` : ""}`;

  return (
    <div
      role="button"
      tabIndex={isCurrentPeriod ? 0 : -1}
      aria-label={label}
      aria-disabled={!isCurrentPeriod}
      onClick={() => isCurrentPeriod && onOpenDay(iso)}
      onKeyDown={(e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        if (isCurrentPeriod) onOpenDay(iso);
      }}
      className={cn(
        "group relative flex flex-col gap-1 overflow-hidden rounded-xl border border-border bg-surface p-1.5 text-left transition-colors",
        mode === "month" ? "min-h-16 sm:min-h-20 sm:aspect-square" : "min-h-16 sm:min-h-40",
        isCurrentPeriod
          ? "hover:border-green/40"
          : "pointer-events-none opacity-40"
      )}
    >
      {/* Tint only reinforces the sign — the number below stays readable regardless. */}
      {trades.length > 0 && sum !== 0 && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{
            backgroundColor:
              sum > 0 ? "rgb(186 255 98 / 0.10)" : "rgb(239 75 75 / 0.10)",
          }}
        />
      )}

      {/* Phone: number, day total and one dot, stacked. Side by side they do not
          fit — a 7-column grid on a 375px screen leaves ~36px of usable width,
          and the tile list needs far more than that. */}
      <span className="relative flex flex-col items-center gap-0.5 sm:hidden">
        <CalendarDayNumber day={date.getDate()} isToday={isToday} />

        {trades.length > 0 && (
          <>
            <span
              className={cn(
                "text-[10px] font-semibold leading-none",
                percentTone(sum)
              )}
            >
              {formatPercentShort(sum)}
            </span>
            <CalendarDayDot count={trades.length} sum={sum} />
          </>
        )}
      </span>

      <span className="relative hidden items-start justify-between gap-1 sm:flex">
        <CalendarDayNumber day={date.getDate()} isToday={isToday} />

        {trades.length > 0 && (
          <span className={cn("text-xs font-semibold", percentTone(sum))}>
            {formatPercent(sum)}
          </span>
        )}
      </span>

      <span className="relative hidden min-w-0 flex-col gap-0.5 sm:flex">
        {trades.slice(0, limit).map((trade) => (
          <span key={trade.id} className="flex items-center gap-1">
            <span className="min-w-0 flex-1 truncate text-[11px] text-ink">
              {trade.instrument}
            </span>
            <ResultBadge result={trade.result} />
          </span>
        ))}

        {overflow > 0 && (
          <span className="text-[11px] text-muted-2">+{overflow}</span>
        )}
      </span>

      {/* Hover reveals it on pointer devices; on touch there is no hover, so the
          arbitrary media variant pins it visible. */}
      <button
        type="button"
        aria-label={`Dodaj pozycję ${formatFullDate(date)}`}
        onClick={(e) => {
          e.stopPropagation();
          onAdd(iso);
        }}
        className="absolute right-1 bottom-1 hidden h-6 w-6 items-center justify-center rounded-full bg-surface-2 text-muted opacity-0 transition-opacity hover:text-green-ink focus-visible:opacity-100 group-hover:opacity-100 sm:flex [@media(hover:none)]:opacity-100"
      >
        <Plus size={13} />
      </button>
    </div>
  );
};
