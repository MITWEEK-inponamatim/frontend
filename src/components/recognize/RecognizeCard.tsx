"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { useScanner, type ScanTab } from "@/hooks/useScanner";
import { ScanResultPanel } from "@/components/recognize/ScanResultPanel";
import { rememberPhoneResult } from "@/lib/phoneHandoff";
import { phoneInputProblem, phoneSlug } from "@/lib/phone";

const tabs: { id: ScanTab; label: string; icon: string }[] = [
  { id: "url", label: "Tautan", icon: "solar:link-circle-bold-duotone" },
  { id: "phone", label: "Telepon", icon: "solar:phone-bold-duotone" },
  { id: "application", label: "Berkas APK", icon: "solar:document-bold-duotone" },
];

const MAX_APK_MB = 50;

export function RecognizeCard() {
  const scan = useScanner();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [searchProblem, setSearchProblem] = useState("");
  const awaitingPhone = useRef(false);

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
  // A number is searched here and answered at its own address, so the result can be shared,
  // bookmarked, and reached again without re-typing. The wait stays on this page: the verdict is
  // scanned now, and the address only changes once there is something to show at it.
  const searchNumber = (event: React.FormEvent) => {
    event.preventDefault();
    const problem = phoneInputProblem(scan.number);
    setSearchProblem(problem);
    if (problem || scan.isScanning) return;
    awaitingPhone.current = true;
    scan.startPhoneScan(scan.number);
  };

  // A ref, not state: this only decides whether an incoming scan result means "leave now", and
  // putting it in state would make the effect itself the thing that changes what it reads.
  useEffect(() => {
    if (!awaitingPhone.current) return;
    if (scan.errorMessage) {
      awaitingPhone.current = false;
      return;
    }
    if (!scan.result) return;
    const slug = phoneSlug(scan.number);
    rememberPhoneResult(slug, scan.result);
    awaitingPhone.current = false;
    router.push(`/recognize/phone/${slug}`);
  }, [scan.errorMessage, scan.result, scan.number, router]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center">
      <div className="mb-3 flex flex-wrap items-center justify-center gap-2 sm:mb-4">
        {tabs.map((tab) => (
          <button key={tab.id} type="button" onClick={() => switchTab(tab.id)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs transition-all ${scan.activeTab === tab.id ? "border-slate-900 bg-slate-900 font-medium text-white shadow-sm" : "border-gray-200/90 bg-white font-normal text-slate-600 hover:border-gray-300 hover:text-slate-900"}`}>
            <Icon icon={tab.icon} className="h-3.5 w-3.5 opacity-80" /><span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="relative w-full rounded-2xl border border-gray-200/90 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:rounded-3xl sm:p-5">
        {scan.activeTab === "phone" ? (
          <form onSubmit={searchNumber} className="flex min-h-[110px] flex-col justify-between">
            <div className="flex w-full gap-2 py-2">
              <span aria-hidden="true" className="flex items-center rounded-xl border border-gray-200 bg-slate-50 px-3 text-sm font-medium text-slate-600">+62</span>
              <input type="tel" aria-label="Nomor telepon Indonesia" value={scan.number} disabled={scan.isScanning}
                onChange={(event) => { scan.setNumber(event.target.value); setSearchProblem(""); }}
                placeholder="08xx xxxx xxxx" className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-transparent px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20" />
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">Hasil pemeriksaan nomor tampil di halaman sendiri, lengkap dengan laporan warga dan bukti gambarnya.</p>
            {(searchProblem || scan.errorMessage) && <p role="alert" className="py-1 text-left text-xs font-normal text-red-600">{searchProblem || scan.errorMessage}</p>}
            {scan.isScanning && <div aria-live="polite" className="flex items-center gap-2 py-1 text-xs font-normal text-slate-600"><Icon icon="solar:restart-bold-duotone" className="h-3.5 w-3.5 animate-spin text-red-600" /><span>{scan.scanStep || "Memeriksa nomor..."}</span></div>}
            <div className="mt-1 flex items-center justify-between border-t border-gray-100 pt-3">
              <div className="flex items-center gap-1">{tabs.map((tab) => <button key={tab.id} type="button" title={tab.label} aria-label={tab.label} onClick={() => switchTab(tab.id)} className={`rounded-full p-2 transition-colors ${scan.activeTab === tab.id ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"}`}><Icon icon={tab.icon} className="h-4 w-4" /></button>)}</div>
              <button type="submit" disabled={scan.isScanning} aria-label="Cari nomor" className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-slate-900/20 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 sm:h-10 sm:w-10">{scan.isScanning ? <Icon icon="solar:restart-bold-duotone" className="h-4 w-4 animate-spin" /> : <Icon icon="solar:magnifer-linear" className="h-5 w-5" />}</button>
            </div>
          </form>
        ) : scan.result ? (
          <ScanResultPanel result={scan.result} resetLabel="Periksa data baru" onReset={scan.resetScan} />
        ) : (
          <div className="flex min-h-[110px] flex-col justify-between">
            {scan.activeTab === "url" && <div className="w-full">
              <textarea rows={3} aria-label="Tautan" value={scan.input} onChange={(event) => scan.setInput(event.target.value)} disabled={scan.isScanning}
                placeholder="Tempel tautan yang ingin diperiksa..."
                className="w-full resize-none border-0 bg-transparent text-sm font-normal leading-relaxed text-slate-900 placeholder:text-slate-400 focus:outline-none sm:text-base" />
            </div>}

            {scan.activeTab === "application" && <div className="w-full py-2">
              <input ref={fileRef} type="file" accept=".apk,application/vnd.android.package-archive" className="hidden" onChange={(event) => selectFile(event.target.files?.[0] ?? null)} />
              {!scan.file ? <div role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") fileRef.current?.click(); }} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); selectFile(event.dataTransfer.files?.[0] ?? null); }} onClick={() => fileRef.current?.click()} className={`cursor-pointer rounded-2xl border border-dashed p-6 text-center transition-all ${dragging ? "border-red-500 bg-red-50/40" : "border-gray-200 bg-slate-50/40 hover:border-gray-300 hover:bg-slate-50/80"}`}>
                <Icon icon="solar:upload-track-2-bold-duotone" className="mx-auto mb-2 h-7 w-7 text-slate-400" /><p className="text-xs font-normal text-slate-700 sm:text-sm">Pilih atau seret berkas APK ke sini</p><p className="mt-0.5 text-[11px] text-slate-400">APK · maks. {MAX_APK_MB} MB</p>
              </div> : <div className="flex items-center justify-between rounded-2xl border border-gray-200/80 bg-slate-50 p-3">
                <div className="flex min-w-0 items-center gap-3"><Icon icon="solar:document-bold-duotone" className="h-8 w-8 shrink-0 text-slate-500" /><div className="min-w-0"><p className="truncate text-xs text-slate-900 sm:text-sm">{scan.file.name}</p><p className="text-[11px] text-slate-400">{(scan.file.size / 1048576).toFixed(2)} MB</p></div></div>
                <button type="button" onClick={() => selectFile(null)} aria-label="Hapus berkas" className="rounded-lg p-1.5 text-slate-400 hover:text-red-600"><Icon icon="solar:trash-bin-trash-bold-duotone" className="h-4 w-4" /></button>
              </div>}
              <label className="mt-3 flex items-start gap-2 text-xs text-slate-600"><input type="checkbox" checked={scan.consent} onChange={(event) => scan.setConsent(event.target.checked)} className="mt-0.5" />Setuju mengirim sampel APK ke layanan pemindai eksternal (VirusTotal) untuk analisis tambahan. Tanpa persetujuan, hanya hash berkas yang diperiksa.</label>
            </div>}

            {scan.errorMessage && <p role="alert" className="py-1 text-left text-xs font-normal text-red-600">{scan.errorMessage}</p>}
            {scan.isScanning && <div aria-live="polite" className="flex items-center gap-2 py-2 text-xs font-normal text-slate-600"><Icon icon="solar:restart-bold-duotone" className="h-3.5 w-3.5 animate-spin text-red-600" /><span>{scan.scanStep}</span></div>}
            <div className="mt-1 flex items-center justify-between border-t border-gray-100 pt-3">
              <div className="flex items-center gap-1">{tabs.map((tab) => <button key={tab.id} type="button" title={tab.label} aria-label={tab.label} onClick={() => switchTab(tab.id)} className={`rounded-full p-2 transition-colors ${scan.activeTab === tab.id ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"}`}><Icon icon={tab.icon} className="h-4 w-4" /></button>)}</div>
              <button type="button" onClick={scan.runScan} disabled={scan.isScanning} aria-label="Pindai data" className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-slate-900/20 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 sm:h-10 sm:w-10">{scan.isScanning ? <Icon icon="solar:restart-bold-duotone" className="h-4 w-4 animate-spin" /> : <Icon icon="solar:arrow-up-linear" className="h-5 w-5 stroke-[2.5]" />}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
