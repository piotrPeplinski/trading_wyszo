/**
 * Local-time date maths, built from getFullYear/getMonth/getDate only.
 *
 * The UTC serialiser is deliberately avoided everywhere in the calendar: it shifts
 * a date built at local midnight to the previous day east of Greenwich, which would
 * drop trades into the wrong cell.
 */

const pad = (n: number) => String(n).padStart(2, "0");

export const toIso = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const fromIso = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

/** Monday-first: getDay() is 0 for Sunday, so shift by 6 before taking the rest. */
const weekdayIndex = (d: Date) => (d.getDay() + 6) % 7;

export const startOfWeek = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() - weekdayIndex(d));

export const endOfWeek = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() - weekdayIndex(d) + 6);

export const startOfMonthGrid = (d: Date) =>
  startOfWeek(new Date(d.getFullYear(), d.getMonth(), 1));

export const endOfMonthGrid = (d: Date) =>
  endOfWeek(new Date(d.getFullYear(), d.getMonth() + 1, 0));

/** Clamps the day: addMonths(31 Jan, 1) is 28/29 Feb, never 2/3 March. */
export const addMonths = (d: Date, n: number) => {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(d.getDate(), lastDay));
  return target;
};

export const addWeeks = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n * 7);

export const eachDay = (from: Date, to: Date) => {
  const days: Date[] = [];
  const cursor = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  while (cursor <= to) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
};

export const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const isSameMonth = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

const monthYear = new Intl.DateTimeFormat("pl-PL", {
  month: "long",
  year: "numeric",
});

const dayMonthYear = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const dayOnly = new Intl.DateTimeFormat("pl-PL", { day: "numeric" });
const dayMonth = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long" });

export const formatMonthLabel = (d: Date) => monthYear.format(d);

export const formatFullDate = (d: Date) => dayMonthYear.format(d);

export const formatDayMonth = (d: Date) => dayMonth.format(d);

/** "3–9 marca 2026", collapsing the month when both ends share it. */
export const formatWeekLabel = (d: Date) => {
  const from = startOfWeek(d);
  const to = endOfWeek(d);
  const left = isSameMonth(from, to) ? dayOnly.format(from) : dayMonth.format(from);
  return `${left}–${dayMonthYear.format(to)}`;
};
