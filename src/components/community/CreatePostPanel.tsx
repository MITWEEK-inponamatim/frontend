"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { api } from "@/lib/api";
import { canonicalPhone, phoneInputProblem } from "@/lib/phone";
import {
  BODY_MAX,
  BODY_MIN,
  COMMUNITY_CATEGORIES,
  EVIDENCE_TYPES,
  MAX_EVIDENCE_MB,
  TITLE_MAX,
  TITLE_MIN,
  communityMessage,
  type CommunityCategory,
} from "@/lib/community";

type CreatedPost = { id?: string; number_e164?: string; title?: string; author_alias?: string };

const FIELD =
  "w-full rounded-xl border border-slate-200/90 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100 transition-colors";
const LABEL = "text-xs font-normal text-slate-900";
const COUNT = "text-[11px] font-normal tabular-nums text-slate-400";
const SOLID_BTN =
  "rounded-full bg-red-600 px-5 py-2 text-xs sm:text-sm font-normal text-white shadow-sm transition-colors hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400";
const GHOST_BTN =
  "text-sm font-normal text-slate-500 transition-colors hover:text-slate-900";

/**
 * Modal dialog enabling citizens to upload evidence and publish community reports.
 */
export function CreatePostPanel({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (post: CreatedPost) => void;
}) {
  const [step, setStep] = useState<"pick" | "write">("pick");
  const [number, setNumber] = useState("");
  const [category, setCategory] = useState<CommunityCategory | "">("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [evidence, setEvidence] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [problem, setProblem] = useState("");
  const [sending, setSending] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const numberRef = useRef<HTMLInputElement>(null);

  const normalized = canonicalPhone(number);

  const pickEvidence = (file: File | null) => {
    setPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return file ? URL.createObjectURL(file) : null;
    });
    setEvidence(file);
    setProblem(file && file.size > MAX_EVIDENCE_MB * 1048576 ? communityMessage("evidence_too_large") : "");
  };

  const validate = () => {
    if (!evidence) return communityMessage("evidence_required");
    if (!category) return "Pilih kategori dulu yang paling sesuai dengan kejadian.";
    const phoneProblem = phoneInputProblem(number);
    if (phoneProblem) return phoneProblem;
    if (title.trim().length < TITLE_MIN || title.trim().length > TITLE_MAX) {
      return `Judul cerita minimal ${TITLE_MIN} dan maksimal ${TITLE_MAX} karakter.`;
    }
    if (body.trim().length < BODY_MIN || body.trim().length > BODY_MAX) {
      return `Cerita kronologi minimal ${BODY_MIN} dan maksimal ${BODY_MAX} karakter.`;
    }
    if (evidence.size > MAX_EVIDENCE_MB * 1048576) return communityMessage("evidence_too_large");
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
      form.set("category", category);
      form.set("title", title.trim());
      form.set("body", body.trim());
      form.set("evidence", evidence as File, evidence?.name);
      const response = (await api("/api/v1/community/posts", { method: "POST", body: form })) as CreatedPost | null;
      setNumber("");
      setTitle("");
      setBody("");
      setCategory("");
      setStep("pick");
      pickEvidence(null);
      if (fileRef.current) fileRef.current.value = "";
      setProblem("");
      onCreated(response ?? {});
      onClose();
    } catch (failure) {
      setProblem(communityMessage(failure instanceof Error ? failure.message : null));
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (!open) return;
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
  }, [open, onClose]);

  useEffect(() => {
    if (open && step === "write") numberRef.current?.focus();
  }, [open, step]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-label="Tulis Cerita Baru">
      <button type="button" onClick={onClose} aria-label="Tutup form cerita" className="absolute inset-0 bg-slate-950/60" />

      <div className="relative flex max-h-[90vh] w-full max-w-[820px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100">
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <button type="button" onClick={onClose} className={GHOST_BTN}>
            Batal
          </button>
          <h2 className="text-sm sm:text-base font-normal text-slate-900">
            {step === "pick" ? "Langkah 1: Unggah Bukti Screenshot" : "Langkah 2: Tulis Kronologi Cerita"}
          </h2>
          {step === "pick" ? (
            <button
              type="button"
              disabled={!evidence}
              onClick={() => {
                setStep("write");
                setProblem("");
              }}
              className={SOLID_BTN}
            >
              Lanjut
            </button>
          ) : (
            <button type="button" disabled={sending} onClick={submit} className={SOLID_BTN}>
              {sending ? "Mengirim..." : "Bagikan"}
            </button>
          )}
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {step === "pick" ? (
            <div className="p-5 sm:p-8">
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
                className={`grid place-items-center gap-3 rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-colors ${
                  dragging ? "border-red-500 bg-red-50/50" : "border-slate-200 bg-slate-50/50 hover:bg-slate-50"
                }`}
              >
                <div className="grid h-12 w-12 place-items-center rounded-full bg-red-50 text-red-600">
                  <Icon icon="solar:gallery-add-bold-duotone" className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-normal text-slate-900">Seret tangkapan layar bukti ke sini</p>
                  <p className="mt-1 text-xs font-normal text-slate-500">Mendukung format JPG, PNG, WEBP, atau HEIC (maks. {MAX_EVIDENCE_MB} MB)</p>
                </div>
                <p className="max-w-md text-xs font-normal leading-relaxed text-slate-500">
                  Bukti gambar wajib disertakan. Pastikan Anda telah menyensor informasi pribadi sensitif seperti NIK, nomor rekening pribadi, atau alamat tempat tinggal.
                </p>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="mt-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-normal text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                >
                  Pilih Berkas dari Perangkat
                </button>
              </div>

              {preview && (
                <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center justify-between pb-2 text-xs font-normal text-slate-700">
                    <span className="font-normal">Pratinjau Bukti Terpilih</span>
                    <span className="text-slate-500 font-normal tabular-nums">
                      {evidence ? `${(evidence.size / 1048576).toFixed(2)} MB` : ""}
                    </span>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Pratinjau bukti" className="max-h-48 w-full rounded-lg object-contain bg-white" />
                </div>
              )}

              {problem && (
                <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-normal text-red-700">
                  {problem}
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-0 md:grid-cols-2">
              <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50 p-5 md:border-b-0 md:border-r">
                {preview && (
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Pratinjau bukti" className="max-h-[300px] w-full rounded-lg object-contain" />
                  </div>
                )}
                <div className="flex items-center justify-between text-xs font-normal text-slate-600">
                  <span className="truncate font-normal">{evidence?.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      pickEvidence(null);
                      if (fileRef.current) fileRef.current.value = "";
                      setStep("pick");
                    }}
                    className="font-normal text-red-600 hover:text-red-700 hover:underline"
                  >
                    Ganti gambar
                  </button>
                </div>
              </div>

              <div className="space-y-4 p-5 sm:p-6">
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
                  <label className={LABEL} htmlFor="community-number">
                    Nomor Terduga Pelaku
                  </label>
                  <div className="mt-2 flex w-full gap-2">
                    <span
                      aria-hidden="true"
                      className="grid place-items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-normal tabular-nums text-slate-600"
                    >
                      +62
                    </span>
                    <input
                      ref={numberRef}
                      id="community-number"
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
                  <div className="flex items-baseline justify-between gap-2">
                    <label className={LABEL} htmlFor="community-title">
                      Judul Cerita
                    </label>
                    <span className={COUNT}>
                      {title.trim().length}/{TITLE_MAX}
                    </span>
                  </div>
                  <input
                    id="community-title"
                    value={title}
                    disabled={sending}
                    maxLength={TITLE_MAX}
                    onChange={(event) => {
                      setTitle(event.target.value);
                      setProblem("");
                    }}
                    placeholder="Contoh: Modus kurir paket kirim link APK lewat WA"
                    className={`${FIELD} mt-1`}
                  />
                </div>

                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <label className={LABEL} htmlFor="community-body">
                      Kronologi Lengkap
                    </label>
                    <span className={COUNT}>
                      {body.trim().length}/{BODY_MAX}
                    </span>
                  </div>
                  <textarea
                    id="community-body"
                    rows={5}
                    value={body}
                    disabled={sending}
                    maxLength={BODY_MAX}
                    onChange={(event) => {
                      setBody(event.target.value);
                      setProblem("");
                    }}
                    placeholder="Tuliskan runtutan kejadian: pesan pertama yang dikirim, ancaman/imbalan yang dijanjikan, dan tindakan yang Anda ambil."
                    className={`${FIELD} mt-1 resize-none`}
                  />
                </div>

                {problem && (
                  <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-normal text-red-700">
                    {problem}
                  </div>
                )}
              </div>
            </div>
          )}

          <input
            ref={fileRef}
            id="community-evidence"
            type="file"
            accept={EVIDENCE_TYPES}
            disabled={sending}
            onChange={(event) => {
              pickEvidence(event.target.files?.[0] ?? null);
              if (event.target.files?.[0]) setStep("write");
            }}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
