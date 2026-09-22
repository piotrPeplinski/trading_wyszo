import type { Metadata } from "next";
import Link from "next/link";
import { Lock } from "lucide-react";

import { AuthHeader } from "@/components/journal/AuthHeader";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { SectionAurora } from "@/components/ui/SectionAurora";

export const metadata: Metadata = {
  title: "Brak dostępu — Dziennik Tradera | JWFOREX",
  description:
    "Dziennik Tradera jest częścią członkostwa w grupie JWFOREX. Zobacz, jak uzyskać dostęp.",
  robots: { index: false },
};

const STEPS = [
  "Wykup dostęp do grupy JWFOREX na stronie z cennikiem.",
  "Dołącz do serwera Discord, korzystając z zaproszenia, które otrzymasz po zakupie.",
  "Zaloguj się ponownie tym samym kontem Discord — dziennik odblokuje się automatycznie.",
];

export default function NoAccessPage() {
  return (
    // Aurora wraps header + main, not just <main>: clipping it at main's top edge
    // draws a visible seam across the page.
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <SectionAurora variant="left" />
      <AuthHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8">
          <Badge>
            <Lock size={13} />
            Brak dostępu
          </Badge>

          <h1 className="mt-6 font-display text-3xl font-bold leading-tight text-ink">
            Dołącz do grupy, aby uzyskać dostęp.
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-muted">
            Rozpoznaliśmy Twoje konto Discord, ale nie należy ono do serwera
            JWFOREX. Dziennik Tradera jest częścią członkostwa w grupie.
          </p>

          <ol className="mt-6 flex flex-col gap-4 rounded-xl border border-border bg-surface-2 p-5">
            {STEPS.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-soft text-xs font-semibold text-green-ink">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed text-muted">{step}</span>
              </li>
            ))}
          </ol>

          <Link href="/#cennik" className={buttonClasses("primary", "lg", "mt-8 w-full")}>
            Zobacz cennik
          </Link>

          <Link
            href="/login"
            className={buttonClasses("secondary", "md", "mt-3 w-full")}
          >
            Spróbuj zalogować się ponownie
          </Link>
        </div>
      </main>
    </div>
  );
}
