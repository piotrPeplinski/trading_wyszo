import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { OPERATION_LABELS } from "@/utils/trades/constants";
import type { Operation } from "@/utils/trades/types";

type OperationCellProps = {
  operation: Operation;
};

export const OperationCell = ({ operation }: OperationCellProps) => {
  const long = operation === "long";
  const Icon = long ? ArrowUpRight : ArrowDownRight;

  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap">
      <Icon size={15} className={long ? "text-green-ink" : "text-red"} />
      {OPERATION_LABELS[operation]}
    </span>
  );
};
