"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { api } from "@/lib/api";
import { timeAgo } from "@/lib/community";
import {
  isScanFinished,
  scanKindLabel,
  SCAN_KIND_META,
  scanOutcomeLabel,
  scanTargetLabel,
} from "@/lib/scanRecord";
import { scanResultPath } from "@/lib/paths";

type ScanRow = {
  id: string;
  type: string;
  status: string;
  input_ref: string | null;
  outcome: string | null;
  risk_level: string | null;
  created_at: string;
};

const VERDICT_TONES = {
  red: "border-red-200 bg-red-50/70 text-red-700",
  amber: "border-amber-200 bg-amber-50/70 text-amber-700",
  green: "border-emerald-200 bg-emerald-50/70 text-emerald-700",
  slate: "border-slate-200 bg-slate-50 text-slate-600",
};

function verdictOf(row: ScanRow) {
  if (!isScanFinished(row.status)) {
    return { label: "Masih diproses", tone: VERDICT_TONES.slate };
  }
  return {
    label: scanOutcomeLabel(row.outcome),
    tone:
      row.risk_level === "high"
        ? VERDICT_TONES.red
        : row.risk_level === "medium"
          ? VERDICT_TONES.amber
          : row.risk_level === "low" || row.outcome === "benign"
            ? VERDICT_TONES.green
            : VERDICT_TONES.slate,
  };
}

/**
 * Compact recent scans card displayed directly under the scanner on the workspace page.
 */
export function RecentHistoryCard() {
  const [rows, setRows] = useState<ScanRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function fetchRecentScans() {
      try {
        const data = (await api(
          "/api/v1/scans?type=url,phone,application&limit=4&offset=0",
        )) as { scans?: ScanRow[] };
        if (active) {
          setRows(data.scans ?? []);
        }
      } catch {
        // Silently catch error to avoid interrupting the main scanner interface
      } finally {
        if (active) setLoading(false);
      }
    }

    void fetchRecentScans();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-6 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div className="h-4 w-28 bg-slate-100 rounded animate-pulse mb-3" />
        <div className="space-y-2">
          <div className="h-10 bg-slate-50 rounded-xl animate-pulse" />
          <div className="h-10 bg-slate-50 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-6 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="text-md font-medium tracking-tight text-slate-800">
            History
          </span>
        </div>
        <p className="text-xs text-slate-400 font-normal py-5 text-center">
          Belum ada riwayat
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <span className="text-xs font-medium tracking-tight text-slate-800">
          History
        </span>
        <Link
          href="/history"
          className="text-xs text-slate-500 hover:text-red-600 transition-colors inline-flex items-center gap-1"
        >
          <span>Lihat Semua</span>
          <span>&rarr;</span>
        </Link>
      </div>

      <ul className="divide-y divide-slate-100 mt-1">
        {rows.map((row) => {
          const href = scanResultPath(row.type, row.id, row.input_ref);
          const verdict = verdictOf(row);
          const target =
            scanTargetLabel(row.type, row.input_ref) || scanKindLabel(row.type);

          const content = (
            <div className="flex items-center gap-3 py-3 w-full">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-700">
                <Icon
                  icon={
                    SCAN_KIND_META[row.type]?.icon ??
                    "solar:shield-check-bold-duotone"
                  }
                  className="h-4 w-4"
                />
              </span>
              <div className="min-w-0 flex-1 text-left">
                <span
                  className="block truncate text-xs sm:text-sm font-normal text-slate-900"
                  title={target}
                >
                  {target}
                </span>
                <span className="block text-[11px] text-slate-400">
                  {scanKindLabel(row.type)} &middot; {timeAgo(row.created_at)}
                </span>
              </div>
              <span
                className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${verdict.tone}`}
              >
                {verdict.label}
              </span>
            </div>
          );

          return (
            <li key={row.id}>
              {href ? (
                <Link
                  href={href}
                  className="block rounded-lg px-1.5 transition-colors hover:bg-slate-50"
                >
                  {content}
                </Link>
              ) : (
                <div className="px-1.5">{content}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
