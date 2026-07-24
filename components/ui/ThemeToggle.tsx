"use client";

import { useLayoutEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const [isLight, setIsLight] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("theme") === "light";
  });

  // Next.js resets <html> attributes not present in the SSR'd JSX during
  // hydration, discarding what the pre-hydration inline script set. Reapply
  // it here so it survives past the hydration commit.
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", isLight ? "light" : "dark");
  }, [isLight]);

  const toggle = () => {
    const next = !isLight;
    setIsLight(next);
    const theme = next ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? "Włącz tryb ciemny" : "Włącz tryb jasny"}
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-colors hover:text-ink",
        className
      )}
    >
      {isLight ? <Moon size={17} /> : <Sun size={17} />}
    </button>
  );
}
