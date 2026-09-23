import type { Operation, Result, TradeColumn, TradeFormValues } from "@/utils/trades/types";

export const PAGE_SIZE = 50;

/** Sentinel for "no filter" — Radix Select rejects an empty string as a value. */
export const ANY_OPTION = "__any__";

export const OPERATION_LABELS: Record<Operation, string> = {
  long: "Long",
  short: "Short",
};

export const RESULT_LABELS: Record<Result, string> = {
  tp: "TP",
  sl: "SL",
  be: "BE",
};

export const RESULT_TONES: Record<Result, string> = {
  tp: "bg-green-soft text-green-ink",
  sl: "bg-red/12 text-red",
  be: "bg-surface-2 text-muted",
};

export const TRADE_COLUMNS: TradeColumn[] = [
  { key: "date", label: "Data" },
  { key: null, label: "Instrument" },
  { key: null, label: "Interwał", center: true },
  { key: null, label: "Operacja", center: true },
  { key: null, label: "Rezultat", center: true },
  {
    key: "result_percentage",
    label: "%",
    hint: "Wynik procentowy pozycji",
    center: true,
  },
  { key: null, label: "$", hint: "Wynik kwotowy w dolarach", center: true },
  {
    key: "result_rr",
    label: "RR",
    hint: "Stosunek zysku do ryzyka (risk–reward)",
    center: true,
  },
];

/** Drives which field gets focus when validation fails — visual top-to-bottom order. */
export const TRADE_FIELD_ORDER: (keyof TradeFormValues)[] = [
  "date",
  "instrument",
  "interval",
  "operation",
  "result",
  "result_percentage",
  "result_amount",
  "result_rr",
  "link",
  "description",
  "error_desc",
];

export const NUMERIC_TRADE_FIELDS = [
  ["result_percentage", "Wynik %"],
  ["result_amount", "Wynik $"],
  ["result_rr", "RR"],
] as const;

export const ACTION_BUTTON =
  "rounded-full p-1.5 text-muted transition-colors hover:bg-surface-2 hover:text-ink";
