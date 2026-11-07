"use client";

import { Icon } from "@/components/ui/Icon";
import type { ApkAttachmentData } from "@/lib/roleplayData";

/**
 * Renders a WhatsApp document attachment card matching IMG_0475 with an integrated ThreatLens scanner trigger.
 *
 * @param attachment - File metadata including filename, size, and extension.
 * @param isOutgoing - Whether the document is sent by user (green) or received (white).
 * @param time - Message timestamp.
 * @param showDoubleCheck - Whether to render double blue ticks.
 * @param onInspect - Optional callback to trigger ThreatLens heuristic scanner inspection.
 */
export function WhatsAppDocumentCard({
  attachment,
  isOutgoing,
  time,
  showDoubleCheck = false,
  onInspect,
}: {
  attachment: ApkAttachmentData;
  isOutgoing: boolean;
  time: string;
  showDoubleCheck?: boolean;
  onInspect?: () => void;
}) {
  return (
    <div
      className={`rounded-xl p-3 transition-colors ${
        isOutgoing ? "bg-[#DCF7C5]" : "bg-white"
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Document Sheet Icon with folded corner */}
        <div className="relative grid h-10 w-9 shrink-0 place-items-center rounded-md bg-white border border-slate-200/80 shadow-2xs">
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6 text-[#007AFF] fill-none stroke-current stroke-[1.5]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>

        {/* File Metadata */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs sm:text-[13px] font-normal text-slate-900">
            {attachment.filename}
          </p>
          <p className="mt-0.5 text-[11px] font-normal text-slate-500">
            {attachment.size} &middot; {attachment.extension.replace(".", "")}
          </p>
        </div>
      </div>

      {/* ThreatLens Forensic Scan Action Trigger */}
      {onInspect && !isOutgoing && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onInspect();
          }}
          className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-200/80 bg-red-50/70 py-1.5 px-2.5 text-[11px] font-normal text-red-700 transition-colors hover:bg-red-100"
        >
          <Icon icon="solar:magnifier-linear" className="h-3.5 w-3.5" />
          <span>Pindai Berkas dengan ThreatLens</span>
        </button>
      )}

      {/* Timestamp and Double Blue Checkmarks */}
      <div className="mt-1 flex items-center justify-end gap-1 text-[10px] font-normal text-slate-400">
        <span>{time}</span>
        {showDoubleCheck && (
          <svg
            viewBox="0 0 16 11"
            className="h-3 w-4 text-[#34B7F1] fill-current shrink-0"
          >
            <path d="M11.15 1.15 5.5 6.8 3.85 5.15 2.5 6.5l3 3 7-7-1.35-1.35zm3.5 0-7 7-1.4-1.4 1.4-1.4 5.6-5.6 1.4 1.4z" />
          </svg>
        )}
      </div>
    </div>
  );
}
