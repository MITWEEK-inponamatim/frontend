"use client";

import type { ChoiceOption } from "@/lib/roleplayData";

/**
 * Bottom interactive input bar with iOS WhatsApp controls on top and branching dialogue options styled as an authentic iOS Action Sheet below.
 *
 * @param choices - Current set of branching response options for the user.
 * @param disabled - Boolean indicating if interactions are locked during message generation.
 * @param onSelect - Callback receiving the chosen response.
 */
export function WhatsAppInputBar({
  choices,
  disabled,
  onSelect,
}: {
  choices: ChoiceOption[];
  disabled: boolean;
  onSelect: (choice: ChoiceOption) => void;
}) {
  return (
    <div className="relative z-10 flex flex-col border-t border-slate-200/90 bg-[#F6F6F6]">
      {/* 1. iOS WhatsApp Input Bar */}
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <button
          type="button"
          aria-label="Lampiran berkas"
          className="text-[#007AFF] hover:opacity-80 transition-opacity p-0.5"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6 fill-none stroke-current stroke-[2]"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>

        <div className="flex flex-1 items-center justify-between rounded-full border border-slate-300 bg-white px-3.5 py-1.5 shadow-2xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs font-normal text-slate-400 select-none truncate">
              {disabled
                ? "Sedang menunggu balasan..."
                : choices.length > 0
                  ? "Pilih salah satu respons di bawah..."
                  : "Ketik pesan..."}
            </span>
          </div>
          <button
            type="button"
            aria-label="Stiker"
            className="text-slate-400 hover:text-slate-600 transition-colors ml-1"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4.5 w-4.5 fill-none stroke-current stroke-[1.5]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>

        <button
          type="button"
          aria-label="Kamera"
          className="text-[#007AFF] hover:opacity-80 transition-opacity p-0.5"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 fill-none stroke-current stroke-[1.8]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>

        <button
          type="button"
          aria-label="Pesan suara"
          className="text-[#007AFF] hover:opacity-80 transition-opacity p-0.5"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 fill-none stroke-current stroke-[1.8]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </button>
      </div>

      {/* 2. iOS Action Sheet Menu (Pola 1 - Teks Biru Khas iOS #007AFF) */}
      <div className="border-t border-slate-200/80 bg-[#ECEBED] px-3 pt-2.5 pb-2">
        {choices.length > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1 text-[10px] font-normal uppercase tracking-wider text-slate-500">
              <span>Tindakan Respons (Ketuk untuk Mengirim):</span>
              <span className="tabular-nums text-slate-400">
                {choices.length} Pilihan
              </span>
            </div>

            {/* Native iOS Action Sheet Card Container */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs divide-y divide-slate-100 max-h-[220px] overflow-y-auto">
              {choices.map((choice, index) => {
                const letter = String.fromCharCode(65 + index);

                return (
                  <button
                    key={choice.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => onSelect(choice)}
                    className="group flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-slate-50/80 active:bg-slate-100 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {/* iOS Blue Circular Indicator */}
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[#007AFF]/30 bg-[#007AFF]/5 text-[11px] font-normal text-[#007AFF] group-hover:bg-[#007AFF] group-hover:text-white transition-colors">
                      {letter}
                    </span>

                    {/* Choice Action Content in Authentic iOS Blue */}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-[13px] font-normal text-[#007AFF] group-hover:underline">
                        {choice.label}
                      </p>
                      <p className="mt-0.5 text-[11px] font-normal text-slate-500 leading-relaxed line-clamp-2">
                        &ldquo;{choice.actionText}&rdquo;
                      </p>
                    </div>

                    {/* iOS Chevron Right Icon */}
                    <div className="shrink-0 text-slate-300 group-hover:text-[#007AFF] transition-colors mt-0.5">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4 fill-none stroke-current stroke-[2]"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-xs font-normal text-slate-400">
            {disabled
              ? "Menunggu pesan berikutnya dari lawan bicara..."
              : "Simulasi telah mencapai titik keputusan akhir."}
          </div>
        )}

        {/* 3. iOS Bottom Home Indicator Bar */}
        <div
          aria-hidden="true"
          className="mx-auto mt-3 mb-1 h-1 w-32 rounded-full bg-slate-900/60"
        />
      </div>
    </div>
  );
}
