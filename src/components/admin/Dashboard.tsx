"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BreakdownDonut,
  DeskCardSkeleton,
  DeskNotice,
  DeskRangeControl,
  DeskTable,
  KpiCard,
  TrendChart,
  rangeLong,
  type DeskColumn,
} from "@/components/ui/app-dashboard-shell";
import { Icon } from "@/components/ui/Icon";
import { useAdminConsole } from "@/components/admin/AdminShell";
import {
  REPORT_STATUS_META,
  deskStamp,
  reportCategoryLabel,
  type ReportStatus,
  type Tone,
} from "@/lib/admin";
import {
  DESK_METRICS,
  deskCompact,
  deskKpis,
  deskNumber,
  deskPoints,
  type DeskSeriesKey,
  type DeskRecentReport,
} from "@/lib/deskStats";

// Warna chip mengikuti warna vonis di antrean, supaya kata yang sama terbaca sebagai hal yang sama
// di dua halaman.
const DOT: Record<Tone, string> = {
  queue: "var(--mark-warning)",
  approved: "var(--mark-success)",
  declined: "var(--mark-quiet)",
  spam: "var(--mark-error)",
  quiet: "var(--mark-ghost)",
};

const CHIPS: { id: string; label: string; tone: Tone }[] = [
  { id: "all", label: "Semua", tone: "quiet" },
  { id: "pending", label: "Antrean", tone: "queue" },
  { id: "verified", label: "Disetujui", tone: "approved" },
  { id: "rejected", label: "Ditolak", tone: "declined" },
  { id: "rejected_spam", label: "Spam", tone: "spam" },
];

/** Status yang datang dari layanan bisa saja nama yang belum dikenal halaman ini. */
function statusOf(value: string) {
  return REPORT_STATUS_META[value as ReportStatus] ?? { label: value, tone: "quiet" as Tone, meaning: "" };
}

/**
 * Baris yang bisa dibaca tanpa membuka antrean. Yang ditampilkan hanyalah 60 laporan terbaru dalam
 * rentang, jadi judulnya tidak boleh berpura-pura menyebut seluruhnya.
 */
const COLUMNS: DeskColumn<DeskRecentReport>[] = [
  {
    id: "number",
    header: "Nomor",
    cell: (row) => <span className="font-shell-data tabular-nums text-[color:var(--shell-text)]">{row.number_e164}</span>,
  },
  { id: "category", header: "Kategori", cell: (row) => reportCategoryLabel(row.category) },
  {
    id: "status",
    header: "Status",
    cell: (row) => {
      const meta = statusOf(row.status);
      return (
        <span className="inline-flex items-center gap-1.5" title={meta.meaning || undefined}>
          <span aria-hidden="true" className="size-1.5 rounded-full" style={{ background: DOT[meta.tone] }} />
          {meta.label}
        </span>
      );
    },
  },
  {
    id: "reporter",
    header: "Pelapor",
    cell: (row) => row.reporter_alias || "—",
    showFrom: "2xl",
  },
  {
    id: "created",
    header: "Masuk",
    align: "right",
    cell: (row) => (
      <span className="font-shell-data text-[12.5px] tabular-nums text-[color:var(--shell-text-muted)]">
        {deskStamp(row.created_at)}
      </span>
    ),
    // Hanya kolom ini yang bisa disortir: urutan bawaan tabel ini adalah yang terbaru lebih dulu,
    // dan memindah sortir default ke nomor akan menghapus urutan itu.
    sortValue: (row) => row.created_at,
    showFrom: "3xl",
  },
];

/**
 * Dasbor meja moderasi: empat angka inti, satu grafik garis untuk angka yang dipilih, rincian
 * kategori, dan pratinjau laporan terbaru. Semua angka datang dari satu permintaan per rentang yang
 * dipegang shell, jadi rail dan halaman ini membaca jawaban yang sama.
 */
export function Dashboard() {
  const { stats, statsLoading, statsError, reloadStats, range, setRange, search, setDraft, announce } = useAdminConsole();
  const [metric, setMetric] = useState<DeskSeriesKey>("reports");
  const [chip, setChip] = useState("all");

  const active = DESK_METRICS.find((item) => item.id === metric)!;
  const points = useMemo(() => (stats ? deskPoints(stats, metric) : []), [stats, metric]);

  const rows = useMemo(() => stats?.recent ?? [], [stats]);
  const counts = useMemo(() => {
    const map: Record<string, number> = { all: rows.length };
    for (const row of rows) map[row.status] = (map[row.status] ?? 0) + 1;
    return map;
  }, [rows]);

  const visible = useMemo(() => {
    const term = search.toLowerCase();
    return rows.filter((row) => {
      if (chip !== "all" && row.status !== chip) return false;
      if (!term) return true;
      return `${row.number_e164} ${reportCategoryLabel(row.category)} ${row.reporter_alias ?? ""}`
        .toLowerCase()
        .includes(term);
    });
  }, [rows, chip, search]);

  const pick = (id: DeskSeriesKey) => {
    setMetric(id);
    const label = DESK_METRICS.find((item) => item.id === id)?.label ?? id;
    announce(`Grafik menampilkan ${label}.`);
  };

  return (
    <div className="flex min-w-0 flex-col gap-4 @3xl/main:gap-5">
      <DeskRangeControl
        range={range}
        onChange={(next) => {
          setRange(next);
          announce(`Rentang diganti ke ${rangeLong(next)}.`);
        }}
      />

      {statsError ? (
        <DeskNotice
          kind="error"
          title="Angka dasbor belum bisa diambil"
          body={statsError}
          actionLabel="Coba lagi"
          onAction={reloadStats}
        />
      ) : statsLoading || !stats ? (
        <Loading />
      ) : stats.queue_total === 0 && stats.totals.accounts.current === 0 && stats.report_total === 0 ? (
        <DeskNotice
          kind="empty"
          title="Belum ada yang masuk"
          body="ThreatLens belum menerima laporan nomor apa pun, jadi tidak ada yang bisa dibandingkan. Grafik dan tabel terisi sendiri begitu warga mulai melapor."
        />
      ) : (
        <>
          <section
            aria-label="Angka inti"
            className="grid min-w-0 grid-cols-1 gap-3 @sm/main:grid-cols-2 @5xl/main:grid-cols-4"
          >
            {deskKpis(stats).map((kpi) => (
              <KpiCard
                key={kpi.id}
                kpi={kpi}
                number={deskNumber}
                selected={kpi.id === metric}
                onSelect={() => pick(kpi.id as DeskSeriesKey)}
              />
            ))}
          </section>

          <section className="grid min-w-0 gap-4 @5xl/main:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] @5xl/main:gap-5">
            <TrendChart
              title={active.label}
              noun={active.noun}
              points={points}
              rangeLabel={rangeLong(stats.range)}
              number={deskNumber}
              compact={deskCompact}
              animate
            />
            <BreakdownDonut
              title="Kategori laporan"
              noun="laporan"
              rows={stats.categories.map((item) => ({ label: reportCategoryLabel(item.label), value: item.value }))}
              number={deskNumber}
            />
          </section>

          <DeskTable
            title="Laporan terbaru"
            caption={`Pratinjau laporan nomor yang masuk pada ${rangeLong(stats.range)}, yang terbaru lebih dulu. Menampilkan ${rows.length} dari ${stats.report_total} laporan pada rentang ini.`}
            noun="laporan"
            rows={visible}
            columns={COLUMNS}
            chips={CHIPS.map((item) => ({
              id: item.id,
              label: item.label,
              count: counts[item.id] ?? 0,
              dot: DOT[item.tone],
            }))}
            activeChip={chip}
            onChip={(id) => {
              setChip(id);
              const label = CHIPS.find((item) => item.id === id)?.label ?? id;
              announce(`Menampilkan laporan berstatus ${label}.`);
            }}
            search={search}
            onClearSearch={() => {
              setChip("all");
              setDraft("");
            }}
            emptyTitle="Belum ada laporan pada rentang ini"
            emptyBody="Pilih rentang yang lebih panjang di kanan atas, atau buka antrean laporan untuk melihat laporan yang masuk sebelumnya."
            announce={announce}
            extra={
              <Link
                href="/admin/laporan"
                className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-[8px] border border-[color:var(--shell-border)] px-2.5 text-[12.5px] text-[color:var(--shell-text-muted)] transition-colors duration-150 hover:bg-[var(--shell-hover)] hover:text-[color:var(--shell-text)] motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--shell-focus)]"
              >
                <Icon icon="solar:bill-list-linear" className="size-4" />
                Buka antrean laporan
              </Link>
            }
          />
        </>
      )}
    </div>
  );
}

function Loading() {
  return (
    <div className="flex min-w-0 flex-col gap-4 @3xl/main:gap-5">
      <div className="grid min-w-0 grid-cols-1 gap-3 @sm/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[0, 1, 2, 3].map((index) => (
          <DeskCardSkeleton key={index} rows={1} />
        ))}
      </div>
      <div className="grid min-w-0 gap-4 @5xl/main:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] @5xl/main:gap-5">
        <DeskCardSkeleton rows={6} />
        <DeskCardSkeleton rows={4} />
      </div>
      <DeskCardSkeleton rows={6} />
    </div>
  );
}
