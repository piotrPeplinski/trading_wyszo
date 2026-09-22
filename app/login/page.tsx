import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { AuthHeader } from "@/components/journal/AuthHeader";
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

/** Discord wordmark glyph — inline for the same reason the other brand icons are. */
function DiscordIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.037 19.7363 19.7363 0 0 0-4.8852 1.515.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057 13.1073 13.1073 0 0 1-1.8722-.8923.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.099.246.198.3728.2924a.077.077 0 0 1-.0066.1276 12.2986 12.2986 0 0 1-1.873.8914.0766.0766 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 0 0-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
    </svg>
  );
}

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
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
}
