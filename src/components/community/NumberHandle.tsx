"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { displayNumber } from "@/lib/community";
import { phoneSlug } from "@/lib/phone";

/**
 * Renders a tappable phone number handle formatted with proper digit spacing.
 */
export function NumberHandle({
  number,
  size = "md",
  className = "",
}: {
  number: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const digits = displayNumber(number);
  const slug = phoneSlug(number);
  const type = size === "lg" ? "text-lg sm:text-xl" : size === "sm" ? "text-xs" : "text-sm";
  const label = (
    <span className={`${type} font-normal tabular-nums tracking-tight text-slate-900 transition-colors hover:text-red-600 ${className}`}>
      {digits}
    </span>
  );

  if (!slug) return label;
  return (
    <Link href={`/recognize/phone/${slug}`} title={`Hasil pemindaian ${digits}`} className="inline-flex items-center">
      {label}
    </Link>
  );
}

/**
 * Avatar badge for phone numbers indicating verification status.
 */
export function NumberAvatar({ verified = false }: { verified?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full p-[2px] transition-colors ${
        verified ? "bg-red-50 text-red-600 ring-1 ring-red-100" : "bg-slate-100 text-slate-500"
      }`}
    >
      <Icon icon="solar:phone-bold-duotone" className="h-5 w-5" />
    </span>
  );
}

/**
 * Renders a geometric initial circular badge derived from the author's alias.
 */
export function AliasDisc({ alias }: { alias: string }) {
  const clean = alias.replace(/^Warga-?/i, "").trim();
  const badgeText = clean ? clean.slice(0, 2).toUpperCase() : "W";

  return (
    <span
      aria-hidden="true"
      title={alias}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-800 text-xs font-normal tracking-wider text-white"
    >
      {badgeText}
    </span>
  );
}
