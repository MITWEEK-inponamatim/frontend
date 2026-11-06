// Where a `next=` parameter is allowed to send a signed-in user. Both the proxy and the OAuth
// callback read this value from the query string, so they share one rule instead of two that can
// drift apart. Anything else falls back to /recognize.
const UUID = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
const PHONE_PAGE = /^\/recognize\/phone\/[0-9]{8,20}$/;
const COMMUNITY_POST = new RegExp(`^/community/${UUID}$`);
const COMMUNITY_TAB = /^\/community\/(latest|popular|phone)$/;
// One finished check of a link or an APK, addressed by its scan id: that is what the history list
// links to, so a round trip through the login page has to keep it.
const SCAN_RESULT = new RegExp(`^/recognize/(url|apk)/${UUID}$`);
const ALLOWED = ["/", "/recognize", "/history", "/community"];

const SCAN_ID = new RegExp(`^${UUID}$`);

// A scan id is the only thing allowed to address a result page, so a typo in the address bar goes
// back to the scanner instead of spending a request on the API.
export function isScanId(value: string) {
  return SCAN_ID.test(value);
}

// The address a finished check lives at. A phone check has none: its verdict is filed under the
// number, not the scan, so a phone row in the history list stays where it is.
export function scanResultPath(type: string, id: string) {
  if (type === "url") return `/recognize/url/${id}`;
  if (type === "application") return `/recognize/apk/${id}`;
  return null;
}

export function safeNext(path: string | null | undefined) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return "/recognize";
  // A number page keeps its own address through the login round-trip: it is a search result
  // somebody may have linked, and dropping it to /recognize would lose the question. A community
  // story is the same kind of link — somebody else's sentence about one number — and so is a tab,
  // which is now an address of its own.
  return ALLOWED.includes(path) || PHONE_PAGE.test(path) || COMMUNITY_POST.test(path) || COMMUNITY_TAB.test(path) || SCAN_RESULT.test(path) ? path : "/recognize";
}
