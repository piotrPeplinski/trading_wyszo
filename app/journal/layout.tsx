"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AuthProvider, useAuth } from "@/components/journal/AuthProvider";
import { JournalNav } from "@/components/journal/JournalNav";

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
  return (
    <>
      <JournalNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </>
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
