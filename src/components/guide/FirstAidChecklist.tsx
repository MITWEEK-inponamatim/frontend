"use client";

import { useMemo, useSyncExternalStore } from "react";
import { Icon } from "@/components/ui/Icon";

type ChecklistItem = {
  id: string;
  phase: string;
  phaseLabel: string;
  timeWindow: string;
  badgeColor: string;
  title: string;
  description: string;
  actionNote?: string;
};

const CHECKLIST_ITEMS: ChecklistItem[] = [
  // Fase 1: Menit 0 - 5
  {
    id: "step_1_bank",
    phase: "fase_1",
    phaseLabel: "Fase 1: Kritis (Menit 0 - 5)",
    timeWindow: "0 - 5 Menit",
    badgeColor: "bg-red-50 text-red-700 border-red-200/80",
    title: "Hubungi Call Center Bank untuk Memblokir Rekening & M-Banking",
    description:
      "Segera telepon nomor call center resmi bank penerbit rekening Anda (bukan nomor di Google/chat) untuk membekukan kartu debit, kartu kredit, dan akses aplikasi mobile banking.",
    actionNote: "Gunakan menu pintasan Direktori Bank di bawah untuk nomor resmi terverifikasi.",
  },
  {
    id: "step_2_freeze",
    phase: "fase_1",
    phaseLabel: "Fase 1: Kritis (Menit 0 - 5)",
    timeWindow: "0 - 5 Menit",
    badgeColor: "bg-red-50 text-red-700 border-red-200/80",
    title: "Minta Pemblokiran Rekening Penampung Tujuan Transfer",
    description:
      "Jika transfer dana baru saja berhasil beberapa menit lalu, informasikan nomor rekening penipu dan nama bank tujuan ke petugas bank Anda untuk permintaan penahanan darurat (inter-bank fraud hold).",
  },
  {
    id: "step_3_ticket",
    phase: "fase_1",
    phaseLabel: "Fase 1: Kritis (Menit 0 - 5)",
    timeWindow: "0 - 5 Menit",
    badgeColor: "bg-red-50 text-red-700 border-red-200/80",
    title: "Catat Nomor Tiket Pengaduan Resmi dari Bank",
    description:
      "Pastikan Anda mencatat nomor laporan/tiket dari petugas customer service bank beserta nama agen yang melayani sebagai bukti kronologi resmi untuk penyelidikan kepolisian.",
  },

  // Fase 2: Menit 5 - 10
  {
    id: "step_4_airplane",
    phase: "fase_2",
    phaseLabel: "Fase 2: Isolasi Perangkat (Menit 5 - 10)",
    timeWindow: "5 - 10 Menit",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200/80",
    title: "Aktifkan Mode Pesawat (Airplane Mode) & Matikan Wi-Fi",
    description:
      "Putuskan seluruh koneksi internet segera. Jika ponsel sempat mengunduh file APK, malware tidak dapat meneruskan data SMS OTP atau merekam layar ke server pelaku tanpa koneksi aktif.",
  },
  {
    id: "step_5_revoke",
    phase: "fase_2",
    phaseLabel: "Fase 2: Isolasi Perangkat (Menit 5 - 10)",
    timeWindow: "5 - 10 Menit",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200/80",
    title: "Cabut Izin Aksesibilitas (Accessibility Service)",
    description:
      "Buka Pengaturan Android > Aksesibilitas (Accessibility). Nonaktifkan izin dari aplikasi mencurigakan apa pun yang terpasang. Ini mematikan kendali otomatis layar oleh malware.",
  },
  {
    id: "step_6_uninstall",
    phase: "fase_2",
    phaseLabel: "Fase 2: Isolasi Perangkat (Menit 5 - 10)",
    timeWindow: "5 - 10 Menit",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200/80",
    title: "Hapus (Uninstall) Berkas APK Trojan dari Ponsel",
    description:
      "Buka Pengaturan > Aplikasi > Kelola Aplikasi. Cari aplikasi asing (sering menyamar dengan ikon dokumen, foto, atau sistem) dan pilih 'Hapus Instalasi' / Uninstall.",
    actionNote: "Jangan restart perangkat sebelum mencabut izin aksesibilitas agar malware tidak aktif ulang otomatis.",
  },

  // Fase 3: Menit 10 - 15
  {
    id: "step_7_email",
    phase: "fase_3",
    phaseLabel: "Fase 3: Kredensial Akun (Menit 10 - 15)",
    timeWindow: "10 - 15 Menit",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200/80",
    title: "Ganti Kata Sandi Email Utama dari Perangkat Lain yang Bersih",
    description:
      "Gunakan laptop atau ponsel keluarga yang tidak terinfeksi untuk mengganti kata sandi akun Google/email yang terhubung ke perbankan dan e-wallet Anda.",
  },
  {
    id: "step_8_logout_all",
    phase: "fase_3",
    phaseLabel: "Fase 3: Kredensial Akun (Menit 10 - 15)",
    timeWindow: "10 - 15 Menit",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200/80",
    title: "Lakukan 'Logout dari Semua Perangkat Lain' (Sign Out All Sessions)",
    description:
      "Pada pengaturan akun Google/WhatsApp/Media Sosial, pilih opsi putuskan seluruh sesi aktif perangkat lain untuk mencegah penyusup bertahan di akun Anda.",
  },
  {
    id: "step_9_2fa_app",
    phase: "fase_3",
    phaseLabel: "Fase 3: Kredensial Akun (Menit 10 - 15)",
    timeWindow: "10 - 15 Menit",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200/80",
    title: "Alihkan 2FA ke Aplikasi Authenticator (Bukan SMS)",
    description:
      "Ubah autentikasi dua faktor (2FA) dari SMS ke aplikasi generator kode (seperti Google Authenticator) agar OTP tidak dapat disadap melalui sniffer SMS seluler.",
  },

  // Fase 4: Pasca 15 Menit
  {
    id: "step_10_evidence",
    phase: "fase_4",
    phaseLabel: "Fase 4: Penegakan Hukum & Laporan Resmi",
    timeWindow: "Pasca 15 Menit",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200/80",
    title: "Amankan & Ekspor Seluruh Bukti Digital (Tangkapan Layar & Mutasi)",
    description:
      "Simpan tangkapan layar percakapan WhatsApp dengan nomor pelaku, bukti struk transfer, nomor rekening penampung, dan mutasi rekening bank secara rapi.",
  },
  {
    id: "step_11_police",
    phase: "fase_4",
    phaseLabel: "Fase 4: Penegakan Hukum & Laporan Resmi",
    timeWindow: "Pasca 15 Menit",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200/80",
    title: "Buat Laporan Polisi Resmi di SPKT / Patroli Siber Polri (110)",
    description:
      "Kunjungi kantor kepolisian terdekat atau hubungi hotline 110 untuk memperoleh Surat Tanda Penerimaan Laporan (STPL). Dokumen ini adalah syarat mutlak bank untuk mediasi pencairan dana sitaan.",
  },
  {
    id: "step_12_satgas",
    phase: "fase_4",
    phaseLabel: "Fase 4: Penegakan Hukum & Laporan Resmi",
    timeWindow: "Pasca 15 Menit",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200/80",
    title: "Laporkan Nomor & Rekening ke Satgas PASTI OJK (157) & Kominfo",
    description:
      "Laporkan nomor telepon dan nomor rekening sindikat ke Satgas PASTI OJK (157) dan portal Aduan Konten Kominfo (aduankonten.id) agar akun penampung diblokir permanen dari sistem perbankan nasional.",
  },
];

const STORAGE_KEY = "threatlens_first_aid_checklist";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("checklist-updated", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("checklist-updated", callback);
  };
}

function getSnapshot(): string {
  if (typeof window === "undefined") return "[]";
  try {
    return localStorage.getItem(STORAGE_KEY) || "[]";
  } catch {
    return "[]";
  }
}

function getServerSnapshot(): string {
  return "[]";
}

/**
 * Interactive post-incident emergency response runbook with persistent checkbox progress.
 */
export function FirstAidChecklist() {
  const rawChecked = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const checkedIds = useMemo(() => {
    try {
      const parsed = JSON.parse(rawChecked);
      return Array.isArray(parsed) ? (parsed as string[]) : [];
    } catch {
      return [];
    }
  }, [rawChecked]);

  const toggleCheck = (id: string) => {
    const next = checkedIds.includes(id)
      ? checkedIds.filter((item) => item !== id)
      : [...checkedIds, id];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("checklist-updated"));
    } catch {
      // Ignore storage write errors
    }
  };

  const handleReset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event("checklist-updated"));
    } catch {
      // Ignore
    }
  };

  const total = CHECKLIST_ITEMS.length;
  const completed = checkedIds.length;
  const progressPercent = Math.round((completed / total) * 100);

  // Group items by phase
  const phases = [
    { key: "fase_1", title: "Fase 1: Kritis (Menit 0 - 5)", badge: "0 - 5 Menit" },
    { key: "fase_2", title: "Fase 2: Isolasi Perangkat (Menit 5 - 10)", badge: "5 - 10 Menit" },
    { key: "fase_3", title: "Fase 3: Kredensial Akun (Menit 10 - 15)", badge: "10 - 15 Menit" },
    { key: "fase_4", title: "Fase 4: Penegakan Hukum & Laporan Resmi", badge: "Pasca 15 Menit" },
  ];

  return (
    <section className="space-y-6 text-left">
      {/* Progress & Control Header */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-2xs text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                completed === total
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              <Icon
                icon={
                  completed === total
                    ? "solar:shield-check-bold-duotone"
                    : "solar:clock-circle-bold-duotone"
                }
                className="h-5 w-5"
              />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-normal text-slate-900 leading-snug">
                Progres Checklist Mitigasi Cepat
              </h3>
              <p className="text-xs font-normal text-slate-500 mt-0.5">
                {completed === total
                  ? "Seluruh langkah tanggap darurat telah diselesaikan."
                  : `${completed} dari ${total} tindakan darurat terlaksana (${progressPercent}%)`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            <span className="text-sm font-mono font-medium text-slate-800 tabular-nums">
              {progressPercent}%
            </span>
            {completed > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-normal text-slate-400 hover:text-red-600 transition-colors pl-3 border-l border-slate-200"
              >
                Reset Checklist
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              completed === total ? "bg-emerald-500" : "bg-red-600"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Grouped Phase Accordions */}
      <div className="space-y-6">
        {phases.map((phase) => {
          const items = CHECKLIST_ITEMS.filter((item) => item.phase === phase.key);
          const phaseCompleted = items.every((item) =>
            checkedIds.includes(item.id),
          );

          return (
            <div
              key={phase.key}
              className="rounded-2xl border border-slate-200/90 bg-white shadow-2xs overflow-hidden text-left"
            >
              {/* Phase Header */}
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 sm:px-5 py-3 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-medium text-slate-900">
                    {phase.title}
                  </span>
                  {phaseCompleted && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-normal text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-full px-2 py-0.2">
                      <Icon icon="solar:check-circle-bold" className="h-3 w-3" />
                      <span>Selesai</span>
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  {phase.badge}
                </span>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-100">
                {items.map((item) => {
                  const isChecked = checkedIds.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      role="checkbox"
                      aria-checked={isChecked}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleCheck(item.id);
                        }
                      }}
                      className="group flex items-start gap-3.5 p-4 sm:p-5 cursor-pointer transition-colors hover:bg-slate-50/60 select-none text-left"
                    >
                      {/* Checkbox Icon */}
                      <button
                        type="button"
                        aria-hidden="true"
                        tabIndex={-1}
                        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-all ${
                          isChecked
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "border-slate-300 bg-white group-hover:border-slate-400"
                        }`}
                      >
                        {isChecked && (
                          <Icon icon="solar:check-circle-bold" className="h-3.5 w-3.5" />
                        )}
                      </button>

                      {/* Content */}
                      <div className="min-w-0 flex-1 text-left">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4
                            className={`text-xs sm:text-sm font-normal leading-snug transition-colors ${
                              isChecked
                                ? "line-through text-slate-400"
                                : "text-slate-900"
                            }`}
                          >
                            {item.title}
                          </h4>
                        </div>
                        <p
                          className={`mt-1 text-xs font-normal leading-relaxed ${
                            isChecked ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          {item.description}
                        </p>
                        {item.actionNote && (
                          <p className="mt-2 text-[11px] font-normal text-red-600 leading-normal">
                            &bull; {item.actionNote}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
