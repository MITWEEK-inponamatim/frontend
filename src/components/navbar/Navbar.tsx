"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MenuDrawer } from "./MenuDrawer";
import { ContactModal } from "./ContactModal";
import { LogoutButton } from "@/components/auth/LogoutButton";

export type Account = { email?: string; avatarUrl?: string | null; name?: string | null };

/**
 * Landing navbar. `account` is only passed on `/recognize`: that is the single intentional
 * difference between the public landing page and the signed-in scanner page.
 */
export function Navbar({ account = null }: { account?: Account | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const initial = (account?.name ?? account?.email ?? "?").trim().charAt(0).toUpperCase() || "?";

  return (
    <>
      <header className="w-full relative z-20 pt-5 sm:pt-7 px-4 sm:px-8 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Sisi Kiri: Hubungi Kami */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsContactOpen(true)}
              className="group inline-flex items-center gap-2 text-xs sm:text-sm font-normal tracking-tight text-slate-900 hover:text-red-600 transition-colors cursor-pointer py-1"
              aria-label="Buka bantuan dan hubungi kami"
            >
              <span className="w-4 sm:w-7 h-[1.5px] bg-slate-900 group-hover:bg-red-600 transition-all rounded-full" />
              <span>Hubungi Kami</span>
            </button>
          </div>

          {/* Center: Minimalist geometric cross logo */}
          <Link
            href="/"
            className="flex items-center justify-center p-2 rounded-lg hover:opacity-70 transition-opacity"
            aria-label="Beranda Anti-Scam Platform"
          >
            <div className="relative w-5 h-5 flex items-center justify-center">
              <span className="absolute w-[1.5px] h-4.5 bg-slate-900 rounded-full" />
              <span className="absolute h-[1.5px] w-4.5 bg-slate-900 rounded-full" />
            </div>
          </Link>

          {/* Sisi Kanan: Menu Utama (+ akun pada halaman masuk) */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="group inline-flex items-center gap-2 text-xs sm:text-sm font-normal tracking-tight text-slate-900 hover:text-red-600 transition-colors cursor-pointer py-1"
              aria-expanded={isMenuOpen}
              aria-label="Buka menu utama"
            >
              <span>Menu Utama</span>
              <span className="w-4 sm:w-7 h-[1.5px] bg-slate-900 group-hover:bg-red-600 transition-all rounded-full" />
            </button>

            {account && (
              <>
                <span className="hidden sm:block h-4 w-px bg-gray-200" aria-hidden="true" />
                <div className="flex items-center gap-2">
                  {account.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- remote Google avatar, sized and non-interactive
                    <img
                      src={account.avatarUrl}
                      alt=""
                      width={28}
                      height={28}
                      referrerPolicy="no-referrer"
                      className="h-7 w-7 rounded-full border border-gray-200 object-cover"
                    />
                  ) : (
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-900 text-[11px] font-medium text-white" aria-hidden="true">
                      {initial}
                    </span>
                  )}
                  <span className="hidden max-w-[9rem] truncate text-xs font-normal text-slate-600 sm:block" title={account.email}>
                    {account.email}
                  </span>
                </div>
                <LogoutButton className="group inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1 text-xs font-normal text-slate-700 transition-colors hover:border-red-200 hover:text-red-600" />
              </>
            )}
          </div>
        </div>
      </header>

      {/* Dynamic Drawers & Modals */}
      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </>
  );
}
