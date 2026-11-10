"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { phoneSlug } from "@/lib/phone";
import { NavbarLogo } from "./NavbarLogo";
import { NavbarLinks } from "./NavbarLinks";
import { NavbarAccount, type AccountProps } from "./NavbarAccount";
import { MenuDrawer } from "./MenuDrawer";
import { ContactModal } from "./ContactModal";

export type Account = AccountProps;

// The queue a moderator was reading from. Wherever they entered the board, the way home is the desk.
const DESK_HREF = "/admin/posting";

/**
 * Universal responsive top navigation bar orchestrating branding, center search or routes,
 * account actions, and modals.
 */
export function Navbar({ account = null }: { account?: Account | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [communityQuery, setCommunityQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = useIsAdmin();

  const isCommunity = pathname.startsWith("/community");
  // A moderator reading the board is a moderator at work: the exits to the scanner, the help desk
  // and the feature shortcuts only send them away from the queue they came to check, and the desk
  // itself is the one place they can get back to. Everyone else keeps the normal navigation.
  const atDesk = isCommunity && isAdmin;

  const handleCommunitySearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = communityQuery.trim();
    if (!clean) return;
    const slug = phoneSlug(clean);
    if (slug) {
      router.push(`/community/latest?nomor=${slug}`);
    } else {
      router.push(`/community/latest?q=${encodeURIComponent(clean)}`);
    }
  };

  return (
    <>
      <header className="w-full relative z-20 pt-4 sm:pt-5 px-4 sm:px-8 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
          {/* Sisi Kiri: Brand & Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <NavbarLogo href={atDesk ? null : account ? "/recognize" : "/"} />
            {!atDesk && (
              <button
                type="button"
                onClick={() => setIsContactOpen(true)}
                className="hidden xl:inline-flex items-center gap-2 text-xs font-normal tracking-tight text-slate-500 hover:text-red-600 transition-colors cursor-pointer py-1 ml-2"
                aria-label="Buka bantuan dan hubungi kami"
              >
                <span className="w-3.5 h-[1.5px] bg-slate-300 transition-all rounded-full" />
                <span>Bantuan</span>
              </button>
            )}
          </div>

          {/* Sisi Tengah: Global Search pada Komunitas ATAU Navigasi Rute Utama */}
          {isCommunity ? (
            <div className="hidden md:flex flex-1 max-w-xl mx-2">
              <form onSubmit={handleCommunitySearch} className="relative w-full">
                <Icon
                  icon="solar:magnifer-linear"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                />
                <input
                  type="text"
                  value={communityQuery}
                  onChange={(e) => setCommunityQuery(e.target.value)}
                  placeholder="Cari nomor telepon atau cerita penipuan di komunitas..."
                  className="w-full rounded-full bg-slate-100/90 border border-slate-200/80 pl-10 pr-4 py-2 text-xs font-normal text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/15 transition-all"
                />
              </form>
            </div>
          ) : (
            <NavbarLinks />
          )}

          {/* Sisi Kanan: Status Akun / Masuk & Drawer Menu (Mobile Only) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <NavbarAccount account={account} deskHref={atDesk ? DESK_HREF : undefined} />

            {/* Tombol Hamburger: Khusus Device Small / Mobile. Bagi moderator di papan, pintunya ditutup
                sekalian: isi drawer hanya jalan keluar (Pindai, Riwayat, Belajar, Panduan), dan satu-satunya
                tujuan yang mereka butuhkan sudah ada di sampingnya — panah kembali ke meja. */}
            {!atDesk && (
              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden group inline-flex flex-col justify-center items-end gap-1.5 w-8 h-8 p-1 text-slate-900 hover:text-red-600 transition-colors cursor-pointer"
                aria-expanded={isMenuOpen}
                aria-label="Buka menu utama"
              >
                <span className="w-5 h-[1.5px] bg-slate-900 group-hover:bg-red-600 transition-all rounded-full" />
                <span className="w-3.5 h-[1.5px] bg-slate-900 group-hover:bg-red-600 transition-all rounded-full" />
              </button>
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
