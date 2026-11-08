"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ErrorToast } from "@/components/ui/Toast";
import type { ScanResult } from "@/hooks/useScanner";
import { RedirectChainViewer } from "./RedirectChainViewer";
import { BrowserScreenshotViewer } from "./BrowserScreenshotViewer";
import { ApkPermissionsViewer } from "./ApkPermissionsViewer";

const DEFAULT_RECOMMENDATIONS = [
  "Jangan pernah membagikan kode OTP, PIN, kata sandi, atau data perbankan kepada penelepon atau pengirim pesan.",
  "Waspadai pesan atau panggilan yang mendesak Anda mengambil keputusan keuangan secara tergesa-gesa.",
  "Laporkan nomor, tautan, atau berkas mencurigakan ke komunitas agar warga lain terlindungi.",
];

/**
 * Editorial security audit verdict panel:
 * Authoritative, linear forensic presentation of evidence, artifacts, and actionable recommendations
 * unified in a single surface with bold section headers, text-left alignment, and clean highlight pills.
 *
 * @param result - Structured scan verdict from Go API or Python analysis engine.
 * @param resetLabel - Label for the primary reset or action button.
 * @param onReset - Callback to reset scanner state or navigate back.
 * @param footer - Optional contextual footer elements such as a reporting form.
 */
export function ScanResultPanel({
  result,
  resetLabel,
  onReset,
  footer,
}: {
  result: ScanResult;
  resetLabel: string;
  onReset: () => void;
  footer?: ReactNode;
}) {
  const riskLevel = result.risk?.level ?? "unknown";
  const outcome = result.outcome ?? "";
  const isFailed = outcome === "scan_failed" || Boolean(result.error);
  const isHighRisk = riskLevel === "high";
  const isMediumRisk = riskLevel === "medium";
  const isSafe = riskLevel === "low";

  if (isFailed) {
    return (
      <div className="w-full space-y-4 animate-in fade-in duration-150 text-left">
        <ErrorToast
          title="Pemindaian belum dapat diselesaikan"
          description={
            result.error?.message ||
            result.risk?.coverage?.summary ||
            "Layanan analisis tidak dapat menjangkau server target saat ini. Pastikan koneksi atau service pendukung telah aktif, lalu coba ulangi."
          }
        />
        <div className="flex items-center justify-between pt-1 text-xs font-normal">
          <span className="text-slate-400">Status: Pemeriksaan belum selesai</span>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <Icon icon="solar:restart-linear" className="h-3.5 w-3.5 text-slate-500" />
            <span>{resetLabel || "Pindai ulang"}</span>
          </button>
        </div>
      </div>
    );
  }

  const reviews = result.artifacts?.community_reviews ?? [];
  const redirectChain = result.artifacts?.redirect_chain ?? [];
  const screenshotUrl =
    result.artifacts?.screenshot_url ?? result.artifacts?.screenshot_path ?? null;

  const extractedPermissions: string[] = [];
  result.findings?.forEach((f) => {
    if (f.indicator.includes("android.permission.")) {
      const match = f.indicator.match(/android\.permission\.[A-Z_]+/g);
      if (match) extractedPermissions.push(...match);
    }
  });

  const recommendations =
    result.recommended_actions && result.recommended_actions.length > 0
      ? result.recommended_actions
      : DEFAULT_RECOMMENDATIONS;

  return (
    <div className="w-full space-y-4 animate-in fade-in duration-150 text-left">
      {/* 1. Verdict & System Confidence (End-to-End layout with Highlight Badges) */}
      <div className="space-y-2 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
          {/* Vonis: Text-only without background span AI slop */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-normal text-slate-500">Vonis:</span>
            <span
              className={`text-sm font-bold tracking-wide ${
                isHighRisk
                  ? "text-red-600"
                  : isMediumRisk
                    ? "text-amber-600"
                    : isSafe
                      ? "text-emerald-600"
                      : "text-slate-600"
              }`}
            >
              {isHighRisk
                ? "BAHAYA"
                : isMediumRisk
                  ? "WASPADA"
                  : isSafe
                    ? "AMAN"
                    : "BUKTI BELUM CUKUP"}
            </span>
          </div>

          {/* Keyakinan Sistem: Clean text */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Keyakinan sistem:</span>
            <span className="font-semibold text-slate-800 capitalize">
              {result.risk?.confidence === "high"
                ? "Tinggi"
                : result.risk?.confidence === "medium"
                  ? "Sedang"
                  : "Rendah"}
            </span>
          </div>
        </div>

        <p className="text-xs font-normal text-slate-500 leading-relaxed text-left pt-1">
          {result.evidence_summary ||
            "Evaluasi heuristik multi-mesin terhadap indikator telemetri, reputasi basis data, dan pola rekayasa sosial."}
        </p>
      </div>

      {/* 2. Indikator & Temuan Analisis */}
      <div className="border-t border-slate-100 pt-4 space-y-2 text-left">
        <h3 className="text-sm font-semibold text-slate-800 mb-2 text-left">
          Temuan analisis
        </h3>

        {result.findings && result.findings.length > 0 ? (
          <div className="space-y-2 text-left">
            {result.findings.map((finding) => {
              const isCritical =
                finding.severity === "high" || finding.severity === "critical";
              return (
                <div
                  key={finding.id}
                  className="flex items-start gap-2.5 text-xs font-normal leading-relaxed text-slate-700 text-left"
                >
                  <Icon
                    icon={
                      isCritical
                        ? "solar:danger-triangle-linear"
                        : "solar:shield-warning-linear"
                    }
                    className={`h-4 w-4 shrink-0 mt-0.5 ${
                      isCritical ? "text-[#FF3B30]" : "text-[#FF9500]"
                    }`}
                  />
                  <div className="min-w-0 flex-1 text-left">
                    <span>{finding.indicator}</span>
                    {finding.source && (
                      <span className="ml-1.5 text-xs text-slate-400 font-mono">
                        ({finding.source})
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs font-normal text-slate-500 text-left">
            Tidak ditemukan indikator ancaman mencurigakan pada sampel ini.
          </p>
        )}

        {/* Community Reviews if present */}
        {reviews.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-left">
            <span className="text-xs font-normal text-slate-500 block text-left">
              Laporan warga di komunitas ({reviews.length}):
            </span>
            <div className="space-y-1.5 text-left">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="flex items-center justify-between gap-3 text-xs font-normal text-slate-700 text-left"
                >
                  <span className="truncate text-left">{review.category}</span>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 shrink-0">
                    {review.evidence_url && (
                      <a
                        href={review.evidence_url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="hover:opacity-80 transition-opacity"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={review.evidence_url}
                          alt="Bukti Laporan"
                          className="h-6 w-6 rounded-md object-cover border border-slate-200"
                        />
                      </a>
                    )}
                    <span>
                      {review.status === "verified"
                        ? "Terverifikasi"
                        : "Menunggu verifikasi"}
                      {review.age_days !== null ? ` · ${review.age_days} hari lalu` : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Inline Contextual Artifacts (URLs & APKs) */}
      {redirectChain.length > 0 && (
        <div className="border-t border-slate-100 pt-4 text-left">
          <RedirectChainViewer chain={redirectChain} />
        </div>
      )}

      {screenshotUrl && (
        <div className="border-t border-slate-100 pt-4 text-left">
          <BrowserScreenshotViewer
            screenshotUrl={screenshotUrl}
            targetUrl={(result.artifacts?.final_url as string) || undefined}
          />
        </div>
      )}

      {extractedPermissions.length > 0 && (
        <div className="border-t border-slate-100 pt-4 text-left">
          <ApkPermissionsViewer permissions={extractedPermissions} />
        </div>
      )}

      {/* 4. Rekomendasi Perlindungan */}
      <div className="border-t border-slate-100 pt-4 space-y-2 text-left">
        <h3 className="text-sm font-semibold text-slate-800 mb-2 text-left">
          Langkah perlindungan yang disarankan
        </h3>
        <ul className="space-y-1.5 text-xs font-normal text-slate-700 text-left">
          {recommendations.map((action, index) => (
            <li key={index} className="flex items-start gap-2 leading-relaxed text-left">
              <span className="text-slate-400 font-mono text-[11px] shrink-0 mt-0.5">
                {index + 1}.
              </span>
              <span className="text-left">{action}</span>
            </li>
          ))}
        </ul>

        {/* Demoted Disclaimer / Limitations Text */}
        {result.limitations && result.limitations.length > 0 && (
          <p className="mt-3 text-xs text-slate-400 text-left leading-relaxed">
            Catatan: {result.limitations.join(" ")}
          </p>
        )}
      </div>

      {/* 5. Integrated Contextual Footer (e.g. Phone Report Form) */}
      {footer && (
        <div className="border-t border-slate-100 pt-4 text-left">
          {footer}
        </div>
      )}

      {/* 6. Action Dock */}
      <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
        <button
          type="button"
          onClick={onReset}
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 px-5 text-xs font-medium text-white hover:bg-slate-800 transition-colors shadow-2xs"
        >
          <Icon icon="solar:restart-linear" className="h-4 w-4" />
          <span>{resetLabel || "Periksa data baru"}</span>
        </button>

        <Link
          href="/history"
          className="inline-flex items-center gap-1.5 text-xs font-normal text-slate-500 hover:text-slate-900 transition-colors"
        >
          <Icon icon="solar:history-linear" className="h-3.5 w-3.5" />
          <span>Buka riwayat pemindaian</span>
        </Link>
      </div>
    </div>
  );
}
