/**
 * Meja moderasi: apa yang bisa dilakukan seorang moderator, dan apa yang dijanjikan API-nya.
 * Status di bawah menyalin reportStatuses di backend/admin.go dan ALLOWED_STATUSES di
 * analysis-service/app/phone_reports.py; kalau salah satu berubah, yang lain harus ikut.
 */
export type ReportStatus = "pending" | "verified" | "rejected" | "rejected_spam";
export type ReportQueue = ReportStatus | "all";
export type PostStatus = "active" | "removed";
export type PostQueue = PostStatus | "all";

export type ModeratedReport = {
  id: string;
  number_e164: string;
  category: string;
  source: string;
  status: ReportStatus;
  note: string;
  evidence_url: string;
  reporter_alias?: string;
  created_at: string;
};

export type ModeratedPost = {
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
  status: PostStatus;
};

export type Tone = "queue" | "approved" | "declined" | "spam" | "quiet";

export const PAGE_SIZE = 20;

// Labels of record. A moderator decides on these words, so they must not read like database
// values and must never change meaning between the two queues. `meaning` is the sentence a
// moderator sees when asking "then what happens if I press this".
export const REPORT_STATUS_META: Record<ReportStatus, { label: string; tone: Tone; meaning: string }> = {
  pending: { label: "Antrean", tone: "queue", meaning: "Belum dinilai siapa pun." },
  verified: { label: "Disetujui", tone: "approved", meaning: "Nomor ini langsung masuk daftar 'Nomor berbahaya' di papan komunitas." },
  rejected: { label: "Ditolak", tone: "declined", meaning: "Tidak ikut dihitung sebagai risiko." },
  rejected_spam: { label: "Spam", tone: "spam", meaning: "Laporan sampah: tidak dihitung, dan pelapornya tidak ditampilkan." },
};

export const POST_STATUS_META: Record<PostStatus, { label: string; tone: Tone; meaning: string }> = {
  active: { label: "Tayang", tone: "approved", meaning: "Terbaca semua warga di papan." },
  // Grey, not red: taking a story down is a withdrawal, and the desk keeps red for reports it
  // judged harmful so the two never look like the same decision.
  removed: { label: "Dihapus", tone: "declined", meaning: "Masih tersimpan, tapi tidak tampil di papan." },
};

// The bucket list each queue offers, in the order a moderator reads them. The tone is the bucket's
// own verdict colour, so a tab and the rows it selects are read as the same thing.
export const REPORT_QUEUES: { id: ReportQueue; label: string; tone: Tone }[] = [
  { id: "pending", label: "Antrean", tone: "queue" },
  { id: "verified", label: "Disetujui", tone: "approved" },
  { id: "rejected", label: "Ditolak", tone: "declined" },
  { id: "rejected_spam", label: "Spam", tone: "spam" },
  { id: "all", label: "Semua", tone: "quiet" },
];

export const POST_QUEUES: { id: PostQueue; label: string; tone: Tone }[] = [
  { id: "active", label: "Tayang", tone: "approved" },
  { id: "removed", label: "Dihapus", tone: "declined" },
  { id: "all", label: "Semua", tone: "quiet" },
];

export type Decision<T extends string> = { to: T; label: string; title: string };

const REPORT_ACTIONS: Record<ReportStatus, { label: string; title: string }> = {
  pending: { label: "Ke antrean", title: "Kembalikan laporan ini ke antrean" },
  verified: { label: "Setujui", title: "Setujui laporan ini" },
  rejected: { label: "Tolak", title: "Tolak laporan ini" },
  rejected_spam: { label: "Spam", title: "Tandai laporan ini sebagai spam" },
};

/**
 * The moves one report may still make. Its own status is never offered back: the API answers a
 * repeated decision with "unchanged", and a button that changes nothing teaches nobody how the
 * queue works.
 */
export function reportDecisions(status: ReportStatus): Decision<ReportStatus>[] {
  return (["verified", "rejected", "rejected_spam", "pending"] as ReportStatus[])
    .filter((to) => to !== status)
    .map((to) => ({ to, ...REPORT_ACTIONS[to] }));
}

const POST_ACTIONS: Record<PostStatus, { label: string; title: string }> = {
  active: { label: "Hapus", title: "Hapus cerita ini dari papan" },
  removed: { label: "Tayang lagi", title: "Tampilkan lagi cerita ini di papan" },
};

export function postDecisions(status: PostStatus): Decision<PostStatus>[] {
  return [{ to: status, ...POST_ACTIONS[status] }];
}

/**
 * The question asked before a decision is written. A moderator clicks the same words forty times an
 * hour, so the popup has to say something the button does not: what the row does afterwards, in the
 * sentence already used on the row's own stamp, plus the one thing that keeps a wrong click from
 * being frightening — that it can be changed again.
 */
const REPORT_CONFIRM: Record<ReportStatus, { title: string; confirm: string }> = {
  pending: { title: "Kembalikan laporan ini ke antrean?", confirm: "Ke antrean" },
  verified: { title: "Setujui laporan ini?", confirm: "Setujui laporan" },
  rejected: { title: "Tolak laporan ini?", confirm: "Tolak laporan" },
  rejected_spam: { title: "Tandai laporan ini sebagai spam?", confirm: "Tandai spam" },
};

const POST_CONFIRM: Record<PostStatus, { title: string; confirm: string }> = {
  active: { title: "Turunkan cerita ini dari papan?", confirm: "Turunkan cerita" },
  removed: { title: "Tayangkan lagi cerita ini?", confirm: "Tayangkan lagi" },
};

export function reportConfirmation(to: ReportStatus): { title: string; body: string; confirmLabel: string } {
  return {
    title: REPORT_CONFIRM[to].title,
    body: `${REPORT_STATUS_META[to].meaning} Keputusan bisa diubah lagi kapan pun, dan laporan tetap tersimpan.`,
    confirmLabel: REPORT_CONFIRM[to].confirm,
  };
}

export function postConfirmation(to: PostStatus): { title: string; body: string; confirmLabel: string } {
  return {
    title: POST_CONFIRM[to].title,
    body: `${POST_STATUS_META[to].meaning} Tulisan dan gambar buktinya tetap tersimpan — yang berubah hanya tampil atau tidaknya di papan warga.`,
    confirmLabel: POST_CONFIRM[to].confirm,
  };
}

// Category labels for reports, mirroring the form on /community/phone. Unknown values are shown
// as they arrive rather than guessed at: a moderator should see the raw token, not a friendly lie.
const REPORT_CATEGORY_LABELS: Record<string, string> = {
  penipuan: "Penipuan",
  spam: "Spam",
  telemarketing: "Telemarketing",
  penagih_utang: "Penagih utang",
  peniruan_identitas: "Peniruan identitas",
  phishing: "Phishing",
  pharming: "Pharming",
  lainnya: "Lainnya",
};

export function reportCategoryLabel(id: string) {
  return REPORT_CATEGORY_LABELS[id] ?? id;
}

// Only one source writes reports today, but a moderator reading a queue of 400 rows should not
// have to remember which of them came from somewhere else.
const REPORT_SOURCE_LABELS: Record<string, string> = {
  user_report: "Laporan warga",
};

export function reportSourceLabel(id: string) {
  return REPORT_SOURCE_LABELS[id] ?? id;
}

// The desk shows absolute date and time instead of "2 jam lalu": deciding how old a report is needs
// a timestamp, and a relative one stops being true while the moderator reads the row above. The year
// is always part of the stamp, so formatting a row never asks the clock what today is — Next.js
// treats a render-time `new Date()` in a client component as an unstable value.
const DESK_DATE = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" });
const DESK_TIME = new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" });

export function deskStamp(value: string) {
  const moment = new Date(value);
  if (Number.isNaN(moment.getTime())) return "";
  // Joined by hand because one format string puts a comma between the date and the clock.
  return `${DESK_DATE.format(moment)} ${DESK_TIME.format(moment)}`;
}

export const ADMIN_ROUTES = [
  { id: "dasbor", href: "/admin/dasbor", label: "Dasbor", icon: "solar:chart-square-linear" },
  { id: "laporan", href: "/admin/laporan", label: "Laporan nomor", icon: "solar:phone-linear" },
  { id: "posting", href: "/admin/posting", label: "Cerita warga", icon: "solar:chat-round-line-linear" },
] as const;

export type AdminRouteId = (typeof ADMIN_ROUTES)[number]["id"];

// The search box lives in the shell, so the shell asks what it is searching for. On the dashboard
// the box filters the preview of newest reports, which is the only list there a moderator could
// want to narrow.
export function searchPlaceholder(route: AdminRouteId) {
  if (route === "dasbor") return "Cari nomor di laporan terbaru";
  return route === "posting" ? "Cari nomor, judul, atau cerita" : "Cari nomor, catatan, atau kategori";
}

const ADMIN_MESSAGES: Record<string, string> = {
  admin_required: "Halaman ini hanya untuk akun moderator. Keluar lalu masuk lagi dengan akun yang diberi peran admin.",
  moderation_unavailable: "Keputusan tidak tersimpan karena layanan moderasi tidak dapat dihubungi. Nomor ini masih berstatus lama.",
  report_not_found: "Laporan itu tidak ada lagi, mungkin sudah dihapus. Muat ulang daftar.",
  post_not_found: "Cerita itu tidak ada lagi, mungkin sudah dihapus. Muat ulang daftar.",
  invalid_report_id: "Tautan keputusan tidak dikenali. Muat ulang daftar lalu coba lagi.",
  invalid_post_id: "Tautan keputusan tidak dikenali. Muat ulang daftar lalu coba lagi.",
  invalid_status: "Status yang diminta tidak dikenali oleh layanan. Muat ulang halaman.",
  invalid_range: "Rentang waktu yang diminta tidak dikenali oleh layanan. Pilih salah satu dari empat rentang.",
  invalid_json: "Keputusan tidak dapat dibaca oleh layanan. Muat ulang daftar lalu coba lagi.",
  internal_error: "Layanan tidak dapat membaca halaman ini. Coba lagi sebentar lagi.",
  // Two different ways a decision can fail to be written, and neither of them is a scan problem:
  // the request never arrived, or it arrived and the API refused it for a reason this file does not
  // know yet. Both have to say the row did not move.
  request_failed: "Permintaan tidak sampai ke layanan, jadi tidak ada yang berubah. Periksa koneksi lalu coba lagi.",
  unrecognized: "Layanan menolak permintaan ini dengan alasan yang belum dikenali halaman ini. Tidak ada yang berubah — muat ulang daftar lalu coba lagi.",
};

// The desk never has a scan in front of it, so messageForError's scanner sentences are always wrong
// here — including for a code the API invented after this file was written.
export function adminMessage(code: string | undefined | null): string {
  if (!code) return ADMIN_MESSAGES.request_failed;
  return ADMIN_MESSAGES[code] ?? ADMIN_MESSAGES.unrecognized;
}

// The API answers a repeated decision with {"unchanged":true}: the row is already where the
// moderator wants it, so nothing moved and nothing should be announced as if it had.
export function isUnchanged(payload: unknown) {
  return Boolean(payload && typeof payload === "object" && (payload as { unchanged?: boolean }).unchanged);
}
