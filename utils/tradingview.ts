/**
 * TradingView snapshot pages (/x/<ID>/) mirror the image at a predictable S3 path
 * bucketed by the ID's first character, lowercased:
 *   /x/Aic1KlSL/ -> https://s3.tradingview.com/snapshots/a/Aic1KlSL.png
 * No API and no key involved. Anything that isn't a TradingView snapshot link
 * returns null, and the caller falls back to a plain link.
 */
// Any subdomain: TradingView serves locale hosts (pl., de., …) and a snapshot
// copied from one of those points at the same S3 image.
const SNAPSHOT =
  /^https?:\/\/(?:[a-z0-9-]+\.)?tradingview\.com\/x\/([A-Za-z0-9]+)\/?/i;

export const snapshotUrl = (link: string): string | null => {
  const id = link.trim().match(SNAPSHOT)?.[1];
  if (!id) return null;
  return `https://s3.tradingview.com/snapshots/${id[0].toLowerCase()}/${id}.png`;
};
