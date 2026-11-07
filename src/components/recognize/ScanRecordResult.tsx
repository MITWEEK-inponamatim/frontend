"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { ErrorToast } from "@/components/ui/Toast";
import { ScanResultPanel } from "@/components/recognize/ScanResultPanel";
import { messageForError, type ScanResult } from "@/hooks/useScanner";
import { api } from "@/lib/api";
import { timeAgo } from "@/lib/community";
import {
  isScanFinished,
  scanKindLabel,
  SCAN_KIND_META,
  scanTargetLabel,
} from "@/lib/scanRecord";
import { scanResultPath } from "@/lib/paths";

type RecordKind = "url" | "application";
type ScanRecord = {
  id: string;
  type: string;
  status: string;
  created_at: string;
  input_ref?: string | null;
  report?: ScanResult | null;
};

/**
 * Reconstructed Forensic Scan Record Result for URLs and APKs:
 * Target header and clean left-aligned section title positioned outside before the card,
 * maintaining platform-wide consistency with zero AI design gimmicks.
 *
 * @param scanId - Unique identifier of the scan record.
 * @param kind - Analysis target category: "url" or "application".
 */
export function ScanRecordResult({
  scanId,
  kind,
}: {
  scanId: string;
  kind: RecordKind;
}) {
  const router = useRouter();
  const [record, setRecord] = useState<ScanRecord | null>(null);
  const [problem, setProblem] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let live = true;
    const load = async (isFirstLoad: boolean) => {
      try {
        const row = (await api(
          `/api/v1/scans/${scanId}`,
          isFirstLoad ? undefined : { headers: { "X-Activity": "passive" } },
        )) as ScanRecord;
        if (!live) return;
        if (row.type !== kind) {
          router.replace(scanResultPath(row.type, row.id) ?? "/recognize");
          return;
        }
        setRecord(row);
        if (!isScanFinished(row.status)) {
          setTimeout(() => void load(false), 2500);
        }
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

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const meta = SCAN_KIND_META[kind];
  const target = scanTargetLabel(kind, record?.input_ref);
  const finished = !!record && isScanFinished(record.status);
  const stillRunning = !!record && !finished;

  return (
    <div className="mx-auto flex w-full max-w-3xl lg:max-w-4xl flex-col space-y-4 text-left">
      {/* 1. Top Breadcrumb & Share Trigger */}
      <div className="flex w-full items-center justify-between px-1 text-xs font-normal text-slate-500">
        <Link
          href="/recognize"
          className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <Icon icon="solar:arrow-left-linear" className="h-3.5 w-3.5" />
          <span>Kembali ke detektor</span>
        </Link>

        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 text-xs font-normal text-slate-500 hover:text-slate-900 transition-colors"
        >
          <Icon
            icon={copied ? "solar:check-circle-linear" : "solar:copy-linear"}
            className={`h-3.5 w-3.5 ${copied ? "text-[#34C759]" : "text-slate-400"}`}
          />
          <span>{copied ? "Tautan tersalin" : "Salin tautan"}</span>
        </button>
      </div>

      {/* 2. Target Header (Outside before the card) */}
      <div className="w-full text-left pt-1">
        <div className="flex items-start gap-3.5 text-left">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-900 text-white shadow-2xs">
            <Icon icon={meta.icon} className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1 text-left">
            <h1 className="break-all text-lg sm:text-xl font-normal text-slate-900 font-mono tracking-tight leading-snug text-left">
              {target || "Target pemeriksaan"}
            </h1>
            <div className="flex items-center gap-1.5 text-xs font-normal text-slate-400 mt-1 text-left">
              <span>{scanKindLabel(kind)}</span>
              {record && (
                <span>
                  &middot; Diperiksa {timeAgo(record.created_at)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Section Title (H2 text-left on the left, NO sub-headline) */}
      <div className="w-full text-left pt-1">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight text-left">
          Hasil evaluasi risiko
        </h2>
      </div>

      {/* 4. THE SINGLE UNIFIED RESULT CARD */}
      <div className="w-full rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs space-y-4 text-left">
        {/* Error state */}
        {problem && (
          <ErrorToast
            title="Gagal memuat hasil pemindaian"
            description={problem}
          />
        )}

        {/* Polling / Running Skeleton */}
        {!record && !problem && (
          <div
            aria-live="polite"
            className="flex flex-col items-center justify-center py-12 text-center text-xs font-normal text-slate-500 space-y-2"
          >
            <Icon
              icon="solar:restart-linear"
              className="h-6 w-6 animate-spin text-slate-500"
            />
            <p>Memuat rekam laporan forensik...</p>
          </div>
        )}

        {stillRunning && (
          <div
            aria-live="polite"
            className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 text-center space-y-2"
          >
            <Icon
              icon="solar:restart-linear"
              className="mx-auto h-5 w-5 animate-spin text-slate-500"
            />
            <p className="text-xs font-normal text-slate-700">
              Analisis masih berlangsung di worker terisolasi ThreatLens.
            </p>
            <p className="text-[11px] font-normal text-slate-400">
              Halaman ini akan diperbarui otomatis saat proses selesai...
            </p>
          </div>
        )}

        {finished && !record?.report && (
          <p className="py-8 text-center text-xs font-normal text-slate-400">
            Pemeriksaan ini selesai tanpa laporan forensik tersimpan.
          </p>
        )}

        {/* Finished Verdict Report */}
        {record?.report && (
          <ScanResultPanel
            result={record.report}
            resetLabel="Periksa data baru"
            onReset={() => router.push("/recognize")}
          />
        )}
      </div>
    </div>
  );
}
