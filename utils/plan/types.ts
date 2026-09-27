/** Mirrors backend/app/plan/schemas.py — PlanRuleOut. */
export type PlanRule = {
  id: number;
  content: string;
  /** 0-based display order. There is no `done` flag: this is a list, not a checklist. */
  position: number;
};

/** Mirrors backend/app/plan/schemas.py — PlanOut. */
export type TradingPlan = {
  id: number;
  user_id: number;
  /** CSV as stored; the UI renders these two as chips. */
  instruments: string | null;
  intervals: string | null;
  session: string | null;
  /** Text, not a number: "1%", "50$" and "1R" are all valid answers. */
  risk_per_trade: string | null;
  notes: string | null;
  rules: PlanRule[];
};

/** The editable half of the plan — what PUT /plan accepts. */
export type PlanFields = Pick<
  TradingPlan,
  "instruments" | "intervals" | "session" | "risk_per_trade" | "notes"
>;
