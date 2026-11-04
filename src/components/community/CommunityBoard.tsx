"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { PostCard } from "@/components/community/PostCard";
import { DangerousNumberList } from "@/components/community/DangerousNumberList";
import { CreatePostPanel } from "@/components/community/CreatePostPanel";
import { ReportNumberPanel } from "@/components/community/ReportNumberPanel";
import { NumberHandle } from "@/components/community/NumberHandle";
import { useCommunity, type CommunityTab } from "@/hooks/useCommunity";
import { canonicalPhone } from "@/lib/phone";
import { displayNumber } from "@/lib/community";

// Outlined when idle, filled when it is the tab you are on — the same switch a feed's nav makes, so
// the active tab does not need a colour to be recognised. Each tab has its own address, because a
// tab worth sharing or coming back to has to be something a link can point at.
export const TABS: { id: CommunityTab; label: string; href: string; idle: string; active: string }[] = [
  { id: "new", label: "Terbaru", href: "/community/latest", idle: "solar:clock-circle-linear", active: "solar:clock-circle-bold" },
  { id: "top", label: "Terpopuler", href: "/community/popular", idle: "solar:star-linear", active: "solar:star-bold-duotone" },
  { id: "dangerous", label: "Nomor berbahaya", href: "/community/phone", idle: "solar:shield-warning-linear", active: "solar:shield-warning-bold-duotone" },
];

const RULES = [
  "Setiap cerita butuh bukti gambar. Tanpa gambar, ceritanya tidak terkirim.",
  "Penulis tampil sebagai alias. Akun aslinya hanya dipakai untuk mengurutkan papan dan menghentikan spam.",
  "Vote mengatur urutan papan saja. Vote tidak membuat sebuah nomor jadi berbahaya.",
  "Daftar nomor berbahaya datang dari laporan yang sudah diverifikasi moderator — ambang yang sama dengan hasil pemindaian.",
];

const NAV_ROW =
  "flex w-full items-center gap-4 rounded-lg px-3 py-2.5 text-left text-[14px] transition-colors hover:bg-pos-ink/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pos-action";

/**
 * The board: three tabs, three addresses, and two actions that never share a button.
 *
 * "Terpopuler" is ordered by votes and "Nomor berbahaya" by verified reports, and keeping those in
 * separate tabs is what stops a popular story from looking like a verdict. The number filter comes
 * from ?nomor= so a dangerous row, a shared link, and the board itself all agree on what is shown.
 *
 * The middle column stays 470px wide because that is the measure a caption is readable at, and the
 * rail and the notes sit outside it instead of on top of the stories.
 */
export function CommunityBoard({ tab }: { tab: CommunityTab }) {
  const [compose, setCompose] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [notice, setNotice] = useState("");
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  // Canonical before anything else reads it: ?nomor= arrives as a slug (62812…) or a typed number
  // (0812…), and both spellings must narrow the feed to the same stories and display the same way.
  const rawNumber = params.get("nomor") ?? "";
  const number = canonicalPhone(rawNumber);
  const feed = useCommunity(tab, number);

  // Carrying ?nomor= across tabs keeps the same question answered in each ordering. The dangerous
  // list is not narrowed by a number — it *is* a list of numbers — so the filter stops at its door.
  const tabHref = (item: (typeof TABS)[number]) =>
    item.id === "dangerous" || !rawNumber ? item.href : `${item.href}?nomor=${encodeURIComponent(rawNumber)}`;

  // No refresh call: the ?nomor= value feeds useCommunity, so changing the address reloads the
  // list by itself.
  const clearFilter = () => router.replace(pathname);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 6000);
    return () => clearTimeout(timer);
  }, [notice]);

  const onCreated = (created: { id?: string; author_alias?: string; number_e164?: string }) => {
    feed.refresh();
    setNotice(
      created.id
        ? `Tayang sebagai ${created.author_alias ?? "Warga"}${created.number_e164 ? ` · ${displayNumber(created.number_e164)}` : ""}`
        : "Cerita Anda sudah dikirim.",
    );
  };

  const rail = (
    <>
      <nav aria-label="Tab papan" className="space-y-1">
        {TABS.map((item) => {
          const on = tab === item.id;
          return (
            <Link key={item.id} href={tabHref(item)} aria-current={on ? "page" : undefined}
              className={`${NAV_ROW} ${on ? "font-semibold text-pos-ink" : "text-pos-ink/70"}`}>
              <Icon icon={on ? item.active : item.idle} className="h-6 w-6 shrink-0 text-pos-ink" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      {/* Dua aksi yang berbeda, bukan satu tombol yang berganti nama. Cerita ditulis di papan ini,
          nomor dilaporkan lewat form laporan itu sendiri — keduanya tinggal di halaman yang sama,
          karena hanya laporan terverifikasi yang bisa membuat sebuah nomor masuk daftar. */}
      {tab === "dangerous" ? (
        <button type="button" onClick={() => setReporting(true)} className={`${NAV_ROW} mt-2 text-pos-ink/70 hover:text-pos-ink`}>
          <Icon icon="solar:phone-calling-bold-duotone" className="h-6 w-6 shrink-0 text-pos-ink" />
          <span className="min-w-0">
            <span className="block truncate">Lapor nomor berbahaya</span>
            <span className="mt-0.5 block text-[11px] leading-snug text-pos-muted">Wajib sertakan bukti gambar</span>
          </span>
        </button>
      ) : (
        <button type="button" onClick={() => setCompose(true)} className={`${NAV_ROW} mt-2 text-pos-ink/70 hover:text-pos-ink`}>
          <Icon icon="solar:add-square-linear" className="h-6 w-6 shrink-0 text-pos-ink" />
          <span className="truncate">Cerita baru</span>
        </button>
      )}
    </>
  );

  return (
    <>
      <div className="mx-auto flex w-full max-w-[1110px] justify-center gap-7 px-0 sm:px-4">
        <div className="hidden w-[244px] shrink-0 self-start pt-3 lg:sticky lg:top-[61px] lg:block">{rail}</div>

        <div className="min-w-0 w-full max-w-[614px] border-pos-line pb-24 sm:pt-3 lg:w-[470px] lg:max-w-[470px] lg:shrink-0 lg:pb-10">
          {feed.errorMessage && (
            <p role="alert" className="border-y border-pos-line bg-pos-card px-4 py-2.5 text-[13px] text-pos-bad">{feed.errorMessage}</p>
          )}

          {feed.loading ? (
            <div className="grid place-items-center gap-2 bg-pos-card py-20 text-[13px] text-pos-muted">
              <Icon icon="solar:restart-bold-duotone" className="h-6 w-6 animate-spin text-pos-ink" />
              <span aria-live="polite">Memuat cerita warga...</span>
            </div>
          ) : tab === "dangerous" ? (
            <div className="border-y border-pos-line">
              <DangerousNumberList numbers={feed.numbers} />
            </div>
          ) : feed.posts.length === 0 ? (
            <div className="grid place-items-center gap-2 border-y border-pos-line bg-pos-card px-6 py-16 text-center">
              <Icon icon="solar:chat-round-dots-linear" className="h-10 w-10 text-pos-muted" />
              <p className="text-[15px] font-semibold text-pos-ink">{number ? "Belum ada cerita untuk nomor ini." : "Belum ada cerita di papan ini."}</p>
              <p className="max-w-[19rem] text-[13px] leading-relaxed text-pos-muted">
                Cerita pertama tidak membuatnya lebih benar. Setiap cerita butuh bukti gambar dan tetap milik orang yang
                menulisnya.
              </p>
              <button type="button" onClick={() => setCompose(true)} className="mt-2 text-[13px] font-semibold text-pos-action-tua hover:text-pos-ink">
                Tulis cerita pertama
              </button>
            </div>
          ) : (
            <div className="border-y border-pos-line">
              {number && (
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-pos-line px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-[12px] text-pos-muted">Cerita tentang</p>
                    <NumberHandle number={number} size="sm" />
                  </div>
                  <button type="button" onClick={clearFilter} className="text-[13px] font-semibold text-pos-action-tua transition-colors hover:text-pos-ink">
                    Lihat semua
                  </button>
                </div>
              )}
              {feed.posts.map((post) => <PostCard key={post.id} post={post} onVote={feed.vote} />)}
            </div>
          )}

          {!feed.loading && feed.hasMore && (
            <button type="button" onClick={feed.loadMore} disabled={feed.loadingMore}
              className="w-full border-b border-pos-line bg-pos-card py-4 text-[13px] font-semibold text-pos-action-tua transition-colors hover:text-pos-ink disabled:text-pos-muted">
              {feed.loadingMore ? "Memuat..." : tab === "dangerous" ? "Muat nomor berikutnya" : "Muat cerita berikutnya"}
            </button>
          )}

          {/* Di bawah xl kolom kanan tidak ada, jadi catatan cara kerja papan ikut di bawah feed. */}
          <div className="mt-6 xl:hidden">
            <RuleNotes />
          </div>
        </div>

        <aside className="hidden w-[340px] shrink-0 self-start pt-3 xl:block">
          <div className="sticky top-[61px] space-y-5">
            <RuleNotes />

            <div className="rounded-lg border border-pos-line bg-pos-card px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-pos-shell text-pos-muted">
                  <Icon icon="solar:magnifier-linear" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-pos-ink">Pindai dulu nomornya</p>
                  <p className="mt-0.5 text-[12px] leading-snug text-pos-muted">Mesin menjawab apa yang terdeteksi; papan menjawab apa yang dialami warga.</p>
                </div>
                <Link href="/recognize" className="shrink-0 text-[13px] font-semibold text-pos-action-tua transition-colors hover:text-pos-ink">Buka</Link>
              </div>
            </div>

            <p className="px-1 text-[11px] leading-relaxed text-pos-muted">
              Papan ini menyimpan cerita, bukan putusan. Yang menetapkan sebuah nomor berbahaya hanyalah laporan
              terverifikasi. <Link href="/" className="font-semibold transition-colors hover:text-pos-ink">Halaman pemindaian</Link>
            </p>
          </div>
        </aside>
      </div>

      <nav aria-label="Navigasi papan" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-pos-line bg-pos-card pb-[env(safe-area-inset-bottom)] lg:hidden">
        {TABS.map((item) => {
          const on = tab === item.id;
          return (
            <Link key={item.id} href={tabHref(item)} aria-current={on ? "page" : undefined}
              className={`flex min-w-0 flex-col items-center gap-1 py-2.5 text-[11px] transition-colors ${on ? "font-semibold text-pos-ink" : "text-pos-muted"}`}>
              <Icon icon={on ? item.active : item.idle} className="h-6 w-6" />
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
        {tab === "dangerous" ? (
          <button type="button" onClick={() => setReporting(true)} className="flex min-w-0 flex-col items-center gap-1 py-2.5 text-[11px] text-pos-muted">
            <Icon icon="solar:phone-calling-bold-duotone" className="h-6 w-6" />
            <span className="max-w-full truncate">Lapor nomor</span>
          </button>
        ) : (
          <button type="button" onClick={() => setCompose(true)} className="flex min-w-0 flex-col items-center gap-1 py-2.5 text-[11px] text-pos-muted">
            <Icon icon="solar:add-square-linear" className="h-6 w-6" />
            <span className="max-w-full truncate">Cerita baru</span>
          </button>
        )}
      </nav>

      <CreatePostPanel open={compose} onClose={() => setCompose(false)} onCreated={onCreated} />
      {reporting && <ReportNumberPanel onClose={() => setReporting(false)} />}

      {notice && (
        <p role="status" className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 rounded-full bg-pos-ink px-4 py-2.5 text-[13px] text-white shadow-lg lg:bottom-6">
          {notice}
        </p>
      )}
    </>
  );
}

function RuleNotes() {
  return (
    <div className="rounded-lg border border-pos-line bg-pos-card px-4 py-3">
      <p className="text-[13px] font-semibold text-pos-muted">Sebelum menulis</p>
      <ul className="mt-2.5 space-y-2.5">
        {RULES.map((rule) => (
          <li key={rule} className="flex gap-2.5 text-[12px] leading-relaxed text-pos-muted">
            <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-pos-muted/70" />
            <span>{rule}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
