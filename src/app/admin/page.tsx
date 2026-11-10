import { redirect } from "next/navigation";

/**
 * /admin is the address a moderator types from memory, and the address of the desk is its door:
 * the sign-in page, never one of the queues behind it. Where a signed-in moderator ends up is the
 * door's decision, made with the role it has just read.
 */
export default function AdminPage() {
  redirect("/admin/login");
}
