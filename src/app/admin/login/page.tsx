import type { Metadata } from "next";
import { AdminLogin } from "@/components/admin/AdminLogin";

export const metadata: Metadata = {
  title: "Masuk Moderator",
  robots: { index: false, follow: false },
};

// Why the moderator was sent back here — an expired session or the wrong account — arrives in the
// query string, so this page is never served from a cached shell.
export const instant = false;

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string; next?: string }>;
}) {
  const { reason = "", next = "" } = await searchParams;

  return <AdminLogin reason={reason} next={next} />;
}
