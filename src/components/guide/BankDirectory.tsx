"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

type BankContact = {
  id: string;
  bankName: string;
  shortName: string;
  hotline: string;
  hotlineFormatted: string;
  international?: string;
  officialWa?: string;
  notes: string;
};

const BANK_CONTACTS: BankContact[] = [
  {
    id: "bca",
    bankName: "Bank Central Asia",
    shortName: "Halo BCA",
    hotline: "1500888",
    hotlineFormatted: "1500888",
    international: "+62 21 25563000",
    officialWa: "+62 811-1500-888",
    notes: "Layanan 24 jam. Tanpa kode area dari seluruh Indonesia. WhatsApp resmi wajib memiliki centang hijau.",
  },
  {
    id: "mandiri",
    bankName: "Bank Mandiri",
    shortName: "Mandiri Call",
    hotline: "14000",
    hotlineFormatted: "14000",
    international: "+62 21 52997777",
    officialWa: "+62 811-8414-000",
    notes: "Dapat diakses 24 jam untuk pemblokiran darurat rekening dan kartu debit/kredit.",
  },
  {
    id: "bri",
    bankName: "Bank Rakyat Indonesia",
    shortName: "Contact BRI",
    hotline: "1500017",
    hotlineFormatted: "1500017",
    international: "+62 21 57987400",
    officialWa: "+62 812-1214-017",
    notes: "Nomor alternatif darurat: 14017. WhatsApp resmi Sabrina bercentang hijau resmi.",
  },
  {
    id: "bni",
    bankName: "Bank Negara Indonesia",
    shortName: "BNI Call",
    hotline: "1500046",
    hotlineFormatted: "1500046",
    international: "+62 21 2511946",
    officialWa: "+62 811-5881-946",
    notes: "Akses pemblokiran cepat kartu dan mobile banking BNI Mobile / Wondr.",
  },
  {
    id: "bsi",
    bankName: "Bank Syariah Indonesia",
    shortName: "BSI Call",
    hotline: "14040",
    hotlineFormatted: "14040",
    international: "+62 21 38997777",
    officialWa: "+62 815-8411-4040",
    notes: "Nomor bebas pulsa: 0800 178 4040. Layanan nasabah BSI Mobile seluruh Indonesia.",
  },
  {
    id: "cimb",
    bankName: "Bank CIMB Niaga",
    shortName: "CIMB Niaga 14041",
    hotline: "14041",
    hotlineFormatted: "14041",
    international: "+62 21 29978888",
    notes: "Layanan nasabah reguler 14041 dan nasabah Preferred 1500800.",
  },
  {
    id: "danamon",
    bankName: "Bank Danamon",
    shortName: "Hello Danamon",
    hotline: "1500090",
    hotlineFormatted: "1500090",
    international: "+62 21 23546100",
    notes: "Dapat dihubungi 24 jam untuk pemblokiran kartu dan akun D-Bank PRO.",
  },
  {
    id: "permata",
    bankName: "Bank Permata",
    shortName: "PermataTel",
    hotline: "1500111",
    hotlineFormatted: "1500111",
    international: "+62 21 29850555",
    notes: "Layanan pengaduan transaksi mencurigakan dan pemblokiran PermataME.",
  },
  {
    id: "btn",
    bankName: "Bank Tabungan Negara",
    shortName: "Contact Center BTN",
    hotline: "1500286",
    hotlineFormatted: "1500286",
    international: "+62 21 6336789",
    notes: "Layanan darurat perbankan transaksi tabungan dan KPR BTN.",
  },
  {
    id: "jago",
    bankName: "Bank Jago",
    shortName: "Tanya Jago",
    hotline: "1500746",
    hotlineFormatted: "1500746",
    international: "+62 21 30000746",
    officialWa: "+62 819-2477-490",
    notes: "Akses darurat pembekuan kantong rekening digital dan akun aplikasi Jago.",
  },
];

/**
 * Official verified banking call center directory with direct dial and quick copy.
 */
export function BankDirectory() {
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = BANK_CONTACTS.filter(
    (b) =>
      b.bankName.toLowerCase().includes(search.toLowerCase()) ||
      b.shortName.toLowerCase().includes(search.toLowerCase()) ||
      b.hotline.includes(search),
  );

  const handleCopy = (id: string, text: string) => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((curr) => (curr === id ? null : curr));
    }, 2000);
  };

  return (
    <section className="space-y-4 text-left">
      {/* Search Input Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-left">
          <h3 className="text-sm sm:text-base font-normal text-slate-900 leading-snug">
            Call Center Resmi Perbankan Nasional
          </h3>
          <p className="text-xs font-normal text-slate-500 mt-0.5">
            Nomor darurat resmi terverifikasi Bank Indonesia untuk pemblokiran akun dan rekening secara langsung.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama bank (BCA, Mandiri...)"
            className="w-full rounded-full border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs font-normal text-slate-800 placeholder-slate-400 shadow-2xs focus:border-red-600 focus:outline-hidden"
          />
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon icon="solar:magnifer-linear" className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>

      {/* Fraud Warning Box */}
      <div className="rounded-2xl border border-amber-200/90 bg-amber-50/60 p-4 text-left space-y-1">
        <div className="flex items-center gap-2 text-xs font-medium text-amber-900">
          <Icon icon="solar:shield-warning-linear" className="h-4 w-4 text-amber-600" />
          <span>Waspada Nomor Call Center Palsu di Mesin Pencari Google</span>
        </div>
        <p className="text-[11px] font-normal text-amber-800 leading-relaxed">
          Sindikat penipu kerap memasang iklan berbayar (Google Ads) dengan nomor WhatsApp pribadi berkedok CS Bank. Nomor resmi bank TIDAK PERNAH menggunakan nomor seluler pribadi (+62 8xx) tanpa centang hijau resmi. Gunakan tombol panggil langsung di bawah.
        </p>
      </div>

      {/* Banks Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white py-12 text-center text-xs text-slate-400">
          Tidak ada bank yang cocok dengan pencarian Anda.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((bank) => {
            const isCopied = copiedId === bank.id;

            return (
              <div
                key={bank.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs text-left transition-all hover:border-slate-300"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-sm font-medium text-slate-900">
                      {bank.bankName}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-normal text-slate-600">
                      <Icon icon="solar:shield-check-linear" className="h-3 w-3 text-emerald-600" />
                      <span>Resmi BI</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 font-normal">
                    {bank.shortName}
                  </p>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-mono font-medium text-slate-900 tracking-tight">
                      {bank.hotlineFormatted}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(bank.id, bank.hotline)}
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

                  <p className="mt-2 text-[11px] font-normal text-slate-500 leading-relaxed">
                    {bank.notes}
                  </p>
                </div>

                {/* Direct Dial CTA */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <a
                    href={`tel:${bank.hotline}`}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2 px-3 text-xs font-normal text-white transition-colors hover:bg-slate-800 shadow-2xs"
                  >
                    <Icon icon="solar:phone-bold-duotone" className="h-3.5 w-3.5" />
                    <span>Panggil Langsung</span>
                  </a>

                  {bank.international && (
                    <a
                      href={`tel:${bank.international.replace(/\s+/g, "")}`}
                      className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 py-2 px-3 text-xs font-normal text-slate-700 hover:bg-slate-50 transition-colors"
                      title="Panggilan dari Luar Negeri"
                    >
                      <span>Luar Negeri</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

