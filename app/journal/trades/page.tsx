"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NotebookPen, SearchX } from "lucide-react";

import { EmptyState } from "@/components/reusable/EmptyState";
import { TradeFilterBar } from "@/components/journal/trades/TradeFilterBar";
import { TradesTable } from "@/components/journal/trades/TradesTable";
import { Button } from "@/components/ui/Button";
import { useTradeDialog } from "@/hooks/useTradeDialog";
import { useTradesList } from "@/hooks/useTradesList";
import { hasActiveFilters, readFilters, writeFilters } from "@/utils/trades/filters";
import type { TradeFilters } from "@/utils/trades/types";

const TradesPageInner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openCreate } = useTradeDialog();

  // Filters live in the URL so the view is linkable and survives a refresh.
  const filters = readFilters(new URLSearchParams(searchParams.toString()));
  const { items, total, loading, loaded, sentinel } = useTradesList(filters);

  const setFilters = (next: Partial<TradeFilters>) =>
    router.replace(
      `?${writeFilters(new URLSearchParams(searchParams.toString()), next)}`,
      { scroll: false }
    );

  const clear = () => router.replace("?", { scroll: false });
  const filtered = hasActiveFilters(filters);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline gap-3">
        <h1 className="font-display text-2xl font-bold text-ink">Pozycje</h1>
        {loaded && (
          <span className="text-sm text-muted">
            {total === 1 ? "1 pozycja" : `${total} pozycji`}
          </span>
        )}
      </div>

      <TradeFilterBar
        filters={filters}
        hasFilters={filtered}
        onChange={setFilters}
        onClear={clear}
      />

      {loaded && total === 0 ? (
        // Two genuinely different situations, two different exits.
        filtered ? (
          <EmptyState
            icon={<SearchX size={24} />}
            title="Żadna pozycja nie pasuje do filtrów."
            action={
              <Button variant="secondary" onClick={clear}>
                Wyczyść filtry
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon={<NotebookPen size={24} />}
            title="Nie masz jeszcze żadnych pozycji."
            action={<Button onClick={() => openCreate()}>Dodaj pierwszą pozycję</Button>}
          />
        )
      ) : (
        <>
          <TradesTable
            items={items}
            sort={filters.sort}
            order={filters.order}
            onSortChange={(sort, order) => setFilters({ sort, order })}
          />

          <div ref={sentinel} className="flex justify-center py-4">
            {loading && (
              <span
                aria-label="Ładowanie"
                className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-green"
              />
            )}
            {!loading && total > 0 && items.length === total && (
              <p className="text-xs text-muted-2">To wszystkie pozycje.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// useSearchParams needs a Suspense boundary in the App Router.
const TradesPage = () => (
  <Suspense fallback={null}>
    <TradesPageInner />
  </Suspense>
);

export default TradesPage;
