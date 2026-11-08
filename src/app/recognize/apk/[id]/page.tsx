import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Navbar, type Account } from "@/components/navbar/Navbar";
import { IdleSessionMonitor } from "@/components/auth/IdleSessionMonitor";
import { ScanRecordResult } from "@/components/recognize/ScanRecordResult";
import { createClient } from "@/lib/supabase/server";
import { isScanId } from "@/lib/paths";

type ProfileMetadata = { avatar_url?: string; picture?: string; full_name?: string; name?: string };

/**
 * Dedicated forensic report page for an APK scan record, presenting an authoritative
 * dossier view without landing page marketing heroes or distracting visual gimmicks.
 *
 * @param params - Route parameters containing the unique scan identifier.
 */
async function RecognizeApkContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isScanId(id)) redirect("/recognize");

  const { data: { user } } = await (await createClient()).auth.getUser();
  const metadata = (user?.user_metadata ?? {}) as ProfileMetadata;
  const account: Account | null = user
    ? {
        email: user.email ?? undefined,
        avatarUrl: metadata.avatar_url ?? metadata.picture ?? null,
        name: metadata.full_name ?? metadata.name ?? null,
      }
    : null;

  return (
    <div className="relative min-h-screen w-full bg-white text-slate-900 flex flex-col justify-between">
      <IdleSessionMonitor />
      <Navbar account={account} />

      <main className="w-full flex-1 max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10">
        <ScanRecordResult scanId={id} kind="application" />
      </main>

      <footer className="w-full bg-white text-slate-900 px-4 sm:px-8 md:px-12 py-8 border-t border-gray-100 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500 font-normal">
          <span>Anti-Scam AI Platform • Inisiatif Keamanan Siber 2026</span>
          <div className="flex items-center gap-4 text-slate-600">
            <span>Recognize</span>
            <span>•</span>
            <span>Learn</span>
            <span>•</span>
            <span>Act</span>
          </div>
        </div>
      </footer>
    </div>
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
