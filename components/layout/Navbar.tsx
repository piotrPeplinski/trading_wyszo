"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { site } from "@/content/site-content";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn, scrollToId } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-2" : "py-4"
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between rounded-2xl border px-4 transition-all duration-300 sm:px-6",
          scrolled
            ? "border-[#232a3b] bg-[#0f121b]/80 py-2 shadow-lg shadow-black/20 backdrop-blur-md"
            : "border-transparent bg-[#0f121b]/80 py-3 backdrop-blur-md"
        )}
      >
        <a href="#top" className="flex items-center">
          <Image
            src="/jw-logo-mark.png"
            alt={site.brand}
            width={190}
            height={260}
            priority
            className="h-10 w-auto"
          />
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[#92a0b8] transition-colors hover:text-[#f4f6fb]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle className="border-[#232a3b] text-[#92a0b8] hover:text-[#f4f6fb]" />
          <Button size="md" onClick={() => scrollToId("cennik")}>
            Dołącz teraz
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle className="border-[#232a3b] text-[#92a0b8] hover:text-[#f4f6fb]" />
          <button
            className="rounded-lg p-2 text-[#f4f6fb]"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mx-4 mt-2 overflow-hidden rounded-2xl border border-[#232a3b] bg-[#0f121b]/95 backdrop-blur-md md:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {site.nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#92a0b8] transition-colors hover:bg-[#191e2b] hover:text-[#f4f6fb]"
                >
                  {item.label}
                </a>
              ))}
              <Button
                className="mt-2 w-full"
                onClick={() => {
                  setMobileOpen(false);
                  scrollToId("cennik");
                }}
              >
                Dołącz teraz
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
