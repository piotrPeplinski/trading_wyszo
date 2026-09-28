import React from "react";

import { percentDot } from "@/utils/trades/format";

type CalendarDayDotProps = {
  /** Sum of the day's result percentages. */
  sum: number;
};

/**
 * The phone stand-in for the per-trade tiles: one dot per day, coloured by the
 * day's net. At seven columns on a 375px screen a tile is ~48px wide, which
 * truncates the instrument name to nothing useful — the dot carries the same
 * signal the cell tint already does, legibly.
 */
export const CalendarDayDot = ({ sum }: CalendarDayDotProps) => (
  <span
    aria-hidden="true"
    className={`h-2 w-2 shrink-0 rounded-full ${percentDot(sum)}`}
  />
);
