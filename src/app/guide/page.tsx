import { Suspense } from "react";
import { Navbar } from "@/components/navbar/Navbar";
import { IdleSessionMonitor } from "@/components/auth/IdleSessionMonitor";
import { createClient } from "@/lib/supabase/server";

type ProfileMetadata = {
  avatar_url?: string;
  picture?: string;
  full_name?: string;
  name?: string;
};

const EMERGENCY_STEPS = [
  {
    step: "01",
    title: "Blokir Rekening & Kartu Bank",
    desc: "Segera hubungi call center resmi bank Anda untuk memblokir kartu debit/kredit dan mobile banking jika data perbankan atau OTP terlanjur dibagikan.",
  },
  {
    step: "02",
    title: "Amankan & Reset Akses Akun",
    desc: "Ubah kata sandi akun email, media sosial, dan e-wallet dari perangkat lain yang aman. Aktifkan autentikasi dua faktor (2FA) berbasis aplikasi.",
  },
  {
    step: "03",
    title: "Uninstall Berkas APK Mencurigakan",
    desc: "Jika terlanjur menginstal file APK asing, putuskan koneksi internet (Airplane mode), cabut izin aksesibilitas dan SMS, lalu hapus aplikasi tersebut.",
  },
  {
    step: "04",
    title: "Laporkan ke Instansi Berwenang",
    desc: "Simpan bukti tangkapan layar, nomor rekening penipu, dan nomor kontak. Laporkan ke Satgas PASTI OJK (157), Patroli Siber Polri, dan Kominfo.",
  },
];

const OFFICIAL_CONTACTS = [
  {
    institution: "Patroli Siber Polri",
    phone: "110",
    service: "Laporan tindak pidana siber & penipuan online",
    url: "https://patrolisiber.id",
  },
  {
    institution: "Satgas PASTI (OJK)",
    phone: "157",
    service: "Penanganan pinjol ilegal & investasi bodong",
    url: "https://konsumen.ojk.go.id",
  },
  {
    institution: "Aduan Konten Kominfo",
    phone: "0811-9224-545",
    service: "Pemblokiran situs phishing, nomor & rekening penipu",
    url: "https://aduankonten.id",
  },
  {
    institution: "Bank Indonesia",
    phone: "131",
    service: "Informasi dan perlindungan konsumen sistem pembayaran",
    url: "https://bi.go.id",
  },
];

/**
 * Security runbook and emergency assistance guide page.
 */
async function GuideContent() {
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

      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex-1">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <span className="text-xs uppercase tracking-widest text-red-600 font-semibold mb-2 block">
            Panduan Tanggap Darurat
          </span>
          <h1 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900 leading-tight">
            Langkah Cepat Penanganan Penipuan Siber
          </h1>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">
            Jika Anda atau kerabat Anda mencurigai telah menjadi korban rekayasa
            sosial, phising, atau instalasi berkas APK berbahaya, segera lakukan
            tindakan berikut.
          </p>
        </div>

        {/* Step-by-Step Runbook */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {EMERGENCY_STEPS.map((item) => (
            <div
              key={item.step}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-red-600 font-mono mb-2 block">
                  LANGKAH {item.step}
                </span>
                <h2 className="text-base font-medium text-slate-900 mb-2">
                  {item.title}
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Official Authority Hotlines */}
        <div>
          <h2 className="text-lg font-medium text-slate-900 mb-4 tracking-tight">
            Kontak Resmi Pengaduan Nasional
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {OFFICIAL_CONTACTS.map((contact) => (
              <div
                key={contact.institution}
                className="border border-slate-200/80 rounded-2xl p-5 bg-white shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-sm font-medium text-slate-900">
                    {contact.institution}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {contact.service}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900">
                    Hotline: {contact.phone}
                  </span>
                  <a
                    href={contact.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-red-600 hover:text-red-700 transition-colors"
                  >
                    Kunjungi Situs &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="w-full bg-white text-slate-900 px-4 sm:px-8 md:px-12 py-10 border-t border-gray-100 mt-16">
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

export default function GuidePage() {
  return (
    <Suspense
      fallback={<main className="grid min-h-screen place-items-center">ThreatLens</main>}
    >
      <GuideContent />
    </Suspense>
  );
}

