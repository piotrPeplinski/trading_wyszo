const decimal = new Intl.NumberFormat("pl-PL", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

// useGrouping: true — pl-PL defaults to "min2", which leaves 1250 ungrouped and
// only separates from five digits up. Money should group from four.
const money = new Intl.NumberFormat("pl-PL", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: true,
});

const ratio = new Intl.NumberFormat("pl-PL", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Intl already emits "-" for negatives; only the "+" needs adding by hand. */
const sign = (n: number) => (n > 0 ? "+" : "");

export const formatPercent = (n: number) => `${sign(n)}${decimal.format(n)}%`;

export const formatAmount = (n: number) => `${sign(n)}${money.format(n)} $`;

export const formatRr = (n: number) => ratio.format(n);

export const percentTone = (n: number) =>
  n > 0 ? "text-green-ink" : n < 0 ? "text-red" : "text-muted";

const whole = new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0 });

/**
 * No decimals — for the calendar's phone cell, which is ~48px wide. "-40,0%"
 * overflows there; "-40%" fits with room to spare.
 */
export const formatPercentShort = (n: number) =>
  `${sign(n)}${whole.format(n)}%`;

/** Same rule as percentTone, as a fill — for the calendar's mobile day dot. */
export const percentDot = (n: number) =>
  n > 0 ? "bg-green" : n < 0 ? "bg-red" : "bg-muted-2";
