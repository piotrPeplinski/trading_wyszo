"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** `idle` turns true after `ms` without a `poke()`, or right away on `hide()`. */
export const useIdle = (ms: number) => {
  const [idle, setIdle] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const poke = useCallback(() => {
    setIdle(false);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setIdle(true), ms);
  }, [ms]);

  const hide = useCallback(() => {
    clearTimeout(timer.current);
    setIdle(true);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return { idle, poke, hide };
};
