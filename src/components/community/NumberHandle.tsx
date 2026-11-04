"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { displayNumber } from "@/lib/community";
import { phoneSlug } from "@/lib/phone";

/**
 * The number a story is about, set the way a feed sets an account name: bold, first line, tappable.
 *
 * On this board the number is the identity of a post and the writer is a witness — the one fact all
 * reporters agree on is which number rang. It links to /recognize/phone/[slug] so "what did they do"
 * and "what does the checker say" stay one click apart without pretending to be the same answer.
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
  const type = size === "lg" ? "text-[19px]" : size === "sm" ? "text-[13px]" : "text-[14px]";
  const label = <span className={`${type} font-semibold tabular-nums tracking-tight text-pos-ink ${className}`}>{digits}</span>;

  if (!slug) return label;
  return (
    <Link href={`/recognize/phone/${slug}`} title={`Hasil pemindaian ${digits}`} className="hover:underline">
      {label}
    </Link>
  );
}

/**
 * The disc in front of a number.
 *
 * The gradient ring is Instagram's loudest device, so it carries exactly one claim here: this number
 * crossed the verified-report threshold. Everything else gets the flat ring, which is why a row can
 * wear it without anybody having to explain the colour.
 */
export function NumberAvatar({ verified = false }: { verified?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full p-[2px] ${verified ? "" : "bg-pos-line"}`}
      style={verified ? { backgroundImage: "linear-gradient(45deg, #ed4956, #f6a623)" } : undefined}
    >
      <span className={`grid h-full w-full place-items-center rounded-full bg-pos-card ${verified ? "text-pos-flag" : "text-pos-muted"}`}>
        <Icon icon="solar:phone-bold-duotone" className="h-4 w-4" />
      </span>
    </span>
  );
}

/** The writer, as an outlined person: an alias has no face, and a letter of a hash would look like one. */
export function AliasDisc({ alias }: { alias: string }) {
  return (
    <span
      aria-hidden="true"
      title={alias}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-pos-line text-pos-ink/50"
    >
      <Icon icon="solar:user-linear" className="h-5 w-5" />
    </span>
  );
}
