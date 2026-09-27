import React from "react";

type PlanCardProps = {
  title: string;
  children: React.ReactNode;
};

export const PlanCard = ({ title, children }: PlanCardProps) => (
  <section className="rounded-2xl border border-border bg-surface p-5">
    <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
    <div className="mt-4">{children}</div>
  </section>
);
