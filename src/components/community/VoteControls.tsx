"use client";

import { Icon } from "@/components/ui/Icon";

const BUTTON = "grid h-11 w-11 place-items-center rounded-full text-pos-ink transition-colors hover:bg-pos-ink/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pos-action";

/**
 * Up and down vote, as two icons in the row under the picture, outlined when the reader has not
 * spoken and filled when they have — the same switch a feed makes for a like.
 *
 * Clicking the arrow that is already lit withdraws the vote, because a reader who changes their mind
 * has to be able to walk back without hunting for a third control.
 *
 * Vote only orders this board — it never changes a number's risk level, which is decided by verified
 * reports. That is also why no total is printed inside these buttons: the count belongs in the line
 * under the row, next to the words that say what it means.
 */
export function VoteControls({ score, mine, onVote }: { score: number; mine: number; onVote: (value: number) => void }) {
  const toggle = (value: number) => onVote(mine === value ? 0 : value);

  return (
    <div className="flex items-center gap-0.5">
      <button
        type="button"
        onClick={() => toggle(1)}
        aria-pressed={mine === 1}
        aria-label="Anggap cerita ini berguna"
        className={`${BUTTON} ${mine === 1 ? "text-pos-good" : ""}`}
      >
        <Icon icon={mine === 1 ? "solar:alt-arrow-up-bold-duotone" : "solar:alt-arrow-up-linear"} className={`h-6 w-6 ${mine === 1 ? "pos-pop" : ""}`} />
      </button>
      <button
        type="button"
        onClick={() => toggle(-1)}
        aria-pressed={mine === -1}
        aria-label="Anggap cerita ini tidak berguna"
        className={`${BUTTON} ${mine === -1 ? "text-pos-bad" : ""}`}
      >
        <Icon icon={mine === -1 ? "solar:alt-arrow-down-bold-duotone" : "solar:alt-arrow-down-linear"} className={`h-6 w-6 ${mine === -1 ? "pos-pop" : ""}`} />
      </button>
      <span className="sr-only" aria-live="polite">{`Skor ${score}`}</span>
    </div>
  );
}
