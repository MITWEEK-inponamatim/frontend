"use client";

import React, { useEffect } from "react";
import { Icon } from "@/components/ui/Icon";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CHANNELS = [
  {
    name: "Patroli Siber Polri",
    contact: "110",
    href: "tel:110",
    note: "Layanan darurat penipuan digital",
  },
  {
    name: "Satgas PASTI (OJK)",
    contact: "157",
    href: "tel:157",
    note: "Investigasi pinjol & investasi ilegal",
  },
  {
    name: "Aduan Konten Kominfo",
    contact: "0811-9224-545",
    href: "https://wa.me/628119224545",
    note: "Pemblokiran web phishing & rekening penipu",
  },
  {
    name: "Email Bantuan",
    contact: "bantuan@antiscam.id",
    href: "mailto:bantuan@antiscam.id",
    note: "Dukungan teknis platform",
  },
];

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/30 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-sm sm:max-w-md bg-white border border-slate-100 shadow-xl rounded-2xl p-6 sm:p-7 z-10"
        role="dialog"
        aria-modal="true"
        aria-label="Hubungi Kami"
      >
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <span className="text-xs uppercase tracking-widest text-slate-400 font-normal">
            Bantuan
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-900 transition-colors"
            aria-label="Tutup dialog"
          >
            <Icon icon="solar:close-square-linear" className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {CHANNELS.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between py-2 text-left"
            >
              <div>
                <h4 className="text-sm font-normal text-slate-900 group-hover:text-red-600 transition-colors">
                  {item.name}
                </h4>
                <p className="text-xs text-slate-400 font-normal">{item.note}</p>
              </div>
              <span className="text-xs text-slate-700 font-normal group-hover:text-red-600 transition-colors">
                {item.contact}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
