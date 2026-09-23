"use client";

import { useEffect, useState } from "react";

import { useApi } from "@/hooks/useApi";

/**
 * The instruments this user has already traded, most-used first. Fetched once per
 * mount: the list only changes after a save, and both consumers remount by then.
 */
export const useInstruments = () => {
  const api = useApi();
  const [instruments, setInstruments] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await api.get<string[]>("/trades/instruments");
        if (!cancelled) setInstruments(res.data);
      } catch {
        if (!cancelled) setInstruments([]);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return instruments;
};
