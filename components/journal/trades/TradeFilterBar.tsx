"use client";

import { InstrumentFilter } from "@/components/journal/trades/InstrumentFilter";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ANY_OPTION,
  OPERATION_LABELS,
  RESULT_LABELS,
} from "@/utils/trades/constants";
import type { TradeFilters } from "@/utils/trades/types";

type TradeFilterBarProps = {
  filters: TradeFilters;
  hasFilters: boolean;
  onChange: (next: Partial<TradeFilters>) => void;
  onClear: () => void;
};

export const TradeFilterBar = ({
  filters,
  hasFilters,
  onChange,
  onClear,
}: TradeFilterBarProps) => (
  <div className="rounded-2xl border border-border bg-surface p-4">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="f-from" className="text-xs text-muted">
          Od
        </label>
        <Input
          id="f-from"
          type="date"
          value={filters.date_from}
          onChange={(e) => onChange({ date_from: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="f-to" className="text-xs text-muted">
          Do
        </label>
        <Input
          id="f-to"
          type="date"
          value={filters.date_to}
          onChange={(e) => onChange({ date_to: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-muted">Rezultat</label>
        <Select
          value={filters.result || ANY_OPTION}
          onValueChange={(v) => onChange({ result: v === ANY_OPTION ? "" : v })}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY_OPTION}>Wszystkie</SelectItem>
            {Object.entries(RESULT_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-muted">Operacja</label>
        <Select
          value={filters.operation || ANY_OPTION}
          onValueChange={(v) => onChange({ operation: v === ANY_OPTION ? "" : v })}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY_OPTION}>Wszystkie</SelectItem>
            {Object.entries(OPERATION_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>

    <div className="mt-4 flex flex-col gap-1.5">
      <span className="text-xs text-muted">Instrument</span>
      <InstrumentFilter
        selected={filters.instrument}
        onChange={(next) => onChange({ instrument: next })}
      />
    </div>

    {hasFilters && (
      <button
        type="button"
        onClick={onClear}
        className="mt-4 text-xs text-muted underline underline-offset-4 transition-colors hover:text-ink"
      >
        Wyczyść filtry
      </button>
    )}
  </div>
);
