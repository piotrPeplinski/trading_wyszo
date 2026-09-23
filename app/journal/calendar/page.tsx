"use client";

import { Suspense } from "react";

import { CalendarGrid } from "@/components/journal/calendar/CalendarGrid";
import { CalendarSummary } from "@/components/journal/calendar/CalendarSummary";
import { CalendarToolbar } from "@/components/journal/calendar/CalendarToolbar";
import { useCalendarTrades } from "@/hooks/useCalendarTrades";
import { useCalendarView } from "@/hooks/useCalendarView";
import {
  endOfMonthGrid,
  endOfWeek,
  startOfMonthGrid,
  startOfWeek,
} from "@/utils/calendar";

const CalendarPageInner = () => {
  const { mode, anchor, setMode, setAnchor } = useCalendarView();

  const from = mode === "month" ? startOfMonthGrid(anchor) : startOfWeek(anchor);
  const to = mode === "month" ? endOfMonthGrid(anchor) : endOfWeek(anchor);
  const { trades, byDate } = useCalendarTrades(from, to);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold text-ink">Kalendarz</h1>

      <CalendarToolbar
        mode={mode}
        anchor={anchor}
        onModeChange={setMode}
        onAnchorChange={setAnchor}
      />

      <CalendarGrid
        mode={mode}
        anchor={anchor}
        byDate={byDate}
        onAnchorChange={setAnchor}
      />

      <CalendarSummary trades={trades} />
    </div>
  );
};

// useSearchParams needs a Suspense boundary in the App Router.
const CalendarPage = () => (
  <Suspense fallback={null}>
    <CalendarPageInner />
  </Suspense>
);

export default CalendarPage;
