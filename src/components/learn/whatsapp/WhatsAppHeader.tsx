"use client";

import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";

/**
 * Top navigation bar mimicking WhatsApp desktop & web chat interface across wide screen.
 *
 * @param personaName - Full name of the contact.
 * @param personaAvatar - Avatar image URL.
 * @param statusText - Current connectivity or typing status.
 * @param onReset - Optional reset trigger for simulation replay.
 * @param onInspectContact - Optional trigger to view ThreatLens contact report.
 */
export function WhatsAppHeader({
  personaName,
  personaAvatar,
  statusText,
  onReset,
  onInspectContact,
}: {
  personaName: string;
  personaAvatar: string;
  statusText: string;
  onReset?: () => void;
  onInspectContact?: () => void;
}) {
  return (
    <header className="relative z-10 flex h-15 shrink-0 items-center justify-between border-b border-slate-200 bg-[#F0F2F5] px-4 sm:px-6 py-2">
      {/* Left Back Arrow and Persona Profile */}
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href="/learn"
          className="flex items-center text-[#007AFF] hover:opacity-80 transition-opacity pr-1"
          aria-label="Kembali ke daftar skenario"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 fill-none stroke-current stroke-[2.5]"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        <button
          type="button"
          onClick={onInspectContact}
          className="flex items-center gap-3 min-w-0 text-left hover:opacity-85 transition-opacity focus:outline-none"
          title="Klik untuk inspeksi kontak dengan ThreatLens"
        >
          <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden border border-slate-200 bg-slate-200">
            <Image
              src={personaAvatar}
              alt={personaName}
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-xs sm:text-sm font-normal text-slate-900 leading-tight">
              {personaName}
            </h1>
            <p className="truncate text-[11px] font-normal text-slate-500 leading-tight">
              {statusText}
            </p>
          </div>
        </button>
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0 text-slate-600">
        <button
          type="button"
          aria-label="Panggilan video (Simulasi)"
          className="p-1.5 hover:bg-slate-200/70 rounded-full transition-colors hidden sm:inline-flex"
        >
          <Icon icon="solar:videocamera-record-linear" className="h-4.5 w-4.5" />
        </button>

        <button
          type="button"
          aria-label="Panggilan suara (Simulasi)"
          className="p-1.5 hover:bg-slate-200/70 rounded-full transition-colors hidden sm:inline-flex"
        >
          <Icon icon="solar:phone-calling-linear" className="h-4.5 w-4.5" />
        </button>

        <button
          type="button"
          onClick={onInspectContact}
          aria-label="Inspeksi Rekam Jejak Kontak"
          className="p-1.5 hover:bg-slate-200/70 rounded-full transition-colors text-slate-600 hover:text-red-600"
          title="Inspeksi Nomor Pengirim"
        >
          <Icon icon="solar:magnifier-linear" className="h-4.5 w-4.5" />
        </button>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            aria-label="Mulai Ulang Percakapan"
            className="p-1.5 hover:bg-slate-200/70 rounded-full transition-colors"
            title="Mulai Ulang Simulasi"
          >
            <Icon icon="solar:restart-linear" className="h-4.5 w-4.5" />
          </button>
        )}
      </div>
    </header>
  );
}
