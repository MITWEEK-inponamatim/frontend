"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import {
  AppDashboardShell,
  type DeskMeter,
  type DeskNavGroup,
  type DeskRange,
} from "@/components/ui/app-dashboard-shell";
import { useAnnouncer } from "@/components/ui/app-dashboard-shell-utils/app-block-kit";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Icon } from "@/components/ui/Icon";
import { IdleSessionMonitor } from "@/components/auth/IdleSessionMonitor";
import { useAdminRole } from "@/hooks/useIsAdmin";
import { createClient } from "@/lib/supabase/client";
import { api } from "@/lib/api";
import { ADMIN_ROUTES, searchPlaceholder, type AdminRouteId } from "@/lib/admin";
import { useDeskStats, type DeskStatsPayload } from "@/lib/deskStats";

// Satu kali diukur pada kerangkanya sendiri, bukan pada layar: jendela console yang berdiri di
// samping monitor lebar tetap tidak punya tempat untuk rail.
const RAIL_KEY = "threatlens.desk.rail";
const SEARCH_DELAY_MS = 350;

// Lebar rail diingat antar-kunjungan lewat localStorage, bukan disalin ke state saat mount:
// salinan saat mount membuat rail yang render lebar lalu mengecil dengan tiba-tiba.
const railListeners = new Set<() => void>();

function subscribeRail(listener: () => void) {
  railListeners.add(listener);
  return () => {
    railListeners.delete(listener);
  };
}

function readRail() {
  return typeof window !== "undefined" && localStorage.getItem(RAIL_KEY) === "1";
}

function readRailBeforeHydration() {
  return false;
}

function writeRail(collapsed: boolean) {
  localStorage.setItem(RAIL_KEY, collapsed ? "1" : "0");
  for (const listener of railListeners) listener();
}

type Profile = { name: string; email: string };

type ConsoleValue = {
  /** Pencarian yang benar-benar dipakai halaman, tertinggal satu debounce dari yang diketik. */
  search: string;
  draft: string;
  setDraft: (value: string) => void;
  announce: (message: string) => void;
  route: AdminRouteId;
  profile: Profile;
  /** Rentang waktu dasbor. Dipegang shell supaya angka rail dan halaman memakai satu jawaban API. */
  range: DeskRange;
  setRange: (range: DeskRange) => void;
  stats: DeskStatsPayload | null;
  statsLoading: boolean;
  statsError: string;
  reloadStats: () => void;
};

const ConsoleContext = createContext<ConsoleValue | null>(null);

export function useAdminConsole() {
  const value = useContext(ConsoleContext);
  if (!value) throw new Error("useAdminConsole hanya bisa dipakai di dalam AdminShell");
  return value;
}

/**
 * Meja moderasi: satu shell untuk tiga halaman. Rail bisa dikecilkan dan berubah jadi drawer begitu
 * containernya sempit, pencarian hidup di header (tombol "/" memfokuskannya), dan seluruh angka
 * dasor diambil sekali per rentang agar badge antrean di rail dan kartu di halaman membaca jawaban
 * dari permintaan yang sama.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const route = useMemo<AdminRouteId>(() => {
    const match = ADMIN_ROUTES.find((item) => pathname.startsWith(item.href));
    return match ? (match.id as AdminRouteId) : "dasbor";
  }, [pathname]);

  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [profile, setProfile] = useState<Profile>({ name: "", email: "" });
  const [range, setRange] = useState<DeskRange>("30d");
  const [leaving, setLeaving] = useState(false);
  const [leavingBusy, setLeavingBusy] = useState(false);
  const { announce, region } = useAnnouncer();
  const collapsed = useSyncExternalStore(subscribeRail, readRail, readRailBeforeHydration);
  const { payload: stats, loading: statsLoading, errorMessage: statsError, reload: reloadStats } = useDeskStats(range);

  // Dua antrean, dua pertanyaan: pencarian yang diketik untuk Laporan nomor tidak boleh diam-diam
  // menyaring Cerita warga.
  const [lastRoute, setLastRoute] = useState(route);
  if (lastRoute !== route) {
    setLastRoute(route);
    setDraft("");
    setSearch("");
  }

  useEffect(() => {
    const timer = setTimeout(() => setSearch(draft.trim()), SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [draft]);

  useEffect(() => {
    void (async () => {
      const { data } = await createClient().auth.getSession();
      const meta = (data.session?.user.user_metadata ?? {}) as { full_name?: string; name?: string };
      setProfile({ name: meta.full_name ?? meta.name ?? "", email: data.session?.user.email ?? "" });
    })();
  }, []);

  // Sesi biasa yang mengetik /admin dengan tangan dikembalikan lewat pintu moderator, bukan
  // dibiarkan di sini membaca 403: meja ini bukan halaman yang tumbuh bersama akun.
  const role = useAdminRole();
  useEffect(() => {
    if (role === "user") location.replace("/admin/login?reason=forbidden");
  }, [role]);

  useEffect(() => {
    if (statsError) announce(statsError);
  }, [statsError, announce]);

  const signOut = async () => {
    setLeavingBusy(true);
    await api("/api/v1/auth/logout", { method: "POST" }).catch(() => {});
    await createClient().auth.signOut();
    // Muat ulang penuh, bukan navigasi client: pengecekan peran di atas akan menggambar ulang
    // meja sebentar lalu memantul keluar untuk kedua kalinya.
    location.replace("/admin/login");
  };

  const nav = useMemo<DeskNavGroup[]>(() => {
    const pending = stats ? stats.statuses.pending : 0;
    const badge = pending > 0 ? String(pending) : undefined;
    const item = (id: AdminRouteId) => ADMIN_ROUTES.find((entry) => entry.id === id)!;
    return [
      { label: "Ringkasan", items: [{ ...item("dasbor"), id: "dasbor" }] },
      {
        label: "Antrean moderasi",
        items: [{ ...item("laporan"), id: "laporan", badge }, { ...item("posting"), id: "posting" }],
      },
      {
        label: "Komunitas",
        items: [
          { id: "papan", href: "/community/latest", label: "Papan warga", icon: "solar:eye-linear" },
        ],
      },
    ];
  }, [stats]);

  const meter = useMemo<DeskMeter | undefined>(() => {
    if (!stats) return undefined;
    const { pending } = stats.statuses;
    const total = stats.queue_total;
    return {
      label: "Antrean keputusan",
      value: total === 0 ? "kosong" : `${pending} / ${total}`,
      ratio: total === 0 ? 0 : pending / total,
      ratioLabel: "Laporan yang belum diputuskan",
      footnote: `${stats.dangerous} nomor kini tampil sebagai berbahaya di papan warga.`,
    };
  }, [stats]);

  const value: ConsoleValue = {
    search,
    draft,
    setDraft,
    announce,
    route,
    profile,
    range,
    setRange,
    stats,
    statsLoading,
    statsError,
    reloadStats,
  };

  return (
    <ConsoleContext.Provider value={value}>
      <IdleSessionMonitor />
      {region}
      <AppDashboardShell
        workspace={{ name: "Admin", note: "ThreatLens" }}
        mark={<Icon icon="solar:shield-check-linear" className="size-[18px]" />}
        user={profile}
        nav={nav}
        activeId={route}
        collapsed={collapsed}
        onToggleCollapsed={() => writeRail(!collapsed)}
        search={{ value: draft, onChange: setDraft, placeholder: searchPlaceholder(route) }}
        meter={meter}
        onSignOut={() => setLeaving(true)}
        announce={announce}
      >
        {children}
      </AppDashboardShell>

      {leaving && (
        <ConfirmDialog
          open
          surface="desk"
          title="Keluar dari meja moderasi?"
          confirmLabel="Ya, keluar"
          busyLabel="Keluar..."
          busy={leavingBusy}
          onConfirm={() => void signOut()}
          onCancel={() => setLeaving(false)}
          body={
            <p>
              Keputusan yang sudah tersimpan tetap berlaku. Untuk kembali ke antrean ini, masuk lagi lewat{" "}
              <span className="text-desk-ink">/admin/login</span> dengan akun yang punya peran moderator.
            </p>
          }
        />
      )}
    </ConsoleContext.Provider>
  );
}
