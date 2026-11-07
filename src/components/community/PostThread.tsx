"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { api } from "@/lib/api";
import { CategoryChip } from "@/components/community/CategoryChip";
import { AliasDisc } from "@/components/community/NumberHandle";
import { VoteControls } from "@/components/community/VoteControls";
import {
  COMMENT_MAX,
  communityMessage,
  displayNumber,
  timeAgo,
  withLocalVote,
  type CommunityComment,
  type CommunityPost,
} from "@/lib/community";
import { phoneSlug } from "@/lib/phone";

type ThreadResponse = { post?: CommunityPost; comments?: CommunityComment[] };
type VoteResponse = { up_count: number; down_count: number; my_vote: number };

/**
 * Full post detail thread displaying the citizen story, evidence, and nested comments hierarchy.
 */
export function PostThread({ postID }: { postID: string }) {
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [threads, setThreads] = useState<CommunityComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [comment, setComment] = useState("");
  const [replyTo, setReplyTo] = useState<CommunityComment | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [zoomImage, setZoomImage] = useState(false);

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

  if (loading) {
    return (
      <div className="grid place-items-center gap-3 py-28 text-xs font-normal text-slate-500">
        <Icon icon="solar:restart-bold-duotone" className="h-7 w-7 animate-spin text-slate-800" />
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
        <p className="mt-1 text-xs font-normal text-slate-500">{errorMessage || communityMessage("not_found")}</p>
        <Link
          href="/community/latest"
          className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-normal text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
        >
          <Icon icon="solar:arrow-left-linear" className="h-4 w-4" />
          <span>Kembali ke Papan Cerita</span>
        </Link>
      </div>
    );
  }

  const commentCount = threads.reduce((total, thread) => total + 1 + (thread.replies?.length ?? 0), 0);
  const slug = phoneSlug(post.number_e164);
  const handle = `@${post.author_alias.toLowerCase().replace(/[^a-z0-9]/g, "") || "warga"}`;

  return (
    <div className="mx-auto w-full max-w-2xl px-3 sm:px-4 py-4 sm:py-6">
      <Link
        href="/community/latest"
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-normal text-slate-500 transition-colors hover:text-slate-900"
      >
        <Icon icon="solar:arrow-left-linear" className="h-4 w-4" />
        <span>Kembali ke Semua Cerita</span>
      </Link>

      <article className="border-b border-slate-100 bg-white pb-6">
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
              <div className="mt-1 flex items-center gap-2">
                <Link
                  href={`/recognize/phone/${slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50 px-2.5 py-0.5 text-xs font-normal tabular-nums text-slate-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                  <Icon icon="solar:phone-bold-duotone" className="h-3.5 w-3.5 text-red-600" />
                  <span className="font-normal">{displayNumber(post.number_e164)}</span>
                </Link>
              </div>
            </div>
          </div>
          <CategoryChip category={post.category} />
        </header>

        <h1 className="mt-4 text-xl sm:text-2xl font-normal leading-snug text-slate-900">
          {post.title}
        </h1>

        <p className="mt-3 text-sm sm:text-base font-normal leading-relaxed text-slate-700 whitespace-pre-line">
          {post.body}
        </p>

        {post.evidence_url && (
          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 p-2">
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

        {zoomImage && post.evidence_url && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Pratinjau gambar bukti"
          >
            <button
              type="button"
              onClick={() => setZoomImage(false)}
              aria-label="Tutup pratinjau"
              className="absolute right-4 top-4 rounded-full bg-slate-800 p-2 text-white hover:bg-slate-700"
            >
              <Icon icon="solar:close-circle-linear" className="h-6 w-6" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.evidence_url}
              alt={`Bukti gambar cerita ${post.title}`}
              className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
            />
          </div>
        )}

        <footer className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-3">
            <VoteControls score={post.score} mine={post.my_vote ?? 0} onVote={vote} />
            <span className="text-xs font-normal text-slate-500">
              <span className="font-normal text-slate-800">{post.up_count}</span> menganggap berguna
            </span>
          </div>

          <Link
            href={`/recognize/phone/${slug}`}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-normal text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Icon icon="solar:shield-warning-linear" className="h-4 w-4 text-red-600" />
            <span>Cek Pemindai Nomor</span>
          </Link>
        </footer>
      </article>

      {/* Comment Section */}
      <section id="komentar" className="mt-6">
        <h2 className="text-base sm:text-lg font-normal text-slate-900">
          Diskusi & Tanggapan Warga ({commentCount})
        </h2>
        <p className="mt-1 text-xs font-normal text-slate-500">
          Bagikan pengalaman serupa untuk saling mengingatkan sesama warga tanpa menyebarkan data pribadi.
        </p>

        {/* Root Comment Box */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit(comment, "");
          }}
          className="mt-4 space-y-2 rounded-2xl border border-slate-100 bg-slate-50/50 p-3 sm:p-4"
        >
          <textarea
            value={comment}
            maxLength={COMMENT_MAX}
            disabled={sending}
            rows={3}
            aria-label="Tulis komentar"
            onChange={(event) => {
              setComment(event.target.value);
              setErrorMessage("");
            }}
            placeholder="Tuliskan komentar atau tanggapan Anda..."
            className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-xs sm:text-sm font-normal text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
          />
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-normal tabular-nums text-slate-400">
              {comment.trim().length}/{COMMENT_MAX}
            </span>
            <button
              type="submit"
              disabled={sending || !comment.trim()}
              className="rounded-full bg-red-600 px-5 py-2 text-xs font-normal text-white shadow-sm transition-colors hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400"
            >
              {sending ? "Mengirim..." : "Kirim Komentar"}
            </button>
          </div>
        </form>

        {errorMessage && (
          <div role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-normal text-red-700">
            {errorMessage}
          </div>
        )}

        {/* Comment List */}
        <div className="mt-6 space-y-5">
          {threads.length === 0 ? (
            <p className="py-6 text-center text-xs font-normal text-slate-400">
              Belum ada komentar. Jadilah warga pertama yang memberikan tanggapan!
            </p>
          ) : (
            threads.map((thread) => (
              <div key={thread.id} className="space-y-3 border-b border-slate-100 pb-4">
                <CommentRow comment={thread} />

                {/* Nested Replies with Hairline Guide */}
                <div className="space-y-3 border-l border-slate-100 pl-3 sm:pl-4 ml-4">
                  {(thread.replies ?? []).map((replyItem) => (
                    <CommentRow key={replyItem.id} comment={replyItem} nested />
                  ))}

                  {replyTo?.id === thread.id ? (
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        submit(reply, thread.id);
                      }}
                      className="mt-2 space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-3"
                    >
                      <input
                        value={reply}
                        maxLength={COMMENT_MAX}
                        disabled={sending}
                        autoFocus
                        aria-label={`Balas ${thread.author_alias}`}
                        onChange={(event) => setReply(event.target.value)}
                        placeholder={`Balas ${thread.author_alias}...`}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs sm:text-sm font-normal text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setReplyTo(null);
                            setReply("");
                          }}
                          className="rounded-full px-3 py-1 text-xs font-normal text-slate-500 hover:text-slate-900"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          disabled={sending || !reply.trim()}
                          className="rounded-full bg-red-600 px-4 py-1 text-xs font-normal text-white shadow-sm hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400"
                        >
                          {sending ? "Mengirim..." : "Kirim"}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setReplyTo(thread);
                        setReply("");
                      }}
                      className="inline-flex items-center gap-1 text-xs font-normal text-slate-500 transition-colors hover:text-red-600"
                    >
                      <Icon icon="solar:chat-round-line-linear" className="h-3.5 w-3.5" />
                      <span>Balas</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

/**
 * Renders an individual comment item with alias badge and formatted content.
 */
function CommentRow({ comment, nested = false }: { comment: CommunityComment; nested?: boolean }) {
  return (
    <div className="flex gap-2.5 sm:gap-3">
      <AliasDisc alias={comment.author_alias} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-xs font-normal">
          <span className="font-normal text-slate-900">{comment.author_alias}</span>
          <span className="text-slate-400 font-normal" aria-hidden="true">·</span>
          <time className="text-slate-400 font-normal">{timeAgo(comment.created_at)}</time>
          {nested && (
            <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-normal text-slate-600">
              balasan
            </span>
          )}
        </div>
        <p className="mt-1 text-xs sm:text-sm font-normal leading-relaxed text-slate-700 whitespace-pre-line">
          {comment.body}
        </p>
      </div>
    </div>
  );
}
