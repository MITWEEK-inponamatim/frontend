"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenContact: () => void;
}

const MENU_LINKS = [
  { label: "Recognize", href: "/recognize" },
  { label: "Learn", href: "/learn" },
  { label: "Act", href: "/act" },
  { label: "Panduan Keamanan", href: "/guide" },
];

export function MenuDrawer({ isOpen, onClose, onOpenContact }: MenuDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/30 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Minimalist Sidebar */}
      <aside
        className="relative w-full max-w-xs sm:max-w-sm h-full bg-white border-l border-slate-100 shadow-xl flex flex-col justify-between z-10 p-6 sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-label="Menu Utama"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <span className="text-xs uppercase tracking-widest text-slate-400 font-normal">
              Menu
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-900 transition-colors"
              aria-label="Tutup menu"
            >
              <Icon icon="solar:close-square-linear" className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="mt-8 flex flex-col space-y-6">
            {MENU_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="group flex items-center justify-between text-base sm:text-lg font-normal text-slate-900 hover:text-red-600 transition-colors"
              >
                <span>{item.label}</span>
                <span className="w-4 h-[1.5px] bg-slate-200 group-hover:bg-red-600 group-hover:w-6 transition-all rounded-full" />
              </Link>
            ))}

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenContact();
              }}
              className="group flex items-center justify-between text-base sm:text-lg font-normal text-slate-900 hover:text-red-600 transition-colors text-left pt-2 border-t border-slate-100"
            >
              <span>Hubungi Kami</span>
              <span className="w-4 h-[1.5px] bg-slate-200 group-hover:bg-red-600 group-hover:w-6 transition-all rounded-full" />
            </button>
          </nav>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-400 font-normal">
            Platform Deteksi & Pencegahan Penipuan Digital
          </p>
        </div>
      </aside>
    </div>
  );
}
