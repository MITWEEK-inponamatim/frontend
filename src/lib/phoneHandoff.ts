import type { ScanResult } from "@/hooks/useScanner";

/**
 * The verdict is produced while the user is still waiting on /recognize, but it belongs at
 * /recognize/phone/[nomor]. This cache carries it across the client-side navigation so the result
 * page does not run a second scan for a number that was just checked.
 *
 * Reading deliberately does not delete: React runs effects twice in development, and a consuming
 * read would turn the second run into "nothing handed over" — which would re-scan.
 */
const MAX_HANDED_OFF = 20;
const handedOff = new Map<string, ScanResult>();

export function rememberPhoneResult(slug: string, result: ScanResult) {
  handedOff.set(slug, result);
  while (handedOff.size > MAX_HANDED_OFF) {
    const oldest = handedOff.keys().next().value;
    if (oldest === undefined) break;
    handedOff.delete(oldest);
  }
}

export function readPhoneResult(slug: string): ScanResult | null {
  return handedOff.get(slug) ?? null;
}
