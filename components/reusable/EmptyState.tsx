type EmptyStateProps = {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export const EmptyState = ({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) => (
  <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface px-4 py-12 text-center">
    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-2 text-muted">
      {icon}
    </span>

    <div className="flex flex-col gap-1">
      <p className="font-medium text-ink">{title}</p>
      {description && (
        <p className="max-w-sm text-sm text-muted">{description}</p>
      )}
    </div>

    {action}
  </div>
);
