"use client";

import { Icon } from "@/components/ui/Icon";
import type { ApkAttachmentData } from "@/lib/roleplayData";

/**
 * Renders an Android package (.apk) file attachment bubble mimicking chat platform documents.
 *
 * @param attachment - File metadata including filename, size, and malicious permissions.
 * @param onInspect - Optional callback to trigger forensic inspection.
 */
export function ApkAttachment({
  attachment,
  onInspect,
}: {
  attachment: ApkAttachmentData;
  onInspect?: () => void;
}) {
  return (
    <div
      onClick={onInspect}
      className="mt-2.5 flex items-center justify-between gap-3 rounded-xl border border-red-200/90 bg-red-50/40 p-3 transition-colors hover:bg-red-50 cursor-pointer"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-red-600 text-white shadow-xs">
          <Icon icon="solar:document-bold-duotone" className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-xs font-normal text-slate-900">
              {attachment.filename}
            </span>
            <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-normal text-red-700">
              APK
            </span>
          </div>
          <p className="mt-0.5 text-[11px] font-normal text-slate-500">
            {attachment.size} &middot; Berkas Instalasi Android
          </p>
        </div>
      </div>
      <div className="shrink-0 text-red-600">
        <Icon icon="solar:danger-triangle-bold-duotone" className="h-5 w-5" />
      </div>
    </div>
  );
}

