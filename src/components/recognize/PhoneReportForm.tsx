"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { SuccessToast, ErrorToast } from "@/components/ui/Toast";
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

const MAX_EVIDENCE_MB = 5;
const EVIDENCE_TYPES = "image/png,image/jpeg,image/webp,image/heic,image/heif";

type ReportResponse = { number_e164?: string; status?: string; note_saved?: boolean };

/**
 * Community report form for the scanned phone number:
 * Allows verified submission of fraud evidence and incident notes directly
 * into the moderation pipeline with zero AI slop.
 *
 * @param number - The canonical phone number string.
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
      <div className="pt-1">
        <SuccessToast
          title="Laporan dan bukti terkirim"
          description={`Laporan nomor ${sent.number_e164 ?? number} telah diterima dan menunggu verifikasi moderator komunitas.`}
        />
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between text-left text-xs font-normal text-slate-700 hover:text-slate-900 transition-colors py-1"
      >
        <span className="flex items-center gap-2">
          <Icon icon="solar:flag-bold-duotone" className="h-4 w-4 text-slate-500" />
          <span>Laporkan nomor ini ke komunitas</span>
        </span>
        <Icon
          icon={open ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"}
          className="h-4 w-4 text-slate-400"
        />
      </button>

      {open && (
        <div className="rounded-2xl bg-slate-50/70 border border-slate-100 p-4 space-y-3.5 animate-in fade-in duration-150">
          <div>
            <label
              className="block text-xs font-normal text-slate-600 mb-1"
              htmlFor="phone-report-category"
            >
              Kategori laporan
            </label>
            <select
              id="phone-report-category"
              value={category}
              disabled={sending}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-normal text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/15"
            >
              {CATEGORIES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="block text-xs font-normal text-slate-600 mb-1"
              htmlFor="phone-report-evidence"
            >
              Bukti gambar tangkapan layar (wajib, maks. 5 MB)
            </label>
            <input
              ref={fileRef}
              id="phone-report-evidence"
              type="file"
              accept={EVIDENCE_TYPES}
              disabled={sending}
              onChange={(event) => pickEvidence(event.target.files?.[0] ?? null)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-normal text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-[11px] file:text-slate-700 hover:file:bg-slate-200 transition-all"
            />
            {preview && (
              <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Pratinjau bukti"
                  className="h-14 w-14 rounded-lg border border-slate-200 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-normal text-slate-700">
                    {evidence?.name}
                  </p>
                  <p className="text-[11px] font-normal text-slate-400">
                    {evidence ? (evidence.size / 1048576).toFixed(2) : "0"} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    pickEvidence(null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  aria-label="Hapus bukti gambar"
                  className="rounded-lg p-1.5 text-slate-400 hover:text-[#FF3B30] transition-colors"
                >
                  <Icon icon="solar:trash-bin-trash-bold-duotone" className="h-4 w-4" />
                </button>
              </div>
            )}
            <p className="mt-1 text-[11px] font-normal leading-relaxed text-slate-400">
              Tangkapan layar percakapan, SMS, atau bukti lain. Gambar disimpan aman dan
              hanya ditinjau moderator.
            </p>
          </div>

          <div>
            <label
              className="block text-xs font-normal text-slate-600 mb-1"
              htmlFor="phone-report-note"
            >
              Catatan kronologi (opsional)
            </label>
            <textarea
              id="phone-report-note"
              rows={2}
              maxLength={280}
              value={note}
              disabled={sending}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Contoh: Mengaku kurir paket meminta transfer ongkir, atau undian berhadiah."
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-normal text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/15"
            />
          </div>

          {problem && (
            <ErrorToast title="Input belum lengkap" description={problem} />
          )}
          {error && (
            <ErrorToast title="Gagal mengirim laporan" description={error} />
          )}

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={submit}
              disabled={sending || !evidence || Boolean(problem)}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-normal text-white hover:bg-slate-800 disabled:opacity-40 transition-colors shadow-2xs"
            >
              {sending ? (
                <>
                  <Icon icon="solar:restart-linear" className="h-3.5 w-3.5 animate-spin" />
                  <span>Mengirim laporan...</span>
                </>
              ) : (
                <span>
                  {evidence ? "Kirim laporan dengan bukti" : "Lampirkan bukti foto dulu"}
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
