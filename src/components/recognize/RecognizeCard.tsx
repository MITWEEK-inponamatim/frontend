"use client";

import React, { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { useScanner, type ScanTab } from "@/hooks/useScanner";
import { PhoneReportForm } from "@/components/recognize/PhoneReportForm";

const tabs: { id: ScanTab; label: string; icon: string }[] = [
  { id: "url", label: "Tautan", icon: "solar:link-circle-bold-duotone" },
  { id: "message", label: "Pesan", icon: "solar:chat-round-line-bold-duotone" },
  { id: "phone", label: "Telepon", icon: "solar:phone-bold-duotone" },
  { id: "application", label: "Berkas APK", icon: "solar:document-bold-duotone" },
  { id: "image", label: "Tangkapan Layar", icon: "solar:gallery-wide-bold-duotone" },
];

export function RecognizeCard() {
  const scan = useScanner();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState("");
  const tone = scan.result?.risk?.level === "high" ? "red" : scan.result?.risk?.level === "medium" ? "amber" : "slate";

  const switchTab = (tab: ScanTab) => {
    if (scan.isScanning) return;
    scan.setActiveTab(tab);
    scan.resetScan();
  };
  const selectFile = (file: File | null) => {
    if (preview) URL.revokeObjectURL(preview);
    if (file && file.size > (scan.activeTab === "image" ? 15 : 50) * 1048576) {
      scan.setFile(null);
      setPreview("");
      return;
    }
    scan.setFile(file);
    setPreview(file && file.type.startsWith("image/") ? URL.createObjectURL(file) : "");
  };

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

      <div className="relative w-full rounded-2xl border border-gray-200/90 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:rounded-3xl sm:p-5">
        {scan.result ? (
          <div className="animate-in fade-in duration-150">
            <div className={`rounded-2xl border p-4 sm:p-5 ${tone === "red" ? "border-red-200 bg-red-50/50 text-red-950" : tone === "amber" ? "border-amber-200 bg-amber-50/50 text-amber-950" : "border-slate-200 bg-slate-50/70 text-slate-950"}`}>
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className={`rounded-xl p-2 text-white ${tone === "red" ? "bg-red-600" : tone === "amber" ? "bg-amber-600" : "bg-slate-700"}`}>
                    <Icon icon={tone === "red" ? "solar:shield-warning-bold-duotone" : tone === "amber" ? "solar:danger-triangle-bold-duotone" : "solar:shield-check-bold-duotone"} className="h-5 w-5" />
                  </span>
                  <div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${tone === "red" ? "bg-red-200/70 text-red-800" : tone === "amber" ? "bg-amber-200/70 text-amber-800" : "bg-slate-200 text-slate-700"}`}>
                      {scan.result.outcome === "confirmed_threat" ? "Ancaman terkonfirmasi" : scan.result.outcome === "suspicious" ? "Mencurigakan" : scan.result.outcome === "scan_failed" ? "Scan gagal" : "Bukti belum cukup"}
                    </span>
                    <h4 className="mt-1 text-base font-normal text-slate-900">Risiko {scan.result.risk?.level ?? "unknown"}</h4>
                  </div>
                </div>
                <div className="text-right"><span className="block text-[11px] text-slate-500">Confidence</span><span className="text-sm text-slate-700">{scan.result.risk?.confidence ?? "low"}</span></div>
              </div>
              <p className="mb-3 text-xs font-normal leading-relaxed text-slate-700 sm:text-sm">{scan.result.evidence_summary}</p>
              {!!scan.result.findings?.length && <div className="mb-3 space-y-1.5 rounded-xl border border-gray-100 bg-white/90 p-3">
                <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-400">Indikator temuan</span>
                {scan.result.findings.map((finding) => <div key={finding.id} className="flex items-start gap-2 text-xs text-slate-700"><Icon icon="solar:check-circle-bold" className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${tone === "red" ? "text-red-500" : tone === "amber" ? "text-amber-500" : "text-slate-500"}`} /><span>{finding.indicator}</span></div>)}
              </div>}
              {scan.result.recommended_actions?.length > 0 && <div className="flex items-start gap-2 rounded-xl bg-slate-900 p-3 text-xs font-normal text-slate-100"><Icon icon="solar:info-circle-bold-duotone" className="mt-0.5 h-4 w-4 shrink-0 text-red-400"/><div><span className="font-medium text-white">Langkah disarankan: </span><span className="text-slate-300">{scan.result.recommended_actions.join(" ")}</span></div></div>}
              {!!scan.result.limitations?.length && <p className="mt-3 text-xs text-slate-500">Keterbatasan: {scan.result.limitations.join(" ")}</p>}
              {scan.activeTab === "phone" && !!scan.number.trim() && <PhoneReportForm number={scan.number} region={scan.region} />}
              {scan.result.error && <p role="alert" className="mt-3 text-xs text-red-700">{scan.result.error.code}: {scan.result.error.message}</p>}
              {scan.result.risk?.coverage?.summary && <p className="mt-2 text-[11px] text-slate-500">Cakupan: {scan.result.risk.coverage.summary}</p>}
            </div>
            <button type="button" onClick={scan.resetScan} className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-normal text-slate-700 transition-colors hover:bg-slate-50 sm:text-sm"><Icon icon="solar:restart-bold-duotone" className="h-4 w-4"/><span>Periksa data baru</span></button>
          </div>
        ) : (
          <div className="flex min-h-[110px] flex-col justify-between">
            {(scan.activeTab === "url" || scan.activeTab === "message") && <div className="w-full">
              <textarea rows={3} aria-label={scan.activeTab === "url" ? "Tautan" : "Pesan"} value={scan.input} onChange={(event) => scan.setInput(event.target.value)} disabled={scan.isScanning}
                placeholder={scan.activeTab === "url" ? "Tempel tautan yang ingin diperiksa..." : "Tempel pesan mencurigakan yang ingin diperiksa..."}
                className="w-full resize-none border-0 bg-transparent text-sm font-normal leading-relaxed text-slate-900 placeholder:text-slate-400 focus:outline-none sm:text-base" />
              {scan.activeTab === "message" && <div className="mb-2 mt-1 flex flex-wrap items-center gap-1.5"><span className="text-[11px] text-slate-400">Contoh:</span><button type="button" onClick={() => scan.setInput("Peringatan: Akun bank Anda dibatasi. Verifikasi di http://bit.ly/bank-update-id")} className="rounded-full border border-gray-200/80 bg-slate-50 px-2.5 py-0.5 text-[11px] text-slate-600 hover:bg-slate-100">SMS phishing</button><button type="button" onClick={() => scan.setInput("Selamat! Anda mendapatkan hadiah dana 10jt. Segera kirim kode OTP.")} className="rounded-full border border-gray-200/80 bg-slate-50 px-2.5 py-0.5 text-[11px] text-slate-600 hover:bg-slate-100">Pesan undian</button></div>}
            </div>}

            {scan.activeTab === "phone" && <div className="flex w-full gap-2 py-2">
              <select aria-label="Kode negara" value={scan.region} onChange={(event) => scan.setRegion(event.target.value)} className="rounded-xl border border-gray-200 bg-slate-50 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/20"><option value="ID">ID +62</option><option value="MY">MY +60</option><option value="SG">SG +65</option><option value="US">US +1</option><option value="GB">GB +44</option></select>
              <input type="tel" aria-label="Nomor telepon" value={scan.number} onChange={(event) => scan.setNumber(event.target.value)} placeholder="Nomor telepon" className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-transparent px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20" />
            </div>}

            {(scan.activeTab === "application" || scan.activeTab === "image") && <div className="w-full py-2">
              <input ref={fileRef} type="file" accept={scan.activeTab === "application" ? ".apk,application/vnd.android.package-archive" : "image/png,image/jpeg,image/webp"} className="hidden" onChange={(event) => selectFile(event.target.files?.[0] ?? null)} />
              {!scan.file ? <div role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") fileRef.current?.click(); }} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); selectFile(event.dataTransfer.files?.[0] ?? null); }} onClick={() => fileRef.current?.click()} className={`cursor-pointer rounded-2xl border border-dashed p-6 text-center transition-all ${dragging ? "border-red-500 bg-red-50/40" : "border-gray-200 bg-slate-50/40 hover:border-gray-300 hover:bg-slate-50/80"}`}>
                <Icon icon={scan.activeTab === "image" ? "solar:gallery-wide-bold-duotone" : "solar:upload-track-2-bold-duotone"} className="mx-auto mb-2 h-7 w-7 text-slate-400"/><p className="text-xs font-normal text-slate-700 sm:text-sm">Pilih atau seret {scan.activeTab === "image" ? "tangkapan layar" : "berkas APK"} ke sini</p><p className="mt-0.5 text-[11px] text-slate-400">{scan.activeTab === "image" ? "PNG, JPG, WEBP · maks. 15 MB" : "APK · maks. 50 MB"}</p>
              </div> : <div className="flex items-center justify-between rounded-2xl border border-gray-200/80 bg-slate-50 p-3">
                <div className="flex min-w-0 items-center gap-3">{preview ? <div role="img" aria-label="Pratinjau gambar" style={{ backgroundImage: `url(${preview})` }} className="h-10 w-10 rounded-xl border border-gray-200 bg-cover bg-center"/> : <Icon icon="solar:document-bold-duotone" className="h-8 w-8 shrink-0 text-slate-500"/>}<div className="min-w-0"><p className="truncate text-xs text-slate-900 sm:text-sm">{scan.file.name}</p><p className="text-[11px] text-slate-400">{(scan.file.size / 1048576).toFixed(2)} MB</p></div></div>
                <button type="button" onClick={() => selectFile(null)} aria-label="Hapus berkas" className="rounded-lg p-1.5 text-slate-400 hover:text-red-600"><Icon icon="solar:trash-bin-trash-bold-duotone" className="h-4 w-4"/></button>
              </div>}
              {scan.activeTab === "application" && <label className="mt-3 flex items-start gap-2 text-xs text-slate-600"><input type="checkbox" checked={scan.consent} onChange={(event) => scan.setConsent(event.target.checked)} className="mt-0.5"/>Setuju mengirim sampel APK ke layanan pemindai eksternal (VirusTotal) untuk analisis tambahan. Tanpa persetujuan, hanya hash berkas yang diperiksa.</label>}
            </div>}

            {scan.errorMessage && <p role="alert" className="py-1 text-left text-xs font-normal text-red-600">{scan.errorMessage}</p>}
            {scan.isScanning && <div aria-live="polite" className="flex items-center gap-2 py-2 text-xs font-normal text-slate-600"><Icon icon="solar:restart-bold-duotone" className="h-3.5 w-3.5 animate-spin text-red-600"/><span>{scan.scanStep}</span></div>}
            <div className="mt-1 flex items-center justify-between border-t border-gray-100 pt-3">
              <div className="flex items-center gap-1">{tabs.map((tab) => <button key={tab.id} type="button" title={tab.label} aria-label={tab.label} onClick={() => switchTab(tab.id)} className={`rounded-full p-2 transition-colors ${scan.activeTab === tab.id ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"}`}><Icon icon={tab.icon} className="h-4 w-4"/></button>)}</div>
              <button type="button" onClick={scan.runScan} disabled={scan.isScanning} aria-label="Pindai data" className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-slate-900/20 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 sm:h-10 sm:w-10">{scan.isScanning ? <Icon icon="solar:restart-bold-duotone" className="h-4 w-4 animate-spin"/> : <Icon icon="solar:arrow-up-linear" className="h-5 w-5 stroke-[2.5]"/>}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
