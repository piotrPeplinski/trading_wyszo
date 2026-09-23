"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useApi } from "@/hooks/useApi";
import { useTradeDialog } from "@/hooks/useTradeDialog";
import { PAGE_SIZE } from "@/utils/trades/constants";
import type { Trade, TradeFilters, TradePage } from "@/utils/trades/types";

const buildQuery = (f: TradeFilters, offset: number) => {
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
};

/** Paginated trade list with an IntersectionObserver feeding the next page. */
export const useTradesList = (filters: TradeFilters) => {
  const api = useApi();
  const { savedAt } = useTradeDialog();

  const [items, setItems] = useState<Trade[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  // Serialised so the effects below compare by value, not identity.
  const query = buildQuery(filters, 0);

  // Any filter/sort change (or a save/delete) resets the list to page one.
  useEffect(() => {
    let cancelled = false;

    const fetchFirstPage = async () => {
      setLoading(true);
      setLoaded(false);
      try {
        const res = await api.get<TradePage>(`/trades?${query}`);
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
  }, [query, savedAt]);

  const loadMore = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<TradePage>(
        `/trades?${buildQuery(filters, items.length)}`
      );
      setItems((prev) => [...prev, ...res.data.items]);
      setTotal(res.data.total);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, items.length]);

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

  return { items, total, loading, loaded, sentinel };
};
