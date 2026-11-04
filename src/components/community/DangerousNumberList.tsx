"use client";

import Link from "next/link";
import { NumberAvatar, NumberHandle } from "@/components/community/NumberHandle";
import { timeAgo, type DangerousNumber } from "@/lib/community";
import { phoneSlug } from "@/lib/phone";

/**
 * The numbers this platform can currently call dangerous.
 *
 * A row appears here because verified reports crossed the threshold — the same rule the scanner uses
 * to answer "high". Votes and stories stay out of that decision, and there is deliberately no rank
 * number in front of these rows: a rank would invite people to think a number got here by being
 * talked about louder.
 *
 * The gradient ring on each disc is the only saturated mark on the board. It means exactly one thing,
 * and it means it here.
 */
export function DangerousNumberList({ numbers }: { numbers: DangerousNumber[] }) {
  if (numbers.length === 0) {
    return (
      <p className="bg-pos-card px-6 py-12 text-center text-[13px] leading-relaxed text-pos-muted">
        Belum ada nomor yang melewati ambang laporan terverifikasi. Daftar ini diisi hasil moderasi, bukan vote — jadi
        memang bisa kosong.
      </p>
    );
  }

  return (
    <div className="bg-pos-card">
      {numbers.map((row) => {
        const slug = phoneSlug(row.number_e164);
        return (
          <div key={row.number_e164} className="flex items-center gap-3 border-b border-pos-line px-4 py-3 last:border-b-0">
            <NumberAvatar verified />
            <div className="min-w-0 flex-1">
              <NumberHandle number={row.number_e164} size="lg" />
              <p className="mt-0.5 text-[12px] leading-snug text-pos-muted">
                <span className="font-semibold text-pos-ink/80 tabular-nums">{row.verified_reports}</span> laporan terverifikasi dari{" "}
                <span className="tabular-nums">{row.verified_reporters}</span> warga berbeda
              </p>
              <p className="mt-0.5 text-[12px] leading-snug text-pos-muted">
                {row.community_posts > 0 ? (
                  <>
                    <span className="tabular-nums">{row.community_posts}</span> cerita warga
                    {row.last_report_at ? ` · laporan terakhir ${timeAgo(row.last_report_at)}` : ""}
                  </>
                ) : (
                  <>
                    Belum ada cerita warga{row.last_report_at ? ` · laporan terakhir ${timeAgo(row.last_report_at)}` : ""}
                  </>
                )}
              </p>
            </div>
            {row.community_posts > 0 && (
              <Link
                href={`/community/latest?nomor=${slug || row.number_e164}`}
                className="shrink-0 rounded-lg bg-pos-action px-4 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-pos-action-tua focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pos-ink"
              >
                Cerita
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
