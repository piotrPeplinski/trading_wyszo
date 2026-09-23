"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  addMonths,
  addWeeks,
  formatMonthLabel,
  formatWeekLabel,
  fromIso,
  toIso,
} from "@/utils/calendar";
import type { CalendarMode } from "@/utils/calendarView";
import { ACTION_BUTTON } from "@/utils/trades/constants";

type CalendarToolbarProps = {
  mode: CalendarMode;
  anchor: Date;
  onModeChange: (mode: CalendarMode) => void;
  onAnchorChange: (date: Date) => void;
};

export const CalendarToolbar = ({
  mode,
  anchor,
  onModeChange,
  onAnchorChange,
}: CalendarToolbarProps) => {
  // One control, two step sizes — the arrows follow whichever period is shown.
  const step = (n: number) =>
    onAnchorChange(mode === "month" ? addMonths(anchor, n) : addWeeks(anchor, n));

  const label =
    mode === "month" ? formatMonthLabel(anchor) : formatWeekLabel(anchor);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Tabs value={mode} onValueChange={(v) => onModeChange(v as CalendarMode)}>
        <TabsList>
          <TabsTrigger value="month">Miesiąc</TabsTrigger>
          <TabsTrigger value="week">Tydzień</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label={mode === "month" ? "Poprzedni miesiąc" : "Poprzedni tydzień"}
          onClick={() => step(-1)}
          className={ACTION_BUTTON}
        >
          <ChevronLeft size={17} />
        </button>

        <button
          type="button"
          onClick={() => onAnchorChange(new Date())}
          className="rounded-full border border-border px-3 py-1 text-xs text-muted transition-colors hover:border-green/50 hover:text-ink"
        >
          Dziś
        </button>

        <button
          type="button"
          aria-label={mode === "month" ? "Następny miesiąc" : "Następny tydzień"}
          onClick={() => step(1)}
          className={ACTION_BUTTON}
        >
          <ChevronRight size={17} />
        </button>
      </div>

      <p className="font-display text-lg font-semibold text-ink first-letter:uppercase">
        {label}
      </p>

      <div className="ml-auto flex items-center gap-2">
        <label htmlFor="cal-goto" className="text-xs text-muted">
          Przejdź do daty
        </label>
        <Input
          id="cal-goto"
          type="date"
          className="w-auto"
          value={toIso(anchor)}
          onChange={(e) => e.target.value && onAnchorChange(fromIso(e.target.value))}
        />
      </div>
    </div>
  );
};
