"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { api } from "@/lib/api";
import { CategoryChip } from "@/components/community/CategoryChip";
import { AliasDisc, NumberHandle } from "@/components/community/NumberHandle";
import { VoteControls } from "@/components/community/VoteControls";
import {
  COMMENT_MAX,
  communityMessage,
  timeAgo,
  withLocalVote,
  type CommunityComment,
  type CommunityPost,
} from "@/lib/community";

type ThreadResponse = { post?: CommunityPost; comments?: CommunityComment[] };
type VoteResponse = { up_count: number; down_count: number; my_vote: number };

const LINK_MUTED = "text-[13px] text-pos-muted transition-colors hover:text-pos-ink";
const ACTION_TEXT = "text-[13px] font-semibold text-pos-action-tua transition-colors hover:text-pos-ink disabled:text-pos-muted";

/**
 * One story, in full, with its comments — laid out like a permalink: the picture on a dark stage at
 * the left, the words and the conversation in the column at the right.
 *
 * Replies stop at one level. A thread that nests forever turns a discussion into an unreadable tree,
 * and the API refuses a reply-to-a-reply too, so this UI only ever offers the button the server
 * would honour.
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
    // A timer, like the scanner's poll: the first render has to show a spinner, and a setState that
    // runs synchronously inside the effect body is the cascading render React asks us to avoid.
    const timer = setTimeout(() => void load(), 0);
    return () => clearTimeout(timer);
  }, [load]);

  const vote = async (value: number) => {
    if (!post) return;
    const before = post;
    setPost(withLocalVote(before, value));
    try {
      const result = (await api(`/api/v1/community/posts/${postID}/vote`, { method: "POST", body: JSON.stringify({ value }) })) as VoteResponse;
      setPost({ ...before, up_count: result.up_count, down_count: result.down_count, score: result.up_count - result.down_count, my_vote: result.my_vote });
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
      await api(`/api/v1/community/posts/${postID}/comments`, { method: "POST", body: JSON.stringify({ body: trimmed, parent_id: parentID }) });
      setComment(""); setReply(""); setReplyTo(null);
      await load();
    } catch (failure) {
      setErrorMessage(communityMessage(failure instanceof Error ? failure.message : null));
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="grid place-items-center gap-2 py-24 text-[13px] text-pos-muted">
        <Icon icon="solar:restart-bold-duotone" className="h-6 w-6 animate-spin text-pos-ink" />
        <span aria-live="polite">Memuat cerita...</span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto w-full max-w-[470px] px-4 py-16 text-center">
        <Icon icon="solar:danger-triangle-linear" className="mx-auto mb-3 h-8 w-8 text-pos-muted" />
        <p className="text-[15px] font-semibold text-pos-ink">Cerita ini tidak bisa dibuka.</p>
        <p className="mx-auto mt-1 max-w-sm text-[13px] leading-relaxed text-pos-muted">{errorMessage || communityMessage("not_found")}</p>
        <Link href="/community/latest" className="mt-4 inline-block text-[13px] font-semibold text-pos-action-tua hover:text-pos-ink">
          Kembali ke papan
        </Link>
      </div>
    );
  }

  const isReply = (parentID: string) => replyTo?.id === parentID;
  const commentCount = threads.reduce((total, thread) => total + 1 + (thread.replies?.length ?? 0), 0);
  const untouched = post.up_count === 0 && post.down_count === 0;

  return (
    <div className="mx-auto w-full max-w-[935px] px-0 pb-24 sm:px-4 sm:pb-10 sm:pt-6">
      <Link href="/community/latest" className={`${LINK_MUTED} mb-3 inline-flex items-center gap-1.5 px-4 sm:px-0`}>
        <Icon icon="solar:arrow-left-linear" className="h-4 w-4" />
        <span>Semua cerita</span>
      </Link>

      <article className="overflow-hidden border-y border-pos-line bg-pos-card sm:rounded-xl sm:border">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_404px]">
          <div className="flex min-h-[280px] items-center justify-center bg-pos-ink lg:max-h-[680px]">
            {post.evidence_url ? (
              // eslint-disable-next-line @next/next/no-img-element -- Cloudinary proof at its delivered size; next/image would need a remote loader for one picture.
              <img src={post.evidence_url} alt={`Bukti gambar cerita ${post.title}`} className="max-h-[680px] w-full object-contain" />
            ) : (
              <p className="px-6 text-center text-[13px] leading-relaxed text-white/60">Cerita ini tidak punya lampiran gambar.</p>
            )}
          </div>

          <div className="flex min-w-0 flex-col border-t border-pos-line lg:border-t-0 lg:border-l lg:max-h-[680px]">
            <header className="flex items-center gap-3 border-b border-pos-line px-4 py-3">
              <AliasDisc alias={post.author_alias} />
              <div className="min-w-0 flex-1">
                <NumberHandle number={post.number_e164} size="sm" />
                <p className="mt-0.5 truncate text-[12px] text-pos-muted">
                  <span className="font-semibold text-pos-ink/80">{post.author_alias}</span>
                  <span aria-hidden="true"> · </span>
                  {timeAgo(post.created_at)}
                </p>
              </div>
              <CategoryChip category={post.category} />
            </header>

            <div id="komentar" className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
              <div>
                <p className="text-[14px] leading-[1.6] text-pos-ink/90">
                  <span className="font-semibold text-pos-ink">{post.title}</span>{" "}
                  <span className="whitespace-pre-line">{post.body}</span>
                </p>
              </div>

              <div>
                <div className="flex items-center gap-0.5">
                  <VoteControls score={post.score} mine={post.my_vote ?? 0} onVote={vote} />
                </div>
                <p className="mt-1 text-[13px] leading-snug text-pos-ink">
                  {untouched ? (
                    <span className="text-pos-muted">Belum ada yang menilai cerita ini.</span>
                  ) : (
                    <>
                      <span className="font-semibold tabular-nums">{post.up_count}</span> menganggap berguna
                      {post.down_count > 0 && (
                        <>
                          <span aria-hidden="true"> · </span>
                          <span className="font-semibold tabular-nums">{post.down_count}</span> menganggap tidak
                        </>
                      )}
                    </>
                  )}
                </p>
                <p className="mt-2 text-[12px] leading-relaxed text-pos-muted">
                  Suara di sini hanya mengurutkan papan. Status berbahaya sebuah nomor ditentukan oleh laporan yang sudah
                  diverifikasi, bukan oleh berapa banyak orang yang percaya satu cerita.
                </p>
              </div>

              {errorMessage && <p role="alert" className="text-[13px] leading-relaxed text-pos-bad">{errorMessage}</p>}

              <div className="border-t border-pos-line pt-3">
                <p className="text-[13px] font-semibold text-pos-ink">
                  {commentCount === 0 ? "Belum ada komentar" : `${commentCount} komentar`}
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-pos-muted">
                  Tanggapi dengan pengalaman Anda sendiri, bukan dengan tuduhan. Nomor bisa dipalsukan dan berpindah
                  pemilik, jadi satu cerita yang benar belum pasti tentang orang yang sama.
                </p>

                <ul className="mt-3 space-y-4">
                  {threads.map((thread) => (
                    <li key={thread.id}>
                      <CommentRow comment={thread} />
                      <div className="mt-2 space-y-3 pl-3 sm:pl-4">
                        {(thread.replies ?? []).map((answer) => (
                          <div key={answer.id} className="border-l border-pos-line pl-3">
                            <CommentRow comment={answer} nested />
                          </div>
                        ))}
                        {isReply(thread.id) ? (
                          <form
                            onSubmit={(event) => { event.preventDefault(); submit(reply, thread.id); }}
                            className="flex items-center gap-2"
                          >
                            <input value={reply} maxLength={COMMENT_MAX} disabled={sending} autoFocus
                              aria-label={`Balas ${thread.author_alias}`} onChange={(event) => setReply(event.target.value)}
                              placeholder={`Balas ${thread.author_alias}...`}
                              className="min-w-0 flex-1 rounded-lg border border-pos-line bg-pos-card px-3 py-1.5 text-[13px] text-pos-ink placeholder:text-pos-muted focus:border-pos-ink focus:outline-none" />
                            <button type="submit" disabled={sending || !reply.trim()} className={ACTION_TEXT}>Kirim</button>
                            <button type="button" onClick={() => { setReplyTo(null); setReply(""); }} className={LINK_MUTED}>Batal</button>
                          </form>
                        ) : (
                          <button type="button" onClick={() => { setReplyTo(thread); setReply(""); }} className={`${LINK_MUTED} text-[12px] font-semibold`}>
                            Balas
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <form
              onSubmit={(event) => { event.preventDefault(); submit(comment, ""); }}
              className="flex items-center gap-2 border-t border-pos-line px-4 py-3"
            >
              <input value={comment} maxLength={COMMENT_MAX} disabled={sending} aria-label="Tulis komentar"
                onChange={(event) => { setComment(event.target.value); setErrorMessage(""); }}
                placeholder="Tambahkan komentar..."
                className="min-w-0 flex-1 bg-transparent text-[14px] text-pos-ink placeholder:text-pos-muted focus:outline-none" />
              <button type="submit" disabled={sending || !comment.trim()} className={ACTION_TEXT}>
                {sending ? "Mengirim..." : "Bagikan"}
              </button>
            </form>
          </div>
        </div>
      </article>
    </div>
  );
}

function CommentRow({ comment, nested = false }: { comment: CommunityComment; nested?: boolean }) {
  return (
    <div className="flex gap-3">
      <AliasDisc alias={comment.author_alias} />
      <div className="min-w-0 flex-1">
        <p className="text-[14px] leading-[1.5] text-pos-ink/90">
          <span className="font-semibold text-pos-ink">{comment.author_alias}</span>{" "}
          <span className="whitespace-pre-line">{comment.body}</span>
        </p>
        <p className="mt-1 text-[12px] text-pos-muted">
          {timeAgo(comment.created_at)}
          {nested && (
            <>
              <span aria-hidden="true"> · </span>balasan
            </>
          )}
        </p>
      </div>
    </div>
  );
}
