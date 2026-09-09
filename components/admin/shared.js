"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/components/admin/api";

export const INPUT =
  "w-full border border-ink/15 bg-transparent px-3.5 py-2.5 text-sm font-light placeholder:text-ink/40 focus:border-ambleside focus:outline-none transition-colors";

export const BTN_SMALL =
  "border border-ink/20 px-3.5 py-1.5 text-xs font-light transition-colors hover:border-ink disabled:opacity-50";

export const BTN_PRIMARY =
  "bg-ink px-5 py-2.5 text-xs tracking-[0.04em] text-linen transition-opacity hover:opacity-85 disabled:opacity-50";

/**
 * Canonical form of a phone number — mirrors server/utils/phone.js so the
 * panel can sort the list and spot duplicates without a round trip.
 * "+44 7887 255558" and "07887 255558" both give "7887255558".
 */
export function phoneKey(phone) {
  let digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("44") && digits.length > 10) digits = digits.slice(2);
  return digits.replace(/^0+/, "");
}

/** What two customer records are considered the same person on. */
export function customerKeys(customer) {
  const keys = [];
  const phone = customer.phoneKey || phoneKey(customer.phone);
  const email = String(customer.email || "").trim().toLowerCase();
  if (phone) keys.push(`p:${phone}`);
  if (email) keys.push(`e:${email}`);
  return keys;
}

/**
 * Every way the digits in a search could be meant. A half-typed number can't
 * be normalised the way a whole one can — "+44 778" is the start of
 * "07780 …" — so each reading is tried and the best match wins.
 */
function phoneQueries(text) {
  const typed = text.replace(/\D/g, "");
  if (!typed) return [];
  const variants = new Set([typed]);
  const withoutIdd = typed.startsWith("00") ? typed.slice(2) : typed;
  variants.add(withoutIdd);
  if (withoutIdd.startsWith("44")) variants.add(withoutIdd.slice(2));
  variants.add(withoutIdd.replace(/^0+/, ""));
  variants.delete("");
  return [...variants];
}

/**
 * How well one customer answers a search. Higher wins; 0 means no match.
 * Typing digits searches the phone number, so "0778" finds "+44 7780 …" just
 * as well as "07780 …"; typing letters searches the name, then the email.
 */
function matchScore(customer, text, digitQueries) {
  const name = (customer.name || "").toLowerCase();
  const email = (customer.email || "").toLowerCase();
  const phone = customer.phoneKey || phoneKey(customer.phone);

  if (phone) {
    if (digitQueries.some((digits) => phone.startsWith(digits))) return 100;
    if (digitQueries.some((digits) => phone.includes(digits))) return 60;
  }
  if (!name && !email) return 0;
  if (name.startsWith(text)) return 90;
  if (name.split(/\s+/).some((word) => word.startsWith(text))) return 80;
  if (name.includes(text)) return 50;
  if (email.startsWith(text)) return 40;
  if (email.includes(text)) return 30;
  return 0;
}

/** Customers answering a search, best match first. An empty search matches all. */
export function searchCustomers(customers, query) {
  const text = query.trim().toLowerCase();
  if (!text) return customers;
  const digits = phoneQueries(text);

  return customers
    .map((customer) => ({ customer, score: matchScore(customer, text, digits) }))
    .filter((hit) => hit.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        (a.customer.name || "").localeCompare(b.customer.name || "", "en-GB")
    )
    .map((hit) => hit.customer);
}

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
