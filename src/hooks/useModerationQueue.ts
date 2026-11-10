"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { PAGE_SIZE, adminMessage, isUnchanged } from "@/lib/admin";

export type QueueRow = { id: string; status: string };

export type QueueMeta = { limit: number; offset: number; total: number | null };

type Snapshot<T extends QueueRow> = { range: string; offset: number; rows: T[]; meta: QueueMeta };

type Options = {
  /** List endpoint, without a query string. */
  path: string;
  /** Where one decision about one row is written. */
  patchPath: (id: string) => string;
  /** The status bucket the moderator is working through. */
  queue: string;
  /** Free-text search handed to the API. */
  search: string;
};

/**
 * One moderation queue: a page of rows, the real number of rows behind that page, and the decision
 * that moves a row out of it.
 *
 * What is on screen is one snapshot of what the API last answered for one bucket and offset, and
 * `loading` is derived from whether that snapshot still matches what was asked for. Nothing has to
 * be remembered about a request that is on its way, so a response that arrives late is simply not
 * the current snapshot any more.
 *
 * The count comes from the API and is only ever decremented for the bucket the moderator is looking
 * at, because that is the one bucket whose membership just changed. When the API could not read a
 * count at all, `total` stays null and the toolbar says so instead of inventing a number.
 */
export function useModerationQueue<T extends QueueRow>({ path, patchPath, queue, search }: Options) {
  const [snapshot, setSnapshot] = useState<Snapshot<T> | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [pendingID, setPendingID] = useState("");
  const [offset, setOffset] = useState(0);
  const [revision, setRevision] = useState(0);
  const request = useRef(0);

  const range = `${queue}|${search}`;

  // Changing bucket or search means page one. Done while rendering rather than in an effect so the
  // fetch below never runs against the previous bucket's offset.
  const [lastRange, setLastRange] = useState(range);
  if (lastRange !== range) {
    setLastRange(range);
    setOffset(0);
  }

  const current = snapshot !== null && snapshot.range === range && snapshot.offset === offset;
  const loading = !current;
  const rows = current ? snapshot.rows : [];
  const meta = current ? snapshot.meta : { limit: PAGE_SIZE, offset, total: null };

  useEffect(() => {
    const token = ++request.current;
    const query = new URLSearchParams({ status: queue, limit: String(PAGE_SIZE), offset: String(offset) });
    if (search) query.set("q", search);
    void (async () => {
      try {
        const payload = (await api(`${path}?${query.toString()}`, { headers: { "X-Activity": "passive" } })) as
          & { posts?: T[]; reports?: T[] }
          & Partial<QueueMeta>;
        if (request.current !== token) return;
        setSnapshot({
          range,
          offset,
          rows: payload.reports ?? payload.posts ?? [],
          meta: { limit: payload.limit ?? PAGE_SIZE, offset: payload.offset ?? offset, total: payload.total ?? null },
        });
        setErrorMessage("");
      } catch (failure) {
        if (request.current !== token) return;
        setSnapshot(null);
        setErrorMessage(adminMessage(failure instanceof Error ? failure.message : null));
      }
    })();
  }, [path, queue, search, offset, revision, range]);

  /** Re-reads the current page. The effect above keys on `revision`, so bumping it is the reload. */
  const reload = useCallback(() => setRevision((current) => current + 1), []);

  /** Writes one decision and keeps the list honest about what it just did. */
  const decide = useCallback(
    async (row: T, to: string) => {
      setPendingID(row.id);
      setErrorMessage("");
      try {
        const payload = await api(patchPath(row.id), { method: "PATCH", body: JSON.stringify({ status: to }) });
        setSnapshot((latest) => {
          if (!latest) return latest;
          // In the "all" bucket the row keeps its place and wears its new status; anywhere else it
          // has left the queue the moderator is reading and comes off the list.
          const rows =
            queue === "all"
              ? latest.rows.map((item) => (item.id === row.id ? { ...item, status: to } : item))
              : latest.rows.filter((item) => item.id !== row.id);
          // Only the bucket the row came from loses one item, and only when it really moved.
          const dropped = queue !== "all" && queue === row.status && !isUnchanged(payload);
          const total = dropped && latest.meta.total !== null ? Math.max(0, latest.meta.total - 1) : latest.meta.total;
          return { ...latest, rows, meta: { ...latest.meta, total } };
        });
        return true;
      } catch (failure) {
        setErrorMessage(adminMessage(failure instanceof Error ? failure.message : null));
        return false;
      } finally {
        setPendingID("");
      }
    },
    [patchPath, queue],
  );

  const limit = meta.limit > 0 ? meta.limit : PAGE_SIZE;
  const page = Math.floor(meta.offset / limit) + 1;
  const lastPage = meta.total === null || meta.total === 0 ? 1 : Math.ceil(meta.total / limit);

  return {
    rows,
    meta,
    loading,
    errorMessage,
    pendingID,
    page,
    lastPage,
    decide,
    reload,
    previousPage: () => setOffset((value) => Math.max(0, value - PAGE_SIZE)),
    nextPage: () => setOffset((value) => value + PAGE_SIZE),
  };
}
