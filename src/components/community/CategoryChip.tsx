"use client";

import { categoryLabel } from "@/lib/community";

/**
 * The category a story was filed under, in the words the writer chose it with.
 *
 * Deliberately uncoloured: five categories in five hues would turn the board into a candy jar and
 * leave nothing for the one thing that should stand out, which is a verified number. The label is a
 * filing slot, so it gets a label — a hairline outline, no fill, no gradient.
 */
export function CategoryChip({ category, className = "" }: { category: string; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded border border-pos-line px-1.5 py-0.5 text-[11px] font-semibold text-pos-ink/80 ${className}`}>
      {categoryLabel(category)}
    </span>
  );
}
