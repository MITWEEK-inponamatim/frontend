import { createClient } from "@/lib/supabase/client";

export async function api(path: string, init: RequestInit = {}) {
  const { data: { session } } = await createClient().auth.getSession();
  const form = init.body instanceof FormData;
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`, { ...init, headers: { ...(!form ? { "Content-Type": "application/json" } : {}), Authorization: `Bearer ${session?.access_token ?? ""}`, ...(init.headers ?? {}) } });
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.code ?? "request_failed");
  return response.status === 204 ? null : response.json();
}
