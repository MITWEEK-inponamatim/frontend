import React from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { LandingInteractionGuard } from "@/components/auth/LandingInteractionGuard";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

async function HomeContent() {
  const { data: { user } } = await (await createClient()).auth.getUser();
  return <><LandingInteractionGuard authenticated={!!user} /><SiteShell /></>;
}

export default function Home() {
  return <Suspense fallback={<main className="grid min-h-screen place-items-center">ThreatLens</main>}><HomeContent /></Suspense>;
}
