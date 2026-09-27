import type { EquityPoint } from "@/utils/analytics/types";
import { fromIso } from "@/utils/calendar";

export type CurvePoint = {
  date: Date;
  cumulative: number;
};

export type Curve = {
  points: CurvePoint[];
  /** Full extent the chart should span — also the zoom's "reset" domain. */
  domain: [Date, Date] | null;
};

const dayBefore = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1);

/**
 * Turns the API's per-trading-day cumulative points into a curve that spans the
 * whole selected range.
 *
 * Anchored at 0% on the left so the reader has a baseline, and carried forward
 * to the right edge so the card is not half empty. Both ends are skipped when
 * they would land on top of, or before, real data.
 */
export const buildCurve = (
  curve: EquityPoint[],
  from: string | null,
  to: string | null,
  today = new Date()
): Curve => {
  if (curve.length === 0) return { points: [], domain: null };

  const data = curve.map((p) => ({
    // fromIso builds local midnight; a UTC parse of "YYYY-MM-DD" would land on
    // the previous day east of Greenwich and shift the whole curve.
    date: fromIso(p.date),
    cumulative: p.cumulative,
  }));

  const first = data[0].date;
  const last = data[data.length - 1].date;

  // All time has no bounds of its own, so the data supplies them.
  const start = from ? fromIso(from) : dayBefore(first);
  const rawEnd = to ? fromIso(to) : (last > today ? last : today);

  // Clamp to today only when today actually falls inside the range. A range
  // that lies entirely in the past or the future keeps its own end, otherwise
  // a future-dated window would be dragged back to the present.
  const end = start < today && today < rawEnd ? today : rawEnd;

  const points: CurvePoint[] = [];
  if (start < first) points.push({ date: start, cumulative: 0 });
  points.push(...data);
  if (end > last) {
    points.push({ date: end, cumulative: data[data.length - 1].cumulative });
  }

  return { points, domain: [points[0].date, points[points.length - 1].date] };
};

/** Highest and lowest point of the curve, for the peak / trough labels. */
export const curveExtremes = (points: CurvePoint[]) => {
  if (points.length === 0) return null;
  let peak = points[0];
  let trough = points[0];
  for (const p of points) {
    if (p.cumulative > peak.cumulative) peak = p;
    if (p.cumulative < trough.cumulative) trough = p;
  }
  // A flat curve has no meaningful extremes to point at.
  return peak.cumulative === trough.cumulative ? null : { peak, trough };
};
