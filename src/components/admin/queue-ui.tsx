"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { Decision, Tone } from "@/lib/admin";
import type { QueueMeta } from "@/hooks/useModerationQueue";

/**
 * Shared surfaces of the moderation desk, drawn as one register book instead of a stack of panels.
 * Three rules hold the console together: a verdict's colour is only ever a rule or a stamp, ink is
 * the only colour an action wears, and every row keeps the same three columns — so the decisions of
 * a hundred rows line up under one thumb and the eye can travel straight down the page.
 */

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-desk-ink";

const SPINE: Record<Tone, string> = {
  queue: "bg-desk-queue",
  approved: "bg-desk-approved",
  declined: "bg-desk-declined",
  spam: "bg-desk-spam",
  quiet: "bg-desk-edge",
};

const STAMP: Record<Tone, string> = {
  queue: "text-desk-queue",
  approved: "text-desk-approved",
  declined: "text-desk-declined",
  spam: "text-desk-spam",
  quiet: "text-desk-faint",
};

/**
 * The verdict, stamped rather than badged: two hairlines above and below the word, the way a
 * register marks an entry closed. No filled background, because a tint would compete with the
 * ink-only rule that says "this colour means a decision, this colour means you can press it".
 */
export function VerdictMark({ tone, label, title }: { tone: Tone; label: string; title?: string }) {
  return (
    <span
      title={title}
      className={`inline-flex shrink-0 items-center gap-2 border-y border-current/30 py-[3px] pr-1.5 pl-2 text-[12px] leading-none font-medium ${STAMP[tone]}`}
    >
      <span aria-hidden="true" className={`size-[6px] ${SPINE[tone]}`} />
      {label}
    </span>
  );
}

/**
 * One lembaran: the sheet a queue is worked on. It wears the same card as the dasbor — satu bingkai
 * untuk tab, baris, dan paginasi — because a queue read for hours has to keep its controls in one
 * place instead of drifting between a sticky bar and a scrolling list.
 */
export function QueueCard({
  queues,
  queue,
  onQueue,
  noun,
  meta,
  shown,
  page,
  lastPage,
  onPrevious,
  onNext,
  search,
  onClearSearch,
  children,
}: {
  queues: { id: string; label: string; tone: Tone }[];
  queue: string;
  onQueue: (id: string) => void;
  noun: string;
  meta: QueueMeta;
  shown: number;
  page: number;
  lastPage: number;
  onPrevious: () => void;
  onNext: () => void;
  search: string;
  onClearSearch: () => void;
  children: ReactNode;
}) {
  const from = meta.offset + 1;
  const readout =
    shown === 0
      ? `Belum ada ${noun}`
      : meta.total === null
        ? `${shown} ${noun} di halaman ini`
        : `${from}–${meta.offset + shown} dari ${meta.total} ${noun}`;

  return (
    <section
      aria-label={`Antrean ${noun}`}
      className="min-w-0 overflow-hidden rounded-[16px] border border-desk-rule bg-desk-paper shadow-[var(--shell-shadow-surface)]"
    >
      <div className="border-b border-desk-rule px-3 py-2.5">
        <div
          role="group"
          aria-label={`Pilih antrean ${noun}`}
          className="no-scrollbar -mx-1 flex min-w-0 items-center gap-1 overflow-x-auto px-1"
        >
          {queues.map((item) => {
            const isActive = item.id === queue;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => onQueue(item.id)}
                className={`inline-flex h-7 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-2.5 text-[12px] whitespace-nowrap transition-colors duration-150 motion-reduce:transition-none ${FOCUS} ${
                  isActive
                    ? "border-desk-edge bg-desk-sink text-desk-ink"
                    : "border-transparent text-desk-muted hover:bg-desk-stripe hover:text-desk-ink"
                }`}
              >
                <span aria-hidden="true" className={`size-1.5 rounded-full ${SPINE[item.tone]}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {search && (
        <div className="flex flex-wrap items-center gap-2.5 border-b border-desk-rule bg-desk-stripe px-4 py-2 text-[12.5px] text-desk-muted sm:px-5">
          <Icon icon="solar:magnifer-linear" aria-hidden="true" className="size-[14px] text-desk-faint" />
          <span>
            Hanya {noun} yang memuat <span className="text-desk-ink">&ldquo;{search}&rdquo;</span>
          </span>
          <button
            type="button"
            onClick={onClearSearch}
            className={`ml-auto rounded-[2px] px-1 text-desk-muted underline decoration-desk-rule underline-offset-2 hover:text-desk-ink ${FOCUS}`}
          >
            Hapus filter
          </button>
        </div>
      )}

      <ul className="divide-y divide-desk-rule">{children}</ul>

      <div className="flex items-center justify-between gap-3 border-t border-desk-rule px-4 py-2.5 text-[12px] text-desk-muted sm:px-5">
        <span className="tabular-nums">{readout}</span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onPrevious}
            disabled={page <= 1}
            aria-label="Halaman sebelumnya"
            title="Halaman sebelumnya"
            className={`grid size-7 place-items-center rounded-[8px] border border-transparent text-desk-muted transition-colors hover:bg-desk-sink hover:text-desk-ink disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-desk-muted motion-reduce:transition-none ${FOCUS}`}
          >
            <Icon icon="solar:alt-arrow-left-linear" className="size-4" />
          </button>
          <span className="min-w-[5ch] text-center font-desk-data tabular-nums" aria-live="polite">
            <span className="sr-only">Halaman </span>
            {page} / {lastPage}
          </span>
          <button
            type="button"
            onClick={onNext}
            disabled={page >= lastPage}
            aria-label="Halaman berikutnya"
            title="Halaman berikutnya"
            className={`grid size-7 place-items-center rounded-[8px] border border-transparent text-desk-muted transition-colors hover:bg-desk-sink hover:text-desk-ink disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-desk-muted motion-reduce:transition-none ${FOCUS}`}
          >
            <Icon icon="solar:alt-arrow-right-linear" className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

/**
 * One decision waiting for a moderator. The left rule is the status, the alternating wash is only a
 * reading aid: this list is worked top to bottom for hours, and a row that can be followed to its
 * right edge without losing the line is the whole point of the stripe.
 */
export function LedgerRow({
  tone,
  zebra,
  children,
}: {
  tone: Tone;
  zebra: boolean;
  children: ReactNode;
}) {
  return (
    <li
      className={`relative py-4 pr-4 pl-[17px] transition-colors duration-150 hover:bg-desk-sink motion-reduce:transition-none sm:pr-5 sm:pl-[21px] ${
        zebra ? "bg-desk-stripe" : "bg-desk-paper"
      }`}
    >
      <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-[3px] ${SPINE[tone]}`} />
      {children}
    </li>
  );
}

/**
 * Three columns, always in the same place: the claim, the picture that backs it, and the verdict
 * with the moves that change it. Fixing the proof and the decision to their own widths is what
 * keeps a hundred rows readable — the eye drops down one column instead of hunting for where the
 * last row ended.
 */
export function RowSplit({ matter, proof, decision }: { matter: ReactNode; proof?: ReactNode; decision: ReactNode }) {
  return (
    <div className="grid gap-x-5 gap-y-3.5 sm:grid-cols-[minmax(0,1fr)_104px_184px]">
      <div className="min-w-0">{matter}</div>
      {proof !== undefined && <div className="w-fit sm:pt-[2px]">{proof}</div>}
      <div className="flex flex-col items-start gap-2.5">{decision}</div>
    </div>
  );
}

/** The number is the thing under review, so it is the largest type on the desk. */
export function NumberSubject({ e164 }: { e164: string }) {
  // Breaking only after the country code: the grouping dashes belong to the number, and a number
  // cut in the middle of a group is one a moderator has to reassemble by eye.
  const [prefix = "", ...groups] = e164.split(" ");
  return (
    <span className="font-desk-data text-[19px] leading-[1.15] font-medium tracking-[-0.03em] tabular-nums text-desk-ink sm:text-[24px]">
      {prefix}
      {groups.length > 0 && <span className="ml-[0.4em] whitespace-nowrap">{groups.join(" ")}</span>}
    </span>
  );
}

/**
 * The facts about one row. They sit in a wrap of open space, not a sentence: gaps and weight do the
 * separating, because a string of dot-separated fragments is how a generated page gives itself away
 * and a moderator scanning 400 rows reads these as columns, never as prose.
 */
export function FactRow({ children }: { children: ReactNode }) {
  const items = Children.toArray(children);
  return (
    <p className="flex flex-wrap gap-x-4 gap-y-1 pt-2 text-[12.5px] leading-[1.4] text-desk-muted">
      {items.map((item, index) => (
        <span key={index} className="whitespace-nowrap">
          {item}
        </span>
      ))}
    </p>
  );
}

/**
 * Evidence the reporter attached. Full size on demand: a moderator deciding on a screenshot has to
 * be able to read it, and a thumbnail of a chat log is not evidence.
 */
export function EvidenceShot({ url, alt }: { url: string; alt: string }) {
  const [zoomed, setZoomed] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!zoomed) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoomed(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomed]);

  return (
    <>
      <button
        type="button"
        onClick={() => setZoomed(true)}
        aria-label={`Buka bukti gambar: ${alt}`}
        className={`group relative block size-[92px] shrink-0 overflow-hidden rounded-[2px] border border-desk-rule bg-desk-sink sm:size-[104px] ${FOCUS}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={alt} loading="lazy" className="size-full object-cover" />
        <span className="absolute inset-0 grid place-items-center bg-desk-ink/0 text-desk-paper opacity-0 transition-[background-color,opacity] duration-150 group-hover:bg-desk-ink/45 group-hover:opacity-100 group-focus-visible:bg-desk-ink/45 group-focus-visible:opacity-100 motion-reduce:transition-none">
          <Icon icon="solar:maximize-square-linear" className="size-[18px]" />
        </span>
      </button>

      {zoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setZoomed(false)}
          className="fixed inset-0 z-50 grid place-items-center bg-desk-ink/85 p-4 sm:p-8"
        >
          <button
            ref={closeRef}
            type="button"
            onClick={() => setZoomed(false)}
            aria-label="Tutup bukti gambar"
            className={`absolute top-3 right-3 grid size-10 place-items-center rounded-[2px] bg-desk-paper text-desk-ink ${FOCUS}`}
          >
            <Icon icon="solar:close-circle-linear" className="size-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={alt} className="max-h-[88vh] max-w-full rounded-[3px] object-contain" />
        </div>
      )}
    </>
  );
}

export function NoEvidence() {
  return (
    <span
      title="Laporan ini masuk tanpa gambar bukti"
      className="grid size-[92px] shrink-0 place-items-center rounded-[2px] border border-dashed border-desk-edge text-desk-edge sm:size-[104px]"
    >
      <Icon icon="solar:camera-linear" className="size-5" />
    </span>
  );
}

/**
 * The moves a row may still make. All of them wear the same ink outline on purpose: the moment one
 * verdict button looks friendlier than the others, a moderator has to re-read the labels before
 * every click. They stack one per slot in a column of their own, so the same move of every row sits
 * at the same place on the screen. Number-key shortcuts are deliberately absent — a wrong keystroke
 * here would open a verdict nobody meant to give. A click itself only asks: writing the status is
 * the queue's confirmation dialog's job, so `onPick` reads as "the moderator wants to know".
 */
export function DecisionButtons<T extends string>({
  decisions,
  pendingTo,
  blocked,
  onPick,
}: {
  decisions: Decision<T>[];
  pendingTo: string | null;
  blocked: boolean;
  onPick: (to: T) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 sm:w-full sm:flex-col sm:items-stretch">
      {decisions.map((decision) => {
        const isPending = pendingTo === decision.to;
        return (
          <button
            key={decision.to}
            type="button"
            title={decision.title}
            disabled={blocked}
            onClick={() => onPick(decision.to)}
            className={`inline-flex items-center justify-center gap-1.5 rounded-[2px] border px-3 py-[6px] text-[12.5px] font-medium transition-colors motion-reduce:transition-none ${FOCUS} ${
              isPending
                ? "border-desk-ink bg-desk-ink text-desk-paper"
                : "border-desk-edge bg-desk-paper text-desk-ink hover:bg-desk-ink hover:text-desk-paper"
            } disabled:cursor-progress disabled:border-desk-rule disabled:bg-desk-sink disabled:text-desk-faint`}
          >
            {isPending && <Spinner />}
            {isPending ? "Menyimpan" : decision.label}
          </button>
        );
      })}
    </div>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="size-[11px] animate-spin rounded-full border-[1.5px] border-current border-t-transparent motion-reduce:animate-none"
    />
  );
}

/** A quiet way out of the row, kept beside the evidence it refers to rather than under the text. */
export function RowLink({ href, title, children }: { href: string; title: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      title={title}
      className={`inline-flex items-center gap-1.5 rounded-[2px] px-0.5 text-[12.5px] text-desk-muted underline decoration-desk-rule underline-offset-2 hover:text-desk-ink hover:decoration-desk-edge ${FOCUS}`}
    >
      <Icon icon="solar:eye-linear" aria-hidden="true" className="size-[14px]" />
      {children}
    </Link>
  );
}

/** Tiga baris kosong, bentuknya sama persis dengan baris antrean di atasnya. */
export function QueueSkeleton() {
  return (
    <>
      {[0, 1, 2].map((index) => (
        <li key={index} aria-hidden="true" className="animate-pulse bg-desk-stripe py-4 pr-5 pl-[21px] motion-reduce:animate-none">
          <div className="h-[24px] w-[230px] rounded-[2px] bg-desk-rule" />
          <div className="mt-3 h-[11px] w-[340px] max-w-full rounded-[2px] bg-desk-rule/70" />
          <div className="mt-2.5 h-[11px] w-[260px] max-w-full rounded-[2px] bg-desk-rule/70" />
        </li>
      ))}
    </>
  );
}

/**
 * Empty and failed share one shape: what happened, what to do next, and the doing of it. Set on the
 * left like the rows above it — a centred empty state would read as a poster, and the moderator is
 * not being addressed, only informed. It is one row of the sheet, so the tabs and the pagination
 * around it stay put while a queue has nothing in it.
 */
export function QueueNotice({
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
    <li className="px-5 py-8 sm:px-7 sm:py-10">
      <span
        aria-hidden="true"
        className={`mb-3 flex items-center gap-2 text-[12px] font-medium ${isError ? "text-desk-spam" : "text-desk-faint"}`}
      >
        <Icon icon={isError ? "solar:danger-triangle-linear" : "solar:check-circle-linear"} className="size-[15px]" />
        {isError ? "Ada yang tidak beres" : "Tidak ada yang perlu diputuskan"}
      </span>
      <h2 className="text-[16px] leading-[1.3] font-medium tracking-[-0.018em] text-desk-ink">{title}</h2>
      <p className="max-w-[62ch] pt-1.5 text-[13.5px] leading-[1.6] text-desk-muted">{body}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className={`mt-4 inline-flex items-center gap-1.5 rounded-[2px] border border-desk-edge bg-desk-paper px-3 py-[7px] text-[13px] font-medium text-desk-ink transition-colors hover:bg-desk-ink hover:text-desk-paper motion-reduce:transition-none ${FOCUS}`}
        >
          <Icon icon="solar:restart-linear" className="size-4" />
          {actionLabel}
        </button>
      )}
    </li>
  );
}
