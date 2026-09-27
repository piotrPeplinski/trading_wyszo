/** Mirrors backend/app/trades/schemas.py — EquityPoint. */
export type EquityPoint = {
  /** "YYYY-MM-DD" — a DATE column, no time component. */
  date: string;
  /** Running sum of result_percentage up to and including this day. */
  cumulative: number;
};

/** Mirrors backend/app/trades/schemas.py — TradeStats. */
export type TradeStats = {
  count: number;
  wins: number;
  losses: number;
  breakeven: number;
  /** null when wins + losses === 0. A run of pure breakevens is not "0% accuracy". */
  win_rate: number | null;
  /** null when count === 0. */
  avg_rr: number | null;
  total_pnl_percentage: number;
  total_pnl_amount: number;
  equity_curve: EquityPoint[];
};

export type RangeKey = "week" | "month" | "year" | "all" | "custom";

export type AnalyticsRange = {
  key: RangeKey;
  /**
   * "YYYY-MM-DD", or null for an unbounded side. Only "all" uses null: the API
   * treats a missing date_from/date_to as "no WHERE clause", which is exactly
   * all-time. Never send an empty string — FastAPI answers 422, not None.
   */
  from: string | null;
  to: string | null;
};
