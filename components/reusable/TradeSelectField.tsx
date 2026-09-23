"use client";

import { FormField } from "@/components/reusable/FormField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TradeSelectFieldProps = {
  id: string;
  label: string;
  value: string;
  options: Record<string, string>;
  error?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

export const TradeSelectField = ({
  id,
  label,
  value,
  options,
  error,
  disabled,
  onChange,
}: TradeSelectFieldProps) => (
  <FormField label={label} htmlFor={id} error={error} required>
    <Select value={value} disabled={disabled} onValueChange={onChange}>
      <SelectTrigger id={id} className="w-full">
        <SelectValue placeholder="Wybierz…" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(options).map(([key, text]) => (
          <SelectItem key={key} value={key}>
            {text}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </FormField>
);
