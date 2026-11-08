"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ErrorToast, SuccessToast } from "@/components/ui/Toast";
import { messageForError } from "@/hooks/useScanner";
import { api } from "@/lib/api";
import { timeAgo } from "@/lib/community";
import {
  isScanFinished,
  scanKindLabel,
  scanTargetLabel,
} from "@/lib/scanRecord";
import { scanResultPath } from "@/lib/paths";

const PAGE_SIZE = 20;

type ScanTab = "all" | "phone" | "url" | "application";

type ScanRow = {
  id: string;
  type: string;
  status: string;
  input_ref: string | null;
  outcome: string | null;
  risk_level: string | null;
  created_at: string;
};

type AggregatedScanItem = {
  key: string;
  type: string;
  input_ref: string | null;
  target: string;
  count: number;
  latestId: string;
  latestCreatedAt: string;
  status: string;
  outcome: string | null;
  risk_level: string | null;
  items: ScanRow[];
};

const TABS: { id: ScanTab; label: string; icon: string }[] = [
  { id: "all", label: "Semua", icon: "solar:history-linear" },
  { id: "phone", label: "Nomor Telepon", icon: "solar:phone-bold-duotone" },
  { id: "url", label: "Tautan Web", icon: "solar:link-bold-duotone" },
  { id: "application", label: "Berkas APK", icon: "solar:shield-warning-bold-duotone" },
];

/**
 * Returns visual indicator classes and labels based on scan verdict and threat risk level.
 */
function verdictOf(row: { status: string; outcome: string | null; risk_level: string | null }) {
  if (!isScanFinished(row.status)) {
    return {
      label: "MASIH DIPROSES",
      textClass: "text-slate-500 font-medium",
      iconClass: "bg-slate-100 text-slate-700",
    };
  }
  if (row.risk_level === "high" || row.outcome === "confirmed_threat" || row.outcome === "suspicious") {
    return {
      label: "BAHAYA",
      textClass: "text-red-600 font-bold",
      iconClass: "bg-red-50 text-red-600 border border-red-100",
    };
  }
  if (row.risk_level === "medium") {
    return {
      label: "WASPADA",
      textClass: "text-amber-600 font-semibold",
      iconClass: "bg-amber-50 text-amber-600 border border-amber-100",
    };
  }
  if (row.risk_level === "low" || row.outcome === "benign") {
    return {
      label: "AMAN",
      textClass: "text-emerald-600 font-semibold",
      iconClass: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    };
  }
  return {
    label: "BELUM TERVERIFIKASI",
    textClass: "text-slate-500 font-medium",
    iconClass: "bg-slate-100 text-slate-700",
  };
}

/**
 * Inspection history list component:
 * Features smart deduplication aggregation, ThreatLens red brand accents, category counts,
 * instant copy/dismiss quick-actions, and responsive mobile-first typography.
 */
export function HistoryList() {
  const [rows, setRows] = useState<ScanRow[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [exhausted, setExhausted] = useState(false);
  const [problem, setProblem] = useState("");
  const [activeTab, setActiveTab] = useState<ScanTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [groupDuplicates, setGroupDuplicates] = useState(true);
  const [copiedTarget, setCopiedTarget] = useState("");
  const [notification, setNotification] = useState("");
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("threatlens_dismissed_scans");
        return stored ? new Set(JSON.parse(stored)) : new Set();
      } catch {
        return new Set();
      }
    }
    return new Set();
  });

  const persistDismissed = useCallback((updated: Set<string>) => {
    setDismissedIds(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "threatlens_dismissed_scans",
          JSON.stringify(Array.from(updated)),
        );
      } catch {
        // Ignore storage write issues
      }
    }
  }, []);

  const load = useCallback(
    async (from: number, tab: ScanTab) => {
      setLoading(true);
      setProblem("");
      try {
        const typeParam =
          tab === "all" ? "url,phone,application" : tab;
        const data = (await api(
          `/api/v1/scans?type=${typeParam}&limit=${PAGE_SIZE}&offset=${from}`,
        )) as { scans?: ScanRow[] };
        const page = data.scans ?? [];
        setRows((current) => (from === 0 ? page : [...current, ...page]));
        setOffset(from + page.length);
        setExhausted(page.length < PAGE_SIZE);
      } catch (error) {
        setProblem(messageForError(error instanceof Error ? error.message : null));
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    let live = true;
    const timer = setTimeout(() => {
      if (live) void load(0, activeTab);
    }, 0);
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [activeTab, load]);

  // Filter out locally dismissed rows
  const visibleRows = useMemo(() => {
    return rows.filter((r) => !dismissedIds.has(r.id));
  }, [rows, dismissedIds]);

  // Compute category counts for tab pills
  const counts = useMemo(() => {
    return {
      all: visibleRows.length,
      phone: visibleRows.filter((r) => r.type === "phone").length,
      url: visibleRows.filter((r) => r.type === "url").length,
      application: visibleRows.filter((r) => r.type === "application").length,
    };
  }, [visibleRows]);

  // Filter rows based on search query
  const searchMatchedRows = useMemo(() => {
    if (!searchQuery.trim()) return visibleRows;
    const q = searchQuery.toLowerCase().trim();
    return visibleRows.filter((row) => {
      const target = (scanTargetLabel(row.type, row.input_ref) || "").toLowerCase();
      const rawRef = (row.input_ref || "").toLowerCase();
      return target.includes(q) || rawRef.includes(q);
    });
  }, [visibleRows, searchQuery]);

  // Smart deduplication grouping: unites multiple scans of the same target into one clean row
  const aggregatedItems: AggregatedScanItem[] = useMemo(() => {
    if (!groupDuplicates) {
      return searchMatchedRows.map((row) => ({
        key: row.id,
        type: row.type,
        input_ref: row.input_ref,
        target: scanTargetLabel(row.type, row.input_ref) || scanKindLabel(row.type),
        count: 1,
        latestId: row.id,
        latestCreatedAt: row.created_at,
        status: row.status,
        outcome: row.outcome,
        risk_level: row.risk_level,
        items: [row],
      }));
    }

    const groupMap = new Map<string, AggregatedScanItem>();
    for (const row of searchMatchedRows) {
      const display = scanTargetLabel(row.type, row.input_ref) || scanKindLabel(row.type);
      const groupKey = `${row.type}::${(row.input_ref || display).toLowerCase().trim()}`;
      const existing = groupMap.get(groupKey);

      if (!existing) {
        groupMap.set(groupKey, {
          key: groupKey,
          type: row.type,
          input_ref: row.input_ref,
          target: display,
          count: 1,
          latestId: row.id,
          latestCreatedAt: row.created_at,
          status: row.status,
          outcome: row.outcome,
          risk_level: row.risk_level,
          items: [row],
        });
      } else {
        existing.count += 1;
        existing.items.push(row);
        // Elevate risk level if any scan within the group detected a threat
        if (row.risk_level === "high" || row.outcome === "suspicious") {
          existing.risk_level = "high";
          existing.outcome = row.outcome;
        } else if (existing.risk_level !== "high" && row.risk_level === "medium") {
          existing.risk_level = "medium";
          existing.outcome = row.outcome;
        }
      }
    }
    return Array.from(groupMap.values());
  }, [searchMatchedRows, groupDuplicates]);

  const hiddenDuplicatesCount = searchMatchedRows.length - aggregatedItems.length;

  const handleCopy = (e: React.MouseEvent, text: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedTarget(text);
      setTimeout(() => setCopiedTarget(""), 2000);
    }
  };

  const handleDismiss = (e: React.MouseEvent, items: ScanRow[]) => {
    e.preventDefault();
    e.stopPropagation();
    const next = new Set(dismissedIds);
    for (const it of items) next.add(it.id);
    persistDismissed(next);
    setNotification("Item berhasil dihapus dari riwayat.");
    setTimeout(() => setNotification(""), 3000);
  };

  const handleClearAll = () => {
    const next = new Set(dismissedIds);
    for (const it of visibleRows) next.add(it.id);
    persistDismissed(next);
    setNotification("Semua riwayat pada tampilan berhasil dibersihkan.");
    setTimeout(() => setNotification(""), 3500);
  };

  return (
    <section className="mt-6 space-y-4 text-left">
      {/* 1. Quick Search Bar with ThreatLens Red Focus Accent */}
      <div className="group relative w-full">
        <Icon
          icon="solar:magnifer-linear"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-red-600 transition-colors"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nomor telepon, tautan web, atau nama berkas APK..."
          className="w-full rounded-2xl border border-slate-200/90 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs sm:text-sm font-normal text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/15 focus:border-red-500 focus:bg-white transition-all"
        />
      </div>

      {/* 2. Category Filter Pills with Red Brand Accents and Counts */}
      <div className="flex flex-wrap items-center gap-1.5 select-none">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = counts[tab.id];

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setRows([]);
                setOffset(0);
              }}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-all ${
                isActive
                  ? "bg-red-50 text-red-700 border border-red-200/90 font-medium shadow-2xs"
                  : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 border border-transparent"
              }`}
            >
              <Icon
                icon={tab.icon}
                className={`h-3.5 w-3.5 ${isActive ? "text-red-600" : "text-slate-500"}`}
              />
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-medium ${
                  isActive
                    ? "bg-red-100 text-red-700"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Utility Toolbar: Deduplication Toggle & Clear View */}
      {visibleRows.length > 0 && (
        <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-0.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setGroupDuplicates((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition-colors border ${
                groupDuplicates
                  ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
              title={
                groupDuplicates
                  ? "Klik untuk menampilkan setiap riwayat secara terpisah"
                  : "Klik untuk menyatukan riwayat target yang sama"
              }
            >
              <Icon icon="solar:history-linear" className="h-3 w-3" />
              <span>Gabungkan duplikat</span>
              {hiddenDuplicatesCount > 0 && groupDuplicates && (
                <span className="text-[10px] opacity-75">
                  ({hiddenDuplicatesCount} disatukan)
                </span>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-600 transition-colors py-1 px-2 rounded-lg hover:bg-red-50"
          >
            <Icon icon="solar:trash-bin-trash-bold-duotone" className="h-3.5 w-3.5" />
            <span>Kosongkan riwayat</span>
          </button>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <SuccessToast
          title="Riwayat diperbarui"
          description={notification}
        />
      )}

      {/* Error Toast */}
      {problem && (
        <ErrorToast
          title="Gagal memuat riwayat"
          description={problem}
        />
      )}

      {/* 4. Result List with Vertical Risk Borders */}
      {aggregatedItems.length > 0 && (
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xs text-left">
          {aggregatedItems.map((item) => {
            const href = scanResultPath(item.type, item.latestId, item.input_ref);
            const verdict = verdictOf(item);
            const isPhone = item.type === "phone";

            const rowContent = (
              <div
                className="group flex items-center justify-between gap-3.5 p-4 sm:p-4.5 transition-colors hover:bg-slate-50/70"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1 text-left">
                  <div
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${verdict.iconClass}`}
                  >
                    <Icon
                      icon={
                        item.type === "phone"
                          ? "solar:phone-bold-duotone"
                          : item.type === "url"
                            ? "solar:link-bold-duotone"
                            : "solar:shield-warning-bold-duotone"
                      }
                      className="h-5 w-5"
                    />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <span
                      className={`block truncate text-xs sm:text-sm font-normal text-slate-900 text-left ${
                        isPhone ? "font-mono" : ""
                      }`}
                      title={item.target}
                    >
                      {item.target}
                    </span>
                    <span className="mt-0.5 block text-xs font-normal text-slate-400 text-left">
                      {scanKindLabel(item.type)} &middot;{" "}
                      {item.count > 1 ? (
                        <span className="font-medium text-slate-700">
                          Diperiksa {item.count}x &middot; Terakhir {timeAgo(item.latestCreatedAt)}
                        </span>
                      ) : (
                        `Diperiksa ${timeAgo(item.latestCreatedAt)}`
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`shrink-0 text-xs tracking-wide ${verdict.textClass}`}
                  >
                    {verdict.label}
                  </span>

                  {/* Interactive Quick Actions on Row */}
                  <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => handleCopy(e, item.target)}
                      title="Salin target"
                      className="grid h-7 w-7 place-items-center rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                    >
                      <Icon
                        icon={
                          copiedTarget === item.target
                            ? "solar:check-circle-linear"
                            : "solar:copy-linear"
                        }
                        className={`h-3.5 w-3.5 ${
                          copiedTarget === item.target ? "text-emerald-600" : ""
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDismiss(e, item.items)}
                      title="Hapus dari riwayat"
                      className="grid h-7 w-7 place-items-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Icon
                        icon="solar:trash-bin-trash-bold-duotone"
                        className="h-3.5 w-3.5"
                      />
                    </button>
                  </div>

                  <Icon
                    icon="solar:alt-arrow-right-linear"
                    className="h-4 w-4 text-slate-300 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all"
                  />
                </div>
              </div>
            );

            return (
              <li key={item.key}>
                {href ? (
                  <Link href={href} className="block text-left">
                    {rowContent}
                  </Link>
                ) : (
                  <div>{rowContent}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* 5. Empty State: Search yielded no matches */}
      {visibleRows.length > 0 && aggregatedItems.length === 0 && !loading && (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-8 text-center space-y-2">
          <Icon icon="solar:magnifer-linear" className="mx-auto h-6 w-6 text-slate-300" />
          <p className="text-xs sm:text-sm font-normal text-slate-800">
            Tidak ditemukan riwayat yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-xs font-normal text-red-600 hover:text-red-700 transition-colors underline pt-1"
          >
            Hapus filter pencarian
          </button>
        </div>
      )}

      {/* 6. Empty State: Category has no records yet */}
      {visibleRows.length === 0 && !loading && !problem && (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-8 sm:p-10 text-center space-y-2">
          <Icon icon="solar:history-linear" className="mx-auto h-8 w-8 text-slate-300" />
          <p className="text-sm font-normal text-slate-800">
            {activeTab === "all"
              ? "Belum ada riwayat pemeriksaan tersimpan."
              : `Belum ada riwayat pemeriksaan ${
                  activeTab === "phone"
                    ? "nomor telepon"
                    : activeTab === "url"
                      ? "tautan web"
                      : "berkas APK"
                }.`}
          </p>
          <p className="mx-auto max-w-sm text-xs font-normal leading-relaxed text-slate-400">
            Setiap nomor telepon, tautan situs, atau berkas APK yang Anda periksa akan muncul di sini.
          </p>
          <div className="pt-2">
            <Link
              href="/recognize"
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-red-700 shadow-xs"
            >
              <Icon icon="solar:magnifer-linear" className="h-4 w-4" />
              <span>Mulai memeriksa</span>
            </Link>
          </div>
        </div>
      )}

      {/* 7. Pagination / Load More */}
      {visibleRows.length > 0 &&
        (exhausted ? (
          <p className="pt-2 text-center text-xs font-normal text-slate-400">
            Semua riwayat sudah ditampilkan.
          </p>
        ) : (
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              disabled={loading}
              onClick={() => void load(offset, activeTab)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-normal text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 disabled:opacity-50"
            >
              {loading && (
                <Icon
                  icon="solar:restart-linear"
                  className="h-3.5 w-3.5 animate-spin text-slate-500"
                />
              )}
              <span>{loading ? "Memuat..." : "Muat lebih banyak"}</span>
            </button>
          </div>
        ))}
    </section>
  );
}
