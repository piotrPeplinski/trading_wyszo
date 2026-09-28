import React from "react";

import { percentDot } from "@/utils/trades/format";

type CalendarDayDotProps = {
  /** Sum of the day's result percentages — drives the colour. */
  sum: number;
  /** How many trades that day — shown inside the badge. */
  count: number;
};

/**
 * The phone stand-in for the per-trade tiles: one badge per day, coloured by
 * the day's net and carrying the trade count. At seven columns on a 375px
 * screen a tile is ~48px wide, which truncates an instrument name to nothing
 * useful — this keeps both signals the tiles carried.
 */
export const CalendarDayDot = ({ sum, count }: CalendarDayDotProps) => (
  <span
    className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold leading-none ${percentDot(sum)}`}
  >
    {count}
  </span>
);
