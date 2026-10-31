"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function LandingInteractionGuard({ authenticated }: { authenticated: boolean }) {
  const router = useRouter();
  useEffect(() => {
    if (authenticated) return;
    const goLogin = (event: Event) => {
      if (event.target instanceof Element && event.target.closest('a[href="/login"],a[href^="/login?"]')) return;
      event.preventDefault(); event.stopPropagation();
      router.push("/login?next=%2Frecognize");
    };
    const keydown = (event: KeyboardEvent) => {
      if ((event.key === "Enter" || event.key === " ") && (event.target as HTMLElement).closest("a,button,[role=button]")) void goLogin(event);
    };
    document.addEventListener("click", goLogin, true); document.addEventListener("submit", goLogin, true); document.addEventListener("keydown", keydown, true);
    return () => { document.removeEventListener("click", goLogin, true); document.removeEventListener("submit", goLogin, true); document.removeEventListener("keydown", keydown, true); };
  }, [authenticated, router]);
  return null;
}
