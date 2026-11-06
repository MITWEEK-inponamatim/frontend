import { Suspense } from "react";
import { redirect } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import { IdleSessionMonitor } from "@/components/auth/IdleSessionMonitor";
import { ScanRecordResult } from "@/components/recognize/ScanRecordResult";
import { createClient } from "@/lib/supabase/server";
import { isScanId } from "@/lib/paths";

type ProfileMetadata = { avatar_url?: string; picture?: string; full_name?: string; name?: string };

/**
 * One APK check, at the address of its own scan id — the same arrangement as the link page.
 *
 * The uploaded file itself is not kept on this page or offered for download: the address points at
 * the verdict, and the filename is the only trace of the sample shown here.
 */
async function RecognizeApkContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isScanId(id)) redirect("/recognize");
  const { data: { user } } = await (await createClient()).auth.getUser();
  const metadata = (user?.user_metadata ?? {}) as ProfileMetadata;
  return (
    <>
      <IdleSessionMonitor />
      <SiteShell
        account={{ email: user?.email ?? undefined, avatarUrl: metadata.avatar_url ?? metadata.picture ?? null, name: metadata.full_name ?? metadata.name ?? null }}
        scanner={<ScanRecordResult scanId={id} kind="application" />}
      />
    </>
  );
}

// The params promise is awaited inside the Suspense boundary: with Cache Components on, reading
// them in the page body would block prerendering of the whole route.
export default function RecognizeApkPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center">ThreatLens</main>}>
      <RecognizeApkContent params={params} />
    </Suspense>
  );
}
