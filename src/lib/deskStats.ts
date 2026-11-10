"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { adminMessage } from "@/lib/admin";
import type { DeskKpi, DeskPoint, DeskRange } from "@/components/ui/app-dashboard-shell";

/* -----------------------------------------------------------------------------------------------
 * Bentuk jawaban /api/v1/admin/stats/desk
 * ---------------------------------------------------------------------------------------------- */

export type DeskSeriesKey = "accounts" | "reports" | "posts" | "numbers";

export type DeskBucket = "day" | "week" | "month";

type DeskWindow = { current: number; previous: number };

export type DeskStatusCounts = {
  pending: number;
  verified: number;
  rejected: number;
  rejected_spam: number;
};

export type DeskRecentReport = {
  id: string;
  number_e164: string;
  category: string;
  status: string;
  /** Ditulis Go dari akun pelapor, sama seperti di antrean: nomor akun tidak pernah ke browser. */
  reporter_alias?: string;
  evidence_url: string;
  created_at: string;
};

export type DeskStatsPayload = {
  range: DeskRange;
  bucket: DeskBucket;
  totals: Record<DeskSeriesKey, DeskWindow>;
  series: Record<DeskSeriesKey, { bucket: string; current: number; previous: number }[]>;
  categories: { label: string; value: number }[];
  statuses: DeskStatusCounts;
  /** Semua laporan yang pernah masuk, di luar rentang apa pun: inilah isi antrean hari ini. */
  queue_total: number;
  /** Laporan yang masuk di dalam rentang terpilih. */
  report_total: number;
  dangerous: number;
  recent: DeskRecentReport[];
};

/* -----------------------------------------------------------------------------------------------
 * Bentuk angka dan tanggal
 * ---------------------------------------------------------------------------------------------- */

const FULL = new Intl.NumberFormat("id-ID");
const COMPACT = new Intl.NumberFormat("id-ID", { notation: "compact", maximumFractionDigits: 1 });
const DAY_LABEL = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" });
const DAY_YEAR_LABEL = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" });
const MONTH_LABEL = new Intl.DateTimeFormat("id-ID", { month: "short" });
const MONTH_YEAR_LABEL = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" });

export function deskNumber(value: number) {
  return FULL.format(value);
}

export function deskCompact(value: number) {
  return COMPACT.format(Math.round(value));
}

// Label dibaca dari tanggal bucket apa adanya, jadi satu bucket selalu punya label yang sama
// sepanjang sesi; tidak ada "hari ini" yang ikut bergeser saat halaman masih terbuka.
function bucketMoment(iso: string) {
  const [date] = iso.split("T");
  const [year, month, day] = (date ?? iso).split("-").map(Number);
  return new Date(Date.UTC(year ?? 2000, (month ?? 1) - 1, day ?? 1));
}

function bucketLabels(bucket: DeskBucket, iso: string) {
  const moment = bucketMoment(iso);
  if (bucket === "month") {
    return { tick: MONTH_LABEL.format(moment), label: MONTH_YEAR_LABEL.format(moment) };
  }
  const short = DAY_LABEL.format(moment);
  const full = DAY_YEAR_LABEL.format(moment);
  // Minggu dilabeli dari hari pertamanya: date_trunc('week') Postgres menghasilkan hari Senin.
  return { tick: short, label: bucket === "week" ? `Pekan ${full}` : full };
}

function toPoints(rows: DeskStatsPayload["series"][DeskSeriesKey], bucket: DeskBucket): DeskPoint[] {
  return rows.map((row) => ({ ...bucketLabels(bucket, row.bucket), current: row.current, previous: row.previous }));
}

/** Urutan kartu metrik = urutan deret yang bisa dipilih pada grafik. */
export const DESK_METRICS: { id: DeskSeriesKey; label: string; noun: string }[] = [
  { id: "accounts", label: "Akun baru", noun: "akun" },
  { id: "reports", label: "Laporan nomor berbahaya", noun: "laporan" },
  { id: "posts", label: "Cerita warga", noun: "cerita" },
  { id: "numbers", label: "Nomor berbeda dilaporkan", noun: "nomor" },
];

export function deskKpis(payload: DeskStatsPayload): DeskKpi[] {
  return DESK_METRICS.map((metric) => {
    const window = payload.totals[metric.id];
    const series = payload.series[metric.id] ?? [];
    return {
      id: metric.id,
      label: metric.label,
      value: window?.current ?? 0,
      previous: window?.previous ?? 0,
      spark: series.map((row) => row.current),
    };
  });
}

export function deskPoints(payload: DeskStatsPayload, key: DeskSeriesKey) {
  return toPoints(payload.series[key] ?? [], payload.bucket);
}

/* -----------------------------------------------------------------------------------------------
 * Pengambilan
 * ---------------------------------------------------------------------------------------------- */

/**
 * Satu permintaan untuk satu rentang, dipakai bersama oleh rail (angka antrean dan nomor berbahaya)
 * dan halaman Dasbor. Jawaban lama tidak pernah dipakai ulang: snapshot yang tidak lagi cocok dengan
 * rentang yang diminta dianggap belum tiba, sama seperti di antrean moderasi.
 */
export function useDeskStats(range: DeskRange) {
  const [snapshot, setSnapshot] = useState<{ range: DeskRange; payload: DeskStatsPayload } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [revision, setRevision] = useState(0);
  const request = useRef(0);

  useEffect(() => {
    const token = ++request.current;
    void (async () => {
      try {
        const query = new URLSearchParams({ range });
        const payload = (await api(`/api/v1/admin/stats/desk?${query.toString()}`, {
          headers: { "X-Activity": "passive" },
        })) as DeskStatsPayload;
        if (request.current !== token) return;
        setSnapshot({ range, payload });
        setErrorMessage("");
      } catch (failure) {
        if (request.current !== token) return;
        setSnapshot(null);
        setErrorMessage(adminMessage(failure instanceof Error ? failure.message : null));
      }
    })();
  }, [range, revision]);

  const reload = useCallback(() => setRevision((current) => current + 1), []);

  const current = snapshot !== null && snapshot.range === range;

  return {
    payload: current ? snapshot.payload : null,
    loading: !current && !errorMessage,
    errorMessage,
    reload,
  };
}
