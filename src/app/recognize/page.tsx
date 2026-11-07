import { Suspense } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { RecentHistoryCard } from "@/components/history/RecentHistoryCard";
import { IdleSessionMonitor } from "@/components/auth/IdleSessionMonitor";
import { createClient } from "@/lib/supabase/server";

type ProfileMetadata = {
  avatar_url?: string;
  picture?: string;
  full_name?: string;
  name?: string;
};

/**
 * Signed-in scanner workspace page. Focused on the scanner tool and recent user history without marketing sections.
 */
async function RecognizeContent() {
  const {
    data: { user },
  } = await (await createClient()).auth.getUser();
  const metadata = (user?.user_metadata ?? {}) as ProfileMetadata;

  return (
    <>
      <IdleSessionMonitor />
      <SiteShell
        account={{
          email: user?.email ?? undefined,
          avatarUrl: metadata.avatar_url ?? metadata.picture ?? null,
          name: metadata.full_name ?? metadata.name ?? null,
        }}
        showEducationalSections={false}
      >
        <RecentHistoryCard />
      </SiteShell>
    </>
  );
}

export default function RecognizePage() {
  return (
    <Suspense
      fallback={<main className="grid min-h-screen place-items-center">ThreatLens</main>}
    >
      <RecognizeContent />
    </Suspense>
  );
}
