import { RESULT_LABELS, type Result } from "@/utils/trades";

const TONES: Record<Result, string> = {
  tp: "bg-green-soft text-green-ink",
  sl: "bg-red/12 text-red",
  be: "bg-surface-2 text-muted",
};

export function ResultBadge({ result }: { result: Result }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${TONES[result]}`}
    >
      {RESULT_LABELS[result]}
    </span>
  );
}
