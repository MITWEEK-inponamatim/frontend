import { ReportQueue } from "@/components/admin/ReportQueue";

// Which reports are waiting changes the moment a moderator decides, so this page is never cached.
export const instant = false;

/** Antrean laporan nomor telepon: status per laporan, satu baris satu klaim satu akun. */
export default function AdminReportsPage() {
  return <ReportQueue />;
}
