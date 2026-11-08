import React from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { RoleplayScenario } from "@/lib/scenarios";
import { ScenarioAvatar } from "./ScenarioAvatar";
import { ScenarioBadge } from "./ScenarioBadge";

interface ScenarioCardProps {
  scenario: RoleplayScenario;
  isCompleted?: boolean;
}

/**
 * Renders a roleplay scenario card with a left-aligned layout and ThreatLens Red accents.
 */
export function ScenarioCard({ scenario, isCompleted = false }: ScenarioCardProps) {
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs transition-all hover:border-slate-300 hover:shadow-xs">
      <div className="relative h-28 sm:h-32 bg-gradient-to-b from-red-50/50 to-slate-50/30 flex items-center justify-center">
        {isCompleted && (
          <span className="absolute top-2.5 right-2.5 z-10 inline-flex items-center gap-1 rounded-full bg-emerald-600 text-white text-[10px] font-normal px-2.5 py-0.5 shadow-2xs">
            <Icon icon="solar:check-circle-bold" className="h-3 w-3" />
            <span>Ditangkal</span>
          </span>
        )}
        <ScenarioAvatar
          initial={scenario.avatarInitial}
          name={scenario.personaName}
          avatarUrl={scenario.avatarUrl}
          colorClass={scenario.avatarColor}
        />
      </div>

      <div className="relative z-10 -mt-3.5 flex justify-start px-5">
        <ScenarioBadge label={scenario.categoryBadge} />
      </div>

      <div className="flex flex-1 flex-col justify-between px-5 pt-3 pb-5 text-left">
        <div>
          <h2 className="text-left text-sm sm:text-[15px] font-normal text-slate-900 tracking-tight leading-snug">
            {scenario.title}
          </h2>
          <p className="mt-1 text-left text-xs text-slate-500 font-normal">
            {scenario.personaName} &middot; {scenario.personaRole}
          </p>
          <p className="mt-2.5 text-left text-xs text-slate-600 font-normal leading-relaxed line-clamp-3">
            {scenario.description}
          </p>
        </div>

        <div className="mt-5 pt-2">
          <Link
            href={`/learn/${scenario.id}`}
            className={`block w-full rounded-full border py-2 text-center text-xs font-normal transition-all ${
              isCompleted
                ? "border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-600 hover:border-emerald-600 hover:text-white"
                : "border-slate-200/90 bg-white text-slate-800 hover:border-red-600 hover:bg-red-600 hover:text-white group-hover:border-red-600 group-hover:bg-red-600 group-hover:text-white"
            }`}
          >
            {isCompleted ? "Uji Ulang Simulasi" : "Mulai Simulasi"}
          </Link>
        </div>
      </div>
    </div>
  );
}
