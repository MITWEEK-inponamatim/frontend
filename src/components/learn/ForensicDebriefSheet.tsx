"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { RoleplayScenarioDetail } from "@/lib/roleplayData";

/**
 * Authentic Apple iOS Inset Grouped Forensic Debrief Sheet:
 * Provides a clean, authoritative post-simulation debrief without visual slop,
 * adhering to Apple Human Interface Guidelines (HIG).
 *
 * @param status - Simulation outcome: "breached" or "victory".
 * @param scenario - Scenario details, breach metrics, and victory insights.
 * @param onRetry - Callback to replay simulation.
 * @param onClose - Callback to minimize the sheet and review the underlying chat stream.
 */
export function ForensicDebriefSheet({
  status,
  scenario,
  onRetry,
  onClose,
}: {
  status: "breached" | "victory";
  scenario: RoleplayScenarioDetail;
  onRetry: () => void;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"chronology" | "forensics">(
    "chronology",
  );

  const isBreached = status === "breached";
  const forensics = scenario.forensicSummary ?? {
    targetLabel: scenario.id === "tarif-bank-phishing" ? "Target / Alamat URL" : "Nama Berkas",
    targetValue:
      scenario.id === "tarif-bank-phishing"
        ? "https://bca-pembaruan-tarif.info/batal-tarif"
        : "LIHAT_Foto_Paket.apk (4.2 MB)",
    threatClassification:
      scenario.id === "tarif-bank-phishing"
        ? "Credential Harvesting Web Phishing (Tingkat Risiko: 92%)"
        : "Android SMS Sniffer Trojan (Tingkat Risiko: 85%)",
    indicatorLabel:
      scenario.id === "tarif-bank-phishing"
        ? "Kredensial yang Diincar"
        : "Izin Berbahaya (Permissions)",
    indicatorValue:
      scenario.id === "tarif-bank-phishing"
        ? "Nomor Kartu ATM (16 Digit), PIN Mobile Banking, Kode OTP"
        : "RECEIVE_SMS, READ_SMS, INTERNET",
    attackImpact:
      scenario.id === "tarif-bank-phishing"
        ? "Pengambilalihan akun m-Banking secara ilegal dan pengurasan saldo tabungan ke rekening penampung"
        : "Malware membaca SMS OTP m-Banking di latar belakang dan mengirimkannya ke penipu",
    officialProcedure:
      scenario.id === "tarif-bank-phishing"
        ? "Bank BCA tidak pernah membagikan tautan formulir pembatalan tarif melalui pesan instan WhatsApp"
        : "Ekspedisi resmi (J&T, JNE, SiCepat) tidak pernah mengirim berkas APK kepada pelanggan",
    psychologicalPressure:
      scenario.id === "tarif-bank-phishing"
        ? "Ancaman auto-debit Rp 150.000/bulan sebelum pukul 17:00 WIB (Loss Aversion)"
        : "Ancaman retur paket dan denda pembatalan COD jika tidak dicek (False Urgency)",
    decisionPointBreached:
      scenario.id === "tarif-bank-phishing"
        ? "Menyerahkan data nomor kartu ATM dan PIN di formulir web palsu"
        : "Menyetujui instalasi berkas .apk dari luar kanal resmi",
    decisionPointSafe:
      scenario.id === "tarif-bank-phishing"
        ? "Menolak membuka link dan memilih verifikasi ke Halo BCA 1500888"
        : "Menolak eksekusi file dan memverifikasi nomor resi secara mandiri",
  };

  return (
    <>
      {/* Soft Backdrop - Click to minimize and inspect chat */}
      <div
        onClick={onClose}
        className="absolute inset-0 z-20 bg-black/25 backdrop-blur-[1px] transition-opacity"
        aria-hidden="true"
      />

      {/* iOS Bottom Sheet Container */}
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Laporan Forensik Simulasi"
        className="absolute inset-x-0 bottom-0 z-30 flex max-h-[90%] flex-col rounded-t-[28px] border-t border-slate-200/90 bg-[#F2F2F7] shadow-2xl transition-transform duration-300 ease-out"
      >
        {/* Apple Grabber Handle */}
        <div className="mx-auto mt-2.5 mb-1 h-1 w-9 rounded-full bg-slate-300 select-none" />

        {/* Navigation Bar */}
        <header className="flex items-center justify-between px-5 py-2 border-b border-slate-200/60 bg-[#F2F2F7]">
          <h2 className="text-xs sm:text-sm font-normal text-slate-900">
            {isBreached ? "Laporan Insiden Siber" : "Laporan Ketahanan Siber"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-full bg-slate-200/80 text-slate-600 hover:bg-slate-300 transition-colors"
            aria-label="Tutup lembar laporan untuk melihat chat"
            title="Tutup / Lihat Riwayat Chat"
          >
            <Icon icon="solar:close-circle-linear" className="h-4.5 w-4.5" />
          </button>
        </header>

        {/* Content Scroll View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {/* 1. Hero Status Row */}
          <div className="flex items-center gap-3.5 rounded-2xl bg-white p-4 shadow-2xs">
            <div
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${
                isBreached
                  ? "bg-[#FF3B30]/10 text-[#FF3B30]"
                  : "bg-[#34C759]/10 text-[#34C759]"
              }`}
            >
              <Icon
                icon={
                  isBreached
                    ? "solar:danger-triangle-linear"
                    : "solar:check-circle-linear"
                }
                className="h-6 w-6"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-xs sm:text-sm font-normal text-slate-900 leading-snug">
                {isBreached
                  ? "Akun Terbobol & Saldo Terkuras"
                  : "Pertahanan Sempurna (100% Imun)"}
              </h3>
              <p className="mt-0.5 text-[11px] font-normal text-slate-500 leading-tight">
                {isBreached
                  ? `${scenario.breachOutcome.drainAmount} dialihkan melalui rekayasa sosial`
                  : `${scenario.threatTarget} berhasil ditangkal tanpa kebocoran data`}
              </p>
            </div>
          </div>

          {/* 2. Apple Segmented Control */}
          <div className="flex gap-1 rounded-xl bg-[#E3E3E8] p-1 select-none">
            <button
              type="button"
              onClick={() => setActiveTab("chronology")}
              className={`flex-1 rounded-lg py-1.5 px-3 text-xs font-normal transition-all text-center ${
                activeTab === "chronology"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Kronologi &amp; Rekayasa Sosial
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("forensics")}
              className={`flex-1 rounded-lg py-1.5 px-3 text-xs font-normal transition-all text-center ${
                activeTab === "forensics"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {scenario.id === "tarif-bank-phishing"
                ? "Analisis Forensik Phishing Web"
                : "Analisis Forensik APK"}
            </button>
          </div>

          {/* 3. Inset Grouped List (Clean iOS Table Rows) */}
          {activeTab === "chronology" ? (
            <div className="overflow-hidden rounded-2xl bg-white shadow-2xs divide-y divide-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 p-3.5 text-xs font-normal">
                <span className="text-slate-500 shrink-0 sm:w-44">
                  Taktik Rekayasa Sosial
                </span>
                <span className="text-slate-900 sm:text-right leading-relaxed">
                  {scenario.id === "tarif-bank-phishing"
                    ? "Mengaku sebagai Customer Service resmi BCA Priority (Pretexting)"
                    : "Pura-pura menjadi kurir ekspedisi berdalih resi basah (Pretexting)"}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 p-3.5 text-xs font-normal">
                <span className="text-slate-500 shrink-0 sm:w-44">
                  Manipulasi Urgensi
                </span>
                <span className="text-slate-900 sm:text-right leading-relaxed">
                  {forensics.psychologicalPressure}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 p-3.5 text-xs font-normal">
                <span className="text-slate-500 shrink-0 sm:w-44">
                  Titik Evaluasi Keputusan
                </span>
                <span
                  className={`sm:text-right leading-relaxed ${
                    isBreached ? "text-[#FF3B30]" : "text-[#34C759]"
                  }`}
                >
                  {isBreached
                    ? forensics.decisionPointBreached
                    : forensics.decisionPointSafe}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 p-3.5 text-xs font-normal">
                <span className="text-slate-500 shrink-0 sm:w-44">
                  Prosedur Resmi Instansi
                </span>
                <span className="text-slate-900 sm:text-right leading-relaxed">
                  {forensics.officialProcedure}
                </span>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl bg-white shadow-2xs divide-y divide-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 p-3.5 text-xs font-normal">
                <span className="text-slate-500 shrink-0 sm:w-44">
                  {forensics.targetLabel}
                </span>
                <span className="font-mono text-slate-900 sm:text-right">
                  {forensics.targetValue}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 p-3.5 text-xs font-normal">
                <span className="text-slate-500 shrink-0 sm:w-44">
                  Klasifikasi Ancaman
                </span>
                <span className="text-[#FF3B30] sm:text-right leading-relaxed">
                  {forensics.threatClassification}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 p-3.5 text-xs font-normal">
                <span className="text-slate-500 shrink-0 sm:w-44">
                  {forensics.indicatorLabel}
                </span>
                <span className="font-mono text-[11px] text-slate-700 sm:text-right leading-relaxed">
                  {forensics.indicatorValue}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 p-3.5 text-xs font-normal">
                <span className="text-slate-500 shrink-0 sm:w-44">
                  Dampak Penyerangan
                </span>
                <span className="text-slate-900 sm:text-right leading-relaxed">
                  {forensics.attackImpact}
                </span>
              </div>
            </div>
          )}

          {/* 4. Apple Style Action Dock */}
          <div className="space-y-2 pt-1">
            <Link
              href="/community/phone"
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#007AFF] py-2.5 px-4 text-xs font-normal text-white transition-colors hover:bg-[#0066D6] shadow-2xs"
            >
              <span>Laporkan Nomor ke Komunitas ({scenario.personaPhone})</span>
            </Link>

            <div className="grid grid-cols-2 gap-2">
              <Link
                href={`/recognize/phone/${scenario.personaPhone.replace(/[^0-9]/g, "")}`}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-white border border-slate-200 py-2.5 px-3 text-xs font-normal text-slate-700 hover:bg-slate-50 transition-colors text-center"
              >
                <span>Cek di Scanner</span>
              </Link>

              <button
                type="button"
                onClick={onRetry}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-200/80 py-2.5 px-3 text-xs font-normal text-slate-800 hover:bg-slate-300 transition-colors"
              >
                <span>Ulangi Simulasi</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full text-center text-xs font-normal text-slate-400 hover:text-slate-600 transition-colors py-1"
            >
              Tutup &amp; Tinjau Percakapan Chat
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
