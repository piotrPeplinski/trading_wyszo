"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";

import { snapshotUrl } from "@/utils/tradingview";

function shortHost(link: string) {
  try {
    return new URL(link).host.replace(/^www\./, "");
  } catch {
    return link;
  }
}

export function TradingViewEmbed({ link }: { link: string }) {
  // Snapshots get deleted upstream, so a valid-looking URL can still 404 —
  // onError drops us to the same chip a non-TradingView link gets.
  const [broken, setBroken] = useState(false);
  const src = snapshotUrl(link);

  if (src && !broken) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- TradingView S3, not worth a remotePatterns entry
      <img
        src={src}
        alt="Zrzut pozycji"
        loading="lazy"
        onError={() => setBroken(true)}
        className="w-full rounded-xl border border-border"
      />
    );
  }

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs text-muted transition-colors hover:border-green/50 hover:text-ink"
    >
      <ExternalLink size={13} />
      {shortHost(link)}
    </a>
  );
}
