"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { api } from "@/lib/api";
import { messageForError } from "@/hooks/useScanner";
import { canonicalPhone, phoneInputProblem, phoneSlug } from "@/lib/phone";
import {
  COMMUNITY_CATEGORIES,
  EVIDENCE_TYPES,
  MAX_EVIDENCE_MB,
  displayNumber,
  type CommunityCategory,
} from "@/lib/community";

const NOTE_MAX = 280;

const FIELD =
  "w-full rounded-xl border border-slate-200/90 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100 transition-colors";
const LABEL = "text-xs font-normal text-slate-900";
const SOLID_BTN =
  "rounded-full bg-red-600 px-5 py-2 text-xs sm:text-sm font-normal text-white shadow-sm transition-colors hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400";
const GHOST_BTN =
  "text-sm font-normal text-slate-500 transition-colors hover:text-slate-900";

type ReportResponse = { number_e164?: string; status?: string; note_saved?: boolean };

/**
 * Modal dialog for reporting suspicious phone numbers with verified evidence attachments.
 */
export function ReportNumberPanel({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess?: (report: { number_e164: string; category?: string }) => void;
}) {
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
    if (!category) return "Pilih kategori ancaman terlebih dahulu.";
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
      const result = response ?? { status: "pending" };
      setSent(result);
      const targetE164 = result.number_e164 || normalized || number;
      if (targetE164) {
        onSuccess?.({ number_e164: targetE164, category: category || undefined });
      }
    } catch (failure) {
      setProblem(messageForError(failure instanceof Error ? failure.message : null));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-label="Lapor Nomor Berbahaya">
      <button type="button" onClick={onClose} aria-label="Tutup form laporan" className="absolute inset-0 bg-slate-950/60" />

      <div className="relative flex max-h-[90vh] w-full max-w-[540px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100">
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          {sent ? (
            <span className={GHOST_BTN}>Selesai</span>
          ) : (
            <button type="button" onClick={onClose} className={GHOST_BTN}>
              Batal
            </button>
          )}
          <h2 className="text-sm sm:text-base font-normal text-slate-900">
            {sent ? "Laporan Berhasil Terkirim" : "Lapor Nomor Berbahaya"}
          </h2>
          {sent ? (
            <button type="button" onClick={onClose} className={SOLID_BTN}>
              Tutup
            </button>
          ) : (
            <button type="button" disabled={sending} onClick={submit} className={SOLID_BTN}>
              {sending ? "Mengirim..." : "Kirim Laporan"}
            </button>
          )}
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
          {sent ? (
            <div className="space-y-4 text-center py-4">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                <Icon icon="solar:check-circle-bold-duotone" className="h-8 w-8" />
              </div>
              <h3 className="text-base font-normal text-slate-900">
                Laporan Telah Masuk Antrean Moderasi
              </h3>
              <p className="text-xs font-normal leading-relaxed text-slate-600 max-w-sm mx-auto">
                Laporan untuk nomor <span className="font-normal text-slate-900">{sent.number_e164 ? displayNumber(sent.number_e164) : number}</span> telah kami terima beserta bukti tangkapan layar.
              </p>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-left text-xs font-normal leading-relaxed text-slate-500">
                Nomor akan masuk daftar &apos;Nomor Berbahaya&apos; setelah laporan Anda disetujui moderator.
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                <Link
                  href={`/recognize/phone/${phoneSlug(sent.number_e164 || number)}`}
                  onClick={onClose}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-full bg-red-600 px-5 py-2 text-xs font-normal text-white shadow-sm transition-colors hover:bg-red-700"
                >
                  <span>Lihat Hasil Analisis Nomor</span>
                  <Icon icon="solar:arrow-right-up-linear" className="h-3.5 w-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-normal text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Tetap di Komunitas
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className={LABEL} htmlFor="report-number">
                  Nomor Telepon yang Dilaporkan
                </label>
                <div className="mt-1.5 flex w-full gap-2">
                  <span
                    aria-hidden="true"
                    className="grid place-items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-normal tabular-nums text-slate-600"
                  >
                    +62
                  </span>
                  <input
                    ref={numberRef}
                    id="report-number"
                    type="tel"
                    value={number}
                    disabled={sending}
                    onChange={(event) => {
                      setNumber(event.target.value);
                      setProblem("");
                    }}
                    placeholder="0812 3456 7890"
                    className={`${FIELD} tabular-nums`}
                  />
                </div>
                {normalized && (
                  <p className="mt-1 text-[11px] font-normal text-slate-500">
                    Format tersimpan: <span className="font-normal tabular-nums text-slate-700">{normalized}</span>
                  </p>
                )}
              </div>

              <div>
                <span className={LABEL}>Kategori Ancaman</span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {COMMUNITY_CATEGORIES.map((item) => {
                    const isSelected = category === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        aria-pressed={isSelected}
                        disabled={sending}
                        onClick={() => {
                          setCategory(item.id);
                          setProblem("");
                        }}
                        className={`rounded-full border px-3 py-1 text-xs font-normal transition-colors ${
                          isSelected
                            ? "border-red-600 bg-red-600 text-white shadow-sm"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className={LABEL}>Bukti Tangkapan Layar (Wajib)</span>
                {preview ? (
                  <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Pratinjau bukti" className="h-16 w-16 shrink-0 rounded-lg border border-slate-200 object-cover bg-white" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-normal text-slate-900">{evidence?.name}</p>
                      <p className="text-[11px] font-normal tabular-nums text-slate-500">
                        {evidence ? (evidence.size / 1048576).toFixed(2) : "0"} MB dari batas {MAX_EVIDENCE_MB} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        pickEvidence(null);
                        if (fileRef.current) fileRef.current.value = "";
                      }}
                      aria-label="Hapus gambar bukti"
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:text-red-600"
                    >
                      <Icon icon="solar:trash-bin-trash-bold-duotone" className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={(event) => {
                      event.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(event) => {
                      event.preventDefault();
                      setDragging(false);
                      pickEvidence(event.dataTransfer.files?.[0] ?? null);
                    }}
                    className={`mt-1.5 grid place-items-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
                      dragging ? "border-red-500 bg-red-50/50" : "border-slate-200 bg-slate-50/50 hover:bg-slate-50"
                    }`}
                  >
                    <Icon icon="solar:gallery-add-bold-duotone" className="h-7 w-7 text-slate-400" />
                    <p className="text-xs font-normal text-slate-700">Tarik gambar bukti ke sini atau</p>
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-normal text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                    >
                      Pilih dari Galeri
                    </button>
                  </div>
                )}
                <p className="mt-1 text-[11px] font-normal text-slate-500">
                  Sensor nama lengkap, NIK, dan nomor rekening pribadi sebelum mengunggah.
                </p>
              </div>

              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <label className={LABEL} htmlFor="report-note">
                    Catatan Tambahan untuk Moderator
                  </label>
                  <span className="text-[11px] font-normal tabular-nums text-slate-400">
                    {note.trim().length}/{NOTE_MAX}
                  </span>
                </div>
                <textarea
                  id="report-note"
                  rows={3}
                  maxLength={NOTE_MAX}
                  value={note}
                  disabled={sending}
                  onChange={(event) => {
                    setNote(event.target.value);
                    setProblem("");
                  }}
                  placeholder="Ceritakan pesan yang diterima atau waktu panggilan berlangsung."
                  className={`${FIELD} mt-1.5 resize-none`}
                />
              </div>

              {problem && (
                <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-normal text-red-700">
                  {problem}
                </div>
              )}
            </div>
          )}

          <input
            ref={fileRef}
            id="report-evidence"
            type="file"
            accept={EVIDENCE_TYPES}
            disabled={sending}
            onChange={(event) => pickEvidence(event.target.files?.[0] ?? null)}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
