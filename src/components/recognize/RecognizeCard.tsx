"use client";

import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ErrorToast } from "@/components/ui/Toast";
import { useScanner, type ScanTab } from "@/hooks/useScanner";
import { ScanResultPanel } from "@/components/recognize/ScanResultPanel";
import { PhoneReportForm } from "@/components/recognize/PhoneReportForm";
import { rememberPhoneResult } from "@/lib/phoneHandoff";
import { canonicalPhone, formatDisplayPhone, phoneInputProblem, phoneSlug } from "@/lib/phone";

const TABS: { id: ScanTab; label: string; icon: string; subtitle: string }[] = [
  {
    id: "url",
    label: "Tautan URL",
    icon: "solar:link-circle-bold-duotone",
    subtitle: "Analisis phishing & redirect",
  },
  {
    id: "application",
    label: "Berkas APK",
    icon: "solar:document-bold-duotone",
    subtitle: "Dekomplikasi & izin Android",
  },
  {
    id: "phone",
    label: "Nomor Telepon",
    icon: "solar:phone-bold-duotone",
    subtitle: "Reputasi & laporan warga",
  },
];

const MAX_APK_MB = 50;

/**
 * Reconstructed Apple HIG Scanner Hub Component:
 * Clean, minimal interface for scanning suspicious URLs, Android APK packages,
 * and Indonesian phone numbers with inline results (Option A: zero jarring page redirect),
 * seamless shallow permalink URL synchronization, drag-and-drop feedback, byte counters,
 * and progressive analysis telemetry states.
 */
export function RecognizeCard() {
  const scan = useScanner();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [searchProblem, setSearchProblem] = useState("");

  const switchTab = (tab: ScanTab) => {
    if (scan.isScanning) return;
    scan.setActiveTab(tab);
    scan.resetScan();
    setSearchProblem("");
  };

  const selectFile = (file: File | null) => {
    if (file && file.size > MAX_APK_MB * 1048576) {
      scan.setFile(null);
      return;
    }
    scan.setFile(file);
  };

  const searchNumber = (event: React.FormEvent) => {
    event.preventDefault();
    const problem = phoneInputProblem(scan.number);
    setSearchProblem(problem);
    if (problem || scan.isScanning) return;
    scan.startPhoneScan(scan.number);
  };

  // Sync address bar shallowly without trigger page unmount/remount
  useEffect(() => {
    if (!scan.result) return;
    if (typeof window !== "undefined") {
      if (scan.activeTab === "phone" && scan.number) {
        const slug = phoneSlug(scan.number);
        rememberPhoneResult(slug, scan.result);
        window.history.replaceState(null, "", `/recognize/phone/${slug}`);
      } else if (scan.activeTab === "url" && scan.completedScanId) {
        window.history.replaceState(null, "", `/recognize/url/${scan.completedScanId}`);
      } else if (scan.activeTab === "application" && scan.completedScanId) {
        window.history.replaceState(null, "", `/recognize/apk/${scan.completedScanId}`);
      }
    }
  }, [scan.result, scan.activeTab, scan.number, scan.completedScanId]);

  const handleReset = () => {
    scan.resetScan();
    setSearchProblem("");
    if (typeof window !== "undefined" && window.location.pathname !== "/recognize") {
      window.history.replaceState(null, "", "/recognize");
    }
  };

  const isShowingResult = Boolean(scan.result && !scan.isScanning);

  return (
    <div
      className={`mx-auto flex w-full flex-col items-center space-y-4 transition-all duration-200 ${
        isShowingResult ? "max-w-3xl lg:max-w-4xl" : "max-w-2xl"
      }`}
    >
      {/* 1. Header before card when showing result */}
      {isShowingResult ? (
        <div className="w-full space-y-3 px-1">
          <div className="flex items-center justify-between text-xs font-normal text-slate-500">
            <span>
              Laporan hasil pemindaian ({TABS.find((t) => t.id === scan.activeTab)?.label ?? "Analisis"})
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-normal text-slate-600 hover:text-slate-900 transition-colors"
            >
              ← Periksa target lain
            </button>
          </div>

          <div className="flex items-start gap-3.5 pt-1">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-900 text-white shadow-2xs">
              <Icon
                icon={
                  scan.activeTab === "phone"
                    ? "solar:phone-bold-duotone"
                    : scan.activeTab === "url"
                      ? "solar:link-bold-duotone"
                      : "solar:shield-warning-bold-duotone"
                }
                className="h-5 w-5"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="break-all text-xl sm:text-2xl font-normal text-slate-900 font-mono tracking-tight leading-snug">
                {scan.activeTab === "phone"
                  ? (scan.number ? (formatDisplayPhone(scan.number) || canonicalPhone(scan.number)) : "Nomor telepon")
                  : scan.activeTab === "url"
                    ? (scan.input || "Tautan URL")
                    : (scan.file?.name || "Berkas APK")}
              </div>
              <p className="text-xs font-normal text-slate-400 mt-0.5">
                {scan.activeTab === "phone"
                  ? `Nomor Indonesia · Format E.164: +${canonicalPhone(scan.number).replace(/[^0-9]/g, "")}`
                  : scan.activeTab === "url"
                    ? "Pemeriksaan tautan situs"
                    : "Pemeriksaan berkas aplikasi Android"}
              </p>
            </div>
          </div>

          <div className="pt-1 text-left">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight text-left">
              Hasil evaluasi risiko
            </h2>
          </div>
        </div>
      ) : (
        /* Segmented control when searching */
        <div className="inline-flex p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-2xs">
          {TABS.map((tab) => {
            const isActive = scan.activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => switchTab(tab.id)}
                disabled={scan.isScanning}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-normal transition-all ${
                  isActive
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                <Icon
                  icon={tab.icon}
                  className={`h-4 w-4 ${isActive ? "text-[#007AFF]" : "text-slate-400"}`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* 2. Main Inset Grouped Scanning Container */}
      <div className="w-full rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs transition-all">
        {scan.result ? (
          /* Option A: Inline Result Panel directly in-place */
          <ScanResultPanel
            result={scan.result}
            resetLabel="Periksa data baru"
            onReset={handleReset}
            footer={
              scan.activeTab === "phone" && scan.number && canonicalPhone(scan.number) ? (
                <PhoneReportForm number={canonicalPhone(scan.number)} />
              ) : undefined
            }
          />
        ) : scan.activeTab === "phone" ? (
          /* Phone Search Tab */
          <form onSubmit={searchNumber} className="flex min-h-[140px] flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-normal text-slate-500">
                <span>Masukkan nomor telepon Indonesia:</span>
                <span className="text-[11px] text-slate-400">Format E.164 (+62)</span>
              </div>
              <div className="flex w-full gap-2">
                <span
                  aria-hidden="true"
                  className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-normal text-slate-600 font-mono"
                >
                  +62
                </span>
                <input
                  type="tel"
                  aria-label="Nomor telepon Indonesia"
                  value={scan.number}
                  disabled={scan.isScanning}
                  onChange={(event) => {
                    scan.setNumber(event.target.value);
                    setSearchProblem("");
                  }}
                  placeholder="812 3456 7890"
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-transparent px-3.5 py-2.5 text-sm font-normal text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/15 font-mono"
                />
              </div>
              <p className="text-[11px] font-normal leading-relaxed text-slate-400">
                Pemeriksaan nomor mencakup riwayat nomor penipuan, laporan warga terverifikasi, dan telemetri rekayasa sosial.
              </p>
            </div>

            {(searchProblem || scan.errorMessage) && (
              <ErrorToast
                title="Pemeriksaan tidak dapat diproses"
                description={searchProblem || scan.errorMessage || ""}
              />
            )}

            {scan.isScanning && (
              <div
                aria-live="polite"
                className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-xs font-normal text-slate-600"
              >
                <Icon icon="solar:restart-bold-duotone" className="h-4 w-4 animate-spin text-[#007AFF]" />
                <div className="min-w-0 flex-1">
                  <p className="text-slate-900">{scan.scanStep || "Memeriksa basis data intelijen penipuan..."}</p>
                  <p className="text-[10px] text-slate-400">Menghubungkan ke layanan verifikasi telepon</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-slate-100 pt-3.5">
              <span className="text-[11px] font-normal text-slate-400">
                Hasil langsung tampil di tempat secara instan
              </span>
              <button
                type="submit"
                disabled={scan.isScanning || !scan.number.trim()}
                aria-label="Cari nomor"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-normal text-white transition-all hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 active:scale-95 shadow-2xs"
              >
                {scan.isScanning ? (
                  <>
                    <Icon icon="solar:restart-bold-duotone" className="h-4 w-4 animate-spin" />
                    <span>Memeriksa...</span>
                  </>
                ) : (
                  <>
                    <Icon icon="solar:magnifer-linear" className="h-4 w-4" />
                    <span>Periksa nomor</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* URL or APK Scan Tab */
          <div className="flex min-h-[140px] flex-col justify-between space-y-4">
            {scan.activeTab === "url" && (
              <div className="space-y-2">
                <div className="text-xs font-normal text-slate-500">
                  <span>Alamat URL situs yang ingin diperiksa:</span>
                </div>
                <textarea
                  rows={3}
                  aria-label="Tautan URL"
                  value={scan.input}
                  onChange={(event) => scan.setInput(event.target.value)}
                  disabled={scan.isScanning}
                  placeholder="Tempel tautan lengkap yang mencurigakan (contoh: https://undian-kupon-belanja.xyz/klaim)..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/30 p-3 text-xs sm:text-sm font-normal text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/15 focus:bg-white transition-all"
                />
                <p className="text-[11px] font-normal leading-relaxed text-slate-400">
                  Sistem akan mendokumentasikan rantai pengalihan, memeriksa form pencuri data, dan mengambil bukti tangkapan layar secara aman.
                </p>
              </div>
            )}

            {scan.activeTab === "application" && (
              <div className="space-y-3">
                <div className="text-xs font-normal text-slate-500">
                  <span>Unggah paket berkas Android (.apk):</span>
                </div>

                <input
                  ref={fileRef}
                  type="file"
                  accept=".apk,application/vnd.android.package-archive"
                  className="hidden"
                  onChange={(event) => selectFile(event.target.files?.[0] ?? null)}
                />

                {!scan.file ? (
                  <div
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") fileRef.current?.click();
                    }}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(event) => {
                      event.preventDefault();
                      setDragging(false);
                      selectFile(event.dataTransfer.files?.[0] ?? null);
                    }}
                    onClick={() => fileRef.current?.click()}
                    className={`cursor-pointer rounded-2xl border border-dashed p-6 text-center transition-all ${
                      dragging
                        ? "border-[#007AFF] bg-blue-50/40 text-blue-900"
                        : "border-slate-200/90 bg-slate-50/40 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="mx-auto mb-2.5 grid h-10 w-10 place-items-center rounded-2xl bg-white border border-slate-200/70 text-slate-500 shadow-2xs">
                      <Icon icon="solar:upload-track-2-bold-duotone" className="h-5 w-5 text-slate-600" />
                    </div>
                    <p className="text-xs sm:text-sm font-normal text-slate-800">
                      Pilih atau seret berkas APK Android ke sini
                    </p>
                    <p className="mt-1 text-[11px] font-normal text-slate-400">
                      Format <span className="font-mono">.apk</span> · Ukuran maksimum {MAX_APK_MB} MB
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 shadow-2xs">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white border border-slate-200 text-slate-600">
                        <Icon icon="solar:document-bold-duotone" className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs sm:text-sm font-normal text-slate-900 font-mono">
                          {scan.file.name}
                        </p>
                        <p className="text-[11px] font-normal text-slate-400">
                          {(scan.file.size / 1048576).toFixed(2)} MB / {MAX_APK_MB} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => selectFile(null)}
                      aria-label="Hapus berkas"
                      className="rounded-xl p-2 text-slate-400 hover:text-[#FF3B30] hover:bg-red-50/50 transition-colors"
                    >
                      <Icon icon="solar:trash-bin-trash-bold-duotone" className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Consent checkbox */}
                <label className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/50 p-2.5 text-[11px] font-normal leading-relaxed text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={scan.consent}
                    onChange={(event) => scan.setConsent(event.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-0"
                  />
                  <span>
                    Setuju memverifikasi hash berkas ke basis data intelijen ancaman global untuk analisis tambahan. Tanpa persetujuan, berkas hanya dianalisis secara lokal di server ThreatLens.
                  </span>
                </label>
              </div>
            )}

            {(searchProblem || scan.errorMessage) && (
              <ErrorToast
                title="Pemeriksaan tidak dapat diproses"
                description={searchProblem || scan.errorMessage || ""}
              />
            )}

            {scan.isScanning && (
              <div
                aria-live="polite"
                className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-xs font-normal text-slate-600"
              >
                <Icon icon="solar:restart-bold-duotone" className="h-4 w-4 animate-spin text-[#007AFF]" />
                <div className="min-w-0 flex-1">
                  <p className="text-slate-900">{scan.scanStep || "Menganalisis indikator forensik..."}</p>
                  <p className="text-[10px] text-slate-400">Proses pemindaian berjalan secara aman</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end border-t border-slate-100 pt-3.5">

              <button
                type="button"
                onClick={scan.runScan}
                disabled={
                  scan.isScanning ||
                  (scan.activeTab === "url" && !scan.input.trim()) ||
                  (scan.activeTab === "application" && !scan.file)
                }
                aria-label="Mulai pemindaian"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-normal text-white transition-all hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 active:scale-95 shadow-2xs"
              >
                {scan.isScanning ? (
                  <>
                    <Icon icon="solar:restart-bold-duotone" className="h-4 w-4 animate-spin" />
                    <span>Menganalisis...</span>
                  </>
                ) : (
                  <>
                    <Icon icon="solar:shield-check-linear" className="h-4 w-4" />
                    <span>
                      {scan.activeTab === "url" ? "Pindai tautan" : "Pindai berkas APK"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
