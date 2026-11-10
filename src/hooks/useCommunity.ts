"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { communityMessage, withLocalVote, type CommunityPost, type DangerousNumber } from "@/lib/community";

export type CommunityTab = "new" | "top" | "dangerous";

const PAGE_SIZE = 20;

type FeedResponse = { posts?: CommunityPost[]; numbers?: DangerousNumber[] };

/**
 * The community board's data: one tab at a time, optionally narrowed to a single number, paged,
 * with votes applied locally the moment they are clicked. A vote only re-sorts "Terpopuler" on the
 * next load, because re-sorting under somebody's cursor while they read makes a feed impossible to
 * follow.
 */
export function useCommunity(tab: CommunityTab, number = "") {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [numbers, setNumbers] = useState<DangerousNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const offset = useRef(0);

  const load = useCallback(async (which: CommunityTab, append: boolean, onlyNumber: string) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    setErrorMessage("");
    const from = append ? offset.current : 0;
    try {
      if (which === "dangerous") {
        const data = (await api(`/api/v1/community/dangerous-numbers?limit=${PAGE_SIZE}&offset=${from}`)) as FeedResponse;
        const rows = data.numbers ?? [];
        setNumbers((current) => (append ? [...current, ...rows] : rows));
        offset.current = from + rows.length;
        setHasMore(rows.length === PAGE_SIZE);
        return;
      }
      const filter = onlyNumber ? `&number=${encodeURIComponent(onlyNumber)}` : "";
      const data = (await api(`/api/v1/community/posts?sort=${which}&limit=${PAGE_SIZE}&offset=${from}${filter}`)) as FeedResponse;
      const rows = data.posts ?? [];
      setPosts((current) => (append ? [...current, ...rows] : rows));
      offset.current = from + rows.length;
      setHasMore(rows.length === PAGE_SIZE);
    } catch (failure) {
      setErrorMessage(communityMessage(failure instanceof Error ? failure.message : null));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    // A timer, like the scanner's poll: switching tabs has to show a spinner, and a setState that
    // runs synchronously inside the effect body is the cascading render React asks us to avoid.
    const timer = setTimeout(() => void load(tab, false, number), 0);
    return () => clearTimeout(timer);
  }, [load, tab, number]);

  const loadMore = useCallback(() => void load(tab, true, number), [load, tab, number]);

  // Refresh after a post or comment lands: the counters that answer "how many stories, how many
  // votes, what time" belong to the database, and this page must show those, not its own guess.
  const refresh = useCallback(() => void load(tab, false, number), [load, tab, number]);

  const vote = useCallback(async (postID: string, value: number) => {
    // The array before the click, kept in a plain const: an optimistic guess has to be undone
    // exactly, and reading it back through a ref the updater filled in would depend on when React
    // happens to run that updater.
    const snapshot = posts;
    setPosts(snapshot.map((post) => (post.id === postID ? withLocalVote(post, value) : post)));
    try {
      const result = (await api(`/api/v1/community/posts/${postID}/vote`, { method: "POST", body: JSON.stringify({ value }) })) as {
        up_count: number;
        down_count: number;
        my_vote: number;
      };
      setPosts((current) =>
        current.map((post) =>
          post.id === postID
            ? { ...post, up_count: result.up_count, down_count: result.down_count, score: result.up_count - result.down_count, my_vote: result.my_vote }
            : post,
        ),
      );
    } catch (failure) {
      setPosts(snapshot);
      setErrorMessage(communityMessage(failure instanceof Error ? failure.message : null));
    }
  }, [posts]);

  // Deleting is the one write that makes a row disappear, so the feed drops it in place instead of
  // refetching: a refetch jumps the page back to the top while somebody is reading. The paging
  // cursor moves with the row, or the next page would skip the story that slid into its place.
  const remove = useCallback(async (postID: string) => {
    const snapshot = posts;
    setPosts(snapshot.filter((post) => post.id !== postID));
    try {
      await api(`/api/v1/community/posts/${postID}`, { method: "DELETE" });
      offset.current = Math.max(0, offset.current - 1);
      return true;
    } catch (failure) {
      setPosts(snapshot);
      setErrorMessage(communityMessage(failure instanceof Error ? failure.message : null));
      return false;
    }
  }, [posts]);

  return { posts, numbers, loading, loadingMore, hasMore, errorMessage, loadMore, refresh, vote, remove };
}
