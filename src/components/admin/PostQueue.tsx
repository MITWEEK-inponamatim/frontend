"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { useAdminConsole } from "@/components/admin/AdminShell";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  DecisionButtons,
  EvidenceShot,
  FactRow,
  LedgerRow,
  QueueCard,
  QueueNotice,
  QueueSkeleton,
  RowLink,
  RowSplit,
  VerdictMark,
} from "@/components/admin/queue-ui";
import { useModerationQueue } from "@/hooks/useModerationQueue";
import { categoryLabel, displayNumber } from "@/lib/community";
import { phoneSlug } from "@/lib/phone";
import {
  POST_QUEUES,
  POST_STATUS_META,
  deskStamp,
  postConfirmation,
  postDecisions,
  type ModeratedPost,
  type PostStatus,
} from "@/lib/admin";

const QUEUE_PATH = "/api/v1/admin/community/posts";
const patchPath = (id: string) => `${QUEUE_PATH}/${id}/status`;
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-desk-ink";

/**
 * The story queue. A moderator is not judging whether a story is true here — that is what the vote
 * counts beside the title are for — but whether it belongs on the board at all.
 */
export function PostQueue() {
  const { search, setDraft, announce } = useAdminConsole();
  const [queue, setQueue] = useState<PostStatus | "all">("active");
  const [target, setTarget] = useState<{ id: string; to: string } | null>(null);
  const [asked, setAsked] = useState<{ row: ModeratedPost; to: PostStatus } | null>(null);
  const { rows, meta, loading, errorMessage, pendingID, page, lastPage, decide, reload, previousPage, nextPage } =
    useModerationQueue<ModeratedPost>({ path: QUEUE_PATH, patchPath, queue, search });

  useEffect(() => {
    if (errorMessage) announce(errorMessage);
  }, [errorMessage, announce]);

  // Same rule as the report queue: asking first, then writing. Taking a story off the board is the
  // one action here a citizen sees the consequence of immediately.
  const write = async () => {
    if (!asked) return;
    const { row, to } = asked;
    setTarget({ id: row.id, to });
    const moved = await decide(row, to);
    setTarget(null);
    if (moved) {
      setAsked(null);
      announce(`Cerita “${row.title}” ditandai ${POST_STATUS_META[to].label}.`);
    }
  };

  const confirmation = asked ? postConfirmation(asked.to) : null;

  return (
    <div className="flex min-w-0 flex-col gap-4 @3xl/main:gap-5">
      <QueueCard
        queues={POST_QUEUES}
        queue={queue}
        onQueue={(id) => setQueue(id as PostStatus | "all")}
        noun="cerita"
        meta={meta}
        shown={rows.length}
        page={page}
        lastPage={lastPage}
        onPrevious={previousPage}
        onNext={nextPage}
        search={search}
        onClearSearch={() => setDraft("")}
      >
        {loading ? (
          <QueueSkeleton />
        ) : errorMessage ? (
          <QueueNotice
            kind="error"
            title="Antrean tidak dapat dimuat"
            body={errorMessage}
            actionLabel="Muat ulang"
            onAction={reload}
          />
        ) : rows.length === 0 ? (
          search ? (
            <QueueNotice
              kind="empty"
              title="Tidak ada cerita yang cocok"
              body={`Kata “${search}” tidak muncul di judul atau cerita mana pun pada antrean ini. Coba kata yang lebih pendek.`}
              actionLabel="Hapus filter"
              onAction={() => setDraft("")}
            />
          ) : (
            <QueueNotice
              kind="empty"
              title={queue === "active" ? "Belum ada cerita yang tayang" : "Belum ada cerita di sini"}
              body={
                queue === "active"
                  ? "Papan warga sedang kosong. Buka tab Semua untuk melihat cerita yang pernah dihapus."
                  : "Tidak ada cerita pada status ini. Buka tab Semua untuk melihat cerita dalam setiap status."
              }
            />
          )
        ) : (
          rows.map((row, index) => (
            <PostCard
              key={row.id}
              row={row}
              zebra={index % 2 === 1}
              busy={pendingID === row.id}
              pendingTo={target?.id === row.id ? target.to : null}
              onPick={(to) => setAsked({ row, to })}
            />
          ))
        )}
      </QueueCard>

      {asked && confirmation && (
        <ConfirmDialog
          open
          surface="desk"
          title={confirmation.title}
          body={confirmation.body}
          confirmLabel={confirmation.confirmLabel}
          busyLabel="Menyimpan"
          busy={pendingID === asked.row.id}
          onConfirm={() => void write()}
          onCancel={() => setAsked(null)}
        />
      )}
    </div>
  );
}

function PostCard({
  row,
  zebra,
  busy,
  pendingTo,
  onPick,
}: {
  row: ModeratedPost;
  zebra: boolean;
  busy: boolean;
  pendingTo: string | null;
  onPick: (to: PostStatus) => void;
}) {
  const status = POST_STATUS_META[row.status] ?? POST_STATUS_META.active;
  const slug = phoneSlug(row.number_e164);

  return (
    <LedgerRow tone={status.tone} zebra={zebra}>
      <RowSplit
        matter={
          <>
            <h2 className="max-w-[52ch] text-[17px] leading-[1.35] font-medium tracking-[-0.02em] text-desk-ink">
              {row.title}
            </h2>

            <FactRow>
              {slug ? (
                <Link
                  href={`/community/phone?nomor=${encodeURIComponent(row.number_e164)}`}
                  className={`font-desk-data text-[12.5px] tracking-[-0.02em] tabular-nums text-desk-ink underline decoration-desk-rule underline-offset-2 hover:decoration-desk-edge ${FOCUS}`}
                >
                  {displayNumber(row.number_e164)}
                </Link>
              ) : (
                <span className="font-desk-data text-[12.5px] tracking-[-0.02em] tabular-nums text-desk-ink">
                  {displayNumber(row.number_e164)}
                </span>
              )}
              <span className="font-medium">{categoryLabel(row.category)}</span>
              <span className="tabular-nums">{deskStamp(row.created_at)}</span>
              <span>{row.author_alias || "Akun tanpa nama"}</span>
            </FactRow>

            <p className="max-w-[68ch] pt-3 text-[14px] leading-[1.65] whitespace-pre-line line-clamp-6 text-desk-ink">
              {row.body}
            </p>

            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-3 text-[12.5px] tabular-nums text-desk-muted">
              <span title={`${row.up_count} warga menganggap cerita ini membantu`}>
                <Icon icon="solar:alt-arrow-up-linear" aria-hidden="true" className="mr-1.5 inline size-[13px]" />
                {row.up_count} membantu
              </span>
              <span title={`${row.down_count} warga menganggap cerita ini tidak membantu`}>
                <Icon icon="solar:alt-arrow-down-linear" aria-hidden="true" className="mr-1.5 inline size-[13px]" />
                {row.down_count} tidak membantu
              </span>
              <span title={`${row.comment_count} komentar`}>
                <Icon icon="solar:chat-round-dots-linear" aria-hidden="true" className="mr-1.5 inline size-[13px]" />
                {row.comment_count} komentar
              </span>
            </p>
          </>
        }
        proof={row.evidence_url ? <EvidenceShot url={row.evidence_url} alt={`Bukti gambar cerita ${row.title}`} /> : undefined}
        decision={
          <>
            <VerdictMark tone={status.tone} label={status.label} title={status.meaning} />
            <DecisionButtons decisions={postDecisions(row.status)} pendingTo={pendingTo} blocked={busy} onPick={onPick} />
            <RowLink href={`/community/${row.id}`} title={`Baca cerita “${row.title}” seperti warga melihatnya`}>
              Baca penuh
            </RowLink>
          </>
        }
      />
    </LedgerRow>
  );
}
