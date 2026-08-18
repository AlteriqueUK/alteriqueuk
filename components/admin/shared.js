"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/components/admin/api";

export const INPUT =
  "w-full border border-ink/15 bg-transparent px-3.5 py-2.5 text-sm font-light placeholder:text-ink/40 focus:border-ambleside focus:outline-none transition-colors";

export const BTN_SMALL =
  "border border-ink/20 px-3.5 py-1.5 text-xs font-light transition-colors hover:border-ink disabled:opacity-50";

export const BTN_PRIMARY =
  "bg-ink px-5 py-2.5 text-xs tracking-[0.04em] text-linen transition-opacity hover:opacity-85 disabled:opacity-50";

export function formatDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Loads a list from the admin API, with reload + optimistic local updates. */
export function useAdminList(path, onUnauthorised) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setError("");
    try {
      setData(await api(path));
    } catch (err) {
      if (err.unauthorised) return onUnauthorised();
      setError(err.message);
    }
  }, [path, onUnauthorised]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, setData, error, setError, reload };
}
