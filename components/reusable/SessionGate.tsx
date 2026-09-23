"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";

type SessionGateProps = {
  children: React.ReactNode;
};

export const SessionGate = ({ children }: SessionGateProps) => {
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

  return <>{children}</>;
};
