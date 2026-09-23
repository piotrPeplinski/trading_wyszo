"use client";

import { useEffect, useState } from "react";

import { useApi } from "@/hooks/useApi";
import { useTradeDialog } from "@/hooks/useTradeDialog";
import { toIso } from "@/utils/calendar";
import type { Trade, TradePage } from "@/utils/trades/types";

/** Fetches only the visible grid range, then groups by the trade's own `date` string. */
export const useCalendarTrades = (from: Date, to: Date) => {
  const api = useApi();
  const { savedAt } = useTradeDialog();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  const dateFrom = toIso(from);
  const dateTo = toIso(to);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get<TradePage>(
          `/trades?date_from=${dateFrom}&date_to=${dateTo}&limit=500`
        );
        if (!cancelled) setTrades(res.data.items);
      } catch {
        if (!cancelled) setTrades([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFrom, dateTo, savedAt]);

  const byDate = new Map<string, Trade[]>();
  for (const trade of trades) {
    const bucket = byDate.get(trade.date);
    if (bucket) bucket.push(trade);
    else byDate.set(trade.date, [trade]);
  }

  return { trades, byDate, loading };
};
