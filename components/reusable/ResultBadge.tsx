import { RESULT_LABELS, RESULT_TONES } from "@/utils/trades/constants";
import type { Result } from "@/utils/trades/types";

type ResultBadgeProps = {
  result: Result;
};

export const ResultBadge = ({ result }: ResultBadgeProps) => (
  <span
    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${RESULT_TONES[result]}`}
  >
    {RESULT_LABELS[result]}
  </span>
);
