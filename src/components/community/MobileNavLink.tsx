import Link from "next/link";
import type { ComponentProps } from "react";
import { Icon } from "@/components/ui/Icon";

type IconName = ComponentProps<typeof Icon>["icon"];

const ROW = "flex min-w-0 flex-col items-center gap-1 text-[11px] font-normal transition-colors";

/**
 * One item of the community bottom navigation bar.
 *
 * `href = null` keeps the row standing in exactly the same place and takes away its destination: a
 * moderator reading the board is held inside it, and a bar that quietly loses three columns would
 * read as a broken page rather than as a rule.
 */
export function MobileNavLink({ href, icon, label }: { href: string | null; icon: IconName; label: string }) {
  if (!href) {
    return (
      <span className={`${ROW} text-slate-300`} aria-disabled="true" title="Tidak tersedia untuk moderator">
        <Icon icon={icon} className="h-5 w-5" />
        <span>{label}</span>
      </span>
    );
  }

  return (
    <Link href={href} className={`${ROW} text-slate-500 hover:text-slate-900`}>
      <Icon icon={icon} className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
}
