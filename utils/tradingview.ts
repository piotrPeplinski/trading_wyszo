/**
 * TradingView snapshot pages (/x/<ID>/) mirror the image at a predictable S3 path
 * bucketed by the ID's first character, lowercased:
 *   /x/Aic1KlSL/ -> https://s3.tradingview.com/snapshots/a/Aic1KlSL.png
 * No API and no key involved. Anything that isn't a TradingView snapshot link
 * returns null, and the caller falls back to a plain link.
 */
const SNAPSHOT = /^https?:\/\/(?:www\.)?tradingview\.com\/x\/([A-Za-z0-9]+)\/?/;

export function snapshotUrl(link: string): string | null {
  const id = link.trim().match(SNAPSHOT)?.[1];
  if (!id) return null;
  return `https://s3.tradingview.com/snapshots/${id[0].toLowerCase()}/${id}.png`;
}
