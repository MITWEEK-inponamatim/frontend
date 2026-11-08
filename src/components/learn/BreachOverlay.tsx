"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { BreachData, RoleplayScenarioDetail } from "@/lib/roleplayData";

/**
 * Educational breach simulation overlay displayed when user falls for a scam trigger,
 * presenting comprehensive forensic telemetry and direct actionable bridges to ThreatLens tools.
 *
 * @param data - Outcome metadata detailing intercepted OTP and financial impact.
 * @param scenario - Scenario details for forensic breakdown and phone report linking.
 * @param onRetry - Callback to reset the simulation back to initial state.
 */
export function BreachOverlay({
  data,
  scenario,
  onRetry,
}: {
  data: BreachData;
  scenario?: RoleplayScenarioDetail;
  onRetry: () => void;
}) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/75 p-3 sm:p-5 backdrop-blur-2xs overflow-y-auto">
      <div className="my-auto w-full max-w-lg rounded-2xl border border-red-200 bg-white p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Header Banner */}
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-red-100 text-red-600">
            <Icon
              icon="solar:danger-triangle-bold-duotone"
              className="h-7 w-7"
            />
          </div>
          <div>
            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-normal text-red-700">
              Peringatan Keamanan Fatal &middot; Akun Tembus
            </span>
            <h2 className="mt-0.5 text-xs sm:text-sm font-normal text-slate-900 leading-snug">
              {data.headline}
            </h2>
          </div>
        </div>

        {/* Simulated Intercepted SMS OTP */}
        <div className="rounded-xl border border-red-200 bg-red-50/50 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-normal text-red-800">
            <span className="flex items-center gap-1.5">
              <Icon icon="solar:chat-round-dots-linear" className="h-4 w-4" />
              <span>Bukti / Akses Yang Berhasil Diambil Pelaku:</span>
            </span>
            <span className="rounded-full bg-red-200/80 px-2 py-0.2 text-[9px] font-normal text-red-900">
              TEREKSPLOITASI
            </span>
          </div>
          <p className="rounded-lg border border-red-200 bg-white p-2.5 font-mono text-xs text-red-950 leading-relaxed">
            {data.stolenOtp}
          </p>
          <div className="flex items-center justify-between text-xs font-normal text-slate-700 pt-1">
            <span>Estimasi Kerugian Finansial:</span>
            <span className="text-sm font-normal text-red-700 tabular-nums">
              {data.drainAmount}
            </span>
          </div>
        </div>

        {/* Forensic & Psychological Telemetry Breakdown */}
        <div className="space-y-2.5 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 text-xs font-normal text-slate-700">
          <span className="font-normal text-slate-900 flex items-center gap-1.5">
            <Icon icon="solar:radar-2-linear" className="h-4 w-4 text-red-600" />
            <span>Rekonstruksi Taktik Rekayasa Sosial:</span>
          </span>
          <div className="space-y-2 text-[11px] leading-relaxed text-slate-600">
            <div className="rounded-lg bg-white p-2.5 border border-slate-100">
              <span className="font-normal text-red-700">
                1. Taktik Rekayasa Sosial:
              </span>
              <p className="mt-0.5">
                {scenario?.forensicSummary?.socialEngineeringTactic ??
                  "Pelaku membangun manipulasi psikologis untuk memancing korban menyerahkan akses atau dana."}
              </p>
            </div>
            <div className="rounded-lg bg-white p-2.5 border border-slate-100">
              <span className="font-normal text-red-700">
                2. Manipulasi Urgensi &amp; Tekanan Emosional:
              </span>
              <p className="mt-0.5">
                {scenario?.forensicSummary?.psychologicalPressure ??
                  "Pelaku menekan psikologis dengan batas waktu buatan agar korban panik dan buru-buru mengambil keputusan fatal."}
              </p>
            </div>
          </div>
        </div>

        {/* Key Forensic Insight */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 text-xs font-normal text-amber-900 leading-relaxed">
          <span className="font-normal">Prinsip Pertahanan Kritis: </span>
          {data.lessonLearned}
        </div>

        {/* Integrated ThreatLens Action Bridges */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <span className="text-[11px] font-normal text-slate-500">
            Tindakan Nyata Terhadap Penipu:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link
              href="/community/phone"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50/70 py-2 px-3 text-xs font-normal text-red-700 hover:bg-red-100 transition-colors text-center"
            >
              <Icon icon="solar:shield-warning-linear" className="h-4 w-4 shrink-0" />
              <span>Laporkan Nomor ke Komunitas</span>
            </Link>

            <Link
              href={`/recognize/phone/${scenario?.personaPhone ? "6282148291029" : "6282148291029"}`}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-normal text-slate-700 hover:bg-slate-50 transition-colors text-center"
            >
              <Icon icon="solar:magnifier-linear" className="h-4 w-4 shrink-0" />
              <span>Periksa Nomor di Scanner</span>
            </Link>
          </div>
        </div>

        {/* Simulation Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex w-full sm:flex-1 items-center justify-center gap-2 rounded-full bg-red-600 py-2.5 px-4 text-xs font-normal text-white shadow-xs transition-colors hover:bg-red-700"
          >
            <Icon icon="solar:restart-bold-duotone" className="h-4 w-4" />
            <span>Ulangi Simulasi (Coba Lagi)</span>
          </button>
          <Link
            href="/learn"
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-slate-200 bg-white py-2.5 px-4 text-xs font-normal text-slate-700 transition-colors hover:bg-slate-50"
          >
            Daftar Skenario
          </Link>
        </div>
      </div>
    </div>
  );
}
