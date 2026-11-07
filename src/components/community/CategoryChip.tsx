"use client";

import { categoryLabel } from "@/lib/community";

/**
 * Renders a minimalist category badge with subtle borders and clear typography.
 */
export function CategoryChip({ category, className = "" }: { category: string; className?: string }) {
  const isHighThreat = category === "scam" || category === "phishing";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-normal transition-colors ${
        isHighThreat
          ? "border-red-200/80 bg-red-50/70 text-red-700"
          : "border-slate-200/90 bg-slate-50 text-slate-700"
      } ${className}`}
    >
      {categoryLabel(category)}
    </span>
  );
}
