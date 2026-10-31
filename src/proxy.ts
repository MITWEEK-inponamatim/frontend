import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const safeNext = (path: string | null) => path && path.startsWith("/") && !path.startsWith("//") && ["/", "/recognize", "/history"].includes(path) ? path : "/recognize";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: { getAll: () => request.cookies.getAll(), setAll: (values) => { values.forEach(({ name, value }) => request.cookies.set(name, value)); response = NextResponse.next({ request }); values.forEach(({ name, value, options }) => response.cookies.set(name, value, options)); } },
  });
  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  if (path === "/" && !user && ["click", "submit", "keydown"].includes(request.headers.get("x-landing-interaction") ?? "")) {
    const login = new URL("/login", request.url); login.searchParams.set("next", "/recognize"); return NextResponse.redirect(login);
  }
  if (!user && !["/", "/login", "/auth/callback"].includes(path)) {
    const login = new URL("/login", request.url); login.searchParams.set("next", safeNext(path)); return NextResponse.redirect(login);
  }
  if (user && path === "/login") return NextResponse.redirect(new URL(safeNext(request.nextUrl.searchParams.get("next"))!, request.url));
  return response;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"] };
