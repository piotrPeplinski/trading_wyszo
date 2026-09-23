"use client";

import { useRef, useState } from "react";

import { CalendarDay } from "@/components/journal/calendar/CalendarDay";
import { DayTradesDialog } from "@/components/journal/calendar/DayTradesDialog";
import { useTradeDialog } from "@/hooks/useTradeDialog";
import {
  addMonths,
  addWeeks,
  eachDay,
  endOfMonthGrid,
  endOfWeek,
  isSameDay,
  isSameMonth,
  startOfMonthGrid,
  startOfWeek,
  toIso,
} from "@/utils/calendar";
import { SWIPE_THRESHOLD_PX, WEEKDAY_LABELS } from "@/utils/calendarView";
import type { CalendarMode } from "@/utils/calendarView";
import type { Trade } from "@/utils/trades/types";

type CalendarGridProps = {
  mode: CalendarMode;
  anchor: Date;
  byDate: Map<string, Trade[]>;
  onAnchorChange: (date: Date) => void;
};

export const CalendarGrid = ({
  mode,
  anchor,
  byDate,
  onAnchorChange,
}: CalendarGridProps) => {
  const { openCreate } = useTradeDialog();
  const [openDay, setOpenDay] = useState<string | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const from = mode === "month" ? startOfMonthGrid(anchor) : startOfWeek(anchor);
  const to = mode === "month" ? endOfMonthGrid(anchor) : endOfWeek(anchor);
  const days = eachDay(from, to);
  const today = new Date();

  // Horizontal only: a mostly-vertical drag must stay a page scroll.
  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) <= SWIPE_THRESHOLD_PX || Math.abs(dx) <= Math.abs(dy)) return;

    const step = dx < 0 ? 1 : -1;
    onAnchorChange(mode === "month" ? addMonths(anchor, step) : addWeeks(anchor, step));
  };

  return (
    <>
      <div
        onTouchStart={(e) => {
          touchStart.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
          };
        }}
        onTouchEnd={handleTouchEnd}
      >
        <div className="grid grid-cols-7 gap-1.5 pb-1.5">
          {WEEKDAY_LABELS.map((label) => (
            <span key={label} className="text-xs text-muted">
              {label}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {days.map((day) => {
            const iso = toIso(day);
            return (
              <CalendarDay
                key={iso}
                date={day}
                mode={mode}
                trades={byDate.get(iso) ?? []}
                isCurrentPeriod={mode === "week" || isSameMonth(day, anchor)}
                isToday={isSameDay(day, today)}
                onOpenDay={setOpenDay}
                onAdd={openCreate}
              />
            );
          })}
        </div>
      </div>

      <DayTradesDialog
        iso={openDay}
        trades={openDay ? (byDate.get(openDay) ?? []) : []}
        onClose={() => setOpenDay(null)}
      />
    </>
  );
};
