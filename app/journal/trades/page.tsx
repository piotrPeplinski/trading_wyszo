"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NotebookPen, SearchX } from "lucide-react";

import { useApi } from "@/hooks/useApi";
import { InstrumentFilter } from "@/components/journal/InstrumentFilter";
import { useTradeDialog } from "@/components/journal/TradeDialog";
import {
  TradesTable,
  type SortKey,
  type SortOrder,
} from "@/components/journal/TradesTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OPERATION_LABELS, RESULT_LABELS, type Trade, type TradePage } from "@/utils/trades";

const PAGE_SIZE = 50;
const ANY = "__any__";

type Filters = {
  date_from: string;
  date_to: string;
  instrument: string[];
  result: string;
  operation: string;
  sort: SortKey;
  order: SortOrder;
};

function readFilters(params: URLSearchParams): Filters {
  return {
    date_from: params.get("date_from") ?? "",
    date_to: params.get("date_to") ?? "",
    instrument: params.getAll("instrument"),
    result: params.get("result") ?? "",
    operation: params.get("operation") ?? "",
    sort: (params.get("sort") as SortKey) ?? "date",
    order: (params.get("order") as SortOrder) ?? "desc",
  };
}

function TradesPageInner() {
  const api = useApi();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openCreate, savedAt } = useTradeDialog();

  // Filters live in the URL so the view is linkable and survives a refresh.
  const filters = readFilters(new URLSearchParams(searchParams.toString()));
  const queryKey = searchParams.toString();

  const [items, setItems] = useState<Trade[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  const setParams = (next: Partial<Filters>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      params.delete(key);
      // Arrays become repeated params (?instrument=A&instrument=B), which is what
      // FastAPI reads back into list[str].
      if (Array.isArray(value)) value.forEach((v) => params.append(key, v));
      else if (value) params.set(key, value);
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const buildQuery = useCallback(
    (offset: number) => {
      const f = readFilters(new URLSearchParams(queryKey));
      const params = new URLSearchParams({
        limit: String(PAGE_SIZE),
        offset: String(offset),
        sort: f.sort,
        order: f.order,
      });
      if (f.date_from) params.set("date_from", f.date_from);
      if (f.date_to) params.set("date_to", f.date_to);
      f.instrument.forEach((i) => params.append("instrument", i));
      if (f.result) params.set("result", f.result);
      if (f.operation) params.set("operation", f.operation);
      return params.toString();
    },
    [queryKey]
  );

  // Any filter/sort change (or a save/delete) resets the list to page one.
  useEffect(() => {
    let cancelled = false;

    const fetchFirstPage = async () => {
      setLoading(true);
      setLoaded(false);
      try {
        const res = await api.get<TradePage>(`/trades?${buildQuery(0)}`);
        if (cancelled) return;
        setItems(res.data.items);
        setTotal(res.data.total);
      } catch {
        if (cancelled) return;
        setItems([]);
        setTotal(0);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setLoaded(true);
        }
      }
    };

    fetchFirstPage();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildQuery, savedAt]);

  const loadMore = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<TradePage>(`/trades?${buildQuery(items.length)}`);
      setItems((prev) => [...prev, ...res.data.items]);
      setTotal(res.data.total);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildQuery, items.length]);

  useEffect(() => {
    const node = sentinel.current;
    if (!node || loading || items.length === 0 || items.length >= total) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) loadMore();
    });
    observer.observe(node);
    // Disconnect on cleanup, or a filter change leaves two observers alive and
    // fires two parallel requests for the same page.
    return () => observer.disconnect();
  }, [loadMore, loading, items.length, total]);

  const hasFilters = Boolean(
    filters.date_from ||
      filters.date_to ||
      filters.instrument.length > 0 ||
      filters.result ||
      filters.operation
  );

  const clearFilters = () => router.replace("?", { scroll: false });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline gap-3">
        <h1 className="font-display text-2xl font-bold text-ink">Pozycje</h1>
        {loaded && (
          <span className="text-sm text-muted">
            {total === 1 ? "1 pozycja" : `${total} pozycji`}
          </span>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="f-from" className="text-xs text-muted">
              Od
            </label>
            <Input
              id="f-from"
              type="date"
              value={filters.date_from}
              onChange={(e) => setParams({ date_from: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="f-to" className="text-xs text-muted">
              Do
            </label>
            <Input
              id="f-to"
              type="date"
              value={filters.date_to}
              onChange={(e) => setParams({ date_to: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted">Rezultat</label>
            <Select
              value={filters.result || ANY}
              onValueChange={(v) => setParams({ result: v === ANY ? "" : v })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Wszystkie</SelectItem>
                {Object.entries(RESULT_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted">Operacja</label>
            <Select
              value={filters.operation || ANY}
              onValueChange={(v) => setParams({ operation: v === ANY ? "" : v })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Wszystkie</SelectItem>
                {Object.entries(OPERATION_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-1.5">
          <span className="text-xs text-muted">Instrument</span>
          <InstrumentFilter
            selected={filters.instrument}
            onChange={(next) => setParams({ instrument: next })}
          />
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 text-xs text-muted underline underline-offset-4 transition-colors hover:text-ink"
          >
            Wyczyść filtry
          </button>
        )}
      </div>

      {loaded && total === 0 ? (
        // Two genuinely different situations, two different exits.
        hasFilters ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface px-4 py-12 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-2 text-muted">
              <SearchX size={24} />
            </span>
            <p className="font-medium text-ink">
              Żadna pozycja nie pasuje do filtrów.
            </p>
            <Button variant="secondary" onClick={clearFilters}>
              Wyczyść filtry
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface px-4 py-12 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-2 text-muted">
              <NotebookPen size={24} />
            </span>
            <p className="font-medium text-ink">
              Nie masz jeszcze żadnych pozycji.
            </p>
            <Button onClick={() => openCreate()}>Dodaj pierwszą pozycję</Button>
          </div>
        )
      ) : (
        <>
          <TradesTable
            items={items}
            sort={filters.sort}
            order={filters.order}
            onSortChange={(sort, order) => setParams({ sort, order })}
          />

          <div ref={sentinel} className="flex justify-center py-4">
            {loading && (
              <span
                aria-label="Ładowanie"
                className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-green"
              />
            )}
            {!loading && total > 0 && items.length === total && (
              <p className="text-xs text-muted-2">To wszystkie pozycje.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function TradesPage() {
  // useSearchParams needs a Suspense boundary in the App Router.
  return (
    <Suspense fallback={null}>
      <TradesPageInner />
    </Suspense>
  );
}
