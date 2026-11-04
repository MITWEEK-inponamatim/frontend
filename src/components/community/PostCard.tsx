"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { AliasDisc, NumberHandle } from "./NumberHandle";
import { CategoryChip } from "./CategoryChip";
import { VoteControls } from "./VoteControls";
import { excerpt, timeAgo, type CommunityPost } from "@/lib/community";

const ICON_BUTTON =
  "grid h-9 w-9 place-items-center rounded-full text-pos-ink transition-colors hover:bg-pos-ink/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pos-action";

/**
 * One story in the feed, built the way a photo post is built: who is speaking, the picture, the row
 * of actions, the tally, then the caption.
 *
 * The writer appears as their alias and nothing else — the account behind a post never leaves the
 * server, so a screenshot of this board cannot identify a reporter. The evidence keeps its own
 * aspect ratio on a dark stage instead of being cropped into a square: a screenshot with its numbers
 * cut off is not proof, and a feed of cropped tiles would quietly decide what a reader is allowed to
 * see.
 */
export function PostCard({ post, onVote }: { post: CommunityPost; onVote: (postID: string, value: number) => void }) {
  const href = `/community/${post.id}`;
  const untouched = post.up_count === 0 && post.down_count === 0;

  return (
    <article className="border-b border-pos-line bg-pos-card">
      <header className="flex items-center gap-3 px-4 py-3">
        <AliasDisc alias={post.author_alias} />
        <div className="min-w-0 flex-1">
          <NumberHandle number={post.number_e164} />
          <p className="mt-0.5 truncate text-[12px] text-pos-muted">
            <span className="font-semibold text-pos-ink/80">{post.author_alias}</span>
            <span aria-hidden="true"> · </span>
            {timeAgo(post.created_at)}
          </p>
        </div>
        <CategoryChip category={post.category} />
      </header>

      {post.evidence_url && (
        <Link href={href} className="block bg-pos-ink" aria-label={`Buka cerita ${post.title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- Cloudinary proof at its delivered size; next/image would need a remote loader for one picture. */}
          <img src={post.evidence_url} alt={`Bukti gambar cerita ${post.title}`} className="max-h-[460px] w-full object-contain" />
        </Link>
      )}

      <div className="flex items-center gap-0.5 px-3 pt-1">
        <VoteControls score={post.score} mine={post.my_vote ?? 0} onVote={(value) => onVote(post.id, value)} />
        <Link href={`${href}#komentar`} className={ICON_BUTTON} aria-label={`Lihat ${post.comment_count} komentar cerita ini`}>
          <Icon icon="solar:chat-round-line-linear" className="h-6 w-6" />
        </Link>
      </div>

      <p className="px-4 pt-1 text-[13px] leading-snug text-pos-ink">
        {untouched ? (
          <span className="text-pos-muted">Belum ada yang menilai cerita ini.</span>
        ) : (
          <>
            <span className="font-semibold">{post.up_count}</span> menganggap berguna
            {post.down_count > 0 && (
              <>
                <span aria-hidden="true"> · </span>
                <span className="font-semibold">{post.down_count}</span> menganggap tidak
              </>
            )}
          </>
        )}
      </p>

      <p className="px-4 pt-2 text-[14px] leading-[1.5] text-pos-ink/90">
        <Link href={href} className="font-semibold text-pos-ink hover:underline">
          {post.title}
        </Link>{" "}
        {excerpt(post.body, 180)}
      </p>

      {post.comment_count > 0 && (
        <Link href={`${href}#komentar`} className="mt-1.5 block px-4 text-[13px] text-pos-muted transition-colors hover:text-pos-ink">
          Lihat semua {post.comment_count} komentar
        </Link>
      )}

      <div className="h-3" />
    </article>
  );
}
