import React from "react";
import Link from "next/link";
import Image from "next/image";

/**
 * Official ThreatLens brand logo linking to the root path.
 *
 * `href = null` renders the same mark without a destination. A moderator on the community board is
 * kept inside that board, and a brand mark that quietly sends them to the scanner is the most
 * obvious way to leave it by accident.
 */
export function NavbarLogo({ href = "/" }: { href?: string | null }) {
  const mark = (
    <div className="relative flex items-center">
      <Image
        src="/Logo.png"
        alt="ThreatLens"
        width={160}
        height={25}
        priority
        className="h-6 sm:h-7 w-auto object-contain transition-opacity group-hover:opacity-85"
      />
    </div>
  );

  if (!href) {
    return (
      <span className="inline-flex items-center p-1 select-none" aria-label="ThreatLens">
        {mark}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="group inline-flex items-center p-1 rounded-lg transition-opacity hover:opacity-85"
      aria-label="Beranda ThreatLens"
    >
      {mark}
    </Link>
  );
}

