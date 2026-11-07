"use client";

import { Icon } from "@/components/ui/Icon";
import type { ChoiceOption } from "@/lib/roleplayData";

/**
 * Renders the multiple-choice decision tray for user responses in the interactive simulation.
 *
 * @param choices - Array of available response actions.
 * @param disabled - Boolean indicating if user interaction is locked during transitions.
 * @param onSelect - Callback receiving the chosen response.
 */
export function ChoiceTray({
  choices,
  disabled,
  onSelect,
}: {
  choices: ChoiceOption[];
  disabled: boolean;
  onSelect: (choice: ChoiceOption) => void;
}) {
  return (
    <div className="border-t border-slate-100 bg-white p-3.5 sm:p-4">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[11px] font-normal text-slate-400">
          Tentukan respons Anda terhadap pesan di atas:
        </span>
        <span className="text-[10px] font-normal text-slate-400">
          {choices.length} Pilihan Tersedia
        </span>
      </div>

      <div className="space-y-2">
        {choices.map((choice, index) => {
          const letter = String.fromCharCode(65 + index);
          const isFatal = choice.riskLevel === "fatal";
          const isSafe = choice.riskLevel === "safe";

          return (
            <button
              key={choice.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(choice)}
              className="group flex w-full items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-3 text-left transition-all hover:border-slate-300 hover:bg-slate-50/60 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
            >
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg text-xs font-normal transition-colors ${
                  isFatal
                    ? "border border-red-200 bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white"
                    : isSafe
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white"
                      : "border border-slate-200 bg-slate-50 text-slate-700 group-hover:bg-slate-900 group-hover:text-white"
                }`}
              >
                {letter}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-normal text-slate-900 group-hover:text-slate-900">
                    {choice.label}
                  </span>
                  {isFatal && (
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-[9px] font-normal text-red-700 border border-red-100">
                      Tindakan Berisiko
                    </span>
                  )}
                  {isSafe && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-normal text-emerald-700 border border-emerald-100">
                      SOP Perlindungan
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs font-normal text-slate-500 leading-relaxed">
                  &ldquo;{choice.actionText}&rdquo;
                </p>
              </div>

              <div className="shrink-0 text-slate-300 group-hover:text-slate-700 transition-colors mt-0.5">
                <Icon icon="solar:alt-arrow-right-linear" className="h-4 w-4" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

