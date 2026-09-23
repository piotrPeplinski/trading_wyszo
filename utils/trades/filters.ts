import type { SortKey, SortOrder, TradeFilters } from "@/utils/trades/types";

export const readFilters = (params: URLSearchParams): TradeFilters => ({
  date_from: params.get("date_from") ?? "",
  date_to: params.get("date_to") ?? "",
  instrument: params.getAll("instrument"),
  result: params.get("result") ?? "",
  operation: params.get("operation") ?? "",
  sort: (params.get("sort") as SortKey) ?? "date",
  order: (params.get("order") as SortOrder) ?? "desc",
});

export const hasActiveFilters = (f: TradeFilters) =>
  Boolean(
    f.date_from || f.date_to || f.instrument.length > 0 || f.result || f.operation
  );

/** Arrays become repeated params (?instrument=A&instrument=B) — what FastAPI reads into list[str]. */
export const writeFilters = (
  current: URLSearchParams,
  next: Partial<TradeFilters>
) => {
  const params = new URLSearchParams(current.toString());
  for (const [key, value] of Object.entries(next)) {
    params.delete(key);
    if (Array.isArray(value)) value.forEach((v) => params.append(key, v));
    else if (value) params.set(key, value);
  }
  return params.toString();
};
