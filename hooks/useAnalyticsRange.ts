"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { presetRange, readRange, writeRange } from "@/utils/analytics/range";
import type { AnalyticsRange, RangeKey } from "@/utils/analytics/types";

/** The range lives in the URL, so a view can be linked and survives a reload. */
export const useAnalyticsRange = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const range = readRange(new URLSearchParams(searchParams.toString()));

  const push = (next: AnalyticsRange) =>
    router.replace(
      `?${writeRange(new URLSearchParams(searchParams.toString()), next)}`,
      { scroll: false }
    );

  return {
    range,
    // Switching to "custom" seeds it with whatever window is on screen, so the
    // date inputs open on the current range instead of empty.
    setKey: (key: RangeKey) =>
      push(key === "custom" ? { ...range, key } : presetRange(key)),
    setBound: (bound: "from" | "to", value: string) =>
      push({ ...range, key: "custom", [bound]: value }),
  };
};
