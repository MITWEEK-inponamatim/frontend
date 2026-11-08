import { Suspense } from "react";
import { Navbar, type Account } from "@/components/navbar/Navbar";
import { IdleSessionMonitor } from "@/components/auth/IdleSessionMonitor";
import { FirstAidChecklist } from "@/components/guide/FirstAidChecklist";
import { BankDirectory } from "@/components/guide/BankDirectory";
import { EmergencyHotlines } from "@/components/guide/EmergencyHotlines";
import { createClient } from "@/lib/supabase/server";

type ProfileMetadata = {
  avatar_url?: string;
  picture?: string;
  full_name?: string;
  name?: string;
};

/**
 * Authoritative cyber emergency mitigation hub providing interactive 15-minute runbooks,
 * verified bank call center directories, and direct-dial national law enforcement hotlines.
 */
async function GuideContent() {
  const {
    data: { user },
  } = await (await createClient()).auth.getUser();
  const metadata = (user?.user_metadata ?? {}) as ProfileMetadata;

  const account: Account | null = user
    ? {
        email: user.email ?? undefined,
        avatarUrl: metadata.avatar_url ?? metadata.picture ?? null,
        name: metadata.full_name ?? metadata.name ?? null,
      }
    : null;

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between">
      <IdleSessionMonitor />
      <Navbar account={account} />

      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 space-y-12 sm:space-y-16">
        {/* Hub Header */}
        <header className="max-w-3xl text-left space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-200/80 bg-red-50/70 px-3 py-1 text-xs font-medium text-red-700">
            <span>Panduan Tanggap Darurat 2026</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-normal tracking-tight text-slate-900 leading-tight">
            Pertolongan Pertama Pasca-Insiden Siber
          </h1>

          <p className="text-xs sm:text-sm font-normal text-slate-500 leading-relaxed">
            Protokol mitigasi cepat untuk 15 menit pertama setelah mendapati indikasi saldo bank berkurang, PIN tercuri, atau terlanjur mengunduh berkas APK berbahaya untuk menghentikan kerugian finansial.
          </p>

          {/* Anchor Navigation Shortcuts */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            <a
              href="#checklist"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <span>1. Checklist 15 Menit</span>
            </a>
            <a
              href="#bank"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <span>2. Call Center Bank Resmi</span>
            </a>
            <a
              href="#hotline"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <span>3. Kontak Darurat Nasional</span>
            </a>
          </div>
        </header>

        {/* Section 1: 15-Minute Interactive Checklist */}
        <section id="checklist" className="scroll-mt-20">
          <FirstAidChecklist />
        </section>

        {/* Section 2: Verified National Bank CS Directory */}
        <section id="bank" className="scroll-mt-20 pt-6 border-t border-slate-100">
          <BankDirectory />
        </section>

        {/* Section 3: Official Law Enforcement & Regulatory Hotlines */}
        <section id="hotline" className="scroll-mt-20 pt-6 border-t border-slate-100">
          <EmergencyHotlines />
        </section>
      </main>

      <footer className="w-full bg-white text-slate-900 px-4 sm:px-8 md:px-12 py-10 border-t border-gray-100 mt-16">
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

export default function GuidePage() {
  return (
    <Suspense
      fallback={<main className="grid min-h-screen place-items-center bg-white text-xs text-slate-400">ThreatLens</main>}
    >
      <GuideContent />
    </Suspense>
  );
}
