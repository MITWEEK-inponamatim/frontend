"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

type Hotline = {
  institution: string;
  category: string;
  badge: string;
  phone: string;
  phoneDisplay: string;
  service: string;
  url: string;
  whatsapp?: string;
  hours: string;
};

const NATIONAL_HOTLINES: Hotline[] = [
  {
    institution: "Patroli Siber Polri",
    category: "Penegakan Hukum Kepolisian",
    badge: "Darurat 24 Jam",
    phone: "110",
    phoneDisplay: "110 (Bebas Pulsa)",
    service: "Laporan tindak pidana penipuan siber, pemerasan, pengancaman, dan pencurian akun digital.",
    url: "https://patrolisiber.id",
    hours: "24 Jam Setiap Hari",
  },
  {
    institution: "Satgas PASTI OJK",
    category: "Otoritas Jasa Keuangan",
    badge: "Regulasi Keuangan",
    phone: "157",
    phoneDisplay: "157",
    whatsapp: "+62 811-5715-7157",
    service: "Penindakan dan pemblokiran pinjaman online ilegal, investasi bodong, serta rekening penampung penipu.",
    url: "https://konsumen.ojk.go.id",
    hours: "Senin - Jumat, 08:00 - 17:00 WIB",
  },
  {
    institution: "Aduan Konten Kominfo",
    category: "Kementerian Komunikasi dan Informatika",
    badge: "Blokir Konten & Rekening",
    phone: "08119224545",
    phoneDisplay: "0811-9224-545",
    whatsapp: "+62 811-9224-545",
    service: "Pemblokiran situs web phishing, nomor WhatsApp penipu, dan rekening bank penampung kejahatan siber.",
    url: "https://aduankonten.id",
    hours: "Layanan Laporan 24 Jam",
  },
  {
    institution: "Bank Indonesia (BI)",
    category: "Bank Sentral Republik Indonesia",
    badge: "Sistem Pembayaran",
    phone: "131",
    phoneDisplay: "131",
    service: "Konsultasi dan perlindungan konsumen sistem pembayaran nasional, transaksi QRIS, dan transfer antar-bank.",
    url: "https://www.bi.go.id",
    hours: "Senin - Jumat, 08:00 - 17:00 WIB",
  },
  {
    institution: "LPSK (Lembaga Perlindungan Saksi & Korban)",
    category: "Perlindungan Korban Kejahatan",
    badge: "Advokasi & Keamanan",
    phone: "148",
    phoneDisplay: "148",
    whatsapp: "+62 857-7001-0048",
    service: "Perlindungan fisik dan pendampingan hukum jika korban mengalami ancaman kekerasan dari sindikat / debt collector.",
    url: "https://www.lpsk.go.id",
    hours: "Senin - Jumat, 08:00 - 16:00 WIB",
  },
];

/**
 * National official emergency hotlines directory with single-touch direct dial and portal links.
 */
export function EmergencyHotlines() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (index: number, text: string) => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex((curr) => (curr === index ? null : curr));
    }, 2000);
  };

  return (
    <section className="space-y-4 text-left">
      <div className="text-left">
        <h3 className="text-sm sm:text-base font-normal text-slate-900 leading-snug">
          Direktori Kontak Cepat Lembaga Penegak Hukum Nasional
        </h3>
        <p className="text-xs font-normal text-slate-500 mt-0.5">
          Panggilan darurat resmi untuk membuat laporan hukum dan memblokir aset penipuan secara legal.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {NATIONAL_HOTLINES.map((hotline, idx) => {
          const isCopied = copiedIndex === idx;

          return (
            <div
              key={hotline.institution}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs text-left transition-all hover:border-slate-300"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[11px] font-mono font-medium text-red-600">
                    {hotline.category}
                  </span>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-normal text-slate-600">
                    {hotline.badge}
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-medium text-slate-900 leading-snug">
                  {hotline.institution}
                </h4>

                <div className="mt-2.5 flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-mono font-normal text-slate-900 tracking-tight">
                    {hotline.phoneDisplay}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(idx, hotline.phone)}
                    className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-700 transition-colors"
                    title="Salin nomor"
                  >
                    <Icon
                      icon={isCopied ? "solar:check-circle-bold" : "solar:copy-linear"}
                      className={`h-3.5 w-3.5 ${isCopied ? "text-emerald-600" : ""}`}
                    />
                    <span>{isCopied ? "Tersalin" : "Salin"}</span>
                  </button>
                </div>

                <p className="mt-2 text-xs font-normal text-slate-500 leading-relaxed">
                  {hotline.service}
                </p>

                <p className="mt-2 text-[10px] font-normal text-slate-400">
                  Waktu Operasional: {hotline.hours}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <a
                  href={`tel:${hotline.phone}`}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2 px-3 text-xs font-normal text-white transition-colors hover:bg-slate-800 shadow-2xs"
                >
                  <Icon icon="solar:phone-bold-duotone" className="h-3.5 w-3.5" />
                  <span>Panggil {hotline.phone}</span>
                </a>

                <a
                  href={hotline.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 py-2 px-3 text-xs font-normal text-slate-700 hover:bg-slate-50 transition-colors"
                  title="Kunjungi Portal Resmi"
                >
                  <span>Portal</span>
                  <Icon icon="solar:arrow-right-up-linear" className="h-3 w-3 text-slate-400" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
