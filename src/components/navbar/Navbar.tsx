"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MenuDrawer } from "./MenuDrawer";
import { ContactModal } from "./ContactModal";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <>
      <header className="w-full relative z-20 pt-5 sm:pt-7 px-4 sm:px-8 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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

          {/* Sisi Kanan: Menu Utama */}
          <div className="flex items-center gap-2.5">
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
