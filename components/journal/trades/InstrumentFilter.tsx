"use client";

import { InstrumentChip } from "@/components/reusable/InstrumentChip";
import { useInstruments } from "@/hooks/useInstruments";

type InstrumentFilterProps = {
  selected: string[]; //Currently selected instruments. Empty means "all".
  onChange: (next: string[]) => void;
};

/**
 * Multi-select chips. Chips-only, no free-text box: the list is built from this
 * user's own trades, so every value worth filtering by is already a chip, and a
 * text field would only invite typos that match nothing.
 */
export const InstrumentFilter = ({
  selected,
  onChange,
}: InstrumentFilterProps) => {
  const instruments = useInstruments();

  if (instruments.length === 0) return null;

  const toggle = (name: string) =>
    onChange(
      selected.includes(name)
        ? selected.filter((i) => i !== name)
        : [...selected, name],
    );

  return (
    <div className="flex flex-wrap gap-1.5">
      {instruments.map((name) => (
        <InstrumentChip
          key={name}
          name={name}
          active={selected.includes(name)}
          pressed={selected.includes(name)}
          onClick={() => toggle(name)}
        />
      ))}
    </div>
  );
};
