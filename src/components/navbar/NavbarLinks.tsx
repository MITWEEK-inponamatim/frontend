"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Pindai", href: "/recognize" },
  { label: "Riwayat", href: "/history" },
  { label: "Belajar", href: "/learn" },
  { label: "Komunitas", href: "/community/latest" },
  { label: "Panduan", href: "/guide" },
];

/**
 * Centered desktop navigation links with current route awareness.
 */
export function NavbarLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-1 sm:gap-2">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/recognize"
            ? pathname === "/recognize" || pathname.startsWith("/recognize/")
            : item.href === "/history"
            ? pathname === "/history"
            : item.href === "/learn"
            ? pathname.startsWith("/learn")
            : item.href === "/guide"
            ? pathname.startsWith("/guide")
            : pathname.startsWith("/community");

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative px-3 py-1.5 text-xs sm:text-sm tracking-tight transition-colors rounded-full ${
              isActive
                ? "text-slate-900 font-medium bg-slate-100/70"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            {item.label}
            {isActive && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-[2px] bg-red-600 rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

