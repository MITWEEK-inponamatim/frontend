import { Suspense } from "react";
import { CommunityShell } from "@/components/community/CommunityShell";
import { IdleSessionMonitor } from "@/components/auth/IdleSessionMonitor";
import { CommunityBoard } from "@/components/community/CommunityBoard";
import { createClient } from "@/lib/supabase/server";
import type { CommunityTab } from "@/hooks/useCommunity";

type ProfileMetadata = { avatar_url?: string; picture?: string; full_name?: string; name?: string };

/**
 * The board behind a tab's own address: /community/latest, /community/popular, /community/phone.
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

/**
 * Server component host for community tab pages wrapped in a suspense boundary.
 */
export function BoardPage({ tab }: { tab: CommunityTab }) {
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center bg-white text-[13px] font-normal text-slate-500">ThreatLens</main>}>
      <BoardContent tab={tab} />
    </Suspense>
  );
}
