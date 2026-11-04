import { BoardPage } from "@/components/community/BoardPage";

/** Cerita terbaru — urutan berdasarkan waktu posting, tidak dipengaruhi vote. */
export default function LatestStoriesPage() {
  return <BoardPage tab="new" />;
}
