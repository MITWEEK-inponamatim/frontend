import React from "react";
import Link from "next/link";

/**
 * Minimalist geometric cross logo and brand mark linking to the root path.
 */
export function NavbarLogo({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2.5 p-1 rounded-lg transition-opacity hover:opacity-80"
      aria-label="Beranda ThreatLens"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <span className="absolute w-[1.5px] h-4.5 bg-slate-900 rounded-full group-hover:bg-red-600 transition-colors" />
        <span className="absolute h-[1.5px] w-4.5 bg-slate-900 rounded-full group-hover:bg-red-600 transition-colors" />
      </div>
      <span className="text-sm font-semibold tracking-tight text-slate-900">
        ThreatLens
      </span>
    </Link>
  );
}

