import React from "react";

import { cn } from "@/lib/utils";

type CalendarDayNumberProps = {
  day: number;
  isToday: boolean;
};

export const CalendarDayNumber = ({ day, isToday }: CalendarDayNumberProps) => (
  <span
    className={cn(
      "flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs",
      isToday ? "bg-green font-semibold text-[#06110b]" : "text-muted"
    )}
  >
    {day}
  </span>
);
