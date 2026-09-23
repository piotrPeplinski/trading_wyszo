export type CalendarMode = "month" | "week";

export const WEEKDAY_LABELS = ["pn", "wt", "śr", "cz", "pt", "so", "nd"];

/** How many trades a cell lists before collapsing the rest into "+N". */
export const VISIBLE_TRADES: Record<CalendarMode, number> = {
  month: 3,
  week: 6,
};

/** Below this the gesture is a scroll, not a swipe. */
export const SWIPE_THRESHOLD_PX = 50;
