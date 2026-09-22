"use client";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/journal/AuthProvider";

export default function JournalPage() {
  const { user, logout } = useAuth();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <p>
        Zalogowany jako <strong>{user?.username}</strong>
      </p>
      <Button variant="secondary" onClick={logout}>
        Wyloguj
      </Button>
    </main>
  );
}
