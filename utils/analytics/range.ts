import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfMonth,
  startOfWeek,
  startOfYear,
  toIso,
} from "@/utils/calendar";
import type { AnalyticsRange, RangeKey } from "@/utils/analytics/types";

export const RANGE_OPTIONS: { key: RangeKey; label: string }[] = [
  { key: "week", label: "Tydzień" },
  { key: "month", label: "Miesiąc" },
  { key: "year", label: "Rok" },
  { key: "all", label: "Wszystko" },
  { key: "custom", label: "Własny" },
];

const KEYS = new Set<string>(RANGE_OPTIONS.map((o) => o.key));
const ISO = /^\d{4}-\d{2}-\d{2}$/;

/**
 * The preset windows, in local time. startOfWeek is Monday-first (utils/calendar),
 * and month/year use the real calendar bounds rather than the padded *Grid ones.
 */
const presetFor = (key: Exclude<RangeKey, "custom" | "all">, today: Date) => {
  if (key === "week") return { from: startOfWeek(today), to: endOfWeek(today) };
  if (key === "year") return { from: startOfYear(today), to: endOfYear(today) };
  return { from: startOfMonth(today), to: endOfMonth(today) };
};

export const presetRange = (
  key: Exclude<RangeKey, "custom">,
  today = new Date()
): AnalyticsRange => {
  // All time is the absence of bounds, not a very wide one — no clamping, and
  // it keeps working when the user back-dates a trade beyond any window here.
  if (key === "all") return { key, from: null, to: null };
  const { from, to } = presetFor(key, today);
  return { key, from: toIso(from), to: toIso(to) };
};

/**
 * A custom range with only one end filled is still a usable window — the missing
 * side falls back to the current month, so the request never goes out half-built.
 */
export const readRange = (
  params: URLSearchParams,
  today = new Date()
): AnalyticsRange => {
  const raw = params.get("range");
  const key = (KEYS.has(raw ?? "") ? raw : "month") as RangeKey;
  if (key !== "custom") return presetRange(key, today);

  const month = presetRange("month", today);
  const from = params.get("from");
  const to = params.get("to");
  return {
    key: "custom",
    from: from && ISO.test(from) ? from : month.from,
    to: to && ISO.test(to) ? to : month.to,
  };
};

/**
 * Only a custom range carries from/to; the presets are recomputed from today on
 * every read, so persisting their bounds would make a stale link lie.
 */
export const writeRange = (current: URLSearchParams, next: AnalyticsRange) => {
  const params = new URLSearchParams(current.toString());
  params.set("range", next.key);
  if (next.key === "custom" && next.from && next.to) {
    params.set("from", next.from);
    params.set("to", next.to);
  } else {
    params.delete("from");
    params.delete("to");
  }
  return params.toString();
};
