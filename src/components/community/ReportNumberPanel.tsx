"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { api } from "@/lib/api";
import { messageForError } from "@/hooks/useScanner";
import { canonicalPhone, phoneInputProblem } from "@/lib/phone";
import { COMMUNITY_CATEGORIES, EVIDENCE_TYPES, MAX_EVIDENCE_MB, displayNumber, type CommunityCategory } from "@/lib/community";

// The cap the API enforces on phone_reports.note.
const NOTE_MAX = 280;

const FIELD =
  "w-full rounded-lg border border-pos-line bg-pos-card px-3 py-2 text-[14px] leading-relaxed text-pos-ink placeholder:text-pos-muted focus:border-pos-ink focus:outline-none focus:ring-2 focus:ring-pos-action/40";
const LABEL = "text-[12px] font-semibold text-pos-ink";
const SOLID = "rounded-full bg-pos-action px-4 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-pos-action-tua disabled:bg-pos-line disabled:text-pos-muted";
const GHOST = "text-[14px] font-semibold text-pos-action-tua transition-colors hover:text-pos-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pos-action";

type ReportResponse = { number_e164?: string; status?: string; note_saved?: boolean };

/**
 * Reporting a number, without leaving the board.
 *
 * This is the one place on /community where a person can change the dangerous list, and it is a
 * different act from writing a story: a report is an allegation with a proof image attached, so it
 * goes to `/api/v1/phone-reports` and waits for a moderator. Nothing here pretends otherwise — the
 * number only reaches the list once two verified reports from two different warga exist, which is
 * why the confirmation says "menunggu moderasi" instead of thanking them for a verdict.
 *
 * Mounted only while open, so the fields always start empty and a finished report cannot be sent a
 * second time by accident.
 */
export function ReportNumberPanel({ onClose }: { onClose: () => void }) {
  const [number, setNumber] = useState("");
  const [category, setCategory] = useState<CommunityCategory | "">("");
  const [note, setNote] = useState("");
  const [evidence, setEvidence] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [problem, setProblem] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<ReportResponse | null>(null);
  const numberRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const normalized = canonicalPhone(number);

  useEffect(() => {
    numberRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const pickEvidence = (file: File | null) => {
    setPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return file ? URL.createObjectURL(file) : null;
    });
    setEvidence(file);
    setProblem(file && file.size > MAX_EVIDENCE_MB * 1048576 ? messageForError("evidence_too_large") : "");
  };

  const validate = () => {
    const phoneProblem = phoneInputProblem(number);
    if (phoneProblem) return phoneProblem;
    if (!category) return "Pilih kategori dulu, supaya moderator tahu nomor ini dilaporkan untuk apa.";
    if (!evidence) return messageForError("evidence_required");
    if (evidence.size > MAX_EVIDENCE_MB * 1048576) return messageForError("evidence_too_large");
    return "";
  };

  const submit = async () => {
    const reason = validate();
    setProblem(reason);
    if (reason || sending) return;
    setSending(true);
    try {
      const form = new FormData();
      form.set("number", normalized || number);
      form.set("default_region", "ID");
      form.set("category", category);
      form.set("note", note.trim());
      form.set("evidence", evidence as File, evidence?.name);
      const response = (await api("/api/v1/phone-reports", { method: "POST", body: form })) as ReportResponse | null;
      setSent(response ?? { status: "pending" });
    } catch (failure) {
      setProblem(messageForError(failure instanceof Error ? failure.message : null));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-label="Lapor nomor berbahaya">
      <button type="button" onClick={onClose} aria-label="Tutup form laporan" className="absolute inset-0 bg-pos-ink/70" />

      <div className="relative flex max-h-full w-full max-w-[520px] flex-col overflow-hidden rounded-xl bg-pos-card shadow-xl">
        <header className="flex items-center justify-between gap-3 border-b border-pos-line px-4 py-3">
          {sent ? (
            <span className={GHOST}>Selesai</span>
          ) : (
            <button type="button" onClick={onClose} className={GHOST}>
              Batalkan
            </button>
          )}
          <h2 className="truncate text-[14px] font-semibold text-pos-ink">{sent ? "Laporan terkirim" : "Lapor nomor berbahaya"}</h2>
          {sent ? (
            <button type="button" onClick={onClose} className={SOLID}>
              Tutup
            </button>
          ) : (
            <button type="button" disabled={sending} onClick={submit} className={SOLID}>
              {sending ? "Mengirim..." : "Kirim"}
            </button>
          )}
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {sent ? (
            <div className="space-y-3 p-4 sm:p-5">
              <p className="flex items-start gap-2.5 text-[14px] leading-relaxed text-pos-ink">
                <Icon icon="solar:check-circle-bold-duotone" className="mt-0.5 h-5 w-5 shrink-0 text-pos-good" />
                <span>
                  Laporan{sent.number_e164 ? ` untuk ${displayNumber(sent.number_e164)}` : ""} dan bukti gambar sudah tercatat.
                  Statusnya <span className="font-semibold">menunggu moderasi</span>
                  {sent.note_saved === false ? ", dan catatan tambahan Anda tidak tersimpan — laporannya tetap tercatat." : "."}
                </span>
              </p>
              <p className="text-[12px] leading-relaxed text-pos-muted">
                Sebuah nomor baru muncul di daftar ini kalau sudah ada dua laporan terverifikasi dari dua warga berbeda.
                Laporan Anda sendiri belum mengubah daftar, dan tidak ada laporan yang membuktikan seseorang bersalah.
              </p>
            </div>
          ) : (
            <div className="space-y-4 p-4 sm:p-5">
              <div>
                <label className={LABEL} htmlFor="report-number">Nomor yang dilaporkan</label>
                <div className="mt-2 flex w-full gap-2">
                  <span aria-hidden="true" className="grid place-items-center rounded-lg border border-pos-line bg-pos-shell px-3 text-[14px] font-semibold tabular-nums text-pos-muted">+62</span>
                  <input ref={numberRef} id="report-number" type="tel" value={number} disabled={sending}
                    onChange={(event) => { setNumber(event.target.value); setProblem(""); }} placeholder="08xx xxxx xxxx"
                    className={`${FIELD} tabular-nums`} />
                </div>
                {normalized && (
                  <p className="mt-1 text-[12px] text-pos-muted">
                    Akan tersimpan sebagai <span className="font-semibold tabular-nums text-pos-ink/80">{normalized}</span>, sama seperti cara halaman pencarian menuliskannya.
                  </p>
                )}
              </div>

              <div>
                <span className={LABEL}>Kategori</span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {COMMUNITY_CATEGORIES.map((item) => (
                    <button key={item.id} type="button" aria-pressed={category === item.id} disabled={sending}
                      onClick={() => { setCategory(item.id); setProblem(""); }}
                      className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                        category === item.id ? "border-pos-ink bg-pos-ink text-white" : "border-pos-line text-pos-ink hover:border-pos-ink/50"
                      }`}>
                      {item.label}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[12px] leading-relaxed text-pos-muted">
                  {category ? COMMUNITY_CATEGORIES.find((item) => item.id === category)?.hint : "Telepon telemarketing dan penagihan utang masuk ke Spam."}
                </p>
              </div>

              <div>
                <span className={LABEL}>Bukti gambar (wajib)</span>
                {preview ? (
                  <div className="mt-2 flex items-center gap-3 rounded-lg border border-pos-line bg-pos-shell p-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element -- a local object URL, shown only to the reporter before upload. */}
                    <img src={preview} alt="Pratinjau bukti" className="h-16 w-16 shrink-0 rounded-lg border border-pos-line object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] text-pos-ink">{evidence?.name}</p>
                      <p className="text-[12px] tabular-nums text-pos-muted">{evidence ? (evidence.size / 1048576).toFixed(2) : "0"} MB dari batas {MAX_EVIDENCE_MB} MB</p>
                    </div>
                    <button type="button" onClick={() => { pickEvidence(null); if (fileRef.current) fileRef.current.value = ""; }} aria-label="Hapus bukti gambar"
                      className="shrink-0 rounded-lg p-2 text-pos-muted transition-colors hover:text-pos-bad focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pos-action">
                      <Icon icon="solar:trash-bin-trash-bold-duotone" className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(event) => {
                      event.preventDefault();
                      setDragging(false);
                      pickEvidence(event.dataTransfer.files?.[0] ?? null);
                    }}
                    className={`mt-2 grid place-items-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors ${
                      dragging ? "border-pos-action bg-pos-action/5" : "border-pos-line"
                    }`}
                  >
                    <Icon icon="solar:gallery-add-bold-duotone" className="h-7 w-7 text-pos-muted" />
                    <p className="text-[13px] font-semibold text-pos-ink">Seret tangkapan layar ke sini</p>
                    <button type="button" onClick={() => fileRef.current?.click()} className="text-[13px] font-semibold text-pos-action-tua hover:text-pos-ink">
                      Pilih dari galeri
                    </button>
                  </div>
                )}
                <p className="mt-2 text-[12px] leading-relaxed text-pos-muted">
                  Tanpa gambar, laporan tidak terkirim. Yang ikut tampil di hasil pemindaian nomor hanyalah gambarnya,
                  nama Anda tidak. Sensor dulu wajah, nama lengkap, dan data pribadi lainnya. JPG, PNG, WEBP, atau HEIC,
                  maksimal {MAX_EVIDENCE_MB} MB.
                </p>
              </div>

              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <label className={LABEL} htmlFor="report-note">Catatan untuk moderator</label>
                  <span className="text-[11px] tabular-nums text-pos-muted">{note.trim().length}/{NOTE_MAX}</span>
                </div>
                <textarea id="report-note" rows={3} maxLength={NOTE_MAX} value={note} disabled={sending}
                  onChange={(event) => { setNote(event.target.value); setProblem(""); }}
                  placeholder="Misalnya isi pesan yang diterima dan jamnya. Jangan tulis data pribadi orang lain."
                  className={`${FIELD} mt-2 resize-none`} />
              </div>

              {problem && <p role="alert" className="text-[13px] leading-relaxed text-pos-bad">{problem}</p>}

              <p className="text-[12px] leading-relaxed text-pos-muted">
                Satu laporan per nomor per akun. Laporan tidak menghapus nomor mana pun dan tidak mengubah hasil
                pemindaian nomor itu — yang mengubah daftar hanyalah laporan yang sudah diverifikasi.
              </p>
            </div>
          )}

          <input ref={fileRef} id="report-evidence" type="file" accept={EVIDENCE_TYPES} disabled={sending}
            onChange={(event) => pickEvidence(event.target.files?.[0] ?? null)}
            className="hidden" />
        </div>
      </div>
    </div>
  );
}
