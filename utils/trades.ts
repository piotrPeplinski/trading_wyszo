export type Operation = "short" | "long";
export type Result = "tp" | "sl" | "be";

export type Trade = {
  id: number;
  user_id: number;
  /** "YYYY-MM-DD" — the backend column is a DATE, there is no time component. */
  date: string;
  instrument: string;
  interval: string;
  operation: Operation;
  result: Result;
  result_percentage: number;
  result_amount: number;
  result_rr: number;
  link: string | null;
  description: string | null;
  error_desc: string | null;
};

export type TradePage = {
  items: Trade[];
  total: number;
  limit: number;
  offset: number;
};

export const OPERATION_LABELS: Record<Operation, string> = {
  long: "Long",
  short: "Short",
};

export const RESULT_LABELS: Record<Result, string> = {
  tp: "TP",
  sl: "SL",
  be: "BE",
};

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

const rr = new Intl.NumberFormat("pl-PL", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Intl already emits "-" for negatives; only the "+" needs adding by hand. */
const sign = (n: number) => (n > 0 ? "+" : "");

export function formatPercent(n: number): string {
  return `${sign(n)}${decimal.format(n)}%`;
}

export function formatAmount(n: number): string {
  return `${sign(n)}${money.format(n)} $`;
}

export function formatRr(n: number): string {
  return rr.format(n);
}
