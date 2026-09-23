import { TradingViewEmbed } from "@/components/reusable/TradingViewEmbed";
import type { Trade } from "@/utils/trades/types";

type TradeDetailsProps = {
  trade: Trade;
};

export const TradeDetails = ({ trade }: TradeDetailsProps) => {
  if (!trade.description && !trade.error_desc && !trade.link)
    return <p className="text-sm text-muted-2">Brak dodatkowych szczegółów.</p>;

  return (
    <div className="flex flex-col gap-4">
      {trade.description && (
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Opis</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-ink">
            {trade.description}
          </p>
        </div>
      )}

      {trade.error_desc && (
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">
            Popełniony błąd
          </p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-ink">
            {trade.error_desc}
          </p>
        </div>
      )}

      {trade.link && <TradingViewEmbed link={trade.link} />}
    </div>
  );
};
