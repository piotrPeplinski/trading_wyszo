"use client";

import { FormField } from "@/components/reusable/FormField";
import { Input } from "@/components/ui/input";
import { NUMERIC_TRADE_FIELDS } from "@/utils/trades/constants";
import type { TradeFormErrors, TradeFormValues } from "@/utils/trades/types";

type TradeResultFieldsProps = {
  values: TradeFormValues;
  errors: TradeFormErrors;
  disabled?: boolean;
  onChange: (field: keyof TradeFormValues, value: string) => void;
};

export const TradeResultFields = ({
  values,
  errors,
  disabled,
  onChange,
}: TradeResultFieldsProps) => (
  // % and $ pair up on a phone; RR takes the next row on its own rather than
  // sitting in half a row with nothing beside it.
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
    {NUMERIC_TRADE_FIELDS.map(([field, label]) => (
      <FormField
        key={field}
        label={label}
        htmlFor={`field-${field}`}
        error={errors[field]}
        className={field === "result_rr" ? "col-span-2 sm:col-span-1" : undefined}
        required
      >
        <Input
          id={`field-${field}`}
          name={field}
          type="number"
          step="0.01"
          disabled={disabled}
          aria-invalid={errors[field] ? true : undefined}
          value={values[field]}
          onChange={(e) => onChange(field, e.target.value)}
        />
      </FormField>
    ))}
  </div>
);
