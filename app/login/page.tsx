import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { AuthHeader } from "@/components/reusable/AuthHeader";
import { DiscordIcon } from "@/components/journal/login/DiscordIcon";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { SectionAurora } from "@/components/ui/SectionAurora";

export const metadata: Metadata = {
  title: "Logowanie — Dziennik Tradera | JWFOREX",
  description:
    "Zaloguj się przez Discord, aby wejść do Dziennika Tradera JWFOREX.",
  robots: { index: false },
};

const ERRORS: Record<string, string> = {
  discord: "Discord nie odpowiedział poprawnie. Spróbuj ponownie.",
};

const LoginPage = async ({ searchParams }: PageProps<"/login">) => {
  const { error } = await searchParams;
  const message = typeof error === "string" ? ERRORS[error] : undefined;

  return (
    // Aurora wraps header + main, not just <main>: clipping it at main's top edge
    // draws a visible seam across the page.
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <SectionAurora variant="left" />
      <AuthHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8">
          <Badge>Strefa członkowska</Badge>

          <h1 className="mt-6 font-display text-3xl font-bold text-ink">
            Dziennik Tradera
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-muted">
            Zapisuj pozycje, śledź statystyki i prowadź swój plan tradingowy —
            dostęp dla członków grupy JWFOREX.
          </p>

          {message && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-2.5 rounded-xl border border-red px-4 py-3 text-sm text-red"
            >
              <AlertTriangle size={17} className="mt-px shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* Plain <a>, not <Link> and not axios: this is a top-level navigation into
              Discord's cross-origin redirect chain, which an XHR cannot follow. */}
          <a
            href="/api/auth/discord/login"
            className={buttonClasses("primary", "lg", "mt-8 w-full")}
          >
            <DiscordIcon />
            Zaloguj przez Discord
          </a>

          <p className="mt-4 text-center text-xs text-muted-2">
            Dostęp wyłącznie dla członków grupy JWFOREX.
          </p>

          <p className="mt-6 text-center text-sm">
            <Link
              href="/no-access"
              className="text-muted underline underline-offset-4 transition-colors hover:text-ink"
            >
              Nie masz jeszcze dostępu?
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
