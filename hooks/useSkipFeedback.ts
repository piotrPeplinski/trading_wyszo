"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { SKIP_FEEDBACK_MS } from "@/utils/video/constants";
import type { SkipFeedback } from "@/utils/video/types";

/** The "−10 s" / "+10 s" flash. Rapid skips stack up, like YouTube's counter. */
export const useSkipFeedback = () => {
  const [feedback, setFeedback] = useState<SkipFeedback | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = useCallback((seconds: number) => {
    const side = seconds < 0 ? "back" : "forward";
    setFeedback((prev) => ({
      side,
      seconds: prev?.side === side ? prev.seconds + Math.abs(seconds) : Math.abs(seconds),
      key: (prev?.key ?? 0) + 1,
    }));
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setFeedback(null), SKIP_FEEDBACK_MS);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return { feedback, show };
};
