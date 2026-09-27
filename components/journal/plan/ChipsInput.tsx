"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { parseCsv, toCsv } from "@/utils/plan/csv";

type ChipsInputProps = {
  /** CSV, exactly as the column stores it. */
  value: string | null;
  onChange: (value: string | null) => void;
  id?: string;
  placeholder?: string;
};

export const ChipsInput = ({
  value,
  onChange,
  id,
  placeholder,
}: ChipsInputProps) => {
  const [draft, setDraft] = useState("");
  const items = parseCsv(value);

  const commit = (next: string[]) => onChange(toCsv(next));

  const add = (raw: string) => {
    const item = raw.trim();
    if (!item) return;
    // parseCsv already drops case-insensitive duplicates, so re-parsing the
    // joined list is all the de-duping this needs.
    commit(parseCsv([...items, item].join(",")));
    setDraft("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(draft);
      return;
    }
    // Backspace on an empty field removes the last chip — the usual shorthand.
    if (e.key === "Backspace" && draft === "" && items.length > 0) {
      commit(items.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 text-xs text-ink"
            >
              {item}
              <button
                type="button"
                aria-label={`Usuń ${item}`}
                onClick={() => commit(items.filter((i) => i !== item))}
                className="text-muted transition-colors hover:text-red"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      <Input
        id={id}
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        // Typing then clicking away should keep the word, not silently drop it.
        onBlur={() => add(draft)}
      />
    </div>
  );
};
