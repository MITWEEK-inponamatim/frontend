"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { RoleplayScenarioDetail, ApkAttachmentData } from "@/lib/roleplayData";

/**
 * Authentic Apple iOS Sheet for on-demand file and contact threat inspection:
 * Clean Inset Grouped layout with zero visual slop, adhering to Apple HIG.
 *
 * @param isOpen - Controls modal visibility.
 * @param type - Target artifact being inspected: "file" or "contact".
 * @param scenario - Scenario details containing persona and threat metadata.
 * @param fileAttachment - Optional file metadata when inspecting document attachment.
 * @param onClose - Callback to dismiss the inspector sheet.
 */
export function ThreatInspectorModal({
  isOpen,
  type,
  scenario,
  fileAttachment,
  onClose,
}: {
  isOpen: boolean;
  type: "file" | "contact";
  scenario: RoleplayScenarioDetail;
  fileAttachment?: ApkAttachmentData;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <>
      {/* Soft Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 z-30 bg-black/25 backdrop-blur-[1px] transition-opacity"
        aria-hidden="true"
      />

      {/* iOS Bottom Sheet Container */}
      <section
        role="dialog"
        aria-modal="true"
        aria-label={type === "file" ? "Inspeksi Berkas" : "Inspeksi Kontak"}
        className="absolute inset-x-0 bottom-0 z-40 flex max-h-[85%] flex-col rounded-t-[28px] border-t border-slate-200/90 bg-[#F2F2F7] shadow-2xl transition-transform duration-300 ease-out"
      >
        {/* Apple Grabber Handle */}
        <div className="mx-auto mt-2.5 mb-1 h-1 w-9 rounded-full bg-slate-300 select-none" />

        {/* Navigation Bar */}
        <header className="flex items-center justify-between px-5 py-2 border-b border-slate-200/60 bg-[#F2F2F7]">
          <h2 className="text-xs sm:text-sm font-normal text-slate-900">
            {type === "file" ? "Inspeksi Berkas Forensik" : "Inspeksi Nomor Pengirim"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-full bg-slate-200/80 text-slate-600 hover:bg-slate-300 transition-colors"
            aria-label="Tutup inspeksi"
          >
            <Icon icon="solar:close-circle-linear" className="h-4.5 w-4.5" />
          </button>
        </header>

        {/* Content Scroll View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {/* File Inspection Content */}
          {type === "file" && (
            <>
              {/* Hero Status Row */}
              <div className="flex items-center gap-3.5 rounded-2xl bg-white p-4 shadow-2xs">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#FF3B30]/10 text-[#FF3B30]">
                  <Icon icon="solar:danger-triangle-linear" className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs sm:text-sm font-normal text-slate-900 leading-snug">
                    Malware Sniffer Android (.apk)
                  </h3>
                  <p className="mt-0.5 text-[11px] font-normal text-slate-500 leading-tight">
                    Skor Ancaman: 85% &middot; Sangat Berbahaya
                  </p>
                </div>
              </div>

              {/* Inset Grouped List */}
              <div className="overflow-hidden rounded-2xl bg-white shadow-2xs divide-y divide-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 p-3.5 text-xs font-normal">
                  <span className="text-slate-500 shrink-0 sm:w-40">Nama Berkas</span>
                  <span className="font-mono text-slate-900 sm:text-right">
                    {fileAttachment?.filename ?? "LIHAT_Foto_Paket.apk"}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 p-3.5 text-xs font-normal">
                  <span className="text-slate-500 shrink-0 sm:w-40">Ukuran &amp; Format</span>
                  <span className="text-slate-900 sm:text-right">
                    {fileAttachment?.size ?? "4.2 MB"} &middot; Android Package (.apk)
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 p-3.5 text-xs font-normal">
                  <span className="text-slate-500 shrink-0 sm:w-40">Modus Kamuflase</span>
                  <span className="text-slate-900 sm:text-right leading-relaxed">
                    Menyamar sebagai gambar foto resi, padahal berkas aplikasi executable
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 p-3.5 text-xs font-normal">
                  <span className="text-slate-500 shrink-0 sm:w-40">Izin Berbahaya</span>
                  <span className="font-mono text-[11px] text-[#FF3B30] sm:text-right leading-relaxed">
                    RECEIVE_SMS, READ_SMS, INTERNET
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl bg-[#007AFF] py-2.5 px-4 text-xs font-normal text-white hover:bg-[#0066D6] transition-colors shadow-2xs text-center"
              >
                Tutup &amp; Lanjutkan Percakapan
              </button>
            </>
          )}

          {/* Contact Inspection Content */}
          {type === "contact" && (
            <>
              {/* Hero Status Row */}
              <div className="flex items-center gap-3.5 rounded-2xl bg-white p-4 shadow-2xs">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#FF9500]/10 text-[#FF9500]">
                  <Icon icon="solar:shield-warning-linear" className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs sm:text-sm font-normal text-slate-900 leading-snug">
                    Nomor Terindikasi Penipuan
                  </h3>
                  <p className="mt-0.5 text-[11px] font-normal text-slate-500 leading-tight">
                    Laporan Warga Terdata &middot; {scenario.categoryBadge}
                  </p>
                </div>
              </div>

              {/* Inset Grouped List */}
              <div className="overflow-hidden rounded-2xl bg-white shadow-2xs divide-y divide-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 p-3.5 text-xs font-normal">
                  <span className="text-slate-500 shrink-0 sm:w-40">Nomor Telepon</span>
                  <span className="font-mono text-slate-900 sm:text-right">
                    {scenario.personaPhone}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 p-3.5 text-xs font-normal">
                  <span className="text-slate-500 shrink-0 sm:w-40">Identitas Penyamaran</span>
                  <span className="text-slate-900 sm:text-right">
                    {scenario.personaName} ({scenario.personaRole})
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 p-3.5 text-xs font-normal">
                  <span className="text-slate-500 shrink-0 sm:w-40">Modus Terdata</span>
                  <span className="text-slate-900 sm:text-right leading-relaxed">
                    {scenario.threatTarget}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <Link
                  href={`/recognize/phone/${scenario.personaPhone.replace(/[^0-9]/g, "")}`}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#007AFF] py-2.5 px-4 text-xs font-normal text-white hover:bg-[#0066D6] transition-colors shadow-2xs text-center"
                >
                  <span>Buka Analisis Lengkap di ThreatLens Scanner</span>
                </Link>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full text-center text-xs font-normal text-slate-500 hover:text-slate-700 py-1"
                >
                  Tutup
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
