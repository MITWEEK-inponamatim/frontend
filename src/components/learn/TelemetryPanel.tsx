"use client";

import { Icon } from "@/components/ui/Icon";
import type { RoleplayScenarioDetail } from "@/lib/roleplayData";

/**
 * Renders the real-time cyber intelligence and behavioral telemetry panel alongside the simulation chat.
 *
 * @param scenario - Active scenario details and threat metadata.
 * @param activeTactic - Currently active psychological manipulation tactic detected in chat.
 * @param heuristicData - Telemetry indicators extracted from current scenario step.
 * @param revealedTactics - Accumulation of threat tactics user has identified.
 */
export function TelemetryPanel({
  scenario,
  activeTactic,
  heuristicData,
  revealedTactics,
}: {
  scenario: RoleplayScenarioDetail;
  activeTactic?: string;
  heuristicData?: {
    indicatorTitle: string;
    description: string;
    riskScore: number;
  };
  revealedTactics: string[];
}) {
  return (
    <div className="flex flex-col gap-4 p-4 sm:p-5">
      {/* Scenario Overview Card */}
      <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-normal uppercase tracking-wider text-slate-400">
            {scenario.code}
          </span>
          <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-[10px] font-normal text-red-700">
            {scenario.categoryBadge}
          </span>
        </div>
        <h3 className="text-sm font-normal text-slate-900 leading-snug">
          {scenario.title}
        </h3>
        <p className="text-xs font-normal text-slate-500 leading-relaxed">
          {scenario.backgroundStory}
        </p>
      </div>

      {/* Psychological Manipulation Radar */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-lg bg-red-50 text-red-600">
              <Icon
                icon="solar:shield-warning-bold-duotone"
                className="h-3.5 w-3.5"
              />
            </span>
            <h4 className="text-xs font-normal text-slate-900">
              Radar Rekayasa Sosial
            </h4>
          </div>
          <span className="text-[10px] font-normal text-slate-400">
            Live Telemetry
          </span>
        </div>

        <div className="rounded-xl border border-red-100 bg-red-50/40 p-3">
          <span className="text-[10px] font-normal uppercase tracking-wider text-red-700">
            Taktik Pelaku Saat Ini:
          </span>
          <p className="mt-0.5 text-xs font-normal text-slate-900">
            {activeTactic || "Membangun Kedok Palsu (Pretexting)"}
          </p>
        </div>

        {revealedTactics.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-normal text-slate-400">
              Pertahanan yang Berhasil Ditegakkan:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {revealedTactics.map((tactic) => (
                <span
                  key={tactic}
                  className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-normal text-emerald-800"
                >
                  <Icon
                    icon="solar:check-circle-bold"
                    className="h-3 w-3 text-emerald-600"
                  />
                  <span>{tactic}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Heuristic Forensic Inspector */}
      {heuristicData && (
        <div className="rounded-2xl border border-slate-100 bg-white p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-lg bg-slate-100 text-slate-700">
                <Icon
                  icon="solar:magnifier-linear"
                  className="h-3.5 w-3.5"
                />
              </span>
              <h4 className="text-xs font-normal text-slate-900">
                Inspeksi Forensik Ancaman
              </h4>
            </div>
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-normal text-red-700 border border-red-100">
              Skor Risiko {heuristicData.riskScore}%
            </span>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs font-normal">
            <p className="text-slate-900 font-normal">
              {heuristicData.indicatorTitle}
            </p>
            <p className="mt-1 text-[11px] font-normal leading-relaxed text-slate-500">
              {heuristicData.description}
            </p>
          </div>
        </div>
      )}

      {/* Safety Protocol Quick Note */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 text-xs font-normal text-slate-500 leading-relaxed">
        <div className="flex items-center gap-2 text-slate-800 mb-1">
          <Icon icon="solar:info-circle-bold-duotone" className="h-4 w-4 text-red-600" />
          <span className="font-normal text-slate-900">Prinsip Pertahanan:</span>
        </div>
        Selalu verifikasi nomor resi pengiriman melalui aplikasi resmi ekspedisi
        atau situs cekresi resmi. Jangan pernah menginstal berkas aplikasi (.apk)
        dari pesan instan orang asing.
      </div>
    </div>
  );
}

