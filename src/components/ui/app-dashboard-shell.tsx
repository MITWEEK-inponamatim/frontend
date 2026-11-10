"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  BlockButton,
  BlockDrawer,
  IconButton,
  InitialsAvatar,
  Kbd,
  blockRoot,
  focusRing,
  useBlockReducedMotion,
  useElementWidth,
} from "@/components/ui/app-dashboard-shell-utils/app-block-kit";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/* -----------------------------------------------------------------------------------------------
 * Bentuk data
 * ---------------------------------------------------------------------------------------------- */

export type DeskRange = "7d" | "30d" | "90d" | "12m";

export interface DeskNavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: string;
}

export interface DeskNavGroup {
  label?: string;
  items: DeskNavItem[];
}

export interface DeskPoint {
  label: string;
  tick: string;
  current: number;
  previous: number;
}

export interface DeskKpi {
  id: string;
  label: string;
  value: number;
  previous: number;
  spark: number[];
}

export interface DeskMeter {
  label: string;
  value: string;
  /** 0..1. Baris ini satu-satunya tempat rasio muncul di rail, dan penyebutnya selalu jumlah nyata. */
  ratio: number;
  ratioLabel: string;
  footnote: string;
}

export interface AppDashboardShellProps {
  workspace: { name: string; note: string };
  mark?: ReactNode;
  user: { name: string; email: string };
  nav: DeskNavGroup[];
  activeId: string;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  search: { value: string; onChange: (value: string) => void; placeholder: string };
  meter?: DeskMeter;
  onSignOut: () => void;
  announce: (message: string) => void;
  children: ReactNode;
  className?: string;
}

/**
 * Kerangka console: rail yang bisa dikecilkan dan berubah jadi drawer begitu containerny sempit,
 * header dengan pencarian, dan satu kolom konten selebar 1280px. Di bawah 768px pada kerangkanya
 * sendiri — bukan pada layar — rail tidak punya tempat lagi.
 */
export function AppDashboardShell({
  workspace,
  mark,
  user,
  nav,
  activeId,
  collapsed,
  onToggleCollapsed,
  search,
  meter,
  onSignOut,
  announce,
  children,
  className,
}: AppDashboardShellProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const width = useElementWidth(rootRef);
  const narrow = width > 0 && width < DRAWER_BELOW;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const items = nav.flatMap((group) => group.items);
  const activeLabel = items.find((item) => item.id === activeId)?.label ?? workspace.name;

  // Drawer ditutup kalau containernya melebar kembali: kalau tidak, panelnya tetap terbuka di
  // belakang sementara rail sudah muncul lagi. Diatur saat render, bukan di dalam effect, supaya
  // tidak ada render kedua yang hanya untuk menghapus panel.
  const [wasNarrow, setWasNarrow] = useState(narrow);
  if (wasNarrow !== narrow) {
    setWasNarrow(narrow);
    if (!narrow) setDrawerOpen(false);
  }

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && drawerOpen) {
      setDrawerOpen(false);
      return;
    }
    if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
    const target = event.target as HTMLElement;
    if (target.closest("input, textarea, select, [contenteditable=true]")) return;
    event.preventDefault();
    searchRef.current?.focus();
  };

  const rail = (
    <SidebarContent
      mode="rail"
      collapsed={collapsed}
      workspace={workspace}
      mark={mark}
      user={user}
      nav={nav}
      activeId={activeId}
      meter={meter}
      onToggleCollapsed={onToggleCollapsed}
      onSignOut={onSignOut}
      onNavigate={(id) => announce(`Membuka ${labelOf(nav, id)}.`)}
    />
  );

  return (
    <div
      ref={rootRef}
      onKeyDown={onKeyDown}
      className={cn(blockRoot, "h-dvh max-h-dvh min-h-0", className)}
    >
      {!narrow && (
        <aside
          aria-label="Navigasi console"
          className={cn(
            "relative z-20 flex h-full shrink-0 flex-col border-r border-[color:var(--shell-border)] bg-[var(--shell-panel)] transition-[width] duration-[260ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
            collapsed ? "w-[64px]" : "w-[244px]",
          )}
        >
          {rail}
        </aside>
      )}

      <div inert={narrow && drawerOpen} className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-[color:var(--shell-border)] bg-[var(--shell-surface)] px-3 @3xl:px-5">
          {narrow && (
            <IconButton label="Buka navigasi" onClick={() => setDrawerOpen(true)} aria-expanded={drawerOpen}>
              <Icon icon="solar:hamburger-menu-linear" />
            </IconButton>
          )}
          <nav aria-label="Lokasi" className="min-w-0">
            <ol className="flex min-w-0 items-center gap-1.5 text-[13px]">
              <li className="hidden truncate text-[color:var(--shell-text-muted)] @md:block">{workspace.name}</li>
              <li aria-hidden="true" className="hidden text-[color:var(--shell-text-faint)] @md:block">
                /
              </li>
              <li aria-current="page" className="truncate font-medium text-[color:var(--shell-text)]">
                {activeLabel}
              </li>
            </ol>
          </nav>

          <label className="group relative ml-auto flex items-center">
            <span className="sr-only">Cari di halaman ini</span>
            <Icon
              icon="solar:magnifer-linear"
              aria-hidden="true"
              className="pointer-events-none absolute left-2.5 size-[15px] text-[color:var(--shell-text-soft)]"
            />
            <input
              ref={searchRef}
              type="search"
              value={search.value}
              onChange={(event) => search.onChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape" && search.value) {
                  event.stopPropagation();
                  search.onChange("");
                }
              }}
              placeholder={search.placeholder}
              className={cn(
                "h-8 w-[150px] rounded-[9px] border border-[color:var(--shell-border)] bg-[var(--shell-field)] pl-8 pr-8 text-[13px] text-[color:var(--shell-text)] shadow-[var(--shell-shadow-soft)] outline-none transition-[border-color,box-shadow,width] duration-200 ease-out placeholder:text-[color:var(--shell-text-soft)] focus:w-[220px] focus-visible:border-[color:var(--shell-accent)] focus-visible:ring-[3px] focus-visible:ring-[color:var(--shell-focus)] motion-reduce:transition-none sm:w-[200px] lg:w-[248px] [&::-webkit-search-cancel-button]:hidden",
              )}
            />
            <Kbd className="pointer-events-none absolute right-2 hidden group-focus-within:opacity-0 sm:block">
              /
            </Kbd>
          </label>
        </header>

        <main className="@container/main min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-3 pb-10 pt-5 @3xl:gap-5 @3xl:px-6 @3xl:pt-6">
            {/* Nama halaman sudah terbaca di baris atas dan di rail, jadi judulnya tidak perlu
                mengulang dirinya sendiri di badan halaman — tetapi struktur halaman tetap butuh satu
                heading, jadi ia disimpan untuk pembaca layar. */}
            <h1 className="sr-only">{activeLabel}</h1>
            {children}
          </div>
        </main>
      </div>

      {narrow && (
        <BlockDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} label="Navigasi console">
          <SidebarContent
            mode="drawer"
            collapsed={false}
            workspace={workspace}
            mark={mark}
            user={user}
            nav={nav}
            activeId={activeId}
            meter={meter}
            onToggleCollapsed={onToggleCollapsed}
            onSignOut={onSignOut}
            onNavigate={(id) => announce(`Membuka ${labelOf(nav, id)}.`)}
            onClose={() => setDrawerOpen(false)}
          />
        </BlockDrawer>
      )}
    </div>
  );
}

const DRAWER_BELOW = 768;

function labelOf(nav: DeskNavGroup[], id: string) {
  return nav.flatMap((group) => group.items).find((item) => item.id === id)?.label ?? id;
}

/* -----------------------------------------------------------------------------------------------
 * Isi rail
 * ---------------------------------------------------------------------------------------------- */

function SidebarContent({
  mode,
  collapsed,
  workspace,
  mark,
  user,
  nav,
  activeId,
  meter,
  onToggleCollapsed,
  onSignOut,
  onNavigate,
  onClose,
}: {
  mode: "rail" | "drawer";
  collapsed: boolean;
  workspace: { name: string; note: string };
  mark?: ReactNode;
  user: { name: string; email: string };
  nav: DeskNavGroup[];
  activeId: string;
  meter?: DeskMeter;
  onToggleCollapsed: () => void;
  onSignOut: () => void;
  onNavigate: (id: string) => void;
  onClose?: () => void;
}) {
  return (
    <>
      <div
        className={cn(
          "flex h-14 shrink-0 items-center gap-2 border-b border-[color:var(--shell-border)]",
          collapsed ? "justify-center px-2" : "px-3",
        )}
      >
        <Link
          href={nav[0]?.items[0]?.href ?? "/admin"}
          aria-label={collapsed ? `Kembali ke ${workspace.name}` : undefined}
          title={collapsed ? workspace.name : undefined}
          className={cn("flex min-w-0 flex-1 items-center gap-2.5 rounded-[10px] p-1.5 transition-colors duration-150 hover:bg-[var(--shell-hover)]", collapsed && "flex-none", focusRing)}
        >
          <WorkspaceMark>{mark}</WorkspaceMark>
          {!collapsed && (
            <span className="min-w-0">
              <span className="block truncate text-[13.5px] font-semibold leading-tight">{workspace.name}</span>
              <span className="block truncate text-[11.5px] leading-tight text-[color:var(--shell-text-muted)]">{workspace.note}</span>
            </span>
          )}
        </Link>
        {mode === "drawer" && (
          <IconButton label="Tutup navigasi" size="sm" onClick={onClose}>
            <Icon icon="solar:close-square-linear" />
          </IconButton>
        )}
      </div>

      <nav aria-label="Utama" className={cn("no-scrollbar flex-1 overflow-y-auto py-3", collapsed ? "px-2" : "px-2.5")}>
        {nav.map((group, groupIndex) => (
          <div key={group.label ?? groupIndex} className={cn(groupIndex > 0 && "mt-5")}>
            {group.label &&
              (collapsed ? (
                <div aria-hidden="true" className="mx-auto mb-2 h-px w-6 bg-[var(--shell-border)]" />
              ) : (
                <h2 className="mb-1.5 px-2.5 font-shell-data text-[10.5px] uppercase tracking-[0.1em] text-[color:var(--shell-text-soft)]">
                  {group.label}
                </h2>
              ))}
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const isActive = item.id === activeId;
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      onClick={() => onNavigate(item.id)}
                      aria-current={isActive ? "page" : undefined}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "group relative flex h-9 items-center gap-2.5 rounded-[9px] text-[13.5px] transition-colors duration-150 motion-reduce:transition-none",
                        collapsed ? "justify-center px-0" : "px-2.5",
                        isActive
                          ? "bg-[var(--shell-surface)] font-medium text-[color:var(--shell-text)] shadow-[var(--shell-shadow-soft),0_0_0_1px_var(--shell-border)]"
                          : "text-[color:var(--shell-text-medium)] hover:bg-[var(--shell-hover)] hover:text-[color:var(--shell-text)]",
                        focusRing,
                      )}
                    >
                      {isActive && (
                        <span aria-hidden="true" className="absolute -left-2.5 top-2 h-5 w-[3px] rounded-r-full bg-[var(--shell-accent)]" />
                      )}
                      <Icon
                        icon={item.icon}
                        aria-hidden="true"
                        className={cn(
                          "size-[17px] shrink-0",
                          isActive
                            ? "text-[color:var(--shell-accent-ink)]"
                            : "text-[color:var(--shell-text-muted)] group-hover:text-[color:var(--shell-text-medium)]",
                        )}
                      />
                      {collapsed ? (
                        <span className="sr-only">{item.label}</span>
                      ) : (
                        <>
                          <span className="min-w-0 flex-1 truncate">{item.label}</span>
                          {item.badge && (
                            <span className="rounded-[6px] bg-[var(--shell-active)] px-1.5 py-px font-shell-data text-[11px] tabular-nums text-[color:var(--shell-text-muted)]">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                      {collapsed && item.badge && (
                        <span aria-hidden="true" className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[var(--shell-accent)]" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className={cn("shrink-0 border-t border-[color:var(--shell-border)] p-2.5", collapsed && "px-2")}>
        {meter && !collapsed && (
          <div className="mb-2.5 rounded-[12px] border border-[color:var(--shell-border)] bg-[var(--shell-surface)] p-3 shadow-[var(--shell-shadow-soft)]">
            <div className="flex items-baseline justify-between text-[12px]">
              <span className="font-medium">{meter.label}</span>
              <span className="font-shell-data tabular-nums text-[color:var(--shell-text-muted)]">{meter.value}</span>
            </div>
            <div
              role="meter"
              aria-label={meter.ratioLabel}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(meter.ratio * 100)}
              aria-valuetext={`${Math.round(meter.ratio * 100)} persen`}
              className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--shell-active)]"
            >
              <div
                className="h-full rounded-full bg-[var(--shell-accent)] transition-[width] duration-500 ease-out motion-reduce:transition-none"
                style={{ width: `${Math.min(100, Math.max(2, meter.ratio * 100))}%` }}
              />
            </div>
            <p className="mt-2 text-[11.5px] leading-snug text-[color:var(--shell-text-muted)]">{meter.footnote}</p>
          </div>
        )}
        <div className={cn("flex items-center gap-1", collapsed && "flex-col")}>
          <div
            className={cn("flex min-w-0 items-center gap-2.5 rounded-[10px] p-1.5", collapsed ? "flex-none" : "flex-1")}
            title={user.email || undefined}
          >
            <InitialsAvatar name={user.name || user.email} size={28} />
            {!collapsed && (
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12.5px] font-medium leading-tight">{user.name || "Admin"}</span>
                <span className="block truncate text-[11.5px] leading-tight text-[color:var(--shell-text-muted)]">{user.email}</span>
              </span>
            )}
          </div>
          <IconButton label="Keluar dari akun moderator" size="sm" onClick={onSignOut}>
            <Icon icon="solar:logout-2-bold-duotone" />
          </IconButton>
          {mode === "rail" && (
            <IconButton
              label={collapsed ? "Lebarkan sidebar" : "Perkecil sidebar"}
              size="sm"
              onClick={onToggleCollapsed}
              aria-expanded={!collapsed}
            >
              <Icon icon={collapsed ? "solar:sidebar-minimalistic-linear" : "solar:alt-arrow-left-linear"} />
            </IconButton>
          )}
        </div>
      </div>
    </>
  );
}

function WorkspaceMark({ children }: { children?: ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="relative grid size-8 shrink-0 place-items-center overflow-hidden rounded-[9px] bg-[var(--shell-accent-fill)] text-[color:var(--shell-accent-fill-ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(0,0,0,0.18)]"
    >
      {children ?? <Icon icon="solar:shield-check-linear" className="size-[18px]" />}
    </span>
  );
}

/* -----------------------------------------------------------------------------------------------
 * Baris judul halaman + pemilih rentang
 * ---------------------------------------------------------------------------------------------- */

export const DESK_RANGES: { id: DeskRange; label: string; long: string }[] = [
  { id: "7d", label: "7H", long: "7 hari terakhir" },
  { id: "30d", label: "1B", long: "1 bulan terakhir" },
  { id: "90d", label: "3B", long: "3 bulan terakhir" },
  { id: "12m", label: "1T", long: "1 tahun terakhir" },
];

export function rangeLong(range: DeskRange) {
  return DESK_RANGES.find((item) => item.id === range)?.long ?? "";
}

/**
 * Pemilih rentang dasbor, rata kanan. Halaman tidak lagi menulis judulnya sendiri — nama halaman
 * sudah ada di baris atas — jadi yang tersisa dari kepala halaman hanyalah kendali ini.
 */
export function DeskRangeControl({
  range,
  onChange,
}: {
  range: DeskRange;
  onChange: (range: DeskRange) => void;
}) {
  return (
    <div className="flex justify-end">
      <RangeControl value={range} onChange={onChange} />
    </div>
  );
}

function RangeControl({ value, onChange }: { value: DeskRange; onChange: (range: DeskRange) => void }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const index = DESK_RANGES.findIndex((item) => item.id === value);

  const onKeyDown = (event: ReactKeyboardEvent) => {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % DESK_RANGES.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + DESK_RANGES.length) % DESK_RANGES.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = DESK_RANGES.length - 1;
    else return;
    event.preventDefault();
    onChange(DESK_RANGES[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label="Rentang waktu"
      onKeyDown={onKeyDown}
      className="relative inline-grid grid-cols-4 rounded-[11px] border border-[color:var(--shell-border)] bg-[var(--shell-field-inset)] p-[3px] shadow-[var(--shell-shadow-inset)]"
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-[3px] left-[3px] w-[calc((100%-6px)/4)] rounded-[8px] bg-[var(--shell-surface)] shadow-[var(--shell-shadow-surface),0_0_0_1px_var(--shell-border)] transition-transform duration-[220ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
        style={{ transform: `translateX(${index * 100}%)` }}
      />
      {DESK_RANGES.map((item, position) => (
        <button
          key={item.id}
          ref={(element) => {
            refs.current[position] = element;
          }}
          type="button"
          role="radio"
          aria-checked={item.id === value}
          aria-label={item.long}
          tabIndex={item.id === value ? 0 : -1}
          onClick={() => onChange(item.id)}
          className={cn(
            "relative z-10 h-7 min-w-[46px] cursor-pointer rounded-[8px] px-2.5 font-shell-data text-[11.5px] font-medium tabular-nums transition-colors duration-150",
            item.id === value ? "text-[color:var(--shell-text)]" : "text-[color:var(--shell-text-muted)] hover:text-[color:var(--shell-text)]",
            focusRing,
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

/* -----------------------------------------------------------------------------------------------
 * Kartu metrik
 * ---------------------------------------------------------------------------------------------- */

export function KpiCard({
  kpi,
  number,
  selected,
  onSelect,
}: {
  kpi: DeskKpi;
  number: (value: number) => string;
  selected: boolean;
  onSelect: () => void;
}) {
  const change = kpi.previous === 0 ? 0 : ((kpi.value - kpi.previous) / kpi.previous) * 100;
  const up = change >= 0;
  const Arrow = up ? "solar:arrow-right-up-linear" : "solar:arrow-right-down-linear";
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      title={`Tampilkan ${kpi.label} di grafik`}
      className={cn(
        "@container/kpi relative flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-[16px] border p-3.5 text-left transition-[box-shadow,border-color] duration-150 motion-reduce:transition-none @3xl/main:p-4",
        selected
          ? "border-[color:var(--shell-accent)] bg-[var(--shell-surface)] shadow-[var(--shell-shadow-surface),0_0_0_1px_var(--shell-accent)]"
          : "border-[color:var(--shell-border)] bg-[var(--shell-surface)] shadow-[var(--shell-shadow-surface)] hover:border-[color:var(--shell-border-strong)]",
        focusRing,
      )}
    >
      {selected && (
        <span aria-hidden="true" className="absolute right-3.5 top-3.5 size-1.5 rounded-full bg-[var(--shell-accent)]" />
      )}
      <h3 className="pr-4 text-[12.5px] font-medium text-[color:var(--shell-text-muted)] @3xl/main:pr-0">{kpi.label}</h3>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[21px] font-semibold leading-none tracking-[-0.03em] tabular-nums @[220px]/kpi:text-[26px]">
            {number(kpi.value)}
          </p>
          <p className="mt-2.5 flex items-center gap-1.5 text-[12px]">
            <span className="inline-flex items-center gap-0.5 rounded-[6px] bg-[var(--shell-active)] px-1.5 py-[2px] font-shell-data text-[11px] font-medium tabular-nums text-[color:var(--shell-text-medium)]">
              <Icon icon={Arrow} aria-hidden="true" className="size-3" />
              {up ? "+" : "−"}
              {Math.abs(change).toFixed(1)}%
            </span>
            <span className="hidden text-[color:var(--shell-text-soft)] @[200px]/kpi:inline">
              sebelumnya {number(kpi.previous)}
            </span>
            <span className="sr-only">
              {up ? "naik dari periode sebelumnya" : "turun dari periode sebelumnya"}, {number(kpi.previous)}
            </span>
          </p>
        </div>
        <Sparkline values={kpi.spark} />
      </div>
    </button>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const w = 76;
  const h = 30;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pts = values.map((value, index) => [
    (index / Math.max(1, values.length - 1)) * (w - 4) + 2,
    h - 3 - ((value - min) / (max - min || 1)) * (h - 6),
  ]);
  const d = smoothPath(pts);
  const last = pts[pts.length - 1];
  const gradientId = useId();

  return (
    <svg
      aria-hidden="true"
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="hidden shrink-0 overflow-visible @[230px]/kpi:block"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--shell-text)" stopOpacity="0.1" />
          <stop offset="1" stopColor="var(--shell-text)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L ${last[0]} ${h} L ${pts[0][0]} ${h} Z`} fill={`url(#${gradientId})`} />
      <path
        d={d}
        fill="none"
        stroke="var(--shell-text-soft)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={last[0]} cy={last[1]} r="2.75" fill="var(--shell-accent)" stroke="var(--shell-surface)" strokeWidth="1.5" />
    </svg>
  );
}

// Interpolasi kubik monoton, supaya kurva tidak pernah melompat melewati data yang ada.
export function smoothPath(points: number[][]) {
  if (points.length < 2) return "";
  const n = points.length;
  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < n - 1; i += 1) {
    dx.push(points[i + 1][0] - points[i][0]);
    slope.push((points[i + 1][1] - points[i][1]) / (dx[i] || 1));
  }
  const m: number[] = [slope[0]];
  for (let i = 1; i < n - 1; i += 1) {
    m.push(
      slope[i - 1] * slope[i] <= 0
        ? 0
        : (3 * (dx[i - 1] + dx[i])) /
            ((2 * dx[i] + dx[i - 1]) / slope[i - 1] + (dx[i] + 2 * dx[i - 1]) / slope[i]),
    );
  }
  m.push(slope[n - 2]);
  let d = `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;
  for (let i = 0; i < n - 1; i += 1) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const h = dx[i] / 3;
    d += ` C ${(x0 + h).toFixed(2)} ${(y0 + m[i] * h).toFixed(2)}, ${(x1 - h).toFixed(2)} ${(y1 - m[i + 1] * h).toFixed(2)}, ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  }
  return d;
}

/* -----------------------------------------------------------------------------------------------
 * Grafik garis
 * ---------------------------------------------------------------------------------------------- */

const CHART_H = 236;
const PAD = { top: 16, right: 12, bottom: 28, left: 52 };

function niceMax(value: number) {
  const exp = Math.pow(10, Math.floor(Math.log10(value || 1)));
  const f = (value || 1) / exp;
  const nice =
    f <= 1 ? 1 : f <= 1.5 ? 1.5 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 3 ? 3 : f <= 4 ? 4 : f <= 5 ? 5 : f <= 6 ? 6 : f <= 8 ? 8 : 10;
  return nice * exp;
}

export function TrendChart({
  title,
  noun,
  points,
  rangeLabel,
  number,
  compact,
  animate,
}: {
  title: string;
  noun: string;
  points: DeskPoint[];
  rangeLabel: string;
  number: (value: number) => string;
  compact: (value: number) => string;
  animate: boolean;
}) {
  const [view, setView] = useState<"chart" | "table">("chart");
  const [hover, setHover] = useState<number | null>(null);
  const plotRef = useRef<HTMLDivElement>(null);
  const width = useElementWidth(plotRef);
  const reduce = useBlockReducedMotion();
  const [revealed, setRevealed] = useState(!animate);
  const titleId = useId();
  const descriptionId = useId();
  const gradientId = useId();
  const clipId = useId();

  useEffect(() => {
    if (!animate || reduce) return;
    const frame = window.requestAnimationFrame(() => setRevealed(true));
    return () => window.cancelAnimationFrame(frame);
  }, [animate, reduce]);
  const shown = revealed || reduce;

  const total = points.reduce((sum, point) => sum + point.current, 0);
  const totalPrevious = points.reduce((sum, point) => sum + point.previous, 0);
  const max = niceMax(Math.max(...points.map((point) => Math.max(point.current, point.previous)), 1) * 1.08);
  const w = Math.max(width, 240);
  const innerW = w - PAD.left - PAD.right;
  const innerH = CHART_H - PAD.top - PAD.bottom;
  const x = useCallback(
    (index: number) => PAD.left + (points.length === 1 ? innerW / 2 : (index / (points.length - 1)) * innerW),
    [innerW, points.length],
  );
  const y = (value: number) => PAD.top + innerH - (value / max) * innerH;

  const current = points.map((point, index) => [x(index), y(point.current)]);
  const previous = points.map((point, index) => [x(index), y(point.previous)]);
  const currentD = smoothPath(current);
  const previousD = smoothPath(previous);
  const areaD = `${currentD} L ${x(points.length - 1)} ${PAD.top + innerH} L ${x(0)} ${PAD.top + innerH} Z`;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((part) => part * max);
  const labelEvery = Math.ceil(points.length / Math.max(2, Math.floor(innerW / 64)));

  const pickIndex = (clientX: number) => {
    const rect = plotRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const px = clientX - rect.left - PAD.left;
    return Math.max(0, Math.min(points.length - 1, Math.round((px / innerW) * (points.length - 1))));
  };

  const onKeyDown = (event: ReactKeyboardEvent) => {
    const last = points.length - 1;
    const at = hover ?? last;
    let next: number | null = null;
    if (event.key === "ArrowRight") next = Math.min(last, hover === null ? last : at + 1);
    else if (event.key === "ArrowLeft") next = Math.max(0, hover === null ? last : at - 1);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    else if (event.key === "Escape") {
      setHover(null);
      return;
    } else return;
    event.preventDefault();
    setHover(next);
  };

  const active = hover !== null ? points[hover] : null;
  const delta = active ? ((active.current - active.previous) / (active.previous || 1)) * 100 : 0;
  const tipLeft = hover !== null ? x(hover) : 0;
  const tipFlip = tipLeft > w - 190;
  const change = totalPrevious === 0 ? 0 : ((total - totalPrevious) / totalPrevious) * 100;

  return (
    <section
      aria-labelledby={titleId}
      className="flex min-w-0 flex-col rounded-[16px] border border-[color:var(--shell-border)] bg-[var(--shell-surface)] shadow-[var(--shell-shadow-surface)]"
    >
      <div className="@container/head flex flex-wrap items-start justify-between gap-3 px-4 pt-4">
        <div className="min-w-0">
          <h2 id={titleId} className="text-[13.5px] font-semibold">
            {title}
          </h2>
          <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-[12.5px] text-[color:var(--shell-text-muted)]">
            <span className="text-[19px] font-semibold tracking-[-0.025em] tabular-nums text-[color:var(--shell-text)]">
              {number(total)}
            </span>
            <span className="tabular-nums">
              {change >= 0 ? "+" : "−"}
              {Math.abs(change).toFixed(1)}% dari {number(totalPrevious)} pada periode sebelumnya
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ul className="hidden items-center gap-3 text-[11.5px] text-[color:var(--shell-text-muted)] @md/head:flex" aria-label="Keterangan">
            <li className="flex items-center gap-1.5">
              <span aria-hidden="true" className="h-[2px] w-3.5 rounded-full bg-[var(--shell-accent)]" />
              Periode ini
            </li>
            <li className="flex items-center gap-1.5">
              <svg aria-hidden="true" width="14" height="2" className="overflow-visible">
                <line x1="0" x2="14" y1="1" y2="1" stroke="var(--mark-ghost)" strokeWidth="1.5" strokeDasharray="3 3" />
              </svg>
              Periode sebelumnya
            </li>
          </ul>
          <div className="flex rounded-[9px] border border-[color:var(--shell-border)] p-[2px]" role="group" aria-label="Cara baca">
            <IconButton
              label="Lihat sebagai grafik"
              size="sm"
              pressed={view === "chart"}
              onClick={() => setView("chart")}
              className="size-6 rounded-[7px] aria-pressed:bg-[var(--shell-active)]"
            >
              <Icon icon="solar:chart-square-linear" />
            </IconButton>
            <IconButton
              label="Lihat sebagai tabel"
              size="sm"
              pressed={view === "table"}
              onClick={() => setView("table")}
              className="size-6 rounded-[7px] aria-pressed:bg-[var(--shell-active)]"
            >
              <Icon icon="solar:bill-list-linear" />
            </IconButton>
          </div>
        </div>
      </div>

      {view === "chart" ? (
        <div
          ref={plotRef}
          role="img"
          tabIndex={0}
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          onKeyDown={onKeyDown}
          onPointerMove={(event) => setHover(pickIndex(event.clientX))}
          onPointerLeave={() => setHover(null)}
          onBlur={() => setHover(null)}
          className="relative mx-1 mb-1 mt-2 cursor-crosshair rounded-[12px] outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--shell-focus)]"
          style={{ height: CHART_H }}
        >
          <p id={descriptionId} className="sr-only">
            {title}, {rangeLabel}: {number(total)} {noun}, dibandingkan {number(totalPrevious)} {noun} pada periode
            sebelumnya. Pakai tombol panah kiri dan kanan untuk membaca setiap titik.
          </p>
          {width > 0 && (
            <svg width={w} height={CHART_H} className="block overflow-visible" aria-hidden="true">
              <defs>
                <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="var(--shell-accent)" stopOpacity="0.16" />
                  <stop offset="1" stopColor="var(--shell-accent)" stopOpacity="0" />
                </linearGradient>
                <clipPath id={clipId}>
                  <rect
                    x={0}
                    y={0}
                    width={w}
                    height={CHART_H}
                    style={{
                      transformOrigin: `${PAD.left}px 0`,
                      transform: shown ? "scaleX(1)" : "scaleX(0)",
                      transition: animate && !reduce ? "transform 700ms cubic-bezier(0.23,1,0.32,1)" : "none",
                    }}
                  />
                </clipPath>
              </defs>
              {ticks.map((tick) => (
                <g key={tick}>
                  <line
                    x1={PAD.left}
                    x2={w - PAD.right}
                    y1={y(tick)}
                    y2={y(tick)}
                    stroke="var(--shell-border)"
                    strokeDasharray={tick === 0 ? undefined : "2 4"}
                  />
                  <text
                    x={PAD.left - 10}
                    y={y(tick)}
                    dy="0.32em"
                    textAnchor="end"
                    className="fill-[color:var(--shell-text-soft)] font-shell-data text-[11px] tabular-nums"
                  >
                    {compact(tick)}
                  </text>
                </g>
              ))}
              {points.map((point, index) => {
                const last = points.length - 1;
                const show = index === last || (index % labelEvery === 0 && last - index >= labelEvery * 0.7);
                if (!show) return null;
                return (
                  <text
                    key={point.label}
                    x={x(index)}
                    y={CHART_H - 8}
                    textAnchor={index === 0 ? "start" : index === last ? "end" : "middle"}
                    className="fill-[color:var(--shell-text-soft)] font-shell-data text-[11px]"
                  >
                    {point.tick}
                  </text>
                );
              })}
              <g clipPath={`url(#${clipId})`}>
                <path d={previousD} fill="none" stroke="var(--mark-ghost)" strokeWidth="1.5" strokeDasharray="4 4" strokeLinecap="round" />
                <path d={areaD} fill={`url(#${gradientId})`} />
                <path d={currentD} fill="none" stroke="var(--shell-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </g>
              {hover !== null && (
                <g>
                  <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + innerH} stroke="var(--shell-border-strong)" />
                  <circle cx={x(hover)} cy={y(points[hover].previous)} r="3.5" fill="var(--shell-surface)" stroke="var(--mark-ghost)" strokeWidth="1.5" />
                  <circle cx={x(hover)} cy={y(points[hover].current)} r="4.5" fill="var(--shell-accent)" stroke="var(--shell-surface)" strokeWidth="2" />
                </g>
              )}
            </svg>
          )}
          {active && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-2 z-10 w-[184px] rounded-[12px] border border-[color:var(--shell-border)] bg-[var(--shell-menu)] p-2.5 shadow-[var(--shell-shadow-menu)] backdrop-blur-xl"
              style={{ left: tipFlip ? tipLeft - 184 - 12 : tipLeft + 12 }}
            >
              <p className="text-[11.5px] font-medium text-[color:var(--shell-text-muted)]">{active.label}</p>
              <dl className="mt-1.5 space-y-1 text-[12px]">
                <div className="flex items-center justify-between gap-2">
                  <dt className="flex items-center gap-1.5 text-[color:var(--shell-text-medium)]">
                    <span aria-hidden="true" className="h-[2px] w-2.5 rounded-full bg-[var(--shell-accent)]" />
                    Periode ini
                  </dt>
                  <dd className="font-shell-data tabular-nums">{number(active.current)}</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="flex items-center gap-1.5 text-[color:var(--shell-text-medium)]">
                    <span aria-hidden="true" className="h-[2px] w-2.5 rounded-full bg-[var(--mark-ghost)]" />
                    Sebelumnya
                  </dt>
                  <dd className="font-shell-data tabular-nums text-[color:var(--shell-text-muted)]">{number(active.previous)}</dd>
                </div>
              </dl>
              <p className="mt-1.5 border-t border-[color:var(--shell-border)] pt-1.5 font-shell-data text-[11px] tabular-nums text-[color:var(--shell-text-medium)]">
                {delta >= 0 ? "+" : "−"}
                {Math.abs(delta).toFixed(1)}%
              </p>
            </div>
          )}
          <span className="sr-only" aria-live="polite">
            {active ? `${active.label}: ${number(active.current)} ${noun}, sebelumnya ${number(active.previous)}` : ""}
          </span>
        </div>
      ) : (
        <div className="mx-1 mb-1 mt-2 max-h-[236px] overflow-auto rounded-[12px]">
          <table className="w-full text-[12.5px]">
            <caption className="sr-only">{`${title}, ${rangeLabel.toLowerCase()}`}</caption>
            <thead className="sticky top-0 bg-[var(--shell-surface)]">
              <tr className="text-left text-[11px] uppercase tracking-[0.06em] text-[color:var(--shell-text-soft)]">
                <th scope="col" className="px-3 py-2 font-medium">
                  Periode
                </th>
                <th scope="col" className="px-3 py-2 text-right font-medium">
                  Periode ini
                </th>
                <th scope="col" className="px-3 py-2 text-right font-medium">
                  Sebelumnya
                </th>
              </tr>
            </thead>
            <tbody>
              {points.map((point) => (
                <tr key={point.label} className="border-t border-[color:var(--shell-border)]">
                  <th scope="row" className="px-3 py-1.5 text-left font-normal text-[color:var(--shell-text-medium)]">
                    {point.label}
                  </th>
                  <td className="px-3 py-1.5 text-right font-shell-data tabular-nums">{number(point.current)}</td>
                  <td className="px-3 py-1.5 text-right font-shell-data tabular-nums text-[color:var(--shell-text-muted)]">
                    {number(point.previous)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

/* -----------------------------------------------------------------------------------------------
 * Rincian kategori
 * ---------------------------------------------------------------------------------------------- */

const DONUT = 148;
const DONUT_R = 54;
const DONUT_STROKE = 19;
// Celah antar keping, dalam satuan pathLength (lingkaran penuh = 100), bukan piksel, supaya lebarnya
// tidak berubah saat kartu dilebarkan.
const DONUT_GAP = 0.7;

/**
 * Satu warna aksi saja: tinta buku, diturunkan setetes demi setetes dari keping terbesar ke yang
 * terkecil. Rona vonis (amber/hijau/abu/merah) sengaja tidak dipakai di sini — keping kategori tidak
 * boleh terbaca sebagai putusan atas sebuah nomor.
 */
function shade(index: number, count: number) {
  if (count <= 1) return 1;
  return 1 - (index / (count - 1)) * 0.72;
}

export function BreakdownDonut({
  title,
  noun,
  rows,
  number,
}: {
  title: string;
  noun: string;
  rows: { label: string; value: number }[];
  number: (value: number) => string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [drawn, setDrawn] = useState(false);
  const reduce = useBlockReducedMotion();
  const titleId = useId();

  useEffect(() => {
    if (reduce || rows.length === 0) return;
    const frame = window.requestAnimationFrame(() => setDrawn(true));
    return () => window.cancelAnimationFrame(frame);
  }, [reduce, rows.length]);
  const shown = drawn || reduce;

  const total = rows.reduce((sum, row) => sum + row.value, 0);

  // Keping disusun searah jarum jam mulai dari jam dua belas. Offset kumulatif diambil dari jumlah
  // share yang belum dibulatkan, jadi keping terakhir menutup lingkaran persis dan selisih
  // pembulatan tidak menumpuk di satu tempat.
  const shares = rows.map((row) => (total === 0 ? 0 : (row.value / total) * 100));
  const arcs = rows.map((row, index) => ({
    row,
    index,
    share: shares[index],
    offset: shares.slice(0, index).reduce((sum, value) => sum + value, 0),
  }));

  const at = hover ?? active;
  const picked = at === null ? null : arcs[at];
  const dimmed = at !== null;

  return (
    <section
      aria-labelledby={titleId}
      className="flex min-w-0 flex-col rounded-[16px] border border-[color:var(--shell-border)] bg-[var(--shell-surface)] p-4 shadow-[var(--shell-shadow-surface)]"
    >
      <div className="flex items-baseline justify-between">
        <h2 id={titleId} className="text-[13.5px] font-semibold">
          {title}
        </h2>
        <span className="font-shell-data text-[11.5px] tabular-nums text-[color:var(--shell-text-muted)]">{number(total)}</span>
      </div>

      {rows.length === 0 ? (
        <p className="mt-4 flex-1 text-[12.5px] leading-relaxed text-[color:var(--shell-text-muted)]">
          Belum ada laporan pada rentang ini, jadi tidak ada kategori yang bisa dibandingkan.
        </p>
      ) : (
        <>
          <div className="relative mx-auto mt-3 shrink-0" style={{ width: DONUT, height: DONUT }}>
            <svg viewBox={`0 0 ${DONUT} ${DONUT}`} aria-hidden="true" className="size-full -rotate-90 overflow-visible">
              <circle
                cx={DONUT / 2}
                cy={DONUT / 2}
                r={DONUT_R}
                fill="none"
                stroke="var(--shell-active)"
                strokeWidth={DONUT_STROKE}
              />
              {arcs.map((arc) => {
                const length = Math.max(arc.share - DONUT_GAP, 0.35);
                const base = shade(arc.index, arcs.length);
                return (
                  <circle
                    key={arc.row.label}
                    cx={DONUT / 2}
                    cy={DONUT / 2}
                    r={DONUT_R}
                    fill="none"
                    stroke="var(--shell-accent)"
                    strokeWidth={DONUT_STROKE}
                    pathLength={100}
                    strokeDasharray={shown ? `${length} ${100 - length}` : `0 100`}
                    strokeDashoffset={-arc.offset - DONUT_GAP / 2}
                    opacity={dimmed && at !== arc.index ? base * 0.28 : base}
                    className="transition-[stroke-dasharray,opacity] duration-500 ease-out motion-reduce:transition-none"
                  />
                );
              })}
            </svg>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 px-8 text-center">
              <span className="text-[22px] leading-none font-semibold tracking-[-0.025em] tabular-nums text-[color:var(--shell-text)]">
                {number(picked ? picked.row.value : total)}
              </span>
              <span className="text-[11px] leading-[1.25] text-[color:var(--shell-text-muted)]">
                {picked ? `${picked.row.label}, ${Math.round(picked.share)}%` : noun}
              </span>
            </div>
          </div>

          <ul className="mt-3 flex flex-col gap-0.5">
            {arcs.map((arc) => {
              const on = active === arc.index;
              return (
                <li key={arc.row.label}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => setActive(on ? null : arc.index)}
                    onMouseEnter={() => setHover(arc.index)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(arc.index)}
                    onBlur={() => setHover(null)}
                    className={cn(
                      "flex w-full min-w-0 items-center gap-2 rounded-[7px] px-1.5 py-[5px] text-left text-[12.5px] transition-colors duration-150 hover:bg-[var(--shell-hover)] motion-reduce:transition-none",
                      on && "bg-[var(--shell-active)]",
                      focusRing,
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="size-2.5 shrink-0 rounded-[3px]"
                      style={{ background: "var(--shell-accent)", opacity: shade(arc.index, arcs.length) }}
                    />
                    <span className="min-w-0 flex-1 truncate text-[color:var(--shell-text-medium)]">{arc.row.label}</span>
                    <span className="shrink-0 font-shell-data text-[11.5px] tabular-nums">{number(arc.row.value)}</span>
                    <span className="w-[3.4ch] shrink-0 text-right font-shell-data text-[11.5px] tabular-nums text-[color:var(--shell-text-soft)]">
                      {Math.round(arc.share)}%
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}

/* -----------------------------------------------------------------------------------------------
 * Tabel dengan sortir, paginasi, dan chip status
 * ---------------------------------------------------------------------------------------------- */

export interface DeskColumn<Row> {
  id: string;
  header: string;
  cell: (row: Row) => ReactNode;
  /** Kolom tanpa `sortValue` hanya ditampilkan, tidak bisa disortir. */
  sortValue?: (row: Row) => string | number;
  align?: "left" | "right";
  /** Kolom yang baru muncul di atas lebar container tertentu, sama seperti lampiran. */
  showFrom?: "2xl" | "3xl" | "4xl";
  className?: string;
}

const SHOW_FROM = {
  "2xl": "hidden @2xl/main:table-cell",
  "3xl": "hidden @3xl/main:table-cell",
  "4xl": "hidden @4xl/main:table-cell",
};

const SORT_LABEL = { asc: "naik", desc: "turun" } as const;

export function DeskTable<Row extends { id: string }>({
  title,
  caption,
  noun,
  rows,
  columns,
  chips,
  activeChip,
  onChip,
  search,
  onClearSearch,
  emptyTitle,
  emptyBody,
  announce,
  pageSize = 6,
  extra,
}: {
  title: string;
  caption: string;
  noun: string;
  rows: Row[];
  columns: DeskColumn<Row>[];
  chips?: { id: string; label: string; count?: number; dot?: string }[];
  activeChip?: string;
  onChip?: (id: string) => void;
  search?: string;
  onClearSearch?: () => void;
  emptyTitle: string;
  emptyBody: string;
  announce: (message: string) => void;
  pageSize?: number;
  extra?: ReactNode;
}) {
  const [sort, setSort] = useState<{ id: string; dir: "asc" | "desc" } | null>(() => {
    const first = columns.find((column) => column.sortValue);
    return first ? { id: first.id, dir: "desc" } : null;
  });
  const [page, setPage] = useState(0);
  const titleId = useId();

  const sorted = useMemo(() => {
    const column = columns.find((item) => item.id === sort?.id);
    if (!column?.sortValue || !sort) return rows;
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = column.sortValue?.(a);
      const bv = column.sortValue?.(b);
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      return String(av).localeCompare(String(bv), "id") * dir || a.id.localeCompare(b.id);
    });
  }, [rows, columns, sort]);

  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, pages - 1);
  const visible = sorted.slice(current * pageSize, current * pageSize + pageSize);

  // Kembali ke halaman pertama begitu daftar berubah bentuk, termasuk saat baris hilang karena
  // keputusan moderator.
  const shapeKey = `${activeChip ?? ""}|${search ?? ""}|${rows.length}|${sort?.id ?? ""}|${sort?.dir ?? ""}`;
  const [lastShape, setLastShape] = useState(shapeKey);
  if (lastShape !== shapeKey) {
    setLastShape(shapeKey);
    setPage(0);
  }

  const toggleSort = (id: string) => {
    const next = { id, dir: sort?.id === id && sort.dir === "desc" ? ("asc" as const) : ("desc" as const) };
    setSort(next);
    const header = columns.find((column) => column.id === id)?.header ?? id;
    announce(`Disortir berdasarkan ${header}, ${SORT_LABEL[next.dir]}.`);
  };

  return (
    <section
      aria-labelledby={titleId}
      className="min-w-0 rounded-[16px] border border-[color:var(--shell-border)] bg-[var(--shell-surface)] shadow-[var(--shell-shadow-surface)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 pb-3 pt-4">
        <div className="flex items-baseline gap-2">
          <h2 id={titleId} className="text-[13.5px] font-semibold">
            {title}
          </h2>
          <span className="font-shell-data text-[11.5px] tabular-nums text-[color:var(--shell-text-soft)]">{sorted.length}</span>
        </div>
        <div className="flex items-center gap-3">
          {chips && onChip && (
            <div className="no-scrollbar -mx-1 flex max-w-full items-center gap-1 overflow-x-auto px-1" role="group" aria-label={`Saring ${noun}`}>
              {chips.map((chip) => {
                const isActive = chip.id === activeChip;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => onChip(chip.id)}
                    className={cn(
                      "inline-flex h-7 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-2.5 text-[12px] transition-colors duration-150 motion-reduce:transition-none",
                      isActive
                        ? "border-[color:var(--shell-border-strong)] bg-[var(--shell-active)] text-[color:var(--shell-text)]"
                        : "border-transparent text-[color:var(--shell-text-muted)] hover:bg-[var(--shell-hover)] hover:text-[color:var(--shell-text)]",
                      focusRing,
                    )}
                  >
                    {chip.dot && (
                      <span aria-hidden="true" className="size-1.5 rounded-full" style={{ background: chip.dot }} />
                    )}
                    {chip.label}
                    {typeof chip.count === "number" && (
                      <span className="font-shell-data text-[11px] tabular-nums text-[color:var(--shell-text-soft)]">{chip.count}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
          {extra}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-0 border-collapse text-[13px]">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-y border-[color:var(--shell-border)] bg-[var(--shell-panel)] text-left text-[11px] text-[color:var(--shell-text-soft)]">
              {columns.map((column) => {
                const isSorted = sort?.id === column.id;
                const align = cn(column.align === "right" && "text-right", column.showFrom && SHOW_FROM[column.showFrom]);
                if (!column.sortValue) {
                  return (
                    <th key={column.id} scope="col" className={cn("px-3 font-medium uppercase tracking-[0.06em]", align)}>
                      {column.header}
                    </th>
                  );
                }
                return (
                  <th
                    key={column.id}
                    scope="col"
                    aria-sort={isSorted ? (sort?.dir === "asc" ? "ascending" : "descending") : "none"}
                    className={cn("px-3 font-medium", align)}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort(column.id)}
                      title={`Sortir berdasarkan ${column.header}`}
                      className={cn(
                        "inline-flex h-9 cursor-pointer items-center gap-1 rounded-[6px] uppercase tracking-[0.06em] transition-colors hover:text-[color:var(--shell-text)] motion-reduce:transition-none",
                        isSorted && "text-[color:var(--shell-text-medium)]",
                        column.align === "right" && "flex-row-reverse",
                        focusRing,
                      )}
                    >
                      {column.header}
                      <Icon
                        icon={isSorted ? (sort?.dir === "asc" ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear") : "solar:sort-linear"}
                        aria-hidden="true"
                        className={cn("size-3", !isSorted && "opacity-50")}
                      />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr
                key={row.id}
                className="group border-b border-[color:var(--shell-border)] transition-colors duration-100 last:border-b-0 hover:bg-[var(--shell-hover)] motion-reduce:transition-none"
              >
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={cn(
                      "px-3 py-2.5 text-[color:var(--shell-text-medium)]",
                      column.align === "right" && "text-right",
                      column.showFrom && SHOW_FROM[column.showFrom],
                      column.className,
                    )}
                  >
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center">
                  <p className="text-[13px] font-medium text-[color:var(--shell-text)]">{emptyTitle}</p>
                  <p className="mx-auto mt-1 max-w-[46ch] text-[12.5px] leading-relaxed text-[color:var(--shell-text-muted)]">{emptyBody}</p>
                  {onClearSearch && (search || activeChip) && (
                    <BlockButton size="sm" variant="secondary" className="mt-3" onClick={onClearSearch}>
                      Hapus filter
                    </BlockButton>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-[color:var(--shell-border)] px-4 py-2.5 text-[12px] text-[color:var(--shell-text-muted)]">
        <span className="tabular-nums">
          {sorted.length === 0
            ? `Belum ada ${noun}`
            : `${current * pageSize + 1}–${Math.min(sorted.length, (current + 1) * pageSize)} dari ${sorted.length} ${noun}`}
        </span>
        <div className="flex items-center gap-1">
          <IconButton label="Halaman sebelumnya" size="sm" disabled={current === 0} onClick={() => setPage(current - 1)}>
            <Icon icon="solar:alt-arrow-left-linear" />
          </IconButton>
          <span className="min-w-[5ch] text-center font-shell-data tabular-nums" aria-live="polite">
            <span className="sr-only">Halaman </span>
            {current + 1} / {pages}
          </span>
          <IconButton label="Halaman berikutnya" size="sm" disabled={current >= pages - 1} onClick={() => setPage(current + 1)}>
            <Icon icon="solar:alt-arrow-right-linear" />
          </IconButton>
        </div>
      </div>
    </section>
  );
}

export function DeskCardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div aria-hidden="true" className="min-w-0 rounded-[16px] border border-[color:var(--shell-border)] bg-[var(--shell-surface)] p-4 shadow-[var(--shell-shadow-surface)]">
      <div className="h-3 w-[180px] rounded-[4px] bg-[var(--shell-active)]" />
      <div className="mt-4 space-y-3">
        {Array.from({ length: rows }, (_, index) => (
          <div key={index} className="h-8 rounded-[8px] bg-[var(--shell-panel)]" />
        ))}
      </div>
    </div>
  );
}

/**
 * Kosong dan gagal memakai satu bentuk: apa yang terjadi, apa langkah berikutnya, dan tombol untuk
 * mengambilnya lagi. Rata kiri seperti kartu di atasnya — ruang kosong yang ditengahkan terbaca
 * seperti poster, padahal tidak ada siapa pun yang sedang diajak bicara.
 */
export function DeskNotice({
  kind,
  title,
  body,
  actionLabel,
  onAction,
}: {
  kind: "empty" | "error";
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const isError = kind === "error";
  return (
    <section
      className={cn(
        "min-w-0 rounded-[16px] border bg-[var(--shell-surface)] p-5 shadow-[var(--shell-shadow-surface)]",
        isError ? "border-[color:var(--mark-error)]" : "border-[color:var(--shell-border)]",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex items-center gap-2 text-[12px] font-medium",
          isError ? "text-[color:var(--mark-error)]" : "text-[color:var(--shell-text-soft)]",
        )}
      >
        <Icon icon={isError ? "solar:danger-triangle-linear" : "solar:check-circle-linear"} className="size-[15px]" />
        {isError ? "Ada yang tidak beres" : "Tidak ada yang perlu dilihat"}
      </span>
      <h2 className="mt-3 text-[15px] font-semibold tracking-[-0.015em] text-[color:var(--shell-text)]">{title}</h2>
      <p className="mt-1.5 max-w-[62ch] text-[13px] leading-[1.6] text-[color:var(--shell-text-muted)]">{body}</p>
      {actionLabel && onAction && (
        <div className="mt-4">
          <BlockButton variant="secondary" onClick={onAction}>
            <Icon icon="solar:restart-linear" />
            {actionLabel}
          </BlockButton>
        </div>
      )}
    </section>
  );
}
