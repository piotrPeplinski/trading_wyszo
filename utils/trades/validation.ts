import axios from "axios";

import { NUMERIC_TRADE_FIELDS } from "@/utils/trades/constants";
import type {
  Trade,
  TradeFormErrors,
  TradeFormValues,
} from "@/utils/trades/types";

export const today = () => new Date().toISOString().slice(0, 10);

export const toFormValues = (
  trade?: Trade,
  defaultDate?: string
): TradeFormValues => ({
  date: trade?.date ?? defaultDate ?? today(),
  instrument: trade?.instrument ?? "",
  interval: trade?.interval ?? "",
  operation: trade?.operation ?? "",
  result: trade?.result ?? "",
  result_percentage: trade ? String(trade.result_percentage) : "",
  result_amount: trade ? String(trade.result_amount) : "",
  result_rr: trade ? String(trade.result_rr) : "",
  link: trade?.link ?? "",
  description: trade?.description ?? "",
  error_desc: trade?.error_desc ?? "",
});

/** Pure — no state, no requests. Submit is blocked while this returns anything. */
export const validateTrade = (v: TradeFormValues): TradeFormErrors => {
  const errors: TradeFormErrors = {};

  if (!v.date.trim()) {
    errors.date = "Data jest wymagana.";
  } else if (Number.isNaN(Date.parse(v.date))) {
    errors.date = "Nieprawidłowy format daty.";
  } else if (v.date > today()) {
    errors.date = "Data nie może być z przyszłości.";
  }

  const instrument = v.instrument.trim();
  if (!instrument) errors.instrument = "Instrument jest wymagany.";
  else if (instrument.length > 128)
    errors.instrument = "Instrument może mieć maksymalnie 128 znaków.";

  const interval = v.interval.trim();
  if (!interval) errors.interval = "Interwał jest wymagany.";
  else if (interval.length > 32)
    errors.interval = "Interwał może mieć maksymalnie 32 znaki.";

  if (!v.operation) errors.operation = "Wybierz operację.";
  if (!v.result) errors.result = "Wybierz rezultat.";

  for (const [field, label] of NUMERIC_TRADE_FIELDS) {
    const raw = v[field].trim();
    if (!raw) errors[field] = `${label} jest wymagany.`;
    else if (Number.isNaN(Number(raw))) errors[field] = `${label} musi być liczbą.`;
  }

  if (!errors.result_rr && Number(v.result_rr) < 0)
    errors.result_rr = "RR nie może być ujemne.";

  const link = v.link.trim();
  if (link && !/^https?:\/\//i.test(link))
    errors.link = "Link musi zaczynać się od http:// lub https://.";

  return errors;
};

/** FastAPI 422 bodies are [{loc:["body","field"], msg}] — never show that raw. */
export const errorsFromResponse = (error: unknown): TradeFormErrors => {
  if (!axios.isAxiosError(error)) return {};
  const detail = error.response?.data?.detail;
  if (!Array.isArray(detail)) return {};

  const mapped: TradeFormErrors = {};
  for (const item of detail) {
    const field = Array.isArray(item?.loc)
      ? (item.loc[item.loc.length - 1] as keyof TradeFormValues)
      : undefined;
    if (field && typeof item?.msg === "string" && !mapped[field]) {
      mapped[field] = item.msg;
    }
  }
  return mapped;
};

export const toTradePayload = (v: TradeFormValues) => ({
  date: v.date,
  instrument: v.instrument.trim(),
  interval: v.interval.trim(),
  operation: v.operation,
  result: v.result,
  result_percentage: Number(v.result_percentage),
  result_amount: Number(v.result_amount),
  result_rr: Number(v.result_rr),
  link: v.link.trim() || null,
  description: v.description.trim() || null,
  error_desc: v.error_desc.trim() || null,
});
