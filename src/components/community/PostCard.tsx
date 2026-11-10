"use client";

import { useState, type MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { AliasDisc } from "./NumberHandle";
import { CategoryChip } from "./CategoryChip";
import { DeletePostControl } from "./DeletePostControl";
import { excerpt, timeAgo, displayNumber, type CommunityPost } from "@/lib/community";
import { phoneSlug } from "@/lib/phone";

/**
 * X/Twitter-style community discussion card displaying citizen reports and action metrics.
 */
export function PostCard({
  post,
  onVote,
  onRemove,
}: {
  post: CommunityPost;
  onVote: (postID: string, value: number) => void;
  onRemove: (postID: string) => Promise<boolean>;
}) {
  const router = useRouter();
  const [zoomImage, setZoomImage] = useState(false);
  const href = `/community/${post.id}`;
  const slug = phoneSlug(post.number_e164);
  const handle = `@${post.author_alias.toLowerCase().replace(/[^a-z0-9]/g, "") || "warga"}`;

  const handleCardClick = (event: MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("button, a, input, textarea, [role='button']")) {
      return;
    }
    router.push(href);
  };

  return (
    <article
      onClick={handleCardClick}
      className="cursor-pointer border-b border-slate-100 p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex gap-3.5 items-start text-left"
    >
      <Link href={href} tabIndex={-1} aria-hidden="true" className="shrink-0">
        <AliasDisc alias={post.author_alias} />
      </Link>

      <div className="flex-1 min-w-0 space-y-2">
        <header className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-normal min-w-0">
            <span className="font-normal text-sm text-slate-900 truncate">{post.author_alias}</span>
            <span className="font-normal text-xs text-slate-400 truncate">{handle}</span>
            <span className="font-normal text-xs text-slate-300" aria-hidden="true">·</span>
            <time className="font-normal text-xs text-slate-400 shrink-0">{timeAgo(post.created_at)}</time>
          </div>
          <CategoryChip category={post.category} className="shrink-0" />
        </header>

        <h2 className="font-normal text-base text-slate-900 leading-snug">
          <Link href={href} className="transition-colors hover:text-red-600">
            {post.title}
          </Link>
        </h2>

        <p className="font-normal text-sm text-slate-700 leading-relaxed">
          {excerpt(post.body, 220)}
          {post.body.length > 220 && (
            <Link href={href} className="ml-1 font-normal text-red-600 hover:underline">
              Baca selengkapnya
            </Link>
          )}
        </p>

        <div className="pt-0.5">
          <Link
            href={`/recognize/phone/${slug}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50 px-2.5 py-0.5 text-xs font-normal tabular-nums text-slate-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            <Icon icon="solar:phone-bold-duotone" className="h-3.5 w-3.5 text-red-600" />
            <span className="font-normal">{displayNumber(post.number_e164)}</span>
          </Link>
        </div>

        {post.evidence_url && (
          <div className="mt-2 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
            <button
              type="button"
              onClick={() => setZoomImage(true)}
              aria-label="Perbesar gambar bukti"
              className="group relative flex max-h-[380px] w-full cursor-zoom-in items-center justify-center overflow-hidden bg-slate-950/5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.evidence_url}
                alt={`Bukti gambar cerita ${post.title}`}
                className="max-h-[380px] w-full object-cover transition-transform duration-200 group-hover:scale-[1.01]"
              />
              <span className="absolute bottom-2 right-2 rounded-lg bg-slate-900/70 px-2 py-1 text-[11px] font-normal text-white">
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

        <footer className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-2 text-xs font-normal text-slate-500">
          {/* 1. Upvote Button */}
          <button
            type="button"
            onClick={() => onVote(post.id, post.my_vote === 1 ? 0 : 1)}
            aria-pressed={post.my_vote === 1}
            aria-label="Upvote cerita ini"
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-normal transition-colors ${
              post.my_vote === 1
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "text-slate-600 hover:bg-slate-100 hover:text-red-600"
            }`}
            title="Upvote cerita"
          >
            <Icon icon="solar:alt-arrow-up-linear" className="h-3.5 w-3.5 shrink-0" />
            <span className="font-normal tabular-nums">{post.up_count ?? 0}</span>
          </button>

          {/* 2. Downvote Button */}
          <button
            type="button"
            onClick={() => onVote(post.id, post.my_vote === -1 ? 0 : -1)}
            aria-pressed={post.my_vote === -1}
            aria-label="Downvote cerita ini"
            className={`inline-flex items-center justify-center rounded-lg px-2 py-1 font-normal transition-colors ${
              post.my_vote === -1
                ? "bg-slate-200 text-slate-900 hover:bg-slate-300"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            }`}
            title="Downvote cerita"
          >
            <Icon icon="solar:alt-arrow-down-linear" className="h-3.5 w-3.5 shrink-0" />
          </button>

          {/* 3. Comment Link */}
          <Link
            href={`${href}#komentar`}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-normal text-slate-600 transition-colors hover:bg-slate-100 hover:text-red-600"
            title="Lihat komentar dan diskusi"
          >
            <Icon icon="solar:chat-round-line-linear" className="h-3.5 w-3.5 shrink-0" />
            <span className="font-normal tabular-nums">{post.comment_count}</span>
          </Link>

          {/* 4. Cek Nomor Link */}
          <Link
            href={`/recognize/phone/${slug}`}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 font-normal text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            title="Periksa nomor di pemindai ThreatLens"
          >
            <Icon icon="solar:arrow-right-up-linear" className="h-3.5 w-3.5 shrink-0" />
            <span className="font-normal">Cek Nomor</span>
          </Link>

          {post.is_author && (
            <div className="ml-auto">
              <DeletePostControl onDelete={() => onRemove(post.id)} />
            </div>
          )}
        </footer>
      </div>
    </article>
  );
}
