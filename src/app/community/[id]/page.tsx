import { Suspense } from "react";
import { redirect } from "next/navigation";
import { CommunityShell } from "@/components/community/CommunityShell";
import { IdleSessionMonitor } from "@/components/auth/IdleSessionMonitor";
import { PostThread } from "@/components/community/PostThread";
import { createClient } from "@/lib/supabase/server";

type ProfileMetadata = { avatar_url?: string; picture?: string; full_name?: string; name?: string };

const POST_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/**
 * One story and its comments, at /community/[id].
 *
 * The address is a post id rather than a slug because a story is about an experience, not a name:
 * the number it discusses is inside the post and links out to its own page. An id that is not a
 * uuid never reaches the API — the store would answer "not found" for it anyway, and a typo in the
 * address bar is better sent back to the board than given a request.
 */
async function CommunityPostContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!POST_ID.test(id)) redirect("/community/latest");
  const { data: { user } } = await (await createClient()).auth.getUser();
  const metadata = (user?.user_metadata ?? {}) as ProfileMetadata;
  return (
    <>
      <IdleSessionMonitor />
      <CommunityShell
        account={{ email: user?.email ?? undefined, avatarUrl: metadata.avatar_url ?? metadata.picture ?? null, name: metadata.full_name ?? metadata.name ?? null }}
      >
        <PostThread postID={id} />
      </CommunityShell>
    </>
  );
}

// The params promise is awaited inside the Suspense boundary: with Cache Components on, reading
// them in the page body would block prerendering of the whole route.
export default function CommunityPostPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center bg-pos-shell font-pos-ui text-[13px] text-pos-muted">ThreatLens</main>}>
      <CommunityPostContent params={params} />
    </Suspense>
  );
}
