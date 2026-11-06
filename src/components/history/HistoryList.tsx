"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { messageForError } from "@/hooks/useScanner";
import { api } from "@/lib/api";
import { timeAgo } from "@/lib/community";
import { isScanFinished, scanKindLabel, SCAN_KIND_META, scanOutcomeLabel, scanTargetLabel } from "@/lib/scanRecord";
import { scanResultPath } from "@/lib/paths";

const PAGE_SIZE = 20;

type ScanRow = { id: string; type: string; status: string; input_ref: string | null; outcome: string | null; risk_level: string | null; created_at: string };

const VERDICT_TONES = {
  red: "border-red-200 bg-red-50/70 text-red-800",
  amber: "border-amber-200 bg-amber-50/70 text-amber-800",
  slate: "border-slate-200 bg-slate-50 text-slate-600",
};

// The words and the colours a finished check gets on its own page, kept short enough to scan down
// a list. A check still running has no verdict to name, so it says so instead of guessing.
function verdictOf(row: ScanRow) {
  if (!isScanFinished(row.status)) return { label: "Masih diproses", tone: VERDICT_TONES.slate };
  return {
    label: scanOutcomeLabel(row.outcome),
    tone: row.risk_level === "high" ? VERDICT_TONES.red : row.risk_level === "medium" ? VERDICT_TONES.amber : VERDICT_TONES.slate,
  };
}

/**
 * What this account has checked, newest first.
 *
 * Only links and APK files are listed, because only those have an address of their own: a number
 * check is filed under the number it asked about, at /recognize/phone, so repeating it here would
 * offer a second way to the same verdict.
 */
export function HistoryList() {
  const [rows, setRows] = useState<ScanRow[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [exhausted, setExhausted] = useState(false);
  const [problem, setProblem] = useState("");

  const load = useCallback(async (from: number) => {
    setLoading(true);
    setProblem("");
    try {
      const data = (await api(`/api/v1/scans?type=url,application&limit=${PAGE_SIZE}&offset=${from}`)) as { scans?: ScanRow[] };
      const page = data.scans ?? [];
      setRows((current) => (from === 0 ? page : [...current, ...page]));
      setOffset(from + page.length);
      setExhausted(page.length < PAGE_SIZE);
    } catch (error) {
      setProblem(messageForError(error instanceof Error ? error.message : null));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let live = true;
    // Queued instead of called inline, so the first read does not set state inside the effect body.
    const timer = setTimeout(() => { if (live) void load(0); }, 0);
    return () => { live = false; clearTimeout(timer); };
  }, [load]);

  return (
    <section className="mt-7">
      {problem && <p role="alert" className="rounded-2xl border border-red-200 bg-red-50/60 px-4 py-3 text-sm text-red-800">{problem}</p>}

      {!!rows.length && (
        <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200/90 bg-white">
          {rows.map((row) => {
            const href = scanResultPath(row.type, row.id);
            const verdict = verdictOf(row);
            const target = scanTargetLabel(row.type, row.input_ref) || scanKindLabel(row.type);
            const body = (
              <>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-900 text-white">
                  <Icon icon={SCAN_KIND_META[row.type]?.icon ?? "solar:shield-check-bold-duotone"} className="h-4.5 w-4.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-slate-900" title={target}>{target}</span>
                  <span className="mt-0.5 block text-[11px] text-slate-400">{scanKindLabel(row.type)} &middot; {timeAgo(row.created_at)}</span>
                </span>
                <span className={`shrink-0 self-center rounded-full border px-2.5 py-1 text-[11px] ${verdict.tone}`}>{verdict.label}</span>
              </>
            );
            // A row without its own address is a check whose page no longer exists — an older kind
            // of scan. It stays listed, just not clickable.
            return href
              ? <li key={row.id}><Link href={href} className="flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-slate-50/80 focus-visible:bg-slate-50/80">{body}</Link></li>
              : <li key={row.id} className="flex items-start gap-3 px-4 py-3.5">{body}</li>;
          })}
        </ul>
      )}

      {!rows.length && !loading && !problem && (
        <div className="rounded-2xl border border-dashed border-gray-200 px-6 py-10 text-center">
          <p className="text-sm text-slate-900">Belum ada pemeriksaan tersimpan.</p>
          <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-slate-400">Setiap tautan atau berkas APK yang Anda periksa akan muncul di sini, lengkap dengan halaman hasilnya sendiri.</p>
          <Link href="/recognize" className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm text-white transition-colors hover:bg-red-600">
            <Icon icon="solar:magnifer-linear" className="h-4 w-4" /><span>Mulai memeriksa</span>
          </Link>
        </div>
      )}

      {rows.length > 0 && (exhausted
        ? <p className="mt-5 text-center text-[11px] text-slate-400">Semua riwayat sudah tampil.</p>
        : <div className="mt-5 flex justify-center">
          <button type="button" disabled={loading} onClick={() => void load(offset)}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-xs text-slate-700 transition-colors hover:bg-slate-50 disabled:text-slate-400 sm:text-sm">
            {loading && <Icon icon="solar:restart-bold-duotone" className="h-4 w-4 animate-spin" />}
            <span>{loading ? "Memuat..." : "Muat lebih banyak"}</span>
          </button>
        </div>)}
    </section>
  );
}
