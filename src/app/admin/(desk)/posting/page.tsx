import { PostQueue } from "@/components/admin/PostQueue";

// Stories are published and removed while this page is open, so it is never served from a cache.
export const instant = false;

/** Antrean cerita warga: status aktif atau dihapus dari papan. */
export default function AdminPostsPage() {
  return <PostQueue />;
}
