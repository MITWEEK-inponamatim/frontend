import { Suspense } from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar/Navbar";
import { IdleSessionMonitor } from "@/components/auth/IdleSessionMonitor";
import { RoleplaySimulator } from "@/components/learn/RoleplaySimulator";
import { ROLEPLAY_DETAILS } from "@/lib/roleplayData";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Simulasi Kasus",
};

type ProfileMetadata = {
  avatar_url?: string;
  picture?: string;
  full_name?: string;
  name?: string;
};

/**
 * Interactive scam simulation scenario detail page.
 *
 * @param params - Route parameters containing scenario identifier slug.
 */
async function LearnDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const scenario =
    ROLEPLAY_DETAILS[id] ?? ROLEPLAY_DETAILS["resi-paket-apk"];

  const {
    data: { user },
  } = await (await createClient()).auth.getUser();
  const metadata = (user?.user_metadata ?? {}) as ProfileMetadata;

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between">
      <IdleSessionMonitor />
      <Navbar
        account={
          user
            ? {
                email: user.email ?? undefined,
                avatarUrl: metadata.avatar_url ?? metadata.picture ?? null,
                name: metadata.full_name ?? metadata.name ?? null,
              }
            : null
        }
      />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex-1 flex flex-col justify-center">
        <RoleplaySimulator scenario={scenario} />
      </main>

      <footer className="w-full bg-white text-slate-900 px-4 sm:px-8 md:px-12 py-8 border-t border-gray-100 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500 font-normal">
          <span>Anti-Scam AI Platform &middot; Inisiatif Keamanan Siber 2026</span>
          <div className="flex items-center gap-4 text-slate-600 font-normal">
            <span>Recognize</span>
            <span>&middot;</span>
            <span>Learn</span>
            <span>&middot;</span>
            <span>Act</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function LearnDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-screen place-items-center bg-white text-xs font-normal text-slate-500">
          Memuat Simulasi Peran...
        </main>
      }
    >
      <LearnDetailContent params={params} />
    </Suspense>
  );
}

