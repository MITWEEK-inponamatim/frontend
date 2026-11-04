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
  "w-full rounded-lg border border-pos-line bg-pos-card px-3 py-2 text-[14px] leading-relaxed text-pos-ink placeholder:text-pos-muted focus:border-pos-ink focus:outline-none focus:ring-2 focus:ring-pos-action/40";
const LABEL = "text-[12px] font-semibold text-pos-ink";
const COUNT = "text-[11px] tabular-nums text-pos-muted";

const GHOST = "text-[14px] font-semibold text-pos-action-tua transition-colors hover:text-pos-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pos-action";
const SOLID = "rounded-full bg-pos-action px-4 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-pos-action-tua disabled:bg-pos-line disabled:text-pos-muted";

/**
 * Writing a story about a number, in a modal that picks the picture first.
 *
 * The image leads because it is the only part of a story that can be checked by somebody else: the
 * photo comes first, then the words. Evidence stays mandatory and travels in the same request as the
 * text, so a story without proof stays where it belongs — unsubmitted.
 *
 * The category is still picked before anything else is typed, and there is no default selection, so
 * nobody posts under a label they never chose.
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

  // The API checks all of this too; checking here keeps somebody from writing 600 characters and
  // then discovering the title was two letters short.
  const validate = () => {
    if (!evidence) return communityMessage("evidence_required");
    if (!category) return "Pilih kategori dulu, itu yang menentukan cerita Anda dibaca di mana.";
    const phoneProblem = phoneInputProblem(number);
    if (phoneProblem) return phoneProblem;
    if (title.trim().length < TITLE_MIN || title.trim().length > TITLE_MAX) return `Judul cerita minimal ${TITLE_MIN} dan maksimal ${TITLE_MAX} karakter.`;
    if (body.trim().length < BODY_MIN || body.trim().length > BODY_MAX) return `Cerita minimal ${BODY_MIN} dan maksimal ${BODY_MAX} karakter.`;
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
      setNumber(""); setTitle(""); setBody(""); setCategory(""); setStep("pick"); pickEvidence(null);
      if (fileRef.current) fileRef.current.value = "";
      setProblem("");
      onCreated(response ?? {});
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-label="Cerita baru">
      <button type="button" onClick={onClose} aria-label="Tutup penulisan cerita" className="absolute inset-0 bg-pos-ink/70" />

      <div className="relative flex max-h-full w-full max-w-[860px] flex-col overflow-hidden rounded-xl bg-pos-card shadow-xl">
        <header className="flex items-center justify-between gap-3 border-b border-pos-line px-4 py-3">
          <button type="button" onClick={onClose} className={GHOST}>
            Batalkan
          </button>
          <h2 className="truncate text-[14px] font-semibold text-pos-ink">{step === "pick" ? "Pilih bukti gambar" : "Tulis ceritanya"}</h2>
          {step === "pick" ? (
            <button type="button" disabled={!evidence} onClick={() => { setStep("write"); setProblem(""); }} className={SOLID}>
              Berikutnya
            </button>
          ) : (
            <button type="button" disabled={sending} onClick={submit} className={SOLID}>
              {sending ? "Mengirim..." : "Bagikan"}
            </button>
          )}
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {step === "pick" ? (
            <div className="p-4 sm:p-6">
              <div
                onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragging(false);
                  pickEvidence(event.dataTransfer.files?.[0] ?? null);
                }}
                className={`grid place-items-center gap-3 rounded-lg border-2 border-dashed px-6 py-14 text-center transition-colors ${
                  dragging ? "border-pos-action bg-pos-action/5" : "border-pos-line"
                }`}
              >
                <Icon icon="solar:gallery-add-bold-duotone" className="h-9 w-9 text-pos-muted" />
                <p className="text-[14px] font-semibold text-pos-ink">Seret tangkapan layar ke sini</p>
                <p className="max-w-sm text-[13px] leading-relaxed text-pos-muted">
                  Bukti gambar wajib: cerita tanpa gambar tidak terkirim. Gambar ini tampil publik bersama cerita, jadi
                  sensor dulu wajah, nama lengkap, dan data pribadi lainnya.
                </p>
                <button type="button" onClick={() => fileRef.current?.click()} className="mt-1 text-[13px] font-semibold text-pos-action-tua hover:text-pos-ink">
                  Pilih dari galeri
                </button>
              </div>
              {preview && (
                <div className="mt-4 flex items-center gap-3 rounded-lg bg-pos-ink p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element -- a local object URL, shown only to the writer before upload. */}
                  <img src={preview} alt="Pratinjau bukti" className="max-h-40 w-full object-contain" />
                </div>
              )}
              <p className="mt-3 text-[12px] tabular-nums text-pos-muted">
                {evidence ? `${evidence.name} · ${(evidence.size / 1048576).toFixed(2)} MB dari batas ${MAX_EVIDENCE_MB} MB` : `JPG, PNG, WEBP, atau HEIC · maksimal ${MAX_EVIDENCE_MB} MB`}
              </p>
              {problem && <p role="alert" className="mt-3 text-[13px] text-pos-bad">{problem}</p>}
            </div>
          ) : (
            <div className="grid gap-0 sm:grid-cols-2">
              <div className="flex flex-col gap-3 bg-pos-ink p-4">
                {preview && (
                  // eslint-disable-next-line @next/next/no-img-element -- a local object URL, shown only to the writer before upload.
                  <img src={preview} alt="Pratinjau bukti" className="max-h-[320px] w-full self-start rounded-lg object-contain" />
                )}
                <div className="flex items-center justify-between gap-2">
                  <p className="min-w-0 truncate text-[12px] text-white/70">
                    {evidence ? `${evidence.name} · ${(evidence.size / 1048576).toFixed(2)} MB` : "Belum ada gambar"}
                  </p>
                  <button type="button" onClick={() => { pickEvidence(null); if (fileRef.current) fileRef.current.value = ""; setStep("pick"); }}
                    className="shrink-0 text-[12px] font-semibold text-white/90 hover:text-white">
                    Ganti gambar
                  </button>
                </div>
              </div>

              <div className="space-y-4 p-4 sm:p-5">
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
                  <label className={LABEL} htmlFor="community-number">Nomor yang diceritakan</label>
                  <div className="mt-2 flex w-full gap-2">
                    <span aria-hidden="true" className="grid place-items-center rounded-lg border border-pos-line bg-pos-shell px-3 text-[14px] font-semibold tabular-nums text-pos-muted">+62</span>
                    <input ref={numberRef} id="community-number" type="tel" value={number} disabled={sending}
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
                  <div className="flex items-baseline justify-between gap-2">
                    <label className={LABEL} htmlFor="community-title">Judul cerita</label>
                    <span className={COUNT}>{title.trim().length}/{TITLE_MAX}</span>
                  </div>
                  <input id="community-title" value={title} disabled={sending} maxLength={TITLE_MAX}
                    onChange={(event) => { setTitle(event.target.value); setProblem(""); }} placeholder="Misalnya: ditanya OTP atas nama bank, saldo lalu terpakai"
                    className={`${FIELD} mt-2`} />
                </div>

                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <label className={LABEL} htmlFor="community-body">Kronologinya</label>
                    <span className={COUNT}>{body.trim().length}/{BODY_MAX}</span>
                  </div>
                  <textarea id="community-body" rows={6} value={body} disabled={sending} maxLength={BODY_MAX}
                    onChange={(event) => { setBody(event.target.value); setProblem(""); }}
                    placeholder="Ceritakan urutannya: dapat pesan dari mana, isinya apa, apa yang diminta, dan apa yang terjadi setelahnya. Jangan tulis data pribadi Anda atau orang lain — nomor rekening, KTP, dan alamat cukup digambarkan."
                    className={`${FIELD} mt-2 resize-none`} />
                </div>

                {problem && <p role="alert" className="text-[13px] leading-relaxed text-pos-bad">{problem}</p>}

                <p className="text-[12px] leading-relaxed text-pos-muted">
                  Nama Anda tidak ditampilkan. Yang terbaca hanyalah alias, dan akun asli hanya dipakai untuk mengurutkan
                  papan serta menghentikan spam.
                </p>
              </div>
            </div>
          )}

          <input ref={fileRef} id="community-evidence" type="file" accept={EVIDENCE_TYPES} disabled={sending}
            onChange={(event) => { pickEvidence(event.target.files?.[0] ?? null); if (event.target.files?.[0]) setStep("write"); }}
            className="hidden" />
        </div>
      </div>
    </div>
  );
}
