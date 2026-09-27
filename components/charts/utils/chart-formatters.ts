// LOCAL DEVIATION from the @bklit registry: locale switched en-US -> pl-PL.
// Neither XAxis nor ChartTooltip exposes a locale prop, and this app is
// Polish-only. Re-apply after any `shadcn add @bklit/*`.
export const shortDateFmt = new Intl.DateTimeFormat("pl-PL", {
  month: "short",
  day: "numeric",
});

export const weekdayDateFmt = new Intl.DateTimeFormat("pl-PL", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

export const hmsTimeFmt = new Intl.DateTimeFormat("pl-PL", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

// `Intl.NumberFormat.prototype.format` is a bound getter — safe to extract.
export const intFmt = new Intl.NumberFormat("pl-PL").format;
