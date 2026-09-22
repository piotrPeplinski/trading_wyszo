"use client";

import { NotebookPen } from "lucide-react";

import { useAuth } from "@/components/journal/AuthProvider";
import { StatCard } from "@/components/journal/StatCard";
import { Button } from "@/components/ui/Button";

// Wired up in Etap 9 — the shell ships with the shape, not the numbers.
const STATS = [
  { label: "Win rate", value: "—" },
  { label: "Pozycje", value: "—" },
  { label: "Średnie RR", value: "—" },
  { label: "Total PnL", value: "—" },
] as const;

export default function JournalDashboard() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display text-2xl font-bold text-ink">
        Cześć, {user?.username}
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-display text-lg font-semibold text-ink">
          Ostatnie pozycje
        </h2>

        <div className="flex flex-col items-center gap-4 px-4 py-12 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-2 text-muted">
            <NotebookPen size={24} />
          </span>

          <div className="flex flex-col gap-1">
            <p className="font-medium text-ink">
              Nie masz jeszcze żadnych pozycji.
            </p>
            <p className="max-w-sm text-sm text-muted">
              Zapisz pierwszy trade, a pojawią się tu statystyki, kalendarz i
              equity curve.
            </p>
          </div>

          <Button size="md" onClick={() => {}}>
            Dodaj pierwszą pozycję
          </Button>
        </div>
      </section>
    </div>
  );
}
