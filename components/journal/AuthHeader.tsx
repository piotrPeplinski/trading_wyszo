import Image from "next/image";
import Link from "next/link";

import { site } from "@/content/site-content";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/**
 * Minimal header for /login and /no-access: logo home, theme toggle. No nav, no CTA.
 *
 * The pill keeps Navbar's hardcoded always-dark colors on purpose — the bar reads the
 * same on the landing and here, in both themes. Hence the literals instead of tokens.
 */
export function AuthHeader() {
  return (
    <header className="px-4 py-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-2xl border border-transparent bg-[#0f121b]/80 px-4 py-3 backdrop-blur-md sm:px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/jw-logo-mark.png"
            alt={site.brand}
            width={190}
            height={260}
            priority
            className="h-9 w-auto"
          />
        </Link>
        <ThemeToggle className="border-[#232a3b] text-[#92a0b8] hover:text-[#f4f6fb]" />
      </div>
    </header>
  );
}
