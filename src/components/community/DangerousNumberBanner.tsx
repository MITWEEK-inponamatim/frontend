"use client";

import { Icon } from "@/components/ui/Icon";

/**
 * Promotional and educational call-to-action banner displayed at the top of the dangerous numbers feed.
 *
 * @param onReportClick - Callback triggered when the user clicks the report button.
 */
export function DangerousNumberBanner({
  onReportClick,
}: {
  onReportClick: () => void;
}) {
  return (
    <div className="border-b border-slate-100 bg-slate-50/50 p-4 sm:p-5">
      <div className="flex items-start gap-3.5 sm:gap-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-red-100 bg-red-50 text-red-600">
          <Icon icon="solar:shield-warning-bold-duotone" className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm sm:text-base font-normal text-slate-900">
              Database Intelijen Nomor Penipuan
            </h2>
            <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-[10px] font-normal text-red-700">
              Komunitas Warga
            </span>
          </div>
          <p className="mt-1 text-xs font-normal leading-relaxed text-slate-500">
            Kumpulan nomor telepon yang dilaporkan warga terindikasi penipuan,
            penagih pinjol ilegal, atau SMS APK berbahaya. Bantu lindungi warga
            lain dengan melaporkan nomor mencurigakan.
          </p>
          <div className="mt-3.5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onReportClick}
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs font-normal text-white shadow-sm transition-colors hover:bg-red-700"
            >
              <Icon
                icon="solar:phone-calling-bold-duotone"
                className="h-3.5 w-3.5"
              />
              <span>Laporkan Nomor Berbahaya</span>
            </button>
            <span className="text-[11px] font-normal text-slate-400">
              Bukti tangkapan layar wajib disertakan
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

