import { Suspense } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { IdleSessionMonitor } from "@/components/auth/IdleSessionMonitor";
import { createClient } from "@/lib/supabase/server";

type ProfileMetadata = { avatar_url?: string; picture?: string; full_name?: string; name?: string };

/**
 * Signed-in scanner page. Same shell as the landing page; the navbar additionally shows the
 * Google profile photo and the logout button.
 */
async function RecognizeContent() {
  const { data: { user } } = await (await createClient()).auth.getUser();
  const metadata = (user?.user_metadata ?? {}) as ProfileMetadata;
  return (
    <>
      <IdleSessionMonitor />
      <SiteShell account={{ email: user?.email ?? undefined, avatarUrl: metadata.avatar_url ?? metadata.picture ?? null, name: metadata.full_name ?? metadata.name ?? null }} />
    </>
  );
}

export default function RecognizePage() {
  return <Suspense fallback={<main className="grid min-h-screen place-items-center">ThreatLens</main>}><RecognizeContent /></Suspense>;
}
