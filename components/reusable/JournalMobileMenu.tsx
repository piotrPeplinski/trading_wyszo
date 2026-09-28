"use client";

import React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { JOURNAL_LINKS, isLinkActive } from "@/utils/journal";
import { cn } from "@/lib/utils";

type JournalMobileMenuProps = {
  open: boolean;
  pathname: string;
  onClose: () => void;
};

const ROW =
  "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-[#191e2b]";

/**
 * Mirrors the landing navbar's panel: a sibling of the pill inside the sticky
 * header, collapsing by height. No portal and no scroll lock there either.
 *
 * Colours are the navbar's hardcoded darks rather than tokens, for the same
 * reason the pill itself is — tokens would turn the panel white in light mode
 * while the bar above it stayed dark.
 */
export const JournalMobileMenu = ({
  open,
  pathname,
  onClose,
}: JournalMobileMenuProps) => {
  const { user, logout } = useAuth();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          // No mx-4: unlike the landing's fixed header, this one already has px-4.
          className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-2xl border border-[#232a3b] bg-[#0f121b]/95 backdrop-blur-md md:hidden"
        >
          <div className="flex flex-col gap-1 p-4">
            {JOURNAL_LINKS.map((link) => {
              const active = isLinkActive(pathname, link.href, link.exact);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  onClick={onClose}
                  className={cn(
                    ROW,
                    active
                      ? "bg-[#191e2b] text-[#f4f6fb]"
                      : "text-[#92a0b8] hover:text-[#f4f6fb]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Rendered inline rather than reusing UserMenu: its Radix dropdown
                portals to the body, so collapsing the panel would strand it open. */}
            <div className="mt-2 flex items-center gap-3 border-t border-[#232a3b] pt-3">
              {user?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element -- Discord CDN, not worth a remotePatterns entry
                <img
                  src={user.avatar_url}
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#191e2b] text-sm font-semibold text-[#f4f6fb]">
                  {user?.username?.[0]?.toUpperCase()}
                </span>
              )}

              <span className="min-w-0 flex-1 truncate text-sm text-[#f4f6fb]">
                {user?.username}
              </span>

              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-[#92a0b8] transition-colors hover:bg-[#191e2b] hover:text-[#f4f6fb]"
              >
                <LogOut size={15} />
                Wyloguj
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
