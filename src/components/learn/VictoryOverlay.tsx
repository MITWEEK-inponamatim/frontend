"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { VictoryData, RoleplayScenarioDetail } from "@/lib/roleplayData";

/**
 * Educational success debrief overlay displayed when the user successfully defuses the scam,
 * providing forensic telemetry insights and actionable bridges to ThreatLens community reporting.
 *
 * @param data - Victory metadata detailing score, foiled tactics, and core security insight.
 * @param scenario - Scenario details for forensic breakdown and phone report linking.
 * @param onRetry - Callback to replay the scenario.
 */
export function VictoryOverlay({
  data,
  scenario,
  onRetry,
}: {
  data: VictoryData;
  scenario?: RoleplayScenarioDetail;
  onRetry: () => void;
}) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/75 p-3 sm:p-5 backdrop-blur-2xs overflow-y-auto">
      <div className="my-auto w-full max-w-lg rounded-2xl border border-emerald-200 bg-white p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Header Banner */}
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
            <Icon
              icon="solar:check-circle-bold-duotone"
              className="h-7 w-7"
            />
          </div>
          <div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-normal text-emerald-800">
              Pertahanan Sempurna &middot; 100% Imun
            </span>
            <h2 className="mt-0.5 text-xs sm:text-sm font-normal text-slate-900 leading-snug">
              {data.headline}
            </h2>
          </div>
        </div>

        {/* Defense Score Card */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-normal text-emerald-900">
            <span>Skor Ketahanan Siber:</span>
            <span className="text-base font-normal text-emerald-700 tabular-nums">
              {data.score} / 100
            </span>
          </div>
          <p className="text-xs font-normal text-slate-600 leading-relaxed">
            {scenario?.forensicSummary?.decisionPointSafe
              ? `Anda berhasil menggagalkan manipulasi psikologis pelaku dengan ${scenario.forensicSummary.decisionPointSafe.toLowerCase()}.`
              : "Anda berhasil menggagalkan manipulasi psikologis pelaku dengan mendeteksi kejanggalan dan menolak transaksi di luar kanal resmi."}
          </p>
        </div>

        {/* Foiled Tactics Breakdown */}
        <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5">
          <span className="text-xs font-normal text-slate-900 flex items-center gap-1.5">
            <Icon icon="solar:shield-check-linear" className="h-4 w-4 text-emerald-600" />
            <span>Taktik Penipuan yang Berhasil Anda Patahkan:</span>
          </span>
          <ul className="space-y-2 text-xs font-normal text-slate-600">
            {data.tacticsFoiled.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <Icon
                  icon="solar:check-circle-bold"
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600"
                />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Core Insight */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-normal text-slate-700 leading-relaxed">
          <span className="font-normal text-slate-900">Fakta Kunci Keamanan: </span>
          {data.keyInsight}
        </div>

        {/* Integrated ThreatLens Action Bridges */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <span className="text-[11px] font-normal text-slate-500">
            Langkah Nyata Melindungi Komunitas:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link
              href="/community/phone"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/70 py-2 px-3 text-xs font-normal text-emerald-800 hover:bg-emerald-100 transition-colors text-center"
            >
              <Icon icon="solar:shield-warning-linear" className="h-4 w-4 shrink-0" />
              <span>Laporkan Nomor ke Komunitas</span>
            </Link>

            <Link
              href={`/recognize/phone/${scenario?.personaPhone ? scenario.personaPhone.replace(/[^0-9]/g, "") : "6282148291029"}`}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-normal text-slate-700 hover:bg-slate-50 transition-colors text-center"
            >
              <Icon icon="solar:magnifier-linear" className="h-4 w-4 shrink-0" />
              <span>Lihat Detail di Scanner</span>
            </Link>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          <Link
            href="/learn"
            className="inline-flex w-full sm:flex-1 items-center justify-center gap-2 rounded-full bg-slate-900 py-2.5 px-4 text-xs font-normal text-white shadow-xs transition-colors hover:bg-slate-800"
          >
            <span>Pilih Skenario Lainnya</span>
            <Icon icon="solar:arrow-right-up-linear" className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-slate-200 bg-white py-2.5 px-4 text-xs font-normal text-slate-700 transition-colors hover:bg-slate-50"
          >
            Mainkan Ulang
          </button>
        </div>
      </div>
    </div>
  );
}
