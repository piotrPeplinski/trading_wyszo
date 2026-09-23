export const JOURNAL_LINKS = [
  { label: "Pulpit", href: "/journal", exact: true },
  { label: "Pozycje", href: "/journal/trades", exact: false },
  { label: "Kalendarz", href: "/journal/calendar", exact: false },
  { label: "Analityka", href: "/journal/analytics", exact: false },
  { label: "Plan", href: "/journal/plan", exact: false },
];

/**
 * Exact match for /journal, prefix match for the rest — otherwise Pulpit, being a
 * prefix of every other route, would stay lit everywhere.
 */
export const isLinkActive = (pathname: string, href: string, exact: boolean) =>
  exact ? pathname === href : pathname.startsWith(href);

export const shortHost = (link: string) => {
  try {
    return new URL(link).host.replace(/^www\./, "");
  } catch {
    return link;
  }
};
