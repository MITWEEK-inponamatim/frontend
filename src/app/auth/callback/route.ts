import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const safeNext = (value: string | null) => value && value.startsWith("/") && !value.startsWith("//") && ["/", "/recognize", "/history"].includes(value) ? value : "/recognize";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const target = safeNext(request.nextUrl.searchParams.get("next"));
  const response = NextResponse.redirect(new URL(code ? target : "/login?reason=session_required", request.url));
  if (!code) return response;

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookies) => cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options)),
    },
  });
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  const token = data.session?.access_token;
  if (error || !token) return NextResponse.redirect(new URL("/login?reason=oauth_error", request.url));

  let finalized: Response;
  try {
    finalized = await fetch(`${process.env.INTERNAL_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/session/finalize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Cookie: request.headers.get("cookie") ?? "",
        Origin: request.nextUrl.origin,
      },
      cache: "no-store",
    });
  } catch {
    return NextResponse.redirect(new URL("/login?reason=session_required", request.url));
  }

  if (!finalized.ok) return NextResponse.redirect(new URL("/login?reason=session_required", request.url));
  for (const cookie of finalized.headers.getSetCookie()) response.headers.append("Set-Cookie", cookie);
  return response;
}
