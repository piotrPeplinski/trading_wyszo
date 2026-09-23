"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider, useAuth } from "@/components/journal/AuthProvider";
import { JournalNav } from "@/components/journal/JournalNav";
import { TradeDialogProvider } from "@/components/journal/TradeDialog";

/** Toasts follow the app theme, which only exists on the client after hydration. */
function Toasts() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const root = document.documentElement;
    const read = () =>
      setTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark");
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      newestOnTop
      closeOnClick
      pauseOnFocusLoss={false}
      theme={theme}
    />
  );
}

function SessionGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  // `loading` is what prevents a flash of protected content. No middleware.ts:
  // the presence of a cookie is not the same thing as a valid session.
  if (loading || !user) {
    return (
      <main className="flex flex-1 items-center justify-center bg-bg p-8 text-muted">
        <p>Ładowanie…</p>
      </main>
    );
  }

  // No Footer: this is the app, not a marketing page.
  // One dialog instance for the whole journal, so nav, list and calendar all
  // open the same thing.
  return (
    <TradeDialogProvider>
      <JournalNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
      <Toasts />
    </TradeDialogProvider>
  );
}

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SessionGate>{children}</SessionGate>
    </AuthProvider>
  );
}
