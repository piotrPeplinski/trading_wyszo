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
