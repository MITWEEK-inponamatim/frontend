import { BoardPage } from "@/components/community/BoardPage";

/** Nomor berbahaya: ambang laporan terverifikasi, sumbernya phone_reports — bukan post dan bukan vote. */
export default function DangerousNumbersPage() {
  return <BoardPage tab="dangerous" />;
}
