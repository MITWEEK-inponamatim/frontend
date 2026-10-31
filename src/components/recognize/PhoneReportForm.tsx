"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { api } from "@/lib/api";
import { messageForError } from "@/hooks/useScanner";

const CATEGORIES: { id: string; label: string }[] = [
  { id: "penipuan", label: "Penipuan" },
  { id: "spam", label: "Spam" },
  { id: "telemarketing", label: "Telemarketing" },
  { id: "penagih_utang", label: "Penagih utang" },
  { id: "peniruan_identitas", label: "Peniruan identitas" },
  { id: "lainnya", label: "Lainnya" },
];

type ReportResponse = { number_e164?: string; status?: string; note_saved?: boolean };

/**
 * Community report form for the scanned number.
 *
 * A report is a user claim, not a verdict: it is stored as "pending" and only a moderator can
 * turn it into "verified". The copy below keeps saying that, so the UI never implies that one
 * report proves anything about the number's owner.
 */
export function PhoneReportForm({ number, region }: { number: string; region: string }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("penipuan");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<ReportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setSending(true);
    setError(null);
    try {
      const response = (await api("/api/v1/phone-reports", {
        method: "POST",
        body: JSON.stringify({ number, default_region: region, category, note: note.trim() }),
      })) as ReportResponse | null;
      setSent(response ?? { status: "pending" });
    } catch (problem) {
      setError(messageForError(problem instanceof Error ? problem.message : null));
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="mt-3 rounded-xl border border-slate-200 bg-white/90 p-3 text-xs text-slate-600">
        <p className="flex items-start gap-2">
          <Icon icon="solar:check-circle-bold-duotone" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <span>
            Laporan terkirim dan menunggu moderasi{sent.number_e164 ? ` (${sent.number_e164})` : ""}. Laporan baru
            menaikkan risiko setelah diverifikasi, dan laporan komunitas tetap bukan bukti tindak pidana.
            {sent.note_saved === false ? " Catatan tambahan tidak tersimpan, laporan tetap tercatat." : ""}
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-xl border border-slate-200 bg-white/90 p-3">
      <button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-2 text-left text-xs font-medium text-slate-700">
        <span className="flex items-center gap-2">
          <Icon icon="solar:flag-bold-duotone" className="h-4 w-4 text-slate-500" />
          Laporkan nomor ini ke komunitas
        </span>
        <Icon icon={open ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"} className="h-4 w-4 text-slate-400" />
      </button>

      {open && <div className="mt-3 space-y-2">
        <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-400" htmlFor="phone-report-category">Kategori</label>
        <select id="phone-report-category" value={category} disabled={sending} onChange={(event) => setCategory(event.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/20">
          {CATEGORIES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
        <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-400" htmlFor="phone-report-note">Catatan untuk moderator (opsional)</label>
        <textarea id="phone-report-note" rows={2} maxLength={280} value={note} disabled={sending} onChange={(event) => setNote(event.target.value)}
          placeholder="Misalnya isi pesan yang diterima. Jangan tulis data pribadi orang lain."
          className="w-full resize-none rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20" />
        <p className="text-[11px] leading-relaxed text-slate-400">
          Satu laporan per nomor per akun. Laporan disimpan sebagai <span className="text-slate-500">pending</span> dan
          hanya menaikkan risiko setelah diverifikasi moderator. Nomor bisa dipalsukan dan berpindah pemilik.
        </p>
        {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
        <button type="button" onClick={submit} disabled={sending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-red-600 disabled:bg-slate-200 disabled:text-slate-400">
          {sending ? <Icon icon="solar:restart-bold-duotone" className="h-3.5 w-3.5 animate-spin" /> : <Icon icon="solar:flag-bold" className="h-3.5 w-3.5" />}
          <span>{sending ? "Mengirim laporan..." : "Kirim laporan"}</span>
        </button>
      </div>}
    </div>
  );
}
