"use client";

import { NotebookPen } from "lucide-react";

import { EmptyState } from "@/components/reusable/EmptyState";
import { StatCard } from "@/components/reusable/StatCard";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useTradeDialog } from "@/hooks/useTradeDialog";

// Wired up in Etap 9 — the shell ships with the shape, not the numbers.
const STATS = [
  { label: "Win rate", value: "—" },
  { label: "Pozycje", value: "—" },
  { label: "Średnie RR", value: "—" },
  { label: "Total PnL", value: "—" },
];

const JournalDashboard = () => {
  const { user } = useAuth();
  const { openCreate } = useTradeDialog();

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
        <EmptyState
          icon={<NotebookPen size={24} />}
          title="Nie masz jeszcze żadnych pozycji."
          description="Zapisz pierwszy trade, a pojawią się tu statystyki, kalendarz i equity curve."
          action={<Button onClick={() => openCreate()}>Dodaj pierwszą pozycję</Button>}
        />
      </section>
    </div>
  );
};

export default JournalDashboard;
