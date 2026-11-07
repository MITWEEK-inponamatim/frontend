import { Suspense } from "react";
import { HistoryList } from "@/components/history/HistoryList";
import { IdleSessionMonitor } from "@/components/auth/IdleSessionMonitor";
import { Navbar } from "@/components/navbar/Navbar";
import { createClient } from "@/lib/supabase/server";

type ProfileMetadata = {
  avatar_url?: string;
  picture?: string;
  full_name?: string;
  name?: string;
};

/**
 * Account history page displaying user's historical phone, link, and APK scans.
 */
async function HistoryContent() {
  const {
    data: { user },
  } = await (await createClient()).auth.getUser();
  const metadata = (user?.user_metadata ?? {}) as ProfileMetadata;

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between">
      <IdleSessionMonitor />
      <Navbar
        account={{
          email: user?.email ?? undefined,
          avatarUrl: metadata.avatar_url ?? metadata.picture ?? null,
          name: metadata.full_name ?? metadata.name ?? null,
        }}
      />

      <main className="mx-auto w-full max-w-3xl lg:max-w-4xl px-4 sm:px-6 pb-20 pt-8 sm:pt-12 flex-1 text-left">
        <h1 className="text-2xl text-slate-900 sm:text-3xl font-semibold tracking-tight text-left">
          Riwayat pemeriksaan
        </h1>
        <p className="mt-1.5 max-w-prose text-xs sm:text-sm leading-relaxed text-slate-500 text-left">
          Daftar seluruh nomor telepon, tautan situs, dan berkas APK yang pernah Anda periksa beserta ringkasan hasil evaluasi risikonya.
        </p>
        <HistoryList />
      </main>

      <footer className="w-full bg-white text-slate-900 px-4 sm:px-8 md:px-12 py-10 border-t border-gray-100">
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

export default function HistoryPage() {
  return (
    <Suspense
      fallback={<main className="grid min-h-screen place-items-center">ThreatLens</main>}
    >
      <HistoryContent />
    </Suspense>
  );
}
