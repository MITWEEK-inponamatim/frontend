"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * One question asked before something that cannot easily be undone.
 *
 * Two surfaces, one behaviour. `board` is the community paper (slate + red) and `desk` is the
 * moderator's register (the desk-* tokens), because a citizen and a moderator should still
 * recognise the furniture they are sitting at when a popup interrupts them. `ConfirmButton` is the
 * common shape — a trigger that owns its own dialog — and `ConfirmDialog` is exported for the cases
 * where the trigger already exists, like a row of decision buttons.
 */

export type ConfirmSurface = "board" | "desk";

const OVERLAY: Record<ConfirmSurface, string> = {
  board: "bg-slate-950/50",
  desk: "bg-desk-ink/45",
};

const PANEL: Record<ConfirmSurface, string> = {
  board: "rounded-2xl border border-slate-200 bg-white shadow-xl",
  desk: "rounded-[3px] border border-desk-rule bg-desk-paper shadow-2xl",
};

const TITLE: Record<ConfirmSurface, string> = {
  board: "text-[15px] font-normal text-slate-900",
  desk: "text-[15.5px] font-medium leading-[1.3] tracking-[-0.018em] text-desk-ink",
};

const BODY: Record<ConfirmSurface, string> = {
  board: "text-xs font-normal leading-relaxed text-slate-500",
  desk: "text-[13.5px] leading-[1.6] text-desk-muted",
};

const CANCEL: Record<ConfirmSurface, string> = {
  board:
    "rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-normal text-slate-700 transition-colors hover:bg-slate-50",
  desk: "rounded-[2px] border border-desk-edge bg-desk-paper px-3 py-[7px] text-[13px] font-medium text-desk-ink transition-colors hover:bg-desk-sink",
};

const CONFIRM: Record<ConfirmSurface, string> = {
  board:
    "rounded-full bg-red-600 px-4 py-2 text-xs font-normal text-white transition-colors hover:bg-red-700",
  desk: "rounded-[2px] bg-desk-ink px-3 py-[7px] text-[13px] font-medium text-desk-paper transition-colors hover:bg-desk-ink/90",
};

const RING: Record<ConfirmSurface, string> = {
  board: "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
  desk: "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-desk-ink",
};

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  cancelLabel = "Batal",
  busy = false,
  busyLabel,
  surface = "board",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  body: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  busy?: boolean;
  busyLabel?: string;
  surface?: ConfirmSurface;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // The way out is the safe default: focus lands on Batal, so a stray Enter cannot confirm. Keyed on
  // `open` alone — re-running it on every render would pull the caret back off a confirm button that
  // somebody has already tabbed to.
  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onCancel();
    };
    // Capture, not bubble: the panel below stops keydowns so the desk's "/" shortcut cannot fire
    // through the dialog, and a bubble-phase listener on window would be silenced by that same stop.
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, busy, onCancel]);

  if (!open) return null;

  const titleID = `confirm-${title.slice(0, 16).replace(/\W/g, "")}`;

  return (
    <div
      className={`fixed inset-0 z-50 grid place-items-center p-4 ${OVERLAY[surface]}`}
      // The dialog renders where its trigger sits, so a click on the dark area would keep bubbling
      // through the page behind it — on the board that means the story card navigating mid-answer.
      // Stopping here covers the backdrop; the panel below stops its own clicks and keystrokes.
      onClick={(event) => {
        event.stopPropagation();
        if (!busy) onCancel();
      }}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleID}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
        className={`w-full max-w-[26rem] p-5 text-left ${PANEL[surface]}`}
      >
        <h2 id={titleID} className={TITLE[surface]}>
          {title}
        </h2>
        <div className={`pt-1.5 ${BODY[surface]}`}>{body}</div>
        <div className="flex flex-wrap items-center justify-end gap-2 pt-4">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={busy}
            className={`${CANCEL[surface]} ${RING[surface]} transition-colors disabled:cursor-progress disabled:opacity-50`}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`${CONFIRM[surface]} ${RING[surface]} transition-colors disabled:cursor-progress disabled:opacity-60`}
          >
            {busy && busyLabel ? busyLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * A trigger that owns its confirmation dialog. `onConfirm` answers whether the action actually
 * happened: a failure leaves the dialog open so the sentence explaining it stays on screen.
 */
export function ConfirmButton({
  label,
  triggerTitle,
  triggerClassName,
  confirmTitle,
  body,
  confirmLabel,
  busyLabel,
  surface = "board",
  onConfirm,
}: {
  label: ReactNode;
  triggerTitle: string;
  triggerClassName: string;
  confirmTitle: string;
  body: ReactNode;
  confirmLabel: string;
  busyLabel: string;
  surface?: ConfirmSurface;
  onConfirm: () => Promise<boolean>;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    const done = await onConfirm();
    setBusy(false);
    if (done) setOpen(false);
  };

  return (
    <>
      <button type="button" title={triggerTitle} onClick={() => setOpen(true)} className={triggerClassName}>
        {label}
      </button>
      <ConfirmDialog
        open={open}
        surface={surface}
        title={confirmTitle}
        body={body}
        confirmLabel={confirmLabel}
        busy={busy}
        busyLabel={busyLabel}
        onConfirm={() => void run()}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
