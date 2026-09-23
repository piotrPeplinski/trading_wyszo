"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";

import { site } from "@/content/site-content";
import { useAuth } from "@/components/journal/AuthProvider";
import { useTradeDialog } from "@/components/journal/TradeDialog";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Pulpit", href: "/journal", exact: true },
  { label: "Pozycje", href: "/journal/trades", exact: false },
  { label: "Kalendarz", href: "/journal/calendar", exact: false },
  { label: "Analityka", href: "/journal/analytics", exact: false },
  { label: "Plan", href: "/journal/plan", exact: false },
];

export function JournalNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { openCreate } = useTradeDialog();

  // Exact match for /journal, prefix match for the rest — otherwise Pulpit,
  // being a prefix of every other route, would stay lit everywhere.
  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

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
          {LINKS.map((link) => {
            const active = isActive(link.href, link.exact);
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
          <Button size="md" onClick={() => openCreate()} aria-label="Dodaj pozycję">
            <Plus size={17} />
            <span className="hidden md:inline">Dodaj pozycję</span>
          </Button>

          <ThemeToggle className="border-[#232a3b] text-[#92a0b8] hover:text-[#f4f6fb]" />

          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Menu użytkownika"
              className="shrink-0 rounded-full outline-hidden focus-visible:ring-2 focus-visible:ring-green/40"
            >
              {user?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element -- Discord CDN, not worth a remotePatterns entry
                <img
                  src={user.avatar_url}
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full"
                />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#191e2b] text-sm font-semibold text-[#f4f6fb]">
                  {user?.username?.[0]?.toUpperCase()}
                </span>
              )}
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled>{user?.username}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Wyloguj</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      </header>
    </>
  );
}
