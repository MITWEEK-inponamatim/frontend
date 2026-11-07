"use client";

import { Icon } from "@/components/ui/Icon";

/**
 * Compact segmented vote pill displaying upvote count and downvote option.
 */
export function VoteControls({
  score,
  mine,
  onVote,
}: {
  score: number;
  mine: number;
  onVote: (value: number) => void;
}) {
  const toggle = (value: number) => onVote(mine === value ? 0 : value);

  return (
    <div className="inline-flex items-center rounded-full border border-slate-200/90 bg-slate-50/80 p-0.5 text-xs font-normal text-slate-700">
      <button
        type="button"
        onClick={() => toggle(1)}
        aria-pressed={mine === 1}
        aria-label="Upvote cerita ini"
        className={`inline-flex items-center gap-1.5 rounded-l-full px-2.5 py-1 text-xs font-normal transition-colors ${
          mine === 1
            ? "bg-red-50 text-red-600 hover:bg-red-100"
            : "text-slate-700 hover:bg-slate-200/60 hover:text-slate-900"
        }`}
      >
        <Icon
          icon={mine === 1 ? "solar:alt-arrow-up-bold" : "solar:alt-arrow-up-linear"}
          className="h-4 w-4 shrink-0"
        />
        <span className="font-normal">Upvote</span>
        <span className="font-normal tabular-nums">{score}</span>
      </button>

      <div className="h-3.5 w-px bg-slate-200" aria-hidden="true" />

      <button
        type="button"
        onClick={() => toggle(-1)}
        aria-pressed={mine === -1}
        aria-label="Downvote cerita ini"
        className={`inline-flex items-center justify-center rounded-r-full px-2 py-1 text-xs font-normal transition-colors ${
          mine === -1
            ? "bg-slate-200 text-slate-900 hover:bg-slate-300"
            : "text-slate-500 hover:bg-slate-200/60 hover:text-slate-900"
        }`}
      >
        <Icon
          icon={mine === -1 ? "solar:alt-arrow-down-bold" : "solar:alt-arrow-down-linear"}
          className="h-4 w-4 shrink-0"
        />
      </button>
    </div>
  );
}
