import { redirect } from "next/navigation";

/**
 * /community is an address people already have — bookmarks, the landing menu, links from the phone
 * result pages — so it forwards to the default tab instead of holding a fourth copy of the board.
 * The ?nomor= filter rides along; a link that narrows a number should not narrow nothing after the
 * hop.
 */

// Blocking on purpose: the target address is built from ?nomor=, so there is nothing to prerender
// here — the only thing this route does needs the request.
export const instant = false;

export default async function CommunityPage({ searchParams }: { searchParams: Promise<{ nomor?: string }> }) {
  const { nomor } = await searchParams;
  redirect(nomor ? `/community/latest?nomor=${encodeURIComponent(nomor)}` : "/community/latest");
}
