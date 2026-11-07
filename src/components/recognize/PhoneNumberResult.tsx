"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ErrorToast } from "@/components/ui/Toast";
import { PhoneReportForm } from "@/components/recognize/PhoneReportForm";
import { ScanResultPanel } from "@/components/recognize/ScanResultPanel";
import { useScanner } from "@/hooks/useScanner";
import { readPhoneResult } from "@/lib/phoneHandoff";
import { canonicalPhone, formatDisplayPhone } from "@/lib/phone";

/**
 * Reconstructed Forensic Record View for Indonesian Phone Numbers:
 * Target header and clean left-aligned section title positioned outside before the card,
 * with a single seamless result card underneath.
 *
 * @param slug - The canonical phone digits string (e.g., "6281234567890").
 */
export function PhoneNumberResult({ slug }: { slug: string }) {
  const scan = useScanner();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const startPhoneScan = scan.startPhoneScan;
  const canonical = canonicalPhone(`+${slug}`);

  const arrived = readPhoneResult(slug);
  const shown = scan.result ?? arrived;

  useEffect(() => {
    if (!readPhoneResult(slug)) startPhoneScan(`+${slug}`);
  }, [slug, startPhoneScan]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    router.push("/recognize");
  };

  return (
    <div className="w-full max-w-3xl lg:max-w-4xl mx-auto space-y-4 text-left">
      {/* 1. Breadcrumb navigation & Copy link */}
      <div className="flex items-center justify-between px-1 text-xs font-normal text-slate-500">
        <div className="flex items-center gap-2">
          <Link
            href="/recognize"
            className="flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <Icon icon="solar:arrow-left-linear" className="h-3.5 w-3.5" />
            <span>Detektor</span>
          </Link>
          <span>/</span>
          <span className="text-slate-400">Pemeriksaan nomor telepon</span>
        </div>

        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 text-xs font-normal text-slate-500 hover:text-slate-900 transition-colors"
        >
          <Icon
            icon={copied ? "solar:check-circle-linear" : "solar:copy-linear"}
            className={`h-3.5 w-3.5 ${copied ? "text-[#34C759]" : "text-slate-400"}`}
          />
          <span>{copied ? "Tautan tersalin" : "Salin tautan"}</span>
        </button>
      </div>

      {/* 2. Target Phone Header (Outside before the card) */}
      <div className="px-1 pt-1 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3.5 min-w-0 text-left">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-100 text-slate-700">
              <Icon icon="solar:phone-bold-duotone" className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <div className="break-all text-xl sm:text-2xl font-normal text-slate-900 font-mono tracking-tight text-left">
                {formatDisplayPhone(canonical) || canonical}
              </div>
              <p className="text-xs font-normal text-slate-400 mt-0.5 text-left">
                Nomor Indonesia · Format E.164: +{slug}
              </p>
            </div>
          </div>

          <span className="text-xs font-normal text-slate-500 shrink-0 text-left sm:text-right">
            Basis data komunitas aktif
          </span>
        </div>
      </div>

      {/* 3. Section Title (H2 text-left on the left, matching card left edge, NO sub-headline) */}
      <div className="px-1 pt-1 text-left">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight text-left">
          Hasil evaluasi risiko
        </h2>
      </div>

      {/* 4. THE SINGLE UNIFIED RESULT CARD */}
      <div className="w-full rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs space-y-4 text-left">
        {/* Loading State */}
        {scan.isScanning && (
          <div
            aria-live="polite"
            className="py-8 flex flex-col items-center justify-center text-center space-y-2"
          >
            <Icon
              icon="solar:restart-linear"
              className="h-5 w-5 animate-spin text-slate-500"
            />
            <p className="text-xs font-normal text-slate-600">
              {scan.scanStep || "Memeriksa basis data intelijen penipuan..."}
            </p>
          </div>
        )}

        {/* Error State */}
        {scan.errorMessage && !scan.isScanning && (
          <ErrorToast
            title="Pemeriksaan nomor tidak dapat diproses"
            description={scan.errorMessage}
          />
        )}

        {/* Forensic Report Panel */}
        {shown && !scan.isScanning && (
          <ScanResultPanel
            result={shown}
            resetLabel="Periksa nomor lain"
            onReset={handleReset}
            footer={<PhoneReportForm number={canonical} />}
          />
        )}
      </div>
    </div>
  );
}
