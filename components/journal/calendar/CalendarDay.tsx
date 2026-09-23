"use client";

import { Plus } from "lucide-react";

import { ResultBadge } from "@/components/reusable/ResultBadge";
import { formatFullDate, toIso } from "@/utils/calendar";
import type { CalendarMode } from "@/utils/calendarView";
import { VISIBLE_TRADES } from "@/utils/calendarView";
import { formatPercent, percentTone } from "@/utils/trades/format";
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
        mode === "month" ? "min-h-20 sm:aspect-square" : "min-h-40",
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

      <span className="relative flex items-start justify-between gap-1">
        <span
          className={cn(
            "flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs",
            isToday ? "bg-green font-semibold text-[#06110b]" : "text-muted"
          )}
        >
          {date.getDate()}
        </span>

        {trades.length > 0 && (
          <span className={cn("text-xs font-semibold", percentTone(sum))}>
            {formatPercent(sum)}
          </span>
        )}
      </span>

      <span className="relative flex min-w-0 flex-col gap-0.5">
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
        className="absolute right-1 bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-surface-2 text-muted opacity-0 transition-opacity hover:text-green-ink focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
      >
        <Plus size={13} />
      </button>
    </div>
  );
};
