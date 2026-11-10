"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { api } from "@/lib/api";
import { CategoryChip } from "@/components/community/CategoryChip";
import { DeletePostControl } from "@/components/community/DeletePostControl";
import { DeleteCommentControl } from "@/components/community/DeleteCommentControl";
import { MobileNavLink } from "@/components/community/MobileNavLink";
import { AliasDisc, NumberHandle } from "@/components/community/NumberHandle";
import {
  COMMENT_MAX,
  communityMessage,
  displayNumber,
  timeAgo,
  withLocalVote,
  type CommunityComment,
  type CommunityPost,
  type DangerousNumber,
} from "@/lib/community";
import { phoneSlug } from "@/lib/phone";

type ThreadResponse = { post?: CommunityPost; comments?: CommunityComment[] };
type VoteResponse = { up_count: number; down_count: number; my_vote: number };

const CATEGORIES = [
  { label: "Semua Kategori", href: "/community/latest" },
  { label: "Kurir & Undangan APK", href: "/community/latest?kategori=apk" },
  { label: "Perbankan & Rekening", href: "/community/latest?kategori=bank" },
  { label: "Telemarketing & Pinjol", href: "/community/latest?kategori=telemarketing" },
  { label: "Undian & Hadiah Palsu", href: "/community/latest?kategori=hadiah" },
];

/**
 * Three-column community story thread detailing incident timeline, evidence, and nested comments.
 * Features independent center-column scrolling with hidden scrollbar matching standard social platforms.
 */
export function PostThread({
  postID,
  isAdmin = false,
}: {
  postID: string;
  isAdmin?: boolean;
}) {
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [threads, setThreads] = useState<CommunityComment[]>([]);
  const [topNumbers, setTopNumbers] = useState<DangerousNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [comment, setComment] = useState("");
  const [replyTo, setReplyTo] = useState<CommunityComment | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [zoomImage, setZoomImage] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const data = (await api(`/api/v1/community/posts/${postID}`)) as ThreadResponse;
      setPost(data.post ?? null);
      setThreads(data.comments ?? []);
    } catch (failure) {
      setErrorMessage(communityMessage(failure instanceof Error ? failure.message : null));
    } finally {
      setLoading(false);
    }
  }, [postID]);

  useEffect(() => {
    const timer = setTimeout(() => void load(), 0);
    return () => clearTimeout(timer);
  }, [load]);

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

  useEffect(() => {
    if (!zoomImage) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoomImage(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomImage]);

  const vote = async (value: number) => {
    if (!post) return;
    const before = post;
    setPost(withLocalVote(before, value));
    try {
      const result = (await api(`/api/v1/community/posts/${postID}/vote`, {
        method: "POST",
        body: JSON.stringify({ value }),
      })) as VoteResponse;
      setPost({
        ...before,
        up_count: result.up_count,
        down_count: result.down_count,
        score: result.up_count - result.down_count,
        my_vote: result.my_vote,
      });
    } catch (failure) {
      setPost(before);
      setErrorMessage(communityMessage(failure instanceof Error ? failure.message : null));
    }
  };

  const submit = async (text: string, parentID: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setErrorMessage("");
    try {
      await api(`/api/v1/community/posts/${postID}/comments`, {
        method: "POST",
        body: JSON.stringify({ body: trimmed, parent_id: parentID }),
      });
      setComment("");
      setReply("");
      setReplyTo(null);
      await load();
    } catch (failure) {
      setErrorMessage(communityMessage(failure instanceof Error ? failure.message : null));
    } finally {
      setSending(false);
    }
  };

  // The story is gone once this answers, so the thread leaves the page rather than trying to show
  // what it just deleted.
  const remove = async () => {
    try {
      await api(`/api/v1/community/posts/${postID}`, { method: "DELETE" });
      router.replace("/community/latest");
      return true;
    } catch (failure) {
      setErrorMessage(communityMessage(failure instanceof Error ? failure.message : null));
      return false;
    }
  };

  // A comment is erased where it stands: the thread is re-read rather than patched, because the
  // replies under it leave too — a list edited by hand would keep showing children of a row that
  // does not exist any more.
  const removeComment = async (commentID: string) => {
    try {
      await api(`/api/v1/community/posts/${postID}/comments/${commentID}`, { method: "DELETE" });
      await load();
      return true;
    } catch (failure) {
      setErrorMessage(communityMessage(failure instanceof Error ? failure.message : null));
      return false;
    }
  };

  const copyLink = async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  if (loading) {
    return (
      <div className="grid place-items-center gap-3 py-28 text-xs font-normal text-slate-500">
        <Icon icon="solar:restart-linear" className="h-7 w-7 animate-spin text-slate-800" />
        <span aria-live="polite">Memuat cerita warga...</span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-20 text-center">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-red-50 text-red-600">
          <Icon icon="solar:danger-triangle-linear" className="h-6 w-6" />
        </div>
        <h2 className="text-base font-normal text-slate-900">Cerita Tidak Ditemukan</h2>
        <p className="mt-1 text-xs font-normal text-slate-500">
          {errorMessage || communityMessage("not_found")}
        </p>
        <Link
          href="/community/latest"
          className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-normal text-slate-700 shadow-xs transition-colors hover:bg-slate-50"
        >
          <Icon icon="solar:arrow-left-linear" className="h-4 w-4" />
          <span>Kembali ke Papan Cerita</span>
        </Link>
      </div>
    );
  }

  const commentCount = threads.reduce(
    (total, thread) => total + 1 + (thread.replies?.length ?? 0),
    0
  );
  const slug = phoneSlug(post.number_e164);
  const handle = `@${post.author_alias.toLowerCase().replace(/[^a-z0-9]/g, "") || "warga"}`;

  return (
    <div className="mx-auto flex w-full max-w-7xl justify-center bg-white h-[calc(100vh-73px)] overflow-hidden">
      {/* 1. Left Navigation Rail (Desktop - Stationary) */}
      <aside className="hidden md:flex flex-col w-[200px] lg:w-[230px] xl:w-[250px] shrink-0 h-full overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pt-4 pb-6 px-3 justify-between text-left border-r border-slate-100">
        <div className="space-y-5 text-left">
          <Link
            href="/community/latest"
            className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/70 px-3 py-2 text-xs font-normal text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Icon icon="solar:arrow-left-linear" className="h-4 w-4 shrink-0 text-slate-500" />
            <span>Kembali ke Papan</span>
          </Link>

          {/* Feeds Section */}
          <div className="space-y-1 text-left">
            <span className="px-3 text-[11px] font-normal uppercase tracking-wider text-slate-400 block text-left">
              Umpan Komunitas
            </span>
            <div className="space-y-0.5 pt-1 text-left">
              <Link
                href="/community/latest"
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-normal text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <Icon icon="solar:clock-circle-linear" className="h-4 w-4 shrink-0 text-slate-500" />
                <span>Terbaru</span>
              </Link>
              <Link
                href="/community/popular"
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-normal text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <Icon icon="solar:fire-linear" className="h-4 w-4 shrink-0 text-slate-500" />
                <span>Terpopuler</span>
              </Link>
              <Link
                href="/community/phone"
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-normal text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <Icon icon="solar:phone-bold-duotone" className="h-4 w-4 shrink-0 text-slate-500" />
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

      {/* 2. Center Timeline Feed Column (Only this component scrolls, scrollbar hidden) */}
      <main className="w-full max-w-[660px] border-x border-slate-100 h-full overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex flex-col pb-24 md:pb-12 text-left px-4 sm:px-6 py-5">
        {/* Navigation Breadcrumb Bar */}
        <div className="mb-4 flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <Link
            href="/community/latest"
            className="inline-flex items-center gap-1.5 text-xs font-normal text-slate-500 hover:text-slate-900 transition-colors"
          >
            <Icon icon="solar:arrow-left-linear" className="h-3.5 w-3.5" />
            <span>Papan Cerita</span>
          </Link>
          {isAdmin && (
            <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 border border-amber-200">
              Admin
            </span>
          )}
        </div>

        {/* Story Article */}
        <article className="border-b border-slate-100 pb-6 text-left">
          {/* Author Header */}
          <header className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex min-w-0 items-center gap-3">
              <AliasDisc alias={post.author_alias} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-normal">
                  <span className="font-normal text-sm text-slate-900">{post.author_alias}</span>
                  <span className="text-slate-400 font-normal">{handle}</span>
                  <span className="text-slate-300 font-normal" aria-hidden="true">·</span>
                  <time className="text-slate-400 font-normal">{timeAgo(post.created_at)}</time>
                </div>
              </div>
            </div>
          </header>

          {/* Relokasi Badge Kategori & Sorotan Nomor Terlapor */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <CategoryChip category={post.category} />
            <Link
              href={`/recognize/phone/${slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50 px-2.5 py-0.5 text-xs font-normal tabular-nums text-slate-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700"
              title="Periksa nomor di pemindai ThreatLens"
            >
              <Icon icon="solar:phone-bold-duotone" className="h-3.5 w-3.5 text-red-600" />
              <span className="font-normal">{displayNumber(post.number_e164)}</span>
            </Link>
          </div>

          {/* Incident Title */}
          <h1 className="mt-2 text-xl sm:text-2xl font-normal leading-snug text-slate-900 text-left">
            {post.title}
          </h1>

          {/* Story Narrative Body (Mengalir langsung dari Judul) */}
          <p className="mt-4 text-sm sm:text-base font-normal leading-relaxed text-slate-700 whitespace-pre-line text-left">
            {post.body}
          </p>

          {/* Evidence Inspector */}
          {post.evidence_url && (
            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 text-left">
              {/* Sejajar rapat: 'Tangkapan Layar Bukti Obrolan' dan 'Terverifikasi' */}
              <div className="mb-2 flex items-center gap-2 text-xs">
                <span className="font-normal text-slate-700">Tangkapan Layar Bukti Obrolan</span>
                <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-normal text-slate-500">
                  <Icon icon="solar:shield-check-linear" className="h-3 w-3 text-emerald-600" />
                  <span>Terverifikasi</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setZoomImage(true)}
                aria-label="Perbesar gambar bukti"
                className="group relative flex max-h-[460px] w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-xl bg-slate-950/5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.evidence_url}
                  alt={`Bukti gambar cerita ${post.title}`}
                  className="max-h-[460px] w-full object-contain transition-transform duration-200 group-hover:scale-[1.01]"
                />
                <span className="absolute bottom-2 right-2 rounded-lg bg-slate-900/70 px-2.5 py-1 text-[11px] font-normal text-white">
                  Klik untuk perbesar
                </span>
              </button>
            </div>
          )}

          {/* Fullscreen Zoom Modal */}
          {zoomImage && post.evidence_url && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"
              role="dialog"
              aria-modal="true"
              aria-label="Pratinjau gambar bukti"
              onClick={() => setZoomImage(false)}
            >
              <button
                type="button"
                onClick={() => setZoomImage(false)}
                aria-label="Tutup pratinjau"
                className="absolute right-4 top-4 rounded-full bg-slate-800 p-2 text-white hover:bg-slate-700 transition-colors"
              >
                <Icon icon="solar:close-circle-linear" className="h-6 w-6" />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.evidence_url}
                alt={`Bukti gambar cerita ${post.title}`}
                onClick={(e) => e.stopPropagation()}
                className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
              />
            </div>
          )}

          {/* Action Metrics Footer (Ordered: Upvote, Downvote, Comment, Share) */}
          <footer className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs font-normal">
              {/* 1. Upvote Button */}
              <button
                type="button"
                onClick={() => vote(post.my_vote === 1 ? 0 : 1)}
                aria-pressed={post.my_vote === 1}
                aria-label="Upvote cerita ini"
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-normal transition-colors ${
                  post.my_vote === 1
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : "text-slate-700 hover:bg-slate-100 hover:text-red-600"
                }`}
                title="Upvote cerita"
              >
                <Icon icon="solar:alt-arrow-up-linear" className="h-4 w-4 shrink-0" />
                <span className="font-normal tabular-nums">{post.up_count ?? 0}</span>
              </button>

              {/* 2. Downvote Button */}
              <button
                type="button"
                onClick={() => vote(post.my_vote === -1 ? 0 : -1)}
                aria-pressed={post.my_vote === -1}
                aria-label="Downvote cerita ini"
                className={`inline-flex items-center justify-center rounded-lg px-2 py-1.5 font-normal transition-colors ${
                  post.my_vote === -1
                    ? "bg-slate-200 text-slate-900 hover:bg-slate-300"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
                title="Downvote cerita"
              >
                <Icon icon="solar:alt-arrow-down-linear" className="h-4 w-4 shrink-0" />
              </button>

              {/* 3. Comment Indicator */}
              <a
                href="#komentar"
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-normal text-slate-600 transition-colors hover:bg-slate-100 hover:text-red-600"
                title="Menuju ke diskusi komentar"
              >
                <Icon icon="solar:chat-round-line-linear" className="h-4 w-4 shrink-0" />
                <span className="font-normal tabular-nums">{commentCount} Tanggapan</span>
              </a>

              {/* 4. Share / Copy Link Button */}
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-normal text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                title="Salin tautan cerita ini"
              >
                <Icon
                  icon={copied ? "solar:check-circle-bold" : "solar:copy-linear"}
                  className={`h-4 w-4 shrink-0 ${copied ? "text-emerald-600" : ""}`}
                />
                <span>{copied ? "Tersalin!" : "Salin Link"}</span>
              </button>

              {post.is_author && (
                <DeletePostControl onDelete={remove} triggerClassName="px-2.5 py-1.5" />
              )}
            </div>

            <Link
              href={`/recognize/phone/${slug}`}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-normal text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <Icon icon="solar:shield-warning-linear" className="h-4 w-4 text-red-600" />
              <span>Detail Intelijen Nomor</span>
            </Link>
          </footer>
        </article>

        {/* 5. Nested Comments Section */}
        <section id="komentar" className="mt-8 text-left">
          <div className="border-b border-slate-100 pb-3 text-left">
            <h2 className="text-base sm:text-lg font-normal text-slate-900 text-left">
              Diskusi & Tanggapan Warga ({commentCount})
            </h2>
            <p className="mt-1 text-xs font-normal text-slate-500 text-left">
              Bagikan pengalaman atau kronologi penanganan Anda untuk saling mengingatkan sesama warga tanpa membagikan informasi pribadi rahasia.
            </p>
          </div>

          {/* Root Comment Box */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              submit(comment, "");
            }}
            className="mt-4 space-y-2 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 sm:p-4 text-left"
          >
            <textarea
              value={comment}
              maxLength={COMMENT_MAX}
              disabled={sending}
              rows={3}
              aria-label="Tulis tanggapan atau kronologi tambahan"
              onChange={(event) => {
                setComment(event.target.value);
                setErrorMessage("");
              }}
              placeholder="Tuliskan pengalaman atau saran penanganan Anda..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-xs sm:text-sm font-normal text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100 transition-colors"
            />
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-normal tabular-nums text-slate-400">
                {comment.trim().length}/{COMMENT_MAX}
              </span>
              <button
                type="submit"
                disabled={sending || !comment.trim()}
                className="rounded-full bg-red-600 px-5 py-2 text-xs font-normal text-white shadow-2xs transition-colors hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400"
              >
                {sending ? "Mengirim..." : "Kirim Komentar"}
              </button>
            </div>
          </form>

          {errorMessage && (
            <div
              role="alert"
              className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-normal text-red-700 text-left"
            >
              {errorMessage}
            </div>
          )}

          {/* Comment Stream */}
          <div className="mt-6 space-y-5 text-left">
            {threads.length === 0 ? (
              <div className="py-12 text-center text-xs font-normal text-slate-400">
                <div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-400">
                  <Icon icon="solar:chat-round-line-linear" className="h-5 w-5" />
                </div>
                <span>Belum ada komentar. Jadilah warga pertama yang membagikan tanggapan!</span>
              </div>
            ) : (
              threads.map((thread) => (
                <div key={thread.id} className="space-y-3 border-b border-slate-100 pb-4 text-left">
                  <CommentRow
                    comment={thread}
                    authorAlias={post.author_alias}
                    hasReplies={(thread.replies?.length ?? 0) > 0}
                    onDelete={() => removeComment(thread.id)}
                    onReply={() => {
                      setReplyTo(thread);
                      setReply("");
                    }}
                  />

                  {/* Nested Replies with Hairline Guide */}
                  <div className="border-l-2 border-slate-100 hover:border-slate-300 transition-colors pl-3 sm:pl-4 ml-4 space-y-3 text-left">
                    {(thread.replies ?? []).map((replyItem) => (
                      <CommentRow
                        key={replyItem.id}
                        comment={replyItem}
                        authorAlias={post.author_alias}
                        nested
                        onDelete={() => removeComment(replyItem.id)}
                      />
                    ))}

                    {/* Inline Reply Input Box */}
                    {replyTo?.id === thread.id && (
                      <form
                        onSubmit={(event) => {
                          event.preventDefault();
                          submit(reply, thread.id);
                        }}
                        className="mt-2 space-y-2 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 text-left"
                      >
                        <textarea
                          value={reply}
                          maxLength={COMMENT_MAX}
                          disabled={sending}
                          autoFocus
                          rows={2}
                          aria-label={`Balas tanggapan ${thread.author_alias}`}
                          onChange={(event) => setReply(event.target.value)}
                          placeholder={`Balas tanggapan ${thread.author_alias}...`}
                          className="w-full resize-none rounded-lg border border-slate-200 bg-white p-2.5 text-xs sm:text-sm font-normal text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-normal tabular-nums text-slate-400">
                            {reply.trim().length}/{COMMENT_MAX}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setReplyTo(null);
                                setReply("");
                              }}
                              className="rounded-full px-3 py-1 text-xs font-normal text-slate-500 hover:text-slate-900 transition-colors"
                            >
                              Batal
                            </button>
                            <button
                              type="submit"
                              disabled={sending || !reply.trim()}
                              className="rounded-full bg-red-600 px-4 py-1 text-xs font-normal text-white shadow-2xs hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400 transition-colors"
                            >
                              {sending ? "Mengirim..." : "Kirim Balasan"}
                            </button>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* 3. Right Context Rail (Desktop - Stationary) */}
      <aside className="hidden lg:block w-[320px] xl:w-[350px] shrink-0 h-full overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pt-4 pb-8 px-4 space-y-4 text-left border-l border-slate-100">
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

        {/* First Aid & Safety Checklist */}
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-3 shadow-2xs text-left">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 text-left">
            <Icon icon="solar:shield-warning-linear" className="h-4 w-4 text-red-600" />
            <span>Panduan Cepat Darurat</span>
          </div>

          <ul className="space-y-2 text-xs font-normal text-slate-600 leading-relaxed text-left">
            <li className="flex items-start gap-2">
              <span className="text-slate-400 font-mono text-[11px] shrink-0 mt-0.5">1.</span>
              <span>Jangan pernah mengunduh berkas APK atau mengklik tautan tidak dikenal.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-slate-400 font-mono text-[11px] shrink-0 mt-0.5">2.</span>
              <span>Jangan bagikan kode OTP, PIN perbankan, atau nomor kartu identitas.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-slate-400 font-mono text-[11px] shrink-0 mt-0.5">3.</span>
              <span>Segera blokir nomor dan laporkan ke bank jika data perbankan terlanjur tersebar.</span>
            </li>
          </ul>

          <Link
            href="/guide"
            className="inline-flex items-center gap-1 pt-1 text-xs font-normal text-red-600 hover:text-red-700 hover:underline"
          >
            <span>Buka panduan mitigasi 15 menit</span>
            <Icon icon="solar:arrow-right-up-linear" className="h-3.5 w-3.5" />
          </Link>
        </div>
      </aside>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav
        aria-label="Navigasi Mobile"
        className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-slate-100 bg-white/95 backdrop-blur-sm py-2 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] md:hidden shadow-lg"
      >
        <MobileNavLink href={isAdmin ? null : "/"} icon="solar:magnifer-linear" label="Pindai" />
        <Link
          href="/community/latest"
          className="flex min-w-0 flex-col items-center gap-1 text-[11px] font-normal text-slate-900 transition-colors"
        >
          <Icon icon="solar:users-group-two-rounded-linear" className="h-5 w-5" />
          <span>Komunitas</span>
        </Link>
        <a
          href="#komentar"
          className="flex min-w-0 flex-col items-center gap-1 text-[11px] font-normal text-slate-700 hover:text-slate-900 transition-colors"
        >
          <Icon icon="solar:chat-round-line-linear" className="h-5 w-5" />
          <span>Komentar</span>
        </a>
        <MobileNavLink href={isAdmin ? null : "/guide"} icon="solar:book-2-linear" label="Panduan" />
      </nav>
    </div>
  );
}

/**
 * Renders an individual comment item with alias disc, OP author badge, and inline reply trigger.
 * The delete trigger only ever appears on the reader's own rows — the API stamps is_author and
 * refuses anybody else's comment, so this is presentation of a rule the server already holds.
 */
function CommentRow({
  comment,
  authorAlias,
  nested = false,
  hasReplies = false,
  onDelete,
  onReply,
}: {
  comment: CommunityComment;
  authorAlias?: string;
  nested?: boolean;
  hasReplies?: boolean;
  onDelete?: () => Promise<boolean>;
  onReply?: () => void;
}) {
  const isOriginalPoster = authorAlias && comment.author_alias === authorAlias;

  return (
    <div className="flex gap-2.5 sm:gap-3 text-left">
      <AliasDisc alias={comment.author_alias} />
      <div className="min-w-0 flex-1 text-left">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-normal">
          <span className="font-normal text-slate-900">{comment.author_alias}</span>

          {/* OP Author Distinction Badge */}
          {isOriginalPoster && (
            <span className="rounded bg-red-50 border border-red-200/80 px-1.5 py-0.2 text-[10px] font-medium text-red-700">
              Penulis Cerita
            </span>
          )}

          {nested && !isOriginalPoster && (
            <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-normal text-slate-600">
              balasan
            </span>
          )}

          <span className="text-slate-300 font-normal" aria-hidden="true">·</span>
          <time className="text-slate-400 font-normal">{timeAgo(comment.created_at)}</time>
        </div>

        <p className="mt-1 text-xs sm:text-sm font-normal leading-relaxed text-slate-700 whitespace-pre-line text-left">
          {comment.body}
        </p>

        {/* Reply Trigger for root comments + erase for the reader's own */}
        {(onReply || (comment.is_author && onDelete)) && (
          <div className="mt-1.5 flex items-center gap-3">
            {onReply && (
              <button
                type="button"
                onClick={onReply}
                className="inline-flex items-center gap-1 text-xs font-normal text-slate-500 hover:text-red-600 transition-colors"
              >
                <Icon icon="solar:chat-round-line-linear" className="h-3.5 w-3.5" />
                <span>Balas</span>
              </button>
            )}
            {comment.is_author && onDelete && (
              <DeleteCommentControl hasReplies={hasReplies} onDelete={onDelete} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
