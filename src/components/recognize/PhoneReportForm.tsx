"use client";

import { useRef, useState } from "react";
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

// Same ceiling as MAX_EVIDENCE_MB (Go) and MAX_EVIDENCE_BYTES (analysis service). Checking it
// here only saves the reporter an upload that the API would refuse anyway.
const MAX_EVIDENCE_MB = 5;
const EVIDENCE_TYPES = "image/png,image/jpeg,image/webp,image/heic,image/heif";

type ReportResponse = { number_e164?: string; status?: string; note_saved?: boolean };

/**
 * Community report form for the scanned number.
 *
 * A report is a user claim, not a verdict: it is stored as "pending" and only a moderator can
 * turn it into "verified". The proof image is mandatory and sent with the report as one request,
 * so a report cannot exist without the evidence that justifies it.
 */
export function PhoneReportForm({ number }: { number: string }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("penipuan");
  const [note, setNote] = useState("");
  const [evidence, setEvidence] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [problem, setProblem] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<ReportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const pickEvidence = (file: File | null) => {
    setPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return file ? URL.createObjectURL(file) : null;
    });
    setEvidence(file);
    setProblem(file && file.size > MAX_EVIDENCE_MB * 1048576 ? messageForError("evidence_too_large") : "");
  };

  const submit = async () => {
    if (!evidence) return;
    setSending(true);
    setError(null);
    setProblem("");
    try {
      const body = new FormData();
      body.set("number", number);
      body.set("default_region", "ID");
      body.set("category", category);
      body.set("note", note.trim());
      body.set("evidence", evidence, evidence.name);
      const response = (await api("/api/v1/phone-reports", { method: "POST", body })) as ReportResponse | null;
      setSent(response ?? { status: "pending" });
    } catch (failure) {
      setError(messageForError(failure instanceof Error ? failure.message : null));
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
            Laporan dan bukti gambar terkirim, menunggu moderasi{sent.number_e164 ? ` (${sent.number_e164})` : ""}. Laporan
            baru menaikkan risiko setelah diverifikasi, dan laporan komunitas tetap bukan bukti tindak pidana.
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

        <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-400" htmlFor="phone-report-evidence">Bukti gambar (wajib)</label>
        <input ref={fileRef} id="phone-report-evidence" type="file" accept={EVIDENCE_TYPES} disabled={sending}
          onChange={(event) => pickEvidence(event.target.files?.[0] ?? null)}
          className="w-full rounded-xl border border-gray-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-200 file:px-3 file:py-1 file:text-[11px] file:text-slate-700" />
        {preview && <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-slate-50 p-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- a local object URL, shown only to the reporter before upload. */}
          <img src={preview} alt="Pratinjau bukti" className="h-14 w-14 rounded-lg border border-gray-200 object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] text-slate-700">{evidence?.name}</p>
            <p className="text-[11px] text-slate-400">{evidence ? (evidence.size / 1048576).toFixed(2) : "0"} MB</p>
          </div>
          <button type="button" onClick={() => { pickEvidence(null); if (fileRef.current) fileRef.current.value = ""; }} aria-label="Hapus bukti gambar"
            className="rounded-lg p-1.5 text-slate-400 hover:text-red-600"><Icon icon="solar:trash-bin-trash-bold-duotone" className="h-4 w-4" /></button>
        </div>}
        <p className="text-[11px] leading-relaxed text-slate-400">
          Tangkapan layar chat, foto profil, atau bukti lain. Gambar disimpan di penyimpanan berkas kami dan tampil
          bersama laporan Anda. Jangan lampirkan data pribadi orang lain.
        </p>

        <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-400" htmlFor="phone-report-note">Catatan untuk moderator (opsional)</label>
        <textarea id="phone-report-note" rows={2} maxLength={280} value={note} disabled={sending} onChange={(event) => setNote(event.target.value)}
          placeholder="Misalnya isi pesan yang diterima. Jangan tulis data pribadi orang lain."
          className="w-full resize-none rounded-xl border border-gray-200 bg-transparent px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20" />
        <p className="text-[11px] leading-relaxed text-slate-400">
          Satu laporan per nomor per akun. Laporan disimpan sebagai <span className="text-slate-500">pending</span> dan
          hanya menaikkan risiko setelah diverifikasi moderator. Nomor bisa dipalsukan dan berpindah pemilik.
        </p>
        {problem && <p role="alert" className="text-xs text-red-600">{problem}</p>}
        {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
        <button type="button" onClick={submit} disabled={sending || !evidence}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-red-600 disabled:bg-slate-200 disabled:text-slate-400">
          {sending ? <Icon icon="solar:restart-bold-duotone" className="h-3.5 w-3.5 animate-spin" /> : <Icon icon="solar:flag-bold" className="h-3.5 w-3.5" />}
          <span>{sending ? "Mengirim laporan..." : evidence ? "Kirim laporan dengan bukti" : "Lampirkan bukti dulu"}</span>
        </button>
      </div>}
    </div>
  );
}
