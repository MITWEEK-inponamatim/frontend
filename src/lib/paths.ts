// Where a `next=` parameter is allowed to send a signed-in user. Both the proxy and the OAuth
// callback read this value from the query string, so they share one rule instead of two that can
// drift apart. Anything else falls back to /recognize.
const PHONE_PAGE = /^\/recognize\/phone\/[0-9]{8,20}$/;
const COMMUNITY_POST = /^\/community\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const COMMUNITY_TAB = /^\/community\/(latest|popular|phone)$/;
const ALLOWED = ["/", "/recognize", "/history", "/community"];

export function safeNext(path: string | null | undefined) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return "/recognize";
  // A number page keeps its own address through the login round-trip: it is a search result
  // somebody may have linked, and dropping it to /recognize would lose the question. A community
  // story is the same kind of link — somebody else's sentence about one number — and so is a tab,
  // which is now an address of its own.
  return ALLOWED.includes(path) || PHONE_PAGE.test(path) || COMMUNITY_POST.test(path) || COMMUNITY_TAB.test(path) ? path : "/recognize";
}
