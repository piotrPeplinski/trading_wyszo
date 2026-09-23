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
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
    {NUMERIC_TRADE_FIELDS.map(([field, label]) => (
      <FormField
        key={field}
        label={label}
        htmlFor={`field-${field}`}
        error={errors[field]}
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
