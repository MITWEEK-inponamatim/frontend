"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { NumberAvatar, NumberHandle } from "@/components/community/NumberHandle";
import { timeAgo, type DangerousNumber } from "@/lib/community";
import { phoneSlug } from "@/lib/phone";

/**
 * Leaderboard displaying verified high-risk numbers based on validated citizen reports.
 */
export function DangerousNumberList({ numbers }: { numbers: DangerousNumber[] }) {
  if (numbers.length === 0) {
    return (
      <div className="border-b border-slate-100 bg-white p-8 text-center">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-500">
          <Icon icon="solar:shield-check-bold-duotone" className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-normal text-slate-900">Belum Ada Nomor Berbahaya</h3>
        <p className="mx-auto mt-1 max-w-sm text-xs font-normal leading-relaxed text-slate-500">
          Daftar ini hanya menampilkan nomor yang telah melewati verifikasi laporan ganda oleh moderator.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {numbers.map((row) => {
        const slug = phoneSlug(row.number_e164);
        return (
          <div
            key={row.number_e164}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 hover:bg-slate-50/40 transition-colors"
          >
            <div className="flex items-start sm:items-center gap-3.5 min-w-0">
              <NumberAvatar verified />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <NumberHandle number={row.number_e164} size="lg" />
                  <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-[11px] font-normal text-red-700">
                    <Icon icon="solar:shield-warning-bold-duotone" className="h-3.5 w-3.5" />
                    <span className="font-normal">{row.verified_reports} Laporan Terverifikasi</span>
                  </span>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs font-normal text-slate-500">
                  <span className="font-normal">{row.verified_reporters} warga berbeda</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-normal">{row.community_posts} cerita komunitas</span>
                  {row.last_report_at && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-normal">terakhir {timeAgo(row.last_report_at)}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              {row.community_posts > 0 && (
                <Link
                  href={`/community/latest?nomor=${slug || row.number_e164}`}
                  className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-normal text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Lihat Cerita ({row.community_posts})
                </Link>
              )}
              <Link
                href={`/recognize/phone/${slug || row.number_e164}`}
                className="inline-flex items-center gap-1 rounded-full bg-red-600 px-4 py-1.5 text-xs font-normal text-white shadow-sm transition-colors hover:bg-red-700"
              >
                <span className="font-normal">Cek Detail</span>
                <Icon icon="solar:arrow-right-up-linear" className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
