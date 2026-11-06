import { Suspense } from "react";
import Link from "next/link";
import { HistoryList } from "@/components/history/HistoryList";
import { IdleSessionMonitor } from "@/components/auth/IdleSessionMonitor";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { createClient } from "@/lib/supabase/server";

type ProfileMetadata = { avatar_url?: string; picture?: string; full_name?: string; name?: string };

/**
 * Riwayat: one account's own checks, newest first.
 *
 * Not SiteShell — the landing page is looked at, this page is read once and closed, so it gets a
 * plain column and a hairline header instead of a hero. The rows live in
 * components/history/HistoryList.tsx because they need the API and the account header does not.
 */
async function HistoryContent() {
  const { data: { user } } = await (await createClient()).auth.getUser();
  const metadata = (user?.user_metadata ?? {}) as ProfileMetadata;
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <IdleSessionMonitor />
      <header className="border-b border-gray-100">
        <div className="mx-auto flex w-full max-w-2xl items-center gap-3 px-5 py-3.5">
          <Link href="/" className="rounded-lg px-0.5 text-sm font-medium tracking-tight text-slate-900 transition-colors hover:text-red-600">
            ThreatLens
          </Link>
          <nav aria-label="Akun" className="ml-auto flex items-center gap-3">
            <span className="hidden max-w-[13rem] truncate text-xs text-slate-500 sm:block" title={user?.email ?? undefined}>
              {metadata.full_name ?? metadata.name ?? user?.email}
            </span>
            <Link href="/recognize" className="rounded-lg px-2 py-1 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900">
              Pindai
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl px-5 pb-20">
        <h1 className="mt-10 text-2xl text-slate-900 sm:text-3xl">Riwayat pemeriksaan</h1>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-slate-500">
          Setiap tautan dan berkas APK yang Anda periksa tersimpan di sini, dengan halaman hasilnya sendiri.
          Pemeriksaan nomor telepon tidak masuk riwayat karena jawabannya menempel pada nomornya.
        </p>
        <HistoryList />
      </main>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center">ThreatLens</main>}>
      <HistoryContent />
    </Suspense>
  );
}
