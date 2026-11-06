"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { ScanResultPanel } from "@/components/recognize/ScanResultPanel";
import { messageForError, type ScanResult } from "@/hooks/useScanner";
import { api } from "@/lib/api";
import { timeAgo } from "@/lib/community";
import { isScanFinished, scanKindLabel, SCAN_KIND_META, scanTargetLabel } from "@/lib/scanRecord";
import { scanResultPath } from "@/lib/paths";

type RecordKind = "url" | "application";
type ScanRecord = { id: string; type: string; status: string; created_at: string; input_ref?: string | null; report?: ScanResult | null };

/**
 * One finished check, at the address its scan id gives it: /recognize/url/[id] or /recognize/apk/[id].
 *
 * The verdict is read back from the stored scan instead of being handed over in memory, so the page
 * works the same when it is opened from the history list, from a bookmark, or after a reload. A scan
 * that has not finished yet is polled here until it has.
 */
export function ScanRecordResult({ scanId, kind }: { scanId: string; kind: RecordKind }) {
  const router = useRouter();
  const [record, setRecord] = useState<ScanRecord | null>(null);
  const [problem, setProblem] = useState("");

  useEffect(() => {
    let live = true;
    const load = async (isFirstLoad: boolean) => {
      try {
        // Only the first read counts as activity: the repeats are this page waiting, not the user.
        const row = (await api(`/api/v1/scans/${scanId}`, isFirstLoad ? undefined : { headers: { "X-Activity": "passive" } })) as ScanRecord;
        if (!live) return;
        // The id decides what this page is, so an address that disagrees with its own scan gets
        // moved to the right one — and a number check goes back to the scanner, where it belongs.
        if (row.type !== kind) {
          router.replace(scanResultPath(row.type, row.id) ?? "/recognize");
          return;
        }
        setRecord(row);
        if (!isScanFinished(row.status)) setTimeout(() => void load(false), 2500);
      } catch (error) {
        if (!live) return;
        setProblem(messageForError(error instanceof Error ? error.message : null));
      }
    };
    void load(true);
    return () => {
      live = false;
    };
  }, [scanId, kind, router]);

  const meta = SCAN_KIND_META[kind];
  const target = scanTargetLabel(kind, record?.input_ref);
  const finished = !!record && isScanFinished(record.status);
  const stillRunning = !!record && !finished;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center">
      <div className="relative w-full rounded-2xl border border-gray-200/90 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-5">
        <div className="mb-3 flex items-start gap-2.5">
          <span className="rounded-xl bg-slate-900 p-2 text-white"><Icon icon={meta.icon} className="h-5 w-5" /></span>
          <div className="min-w-0">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-600">{scanKindLabel(kind)}</span>
            <h4 className="mt-1 break-all text-base font-medium text-slate-900">{target || "Data yang diperiksa tidak tercatat"}</h4>
            {record && <p className="mt-1 text-[11px] text-slate-400">Diperiksa {timeAgo(record.created_at)}</p>}
          </div>
        </div>

        {problem && <p role="alert" className="py-1 text-left text-xs font-normal text-red-600">{problem}</p>}
        {!record && !problem && (
          <div aria-live="polite" className="flex items-center gap-2 py-2 text-xs font-normal text-slate-600">
            <Icon icon="solar:restart-bold-duotone" className="h-3.5 w-3.5 animate-spin text-red-600" /><span>Memuat hasil...</span>
          </div>
        )}
        {stillRunning && (
          <div aria-live="polite" className="flex items-center gap-2 py-2 text-xs font-normal text-slate-600">
            <Icon icon="solar:restart-bold-duotone" className="h-3.5 w-3.5 animate-spin text-red-600" /><span>Hasilnya masih diproses, halaman ini diperbarui otomatis...</span>
          </div>
        )}
        {finished && !record?.report && <p className="py-1 text-left text-xs font-normal text-slate-600">Pemeriksaan ini selesai tanpa laporan tersimpan.</p>}
        {record?.report && <ScanResultPanel result={record.report} resetLabel="Periksa data baru" onReset={() => router.push("/recognize")} />}
      </div>

      <Link href="/history" className="mt-3 text-xs text-slate-500 underline-offset-4 transition-colors hover:text-slate-900 hover:underline">Lihat semua riwayat pemeriksaan</Link>
    </div>
  );
}
