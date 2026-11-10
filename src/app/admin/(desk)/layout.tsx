import { AdminShell } from "@/components/admin/AdminShell";

/**
 * The shell belongs to the queues, not to /admin: the sign-in page has to be reachable without a
 * session, and a shell that reads the session would be the wrong thing to render there.
 */
export default function DeskLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
