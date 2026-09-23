"use client";

import { InstrumentChip } from "@/components/reusable/InstrumentChip";
import { Input } from "@/components/ui/input";
import { useInstruments } from "@/hooks/useInstruments";

type InstrumentInputProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  id?: string;
  disabled?: boolean;
};

/**
 * Free-text instrument with the user's own history as one-tap chips. Chips beat a
 * <datalist> here: they're visible without focusing the field and they work on touch.
 */
export const InstrumentInput = ({
  value,
  onChange,
  error,
  id,
  disabled,
}: InstrumentInputProps) => {
  const instruments = useInstruments();

  return (
    <div className="flex flex-col gap-2">
      {/* A brand-new user has no history — render nothing rather than an empty row. */}
      {instruments.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {instruments.map((name) => (
            <InstrumentChip
              key={name}
              name={name}
              active={name === value}
              disabled={disabled}
              onClick={() => onChange(name)}
            />
          ))}
        </div>
      )}

      <Input
        id={id}
        value={value}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        onChange={(e) => onChange(e.target.value)}
        placeholder="EURUSD, BTCUSD…"
      />
    </div>
  );
};
