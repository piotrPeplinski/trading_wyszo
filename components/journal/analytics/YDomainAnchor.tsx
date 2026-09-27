import type { FC } from "react";

type YDomainAnchorProps = {
  /** The series whose values the y-scale must cover. */
  dataKey: string;
  yAxisId?: string | number;
};

/**
 * Declares the y-domain without drawing anything.
 *
 * LineChart's `LINE_DOMAIN_EXCLUDED_NAMES` lists both "Area" and
 * "ProfitLossLine", so a chart built from those two alone registers no series
 * and silently falls back to a hardcoded [0, 100] — which is why a -11% trough
 * was drawn below the axis. `registersLineDomain` accepts any other child
 * carrying a `dataKey`, so this claims the domain and renders nothing.
 */
export const YDomainAnchor: FC<YDomainAnchorProps> = () => null;
