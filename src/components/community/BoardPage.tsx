import { Suspense } from "react";
import { CommunityShell } from "@/components/community/CommunityShell";
import { IdleSessionMonitor } from "@/components/auth/IdleSessionMonitor";
import { CommunityBoard } from "@/components/community/CommunityBoard";
import { createClient } from "@/lib/supabase/server";
import type { CommunityTab } from "@/hooks/useCommunity";

type ProfileMetadata = { avatar_url?: string; picture?: string; full_name?: string; name?: string };

/**
 * The board behind a tab's own address: /community/latest, /community/popular, /community/phone.
 *
 * Every story here is one person's account of a number, stored with the image that goes with it. It
 * is deliberately not a verdict: the scanner answers "what does the check say", these pages only
 * answer "what did people experience". Both need a signed-in account, because a story without any
 * way to trace it back to a writer is a rumour with a button attached.
 *
 * The tab comes from the route rather than from state so a tab is linkable, reloadable and
 * back-button-able, and the ?nomor= filter stays in the query string because it narrows whatever
 * tab it is read on.
 */
async function BoardContent({ tab }: { tab: CommunityTab }) {
  const { data: { user } } = await (await createClient()).auth.getUser();
  const metadata = (user?.user_metadata ?? {}) as ProfileMetadata;
  return (
    <>
      <IdleSessionMonitor />
      <CommunityShell
        account={{ email: user?.email ?? undefined, avatarUrl: metadata.avatar_url ?? metadata.picture ?? null, name: metadata.full_name ?? metadata.name ?? null }}
      >
        <CommunityBoard tab={tab} />
      </CommunityShell>
    </>
  );
}

// The board reads ?nomor= for its single-number view, so it sits inside a Suspense boundary.
export function BoardPage({ tab }: { tab: CommunityTab }) {
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center bg-pos-shell font-pos-ui text-[13px] text-pos-muted">ThreatLens</main>}>
      <BoardContent tab={tab} />
    </Suspense>
  );
}
