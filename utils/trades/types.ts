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

export type SortKey = "date" | "result_percentage" | "result_rr" | "id";
export type SortOrder = "asc" | "desc";

export type TradeColumn = {
  key: SortKey | null;
  label: string;
  hint?: string;
  center?: boolean;
};

/** Every field is a string: these mirror the raw form controls, not the API. */
export type TradeFormValues = {
  date: string;
  instrument: string;
  interval: string;
  operation: Operation | "";
  result: Result | "";
  result_percentage: string;
  result_amount: string;
  result_rr: string;
  link: string;
  description: string;
  error_desc: string;
};

export type TradeFormErrors = Partial<Record<keyof TradeFormValues, string>>;

export type TradeFilters = {
  date_from: string;
  date_to: string;
  instrument: string[];
  result: string;
  operation: string;
  sort: SortKey;
  order: SortOrder;
};
