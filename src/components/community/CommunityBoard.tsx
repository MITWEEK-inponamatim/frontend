"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { PostCard } from "@/components/community/PostCard";
import { DangerousNumberList } from "@/components/community/DangerousNumberList";
import { MobileNavLink } from "@/components/community/MobileNavLink";
import { DangerousNumberBanner } from "@/components/community/DangerousNumberBanner";
import { CreatePostPanel } from "@/components/community/CreatePostPanel";
import { ReportNumberPanel } from "@/components/community/ReportNumberPanel";
import { NumberHandle } from "@/components/community/NumberHandle";
import { useCommunity, type CommunityTab } from "@/hooks/useCommunity";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { canonicalPhone, phoneSlug } from "@/lib/phone";
import { displayNumber, type DangerousNumber } from "@/lib/community";
import { api } from "@/lib/api";

export const TABS: { id: CommunityTab; label: string; href: string }[] = [
  { id: "new", label: "Terbaru", href: "/community/latest" },
  { id: "top", label: "Terpopuler", href: "/community/popular" },
  { id: "dangerous", label: "Nomor Berbahaya", href: "/community/phone" },
];

const RULES = [
  "Setiap cerita wajib menyertakan tangkapan layar bukti otentik.",
  "Penulis tampil dengan alias anonim untuk menjaga kerahasiaan identitas.",
  "Upvote berfungsi merangking diskusi terpopuler, bukan mengubah status hukum nomor.",
  "Status nomor berbahaya hanya diperbarui melalui laporan yang lolos verifikasi moderator.",
];

const CATEGORIES = [
  { label: "Semua Kategori", href: "/community/latest" },
  { label: "Kurir & Undangan APK", href: "/community/latest?kategori=apk" },
  { label: "Perbankan & Rekening", href: "/community/latest?kategori=bank" },
  { label: "Telemarketing & Pinjol", href: "/community/latest?kategori=telemarketing" },
  { label: "Undian & Hadiah Palsu", href: "/community/latest?kategori=hadiah" },
];

/**
 * Reddit/Quora-style 3-column community board component featuring clean information architecture,
 * non-redundant navigation, and streamlined entry points.
 */
export function CommunityBoard({ tab }: { tab: CommunityTab }) {
  const [compose, setCompose] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [notice, setNotice] = useState<{ message: string; numberSlug?: string } | null>(null);
  const [topNumbers, setTopNumbers] = useState<DangerousNumber[]>([]);
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = useIsAdmin();

  const rawNumber = params.get("nomor") ?? "";
  const number = canonicalPhone(rawNumber);
  const feed = useCommunity(tab, number);

  const tabHref = (item: (typeof TABS)[number]) =>
    item.id === "dangerous" || !rawNumber
      ? item.href
      : `${item.href}?nomor=${encodeURIComponent(rawNumber)}`;

  const clearFilter = () => router.replace(pathname);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 7000);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    let unmounted = false;
    api("/api/v1/community/dangerous-numbers?limit=5&offset=0")
      .then((res: unknown) => {
        const data = res as { numbers?: DangerousNumber[] } | null;
        if (!unmounted && data?.numbers) {
          setTopNumbers(data.numbers);
        }
      })
      .catch(() => {});
    return () => {
      unmounted = true;
    };
  }, []);

  const onCreated = (created: {
    id?: string;
    author_alias?: string;
    number_e164?: string;
  }) => {
    feed.refresh();
    const slug = created.number_e164 ? phoneSlug(created.number_e164) : undefined;
    setNotice({
      message: created.id
        ? `Cerita berhasil diterbitkan sebagai ${created.author_alias ?? "Warga"}${created.number_e164 ? ` · ${displayNumber(created.number_e164)}` : ""}`
        : "Cerita Anda berhasil dibagikan.",
      numberSlug: slug,
    });
  };

  const onReportSuccess = (report: { number_e164: string; category?: string }) => {
    feed.refresh();
    const slug = phoneSlug(report.number_e164);
    setNotice({
      message: `Nomor ${displayNumber(report.number_e164)} berhasil dilaporkan ke database intelijen.`,
      numberSlug: slug,
    });
  };

  return (
    <>
      <div className="mx-auto flex w-full max-w-7xl justify-center bg-white min-h-screen">
        {/* 1. Left Navigation Rail (Pure Community Topics & Feeds, No Duplicate Top Nav, No CTA Conflict) */}
        <aside className="hidden md:flex flex-col w-[200px] lg:w-[230px] xl:w-[250px] shrink-0 sticky top-16 h-[calc(100vh-4rem)] pt-4 pb-6 px-3 justify-between text-left">
          <div className="space-y-5 text-left">
            {/* Feeds Section */}
            <div className="space-y-1 text-left">
              <span className="px-3 text-[11px] font-normal uppercase tracking-wider text-slate-400 block text-left">
                Umpan Komunitas
              </span>
              <div className="space-y-0.5 pt-1 text-left">
                <Link
                  href="/community/latest"
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-normal transition-colors ${
                    tab === "new"
                      ? "bg-red-50 text-red-700 font-medium"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    icon="solar:clock-circle-linear"
                    className={`h-4 w-4 shrink-0 ${tab === "new" ? "text-red-600" : "text-slate-500"}`}
                  />
                  <span>Terbaru</span>
                </Link>
                <Link
                  href="/community/popular"
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-normal transition-colors ${
                    tab === "top"
                      ? "bg-red-50 text-red-700 font-medium"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    icon="solar:fire-linear"
                    className={`h-4 w-4 shrink-0 ${tab === "top" ? "text-red-600" : "text-slate-500"}`}
                  />
                  <span>Terpopuler</span>
                </Link>
                <Link
                  href="/community/phone"
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-normal transition-colors ${
                    tab === "dangerous"
                      ? "bg-red-50 text-red-700 font-medium"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    icon="solar:phone-bold-duotone"
                    className={`h-4 w-4 shrink-0 ${tab === "dangerous" ? "text-red-600" : "text-slate-500"}`}
                  />
                  <span>Nomor Berbahaya</span>
                </Link>
              </div>
            </div>

            {/* Categories Section */}
            <div className="space-y-1 pt-3 border-t border-slate-100 text-left">
              <span className="px-3 text-[11px] font-normal uppercase tracking-wider text-slate-400 block text-left">
                Topik Penipuan
              </span>
              <div className="space-y-0.5 pt-1 text-left">
                {CATEGORIES.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center justify-between rounded-xl px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors text-left"
                  >
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Tools Quick Links */}
            {!isAdmin && (
              <div className="space-y-1 pt-3 border-t border-slate-100 text-left">
                <span className="px-3 text-[11px] font-normal uppercase tracking-wider text-slate-400 block text-left">
                  Pintasan Fitur
                </span>
                <div className="space-y-0.5 pt-1 text-left">
                  <Link
                    href="/recognize"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors text-left"
                  >
                    <Icon icon="solar:shield-check-linear" className="h-4 w-4 text-slate-400" />
                    <span>Pindai Target</span>
                  </Link>
                  <Link
                    href="/history"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors text-left"
                  >
                    <Icon icon="solar:history-linear" className="h-4 w-4 text-slate-400" />
                    <span>Riwayat Scan</span>
                  </Link>
                  <Link
                    href="/learn"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors text-left"
                  >
                    <Icon icon="solar:book-2-linear" className="h-4 w-4 text-slate-400" />
                    <span>Simulasi Belajar</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 text-[11px] font-normal leading-relaxed text-slate-400 text-left">
            ThreatLens Anti-Scam Platform
          </div>
        </aside>

        {/* 2. Center Timeline Feed Column */}
        <main className="w-full max-w-[620px] border-x border-slate-100 min-h-screen bg-white flex flex-col pb-24 md:pb-12 text-left">
          {/* Sticky Tab Header (Redundant 'Papan Warga' header eliminated!) */}
          <div className="sticky top-16 z-20 border-b border-slate-100 bg-white/95 backdrop-blur-sm">
            <div className="flex border-b border-slate-100">
              {TABS.map((item) => {
                const active = tab === item.id;
                return (
                  <Link
                    key={item.id}
                    href={tabHref(item)}
                    className="flex-1 py-3 text-center text-xs sm:text-sm font-normal transition-colors relative hover:bg-slate-50/60"
                  >
                    <span
                      className={`font-normal ${active ? "text-red-600 font-medium" : "text-slate-500 hover:text-slate-900"}`}
                    >
                      {item.label}
                    </span>
                    {active && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-12 rounded-full bg-red-600" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Dangerous Numbers Top Banner if on that tab */}
          {tab === "dangerous" && !number && (
            <DangerousNumberBanner onReportClick={() => setReporting(true)} />
          )}

          {/* Reddit-Style Sleek Single-Line Create Post Entry Bar (Expandable on click) */}
          {tab !== "dangerous" && !number && (
            <div
              onClick={() => setCompose(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setCompose(true);
              }}
              className="border-b border-slate-100 p-3 sm:p-3.5 flex items-center gap-3 cursor-pointer bg-white hover:bg-slate-50/60 transition-colors text-left"
            >
              <div className="h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-normal shrink-0">
                W
              </div>
              <div className="flex-1 rounded-full bg-slate-100/80 hover:bg-slate-100 px-4 py-2 text-xs font-normal text-slate-400 transition-colors text-left truncate">
                Ceritakan modus penipuan atau bagikan pengalaman Anda...
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCompose(true);
                  }}
                  className="p-1.5 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                  title="Lampirkan foto bukti"
                  aria-label="Lampirkan foto bukti"
                >
                  <Icon icon="solar:camera-linear" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCompose(true);
                  }}
                  className="p-1.5 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                  title="Tautkan nomor telepon"
                  aria-label="Tautkan nomor telepon"
                >
                  <Icon icon="solar:phone-bold-duotone" className="h-4 w-4 text-slate-500" />
                </button>
              </div>
            </div>
          )}

          {/* Active Filter Notice Banner */}
          {number && (
            <div className="border-b border-slate-100 p-4 flex items-center justify-between gap-3 bg-slate-50/60 text-left">
              <div className="min-w-0 text-left">
                <p className="text-xs font-normal text-slate-500 text-left">
                  Menampilkan cerita untuk nomor:
                </p>
                <NumberHandle number={number} size="md" />
              </div>
              <button
                type="button"
                onClick={clearFilter}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-normal text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Tampilkan Semua
              </button>
            </div>
          )}

          {feed.errorMessage && (
            <div
              role="alert"
              className="border-b border-red-200 bg-red-50 p-4 text-xs font-normal text-red-700 text-left"
            >
              {feed.errorMessage}
            </div>
          )}

          {/* Feed Stream */}
          {feed.loading ? (
            <div className="grid place-items-center gap-3 py-24 text-xs font-normal text-slate-500">
              <Icon
                icon="solar:restart-linear"
                className="h-7 w-7 animate-spin text-slate-800"
              />
              <span aria-live="polite">Memuat konten komunitas...</span>
            </div>
          ) : tab === "dangerous" ? (
            <DangerousNumberList numbers={feed.numbers} />
          ) : feed.posts.length === 0 ? (
            <div className="grid place-items-center gap-3 px-6 py-20 text-center border-b border-slate-100">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400">
                <Icon icon="solar:chat-round-dots-linear" className="h-6 w-6" />
              </div>
              <p className="text-sm font-normal text-slate-900">
                {number
                  ? "Belum ada cerita untuk nomor ini."
                  : "Belum ada cerita di papan ini."}
              </p>
              <p className="max-w-xs text-xs font-normal leading-relaxed text-slate-500">
                Jadilah pelopor dengan membagikan bukti dan kronologi agar warga
                lain dapat lebih waspada.
              </p>
            </div>
          ) : (
            <div>
              {feed.posts.map((post) => (
                <PostCard key={post.id} post={post} onVote={feed.vote} onRemove={feed.remove} />
              ))}
            </div>
          )}

          {!feed.loading && feed.hasMore && (
            <button
              type="button"
              onClick={feed.loadMore}
              disabled={feed.loadingMore}
              className="border-b border-slate-100 py-3.5 text-xs font-normal text-slate-600 hover:bg-slate-50 transition-colors w-full disabled:text-slate-400"
            >
              {feed.loadingMore
                ? "Memuat..."
                : tab === "dangerous"
                  ? "Muat Nomor Berikutnya"
                  : "Muat Cerita Berikutnya"}
            </button>
          )}

          {/* Rules fallback for small screen view */}
          <div className="p-4 lg:hidden">
            <RuleNotes
              open={rulesOpen}
              onToggle={() => setRulesOpen((prev) => !prev)}
            />
          </div>
        </main>

        {/* 3. Right Sticky Sidebar (Distinct Surface Separation, No Search Widget, Accordion Rules, No Redundant Disclaimer) */}
        <aside className="hidden lg:block w-[320px] xl:w-[350px] shrink-0 sticky top-16 h-fit pt-4 pb-8 px-4 space-y-4 text-left">
          {/* Distinct Surface Card: Nomor Paling Banyak Dilaporkan */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-3 shadow-2xs text-left">
            <div className="flex items-center justify-between text-left">
              <h3 className="text-xs font-semibold text-slate-900 tracking-tight text-left">
                Nomor Paling Banyak Dilaporkan
              </h3>
              <Link
                href="/community/phone"
                className="text-[11px] font-normal text-red-600 hover:text-red-700 hover:underline transition-colors"
              >
                Lihat Semua &rarr;
              </Link>
            </div>
            <div className="space-y-2.5 text-left">
              {topNumbers.length === 0 ? (
                <p className="text-xs font-normal text-slate-400 py-2 text-left">
                  Belum ada data nomor berisiko.
                </p>
              ) : (
                topNumbers.map((row) => (
                  <div
                    key={row.number_e164}
                    className="flex items-center justify-between text-xs py-1 border-b border-slate-200/60 last:border-0 text-left"
                  >
                    <div className="min-w-0 flex-1 text-left">
                      <NumberHandle number={row.number_e164} size="sm" />
                      <p className="text-[11px] font-normal text-slate-400 mt-0.5 text-left">
                        {row.verified_reports} laporan terverifikasi
                      </p>
                    </div>
                    <Link
                      href={`/recognize/phone/${phoneSlug(row.number_e164)}`}
                      className="text-[11px] font-normal text-slate-700 hover:text-red-600 px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-red-200 transition-colors shrink-0 shadow-2xs"
                    >
                      Cek
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Distinct Surface Card: Panduan Warga (Accordion Style to eliminate cognitive overload) */}
          <RuleNotes
            open={rulesOpen}
            onToggle={() => setRulesOpen((prev) => !prev)}
          />
        </aside>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav
        aria-label="Navigasi Mobile"
        className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-slate-100 bg-white/95 backdrop-blur-sm py-2 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] md:hidden shadow-lg"
      >
        <MobileNavLink href={isAdmin ? null : "/"} icon="solar:home-2-linear" label="Beranda" />
        <MobileNavLink href={isAdmin ? null : "/recognize"} icon="solar:magnifer-linear" label="Pindai" />
        <Link
          href="/community/latest"
          className="flex min-w-0 flex-col items-center gap-1 text-[11px] font-normal text-slate-900 transition-colors"
        >
          <Icon
            icon="solar:users-group-two-rounded-linear"
            className="h-5 w-5"
          />
          <span>Komunitas</span>
        </Link>
        <button
          type="button"
          onClick={() =>
            tab === "dangerous" ? setReporting(true) : setCompose(true)
          }
          className="flex min-w-0 flex-col items-center gap-1 text-[11px] font-normal text-slate-700 hover:text-slate-900 transition-colors"
        >
          <Icon
            icon={
              tab === "dangerous"
                ? "solar:phone-calling-bold-duotone"
                : "solar:camera-linear"
            }
            className="h-5 w-5"
          />
          <span>
            {tab === "dangerous" ? "Lapor" : "Tulis"}
          </span>
        </button>
        <MobileNavLink href={isAdmin ? null : "/guide"} icon="solar:book-2-linear" label="Panduan" />
      </nav>

      <CreatePostPanel
        open={compose}
        onClose={() => setCompose(false)}
        onCreated={onCreated}
      />
      {reporting && (
        <ReportNumberPanel
          onClose={() => setReporting(false)}
          onSuccess={onReportSuccess}
        />
      )}

      {notice && (
        <div
          role="status"
          className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 flex items-center gap-3 rounded-full bg-slate-900 py-2.5 pl-5 pr-3 text-xs font-normal text-white shadow-xl md:bottom-6 max-w-[90vw]"
        >
          <span className="truncate">{notice.message}</span>
          {notice.numberSlug && (
            <Link
              href={`/recognize/phone/${notice.numberSlug}`}
              className="inline-flex items-center gap-1 rounded-full bg-white text-slate-900 px-3 py-1 text-[11px] font-medium hover:bg-slate-100 transition-colors shrink-0"
            >
              <span>Lihat Hasil Analisis</span>
              <Icon icon="solar:arrow-right-up-linear" className="h-3 w-3" />
            </Link>
          )}
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="text-slate-400 hover:text-white p-1 ml-1"
            aria-label="Tutup notifikasi"
          >
            <Icon icon="solar:close-circle-linear" className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  );
}

/**
 * Community discussion guidelines accordion widget reducing cognitive load.
 */
function RuleNotes({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-2 shadow-2xs text-left">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left text-xs font-semibold text-slate-900"
      >
        <span className="flex items-center gap-2">
          <Icon icon="solar:shield-warning-linear" className="h-4 w-4 text-red-600" />
          <span>Panduan Komunitas</span>
        </span>
        <Icon
          icon={open ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"}
          className="h-3.5 w-3.5 text-slate-400"
        />
      </button>

      {open && (
        <ul className="pt-2.5 border-t border-slate-200/60 space-y-2 text-xs font-normal text-slate-600 leading-relaxed text-left animate-in fade-in duration-150">
          {RULES.map((rule, index) => (
            <li key={rule} className="flex items-start gap-2 text-left">
              <span className="text-slate-400 font-mono text-[11px] shrink-0 mt-0.5">
                {index + 1}.
              </span>
              <span className="font-normal text-left">{rule}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
