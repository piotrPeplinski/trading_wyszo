"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";

import { site } from "@/content/site-content";
import { UserMenu } from "@/components/reusable/UserMenu";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTradeDialog } from "@/hooks/useTradeDialog";
import { JOURNAL_LINKS, isLinkActive } from "@/utils/journal";
import { cn } from "@/lib/utils";

/**
 * The pill keeps Navbar's hardcoded always-dark colors on purpose: tokens would
 * flip it white in light mode. The strip above it is opaque so scrolled rows
 * never show through, and carries the ambient glow so the page background does
 * not cut off at its edge.
 */
export const JournalNav = () => {
  const pathname = usePathname();
  const { openCreate } = useTradeDialog();

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-40 h-[88px] overflow-hidden bg-bg"
      >
        <span className="ambient-glow-fill" />
      </div>

      <header className="sticky top-4 z-50 px-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl border border-[#232a3b] bg-[#0f121b]/80 px-4 py-2.5 backdrop-blur-md sm:px-6">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/jw-logo-mark.png"
              alt={site.brand}
              width={190}
              height={260}
              priority
              className="h-8 w-auto"
            />
          </Link>

          <nav className="no-scrollbar flex min-w-0 flex-1 items-center gap-5 overflow-x-auto md:justify-center md:overflow-visible">
            {JOURNAL_LINKS.map((link) => {
              const active = isLinkActive(pathname, link.href, link.exact);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "shrink-0 border-b-2 pb-0.5 text-sm font-medium transition-colors",
                    active
                      ? "border-green text-[#f4f6fb]"
                      : "border-transparent text-[#92a0b8] hover:text-[#f4f6fb]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              size="md"
              onClick={() => openCreate()}
              aria-label="Dodaj pozycję"
            >
              <Plus size={17} />
              <span className="hidden md:inline">Dodaj pozycję</span>
            </Button>

            <ThemeToggle className="border-[#232a3b] text-[#92a0b8] hover:text-[#f4f6fb]" />
            <UserMenu />
          </div>
        </div>
      </header>
    </>
  );
};
