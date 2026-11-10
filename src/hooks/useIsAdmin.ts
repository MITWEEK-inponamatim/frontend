"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { createClient } from "@/lib/supabase/client";

/**
 * What an account is allowed to do, as the API reports it: "admin", "user", or null while the answer
 * is still on its way. `null` exists so a navigation link can appear one frame after paint instead of
 * flickering in for admins only, and so the desk can tell "not a moderator" from "not yet known".
 */
export function useAdminRole() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    let settled = true;
    void (async () => {
      // Asking without a session would only produce a 401 on every page view of a signed-out visit.
      const { data } = await createClient().auth.getSession();
      if (!data.session) {
        if (settled) setRole("user");
        return;
      }
      try {
        const payload = (await api("/api/v1/admin/me", { headers: { "X-Activity": "passive" } })) as {
          role?: string;
        };
        if (settled) setRole(payload.role ?? "user");
      } catch {
        if (settled) setRole("user");
      }
    })();
    return () => {
      settled = false;
    };
  }, []);

  return role;
}

/** The one question the navigation asks: is this account a moderator. Anyone else gets `false`. */
export function useIsAdmin() {
  return useAdminRole() === "admin";
}
