import React from "react";
import Link from "next/link";

/**
 * Minimalist geometric cross logo and brand mark linking to the root path.
 *
 * `href = null` renders the same mark without a destination. A moderator on the community board is
 * kept inside that board, and a brand mark that quietly sends them to the scanner is the most
 * obvious way to leave it by accident.
 */
export function NavbarLogo({ href = "/" }: { href?: string | null }) {
  const mark = (
    <>
      <div className="relative w-5 h-5 flex items-center justify-center">
        <span className="absolute w-[1.5px] h-4.5 bg-slate-900 rounded-full group-hover:bg-red-600 transition-colors" />
        <span className="absolute h-[1.5px] w-4.5 bg-slate-900 rounded-full group-hover:bg-red-600 transition-colors" />
      </div>
      <span className="text-sm font-semibold tracking-tight text-slate-900">ThreatLens</span>
    </>
  );

  if (!href) {
    return (
      <span className="inline-flex items-center gap-2.5 p-1" aria-label="ThreatLens">
        {mark}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2.5 p-1 rounded-lg transition-opacity hover:opacity-80"
      aria-label="Beranda ThreatLens"
    >
      {mark}
    </Link>
  );
}

