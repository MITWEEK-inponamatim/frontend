"use client";

import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import type { ScanResult } from "@/hooks/useScanner";

const OUTCOME_LABELS: Record<string, string> = {
  confirmed_threat: "Ancaman terkonfirmasi",
  suspicious: "Mencurigakan",
  scan_failed: "Scan gagal",
};

/**
 * The verdict block, shared by /recognize (tautan dan APK) and /recognize/phone/[nomor].
 *
 * One copy exists because two copies drift: the phone page and the scan card must describe the
 * same risk level, the same findings, and the same coverage gap in the same words.
 */
export function ScanResultPanel({ result, resetLabel, onReset, footer }: {
  result: ScanResult;
  resetLabel: string;
  onReset: () => void;
  footer?: ReactNode;
}) {
  const tone = result.risk?.level === "high" ? "red" : result.risk?.level === "medium" ? "amber" : "slate";
  const reviews = result.artifacts?.community_reviews ?? [];

  return (
    <div className="animate-in fade-in duration-150">
      <div className={`rounded-2xl border p-4 sm:p-5 ${tone === "red" ? "border-red-200 bg-red-50/50 text-red-950" : tone === "amber" ? "border-amber-200 bg-amber-50/50 text-amber-950" : "border-slate-200 bg-slate-50/70 text-slate-950"}`}>
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className={`rounded-xl p-2 text-white ${tone === "red" ? "bg-red-600" : tone === "amber" ? "bg-amber-600" : "bg-slate-700"}`}>
              <Icon icon={tone === "red" ? "solar:shield-warning-bold-duotone" : tone === "amber" ? "solar:danger-triangle-bold-duotone" : "solar:shield-check-bold-duotone"} className="h-5 w-5" />
            </span>
            <div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${tone === "red" ? "bg-red-200/70 text-red-800" : tone === "amber" ? "bg-amber-200/70 text-amber-800" : "bg-slate-200 text-slate-700"}`}>
                {OUTCOME_LABELS[result.outcome] ?? "Bukti belum cukup"}
              </span>
              <h4 className="mt-1 text-base font-normal text-slate-900">Risiko {result.risk?.level ?? "unknown"}</h4>
            </div>
          </div>
          <div className="text-right"><span className="block text-[11px] text-slate-500">Confidence</span><span className="text-sm text-slate-700">{result.risk?.confidence ?? "low"}</span></div>
        </div>
        <p className="mb-3 text-xs font-normal leading-relaxed text-slate-700 sm:text-sm">{result.evidence_summary}</p>
        {!!result.findings?.length && <div className="mb-3 space-y-1.5 rounded-xl border border-gray-100 bg-white/90 p-3">
          <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-400">Indikator temuan</span>
          {result.findings.map((finding) => <div key={finding.id} className="flex items-start gap-2 text-xs text-slate-700"><Icon icon="solar:check-circle-bold" className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${tone === "red" ? "text-red-500" : tone === "amber" ? "text-amber-500" : "text-slate-500"}`} /><span>{finding.indicator}</span></div>)}
        </div>}
        {!!reviews.length && <div className="mb-3 rounded-xl border border-gray-100 bg-white/90 p-3">
          <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-400">Kata warga ({result.artifacts?.community_review_count ?? reviews.length})</span>
          <ul className="mt-2 space-y-1.5">
            {reviews.map((review) => <li key={review.id} className="flex items-center justify-between gap-3 text-xs text-slate-700">
              <span className="flex min-w-0 items-center gap-2">
                <Icon icon={review.status === "verified" ? "solar:check-circle-bold" : "solar:flag-bold"} className={`h-3.5 w-3.5 shrink-0 ${review.status === "verified" ? "text-emerald-600" : "text-slate-400"}`} />
                <span className="truncate">{review.category}</span>
              </span>
              <span className="flex shrink-0 items-center gap-2 text-[11px] text-slate-400">
                {review.evidence_url && <a href={review.evidence_url} target="_blank" rel="noreferrer noopener" className="flex items-center gap-1 text-slate-500 hover:text-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element -- the proof image is a third-party Cloudinary URL, not a project asset to optimise. */}
                  <img src={review.evidence_url} alt="Bukti laporan warga" loading="lazy" referrerPolicy="no-referrer" className="h-7 w-7 rounded-lg border border-gray-200 object-cover" />
                </a>}
                <span>{review.status === "verified" ? "terverifikasi" : "belum terverifikasi"}{review.age_days !== null ? ` · ${review.age_days} hari lalu` : ""}</span>
              </span>
            </li>)}
          </ul>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-400">Isi laporan adalah klaim warga, bukan bukti tindak pidana. Hanya laporan terverifikasi yang menaikkan risiko.</p>
        </div>}
        {result.recommended_actions?.length > 0 && <div className="flex items-start gap-2 rounded-xl bg-slate-900 p-3 text-xs font-normal text-slate-100"><Icon icon="solar:info-circle-bold-duotone" className="mt-0.5 h-4 w-4 shrink-0 text-red-400" /><div><span className="font-medium text-white">Langkah disarankan: </span><span className="text-slate-300">{result.recommended_actions.join(" ")}</span></div></div>}
        {!!result.limitations?.length && <p className="mt-3 text-xs text-slate-500">Keterbatasan: {result.limitations.join(" ")}</p>}
        {footer}
        {result.error && <p role="alert" className="mt-3 text-xs text-red-700">{result.error.code}: {result.error.message}</p>}
        {result.risk?.coverage?.summary && <p className="mt-2 text-[11px] text-slate-500">Cakupan: {result.risk.coverage.summary}</p>}
      </div>
      <button type="button" onClick={onReset} className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-normal text-slate-700 transition-colors hover:bg-slate-50 sm:text-sm"><Icon icon="solar:restart-bold-duotone" className="h-4 w-4" /><span>{resetLabel}</span></button>
    </div>
  );
}
