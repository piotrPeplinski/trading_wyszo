"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { fromIso, toIso } from "@/utils/calendar";
import type { CalendarMode } from "@/utils/calendarView";

/** Mode and anchor date live in the URL, so a view can be linked and survives reload. */
export const useCalendarView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode: CalendarMode = searchParams.get("mode") === "week" ? "week" : "month";
  const raw = searchParams.get("d");
  const anchor = raw && /^\d{4}-\d{2}-\d{2}$/.test(raw) ? fromIso(raw) : new Date();

  const set = (next: { mode?: CalendarMode; anchor?: Date }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next.mode) params.set("mode", next.mode);
    if (next.anchor) params.set("d", toIso(next.anchor));
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return {
    mode,
    anchor,
    setMode: (m: CalendarMode) => set({ mode: m }),
    setAnchor: (d: Date) => set({ anchor: d }),
  };
};
