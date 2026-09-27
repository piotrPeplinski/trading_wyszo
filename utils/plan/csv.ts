/**
 * The chip fields live in one Text column, so the list has to survive a
 * round-trip through a comma-joined string without collecting blanks or
 * duplicates.
 */

export const parseCsv = (value: string | null): string[] => {
  if (!value) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of value.split(",")) {
    const item = raw.trim();
    // Case-insensitive: EURUSD and eurusd are the same instrument to a trader.
    const key = item.toLowerCase();
    if (!item || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
};

/** null rather than "" for an empty list, matching how the backend stores absence. */
export const toCsv = (items: string[]): string | null =>
  items.length > 0 ? items.join(",") : null;
