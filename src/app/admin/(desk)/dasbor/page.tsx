import { Dashboard } from "@/components/admin/Dashboard";

// Angka dasbor bergerak setiap kali ada laporan atau keputusan baru, jadi halaman ini tidak pernah
// disajikan dari cache.
export const instant = false;

/** Ringkasan meja moderasi: jumlah akun, laporan, dan cerita warga beserta pertumbuhannya. */
export default function AdminDashboardPage() {
  return <Dashboard />;
}
