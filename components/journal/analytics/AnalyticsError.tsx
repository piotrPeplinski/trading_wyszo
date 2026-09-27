import React from "react";

import { Button } from "@/components/ui/Button";

type AnalyticsErrorProps = {
  onRetry: () => void;
};

export const AnalyticsError = ({ onRetry }: AnalyticsErrorProps) => (
  <section className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface px-4 py-12 text-center">
    <p className="text-sm text-muted">
      Nie udało się pobrać statystyk.
    </p>
    <Button variant="secondary" onClick={onRetry}>
      Spróbuj ponownie
    </Button>
  </section>
);
