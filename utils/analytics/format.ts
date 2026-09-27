/** Win rate is never signed — formatPercent's leading "+" would be wrong here. */
const rate = new Intl.NumberFormat("pl-PL", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const whole = new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0 });

/** Shown wherever a metric is genuinely undefined, never as a stand-in for zero. */
export const DASH = "—";

export const formatWinRate = (n: number | null) =>
  n === null ? DASH : `${rate.format(n)}%`;

export const formatShare = (part: number, total: number) =>
  total === 0 ? "0%" : `${whole.format((part / total) * 100)}%`;

// Polish has three plural forms and the rule is not "n === 1". Intl knows it.
const plurals = new Intl.PluralRules("pl-PL");

export const plural = (
  n: number,
  forms: { one: string; few: string; many: string }
) => {
  const form = plurals.select(n);
  return forms[form as keyof typeof forms] ?? forms.many;
};
