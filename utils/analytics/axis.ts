/**
 * X-axis granularity for the equity curve.
 *
 * One rule covers every range preset AND keeps adapting while the user zooms:
 * the label set follows the *visible* span, not the picked preset. Zooming a
 * year view down to a fortnight therefore switches months -> days on its own.
 *
 * Intl only, no date library, and no toISOString() — same rule as utils/calendar.ts.
 */

const weekdayFmt = new Intl.DateTimeFormat("pl-PL", { weekday: "short" });
const dayFmt = new Intl.DateTimeFormat("pl-PL", { day: "numeric" });
const dayMonthFmt = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "short",
});
const monthFmt = new Intl.DateTimeFormat("pl-PL", { month: "short" });
const yearFmt = new Intl.DateTimeFormat("pl-PL", { year: "numeric" });

// pl-PL abbreviates with a trailing period ("pon.", "niedz."). On an axis that
// is noise, so it goes — but the abbreviations still come from Intl, not a list.
const weekday = (d: Date) => weekdayFmt.format(d).replace(/\.$/, "");

const DAY_MS = 86_400_000;

export const spanInDays = (from: Date, to: Date) =>
  Math.max(1, Math.round((to.getTime() - from.getTime()) / DAY_MS));

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

export type AxisTicks = {
  numTicks: number;
  format: (date: Date) => string;
};

const monthsBetween = (from: Date, to: Date) =>
  (to.getFullYear() - from.getFullYear()) * 12 +
  (to.getMonth() - from.getMonth()) +
  1;

export const axisTicksFor = (from: Date, to: Date): AxisTicks => {
  const days = spanInDays(from, to);

  // A week or less: name the days. "pon 21", not "21 wrz".
  if (days <= 8) {
    return {
      numTicks: clamp(days + 1, 2, 7),
      format: (d) => `${weekday(d)} ${dayFmt.format(d)}`,
    };
  }
  // Up to a month: seven roughly even dates out of that month.
  if (days <= 31) return { numTicks: 7, format: (d) => dayMonthFmt.format(d) };
  // Up to a year: the months. Counted off the calendar, not days/30 — the tick
  // count has to match the number of distinct labels or a month gets skipped.
  if (days <= 366) {
    return {
      numTicks: clamp(monthsBetween(from, to), 2, 12),
      format: (d) => monthFmt.format(d),
    };
  }
  // Longer than a year — only "all time" gets here: the years. Same reasoning,
  // one tick per calendar year covered.
  return {
    numTicks: clamp(to.getFullYear() - from.getFullYear() + 1, 2, 10),
    format: (d) => yearFmt.format(d),
  };
};
