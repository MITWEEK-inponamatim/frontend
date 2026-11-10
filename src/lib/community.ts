import { messageForError } from "@/hooks/useScanner";

// The five categories agreed for this board, in the order they are offered. They mirror the
// check constraint in 202611040007 and communityCategories in the Go API: a category the API
// does not know is refused there, so this list is a courtesy to the writer, not a gate.
// Telemarketing and debt collectors are deliberately absent — they belong under "spam".
export const COMMUNITY_CATEGORIES = [
  { id: "penipuan", label: "Penipuan", hint: "Ada uang, barang, atau data yang hilang." },
  { id: "phishing", label: "Phishing", hint: "Tautan atau pesan yang mengaku bank, kantor, atau aplikasi." },
  { id: "pharming", label: "Pharming", hint: "Situs asli dipalsukan atau dialihkan ke alamat lain." },
  { id: "spam", label: "Spam", hint: "Pesan atau telepon berulang, termasuk telemarketing dan penagihan." },
  { id: "peniruan_identitas", label: "Peniruan identitas", hint: "Nomor menyamar sebagai instansi, toko, atau kenalan." },
] as const;

export type CommunityCategory = (typeof COMMUNITY_CATEGORIES)[number]["id"];

export type CommunityPost = {
  id: string;
  number_e164: string;
  category: string;
  title: string;
  body: string;
  evidence_url: string;
  author_alias: string;
  up_count: number;
  down_count: number;
  score: number;
  comment_count: number;
  created_at: string;
  my_vote?: number;
  // Stamped by the API: this story is the reader's own, so the board may offer to delete it.
  is_author?: boolean;
};

export type CommunityComment = {
  id: string;
  post_id: string;
  parent_id?: string;
  body: string;
  author_alias: string;
  /** Stamped by the API: this row is the reader's own, so it may be erased by them. */
  is_author?: boolean;
  created_at: string;
  replies?: CommunityComment[];
};

export type DangerousNumber = {
  number_e164: string;
  verified_reports: number;
  verified_reporters: number;
  total_reports: number;
  community_posts: number;
  community_score: number;
  last_report_at?: string;
};

export const TITLE_MIN = 4;
export const TITLE_MAX = 120;
export const BODY_MIN = 10;
export const BODY_MAX = 4000;
export const COMMENT_MAX = 1000;
// Same ceiling as MAX_EVIDENCE_MB in the Go API and MAX_EVIDENCE_BYTES in the analysis service.
export const MAX_EVIDENCE_MB = 5;
export const EVIDENCE_TYPES = "image/png,image/jpeg,image/webp,image/heic,image/heif";

// Worded for this board: messageForError answers in the language of scans and reports, and a
// story that failed as "Scan tidak ditemukan" reads like a bug.
const COMMUNITY_MESSAGES: Record<string, string> = {
  invalid_title: `Judul cerita minimal ${TITLE_MIN} dan maksimal ${TITLE_MAX} karakter.`,
  invalid_body: `Cerita minimal ${BODY_MIN} dan maksimal ${BODY_MAX} karakter.`,
  invalid_parent: "Komentar yang akan dibalas tidak ditemukan, mungkin sudah dihapus.",
  reply_too_deep: "Balasan hanya satu tingkat: balas komentar teratasnya, bukan balasannya.",
  invalid_vote: "Pilihan vote tidak dikenali.",
  evidence_required: "Bukti gambar wajib dilampirkan sebelum cerita dikirim.",
  evidence_too_large: "Gambar bukti melebihi batas ukuran. Kompres dulu lalu kirim lagi.",
  evidence_unsupported_type: "Bukti harus berupa gambar (JPG, PNG, WEBP, atau HEIC dari kamera ponsel).",
  evidence_unavailable: "Bukti gambar tidak dapat disimpan, jadi cerita tidak dikirim. Coba lagi sebentar lagi.",
  not_found: "Cerita atau komentar tidak ditemukan, mungkin sudah dihapus moderator.",
};

export function communityMessage(code: string | undefined | null): string {
  if (!code) return messageForError(code);
  return COMMUNITY_MESSAGES[code] ?? messageForError(code);
}

export function categoryLabel(id: string) {
  return COMMUNITY_CATEGORIES.find((item) => item.id === id)?.label ?? id;
}

// A number this board talks about is stored as +62…, which is hard to skim in a list. Spacing it
// out is presentation only; the link and the API always carry the stored form.
export function displayNumber(e164: string) {
  const subscriber = (e164 || "").replace("+62", "");
  if (!/^[0-9]+$/.test(subscriber)) return e164;
  const groups: string[] = [];
  for (let end = subscriber.length; end > 0; end -= 4) groups.unshift(subscriber.slice(Math.max(0, end - 4), end));
  return `+62 ${groups.join("-")}`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

// Relative for anything inside a week, absolute after that: "1.200 menit lalu" tells nobody
// anything, and a story from March should say March.
export function timeAgo(value: string, now: number = Date.now()) {
  const moment = new Date(value).getTime();
  if (Number.isNaN(moment)) return "";
  const minutes = Math.round((now - moment) / 60000);
  if (minutes < 1) return "baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.round(hours / 24);
  if (days === 1) return "kemarin";
  if (days < 7) return `${days} hari lalu`;
  const date = new Date(value);
  const year = date.getFullYear() === new Date(now).getFullYear() ? "" : ` ${date.getFullYear()}`;
  return `${date.getDate()} ${MONTHS[date.getMonth()]}${year}`;
}

export function excerpt(body: string, max = 220) {
  if (body.length <= max) return body;
  const cut = body.slice(0, max);
  const tail = cut.lastIndexOf(" ");
  return `${cut.slice(0, tail > 120 ? tail : max).trimEnd()}...`;
}

// Mirrors the trigger-maintained counters: up_count and down_count each hold one row per account,
// so switching from up to down moves one from each column rather than two from one.
export function withLocalVote(post: CommunityPost, next: number): CommunityPost {
  const current = post.my_vote ?? 0;
  const up = post.up_count - (current === 1 ? 1 : 0) + (next === 1 ? 1 : 0);
  const down = post.down_count - (current === -1 ? 1 : 0) + (next === -1 ? 1 : 0);
  return { ...post, up_count: up, down_count: down, score: up - down, my_vote: next };
}
