import { Suspense } from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar/Navbar";
import { IdleSessionMonitor } from "@/components/auth/IdleSessionMonitor";
import { ScenarioSelector } from "@/components/learn/ScenarioSelector";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Modul Edukasi",
};

type ProfileMetadata = {
  avatar_url?: string;
  picture?: string;
  full_name?: string;
  name?: string;
};

/**
 * Educational scenario hub where users select realistic conversational scam simulations.
 */
async function LearnContent() {
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

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1">
        <ScenarioSelector />
      </main>

      <footer className="w-full bg-white text-slate-900 px-4 sm:px-8 md:px-12 py-10 border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500 font-normal">
          <span>Anti-Scam AI Platform • Inisiatif Keamanan Siber 2026</span>
          <div className="flex items-center gap-4 text-slate-600 font-normal">
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

export default function LearnPage() {
  return (
    <Suspense
      fallback={<main className="grid min-h-screen place-items-center">ThreatLens</main>}
    >
      <LearnContent />
    </Suspense>
  );
}
