"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIsAdmin } from "@/hooks/useIsAdmin";

const NAV_ITEMS = [
  { label: "Pindai", href: "/recognize" },
  { label: "Riwayat", href: "/history" },
  { label: "Belajar", href: "/learn" },
  { label: "Komunitas", href: "/community/latest" },
  { label: "Panduan", href: "/guide" },
];

// Only the moderation desk is offered conditionally: it is a door, and a door that leads to a 403
// is not navigation.
const ADMIN_ITEM = { label: "Moderasi", href: "/admin" };

function isCurrent(href: string, pathname: string) {
  if (href === "/recognize") return pathname === "/recognize" || pathname.startsWith("/recognize/");
  if (href === "/history") return pathname === "/history";
  return pathname.startsWith(href === "/community/latest" ? "/community" : href);
}

/**
 * Centered desktop navigation links with current route awareness.
 */
export function NavbarLinks() {
  const pathname = usePathname();
  const isAdmin = useIsAdmin();
  const items = isAdmin ? [...NAV_ITEMS, ADMIN_ITEM] : NAV_ITEMS;

  return (
    <nav className="hidden md:flex items-center gap-1 sm:gap-2">
      {items.map((item) => {
        const isActive = isCurrent(item.href, pathname);

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

