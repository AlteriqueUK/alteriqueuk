"use client";

import { useMemo, useRef, useState } from "react";
import { api } from "@/components/admin/api";
import {
  useAdminList,
  customerKeys,
  formatDateTime,
  phoneKey,
  searchCustomers,
  INPUT,
  BTN_SMALL,
  BTN_PRIMARY,
} from "@/components/admin/shared";

/** How many typeahead suggestions to offer under the search box. */
const MAX_SUGGESTIONS = 6;

const EMPTY = { name: "", email: "", phone: "", address: "", comment: "" };

/** What each sortable column is ordered on. */
const SORT_VALUES = {
  phone: (c) => c.phoneKey || phoneKey(c.phone),
  name: (c) => (c.name || "").trim().toLowerCase(),
  email: (c) => (c.email || "").trim().toLowerCase(),
  createdAt: (c) => c.createdAt || "",
};

function compare(a, b, key, direction) {
  const av = SORT_VALUES[key](a);
  const bv = SORT_VALUES[key](b);
  // A missing value sits at the bottom whichever way the column is sorted
  if (!av || !bv) return !av && !bv ? 0 : av ? -1 : 1;
  if (key === "createdAt") return (av < bv ? -1 : av > bv ? 1 : 0) * direction;
  // numeric so a short number sorts before a longer one that starts the same
  return av.localeCompare(bv, "en-GB", { numeric: true }) * direction;
}

export default function CustomersTab({ onUnauthorised }) {
  const { data, setData, error, setError, reload } = useAdminList(
    "/api/admin/customers",
    onUnauthorised
  );
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [merging, setMerging] = useState(false);
  const [notice, setNotice] = useState("");
  // The list opens ordered by phone number
  const [sort, setSort] = useState({ key: "phone", direction: 1 });
  const [query, setQuery] = useState("");
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const searchRef = useRef(null);

  /** Best match first — the order the suggestions are offered in. */
  const matches = useMemo(
    () => searchCustomers(data || [], query),
    [data, query]
  );

  const suggestions = query.trim() ? matches.slice(0, MAX_SUGGESTIONS) : [];

  const rows = useMemo(() => {
    if (!data) return null;
    return [...matches].sort((a, b) => compare(a, b, sort.key, sort.direction));
  }, [data, matches, sort]);

  /** Keys held by more than one record — those records are the same person. */
  const duplicateKeys = useMemo(() => {
    const seen = new Set();
    const duplicates = new Set();
    for (const customer of data || []) {
      for (const key of customerKeys(customer)) {
        if (seen.has(key)) duplicates.add(key);
        seen.add(key);
      }
    }
    return duplicates;
  }, [data]);

  const duplicateCount = useMemo(
    () =>
      (data || []).filter((c) =>
        customerKeys(c).some((key) => duplicateKeys.has(key))
      ).length,
    [data, duplicateKeys]
  );

  /** The record already on file for whatever is typed into the form. */
  const alreadyOnFile = useMemo(() => {
    const keys = customerKeys({ phone: form.phone, email: form.email });
    if (!keys.length) return null;
    return (
      (data || []).find(
        (c) =>
          c._id !== editingId && customerKeys(c).some((key) => keys.includes(key))
      ) || null
    );
  }, [data, form.phone, form.email, editingId]);

  const isDuplicate = (customer) =>
    customerKeys(customer).some((key) => duplicateKeys.has(key));

  // Suggestions can shrink under a highlight that was valid a keystroke ago
  const activeSuggestion = Math.min(highlighted, suggestions.length - 1);
  const showSuggestions = suggestOpen && suggestions.length > 0;

  function search(value) {
    setQuery(value);
    setHighlighted(0);
    setSuggestOpen(true);
  }

  /** Take a suggestion: narrow the list to that one person. */
  function pickSuggestion(customer) {
    setQuery(customer.phone || customer.name || "");
    setSuggestOpen(false);
    searchRef.current?.focus();
  }

  function onSearchKeyDown(e) {
    if (e.key === "Escape") return setSuggestOpen(false);
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSuggestOpen(true);
      setHighlighted((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSuggestOpen(true);
      setHighlighted((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" && showSuggestions) {
      e.preventDefault();
      pickSuggestion(suggestions[activeSuggestion]);
    }
  }

  function toggleSort(key) {
    setSort((current) =>
      current.key === key
        ? { key, direction: -current.direction }
        : { key, direction: 1 }
    );
  }

  function startEdit(customer) {
    setEditingId(customer._id);
    setForm({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
      comment: customer.comment || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      if (editingId) {
        const updated = await api(`/api/admin/customers/${editingId}`, {
          method: "PUT",
          body: form,
        });
        setData((list) => list.map((c) => (c._id === editingId ? updated : c)));
      } else {
        const created = await api("/api/admin/customers", {
          method: "POST",
          body: form,
        });
        setData((list) => [created, ...(list || [])]);
      }
      cancelEdit();
    } catch (err) {
      if (err.unauthorised) return onUnauthorised();
      // Turned away as a duplicate — pull the clashing record into the list so
      // the note under the form can offer to open it
      if (err.status === 409) await reload();
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function mergeDuplicates() {
    if (
      !window.confirm(
        "Merge the records that share a phone number or email? The oldest record is kept, anything missing on it is filled in from the others, and the spare copies are deleted."
      )
    )
      return;
    setMerging(true);
    setNotice("");
    try {
      const { groups, removed } = await api(
        "/api/admin/customers/merge-duplicates",
        { method: "POST" }
      );
      await reload();
      setNotice(
        removed
          ? `Merged ${removed} spare record${removed === 1 ? "" : "s"} into ${groups} customer${groups === 1 ? "" : "s"}.`
          : "No duplicates left to merge."
      );
    } catch (err) {
      if (err.unauthorised) return onUnauthorised();
      setError(err.message);
    } finally {
      setMerging(false);
    }
  }

  async function remove(id) {
    if (!window.confirm("Delete this customer permanently?")) return;
    try {
      await api(`/api/admin/customers/${id}`, { method: "DELETE" });
      setData((list) => list.filter((c) => c._id !== id));
      if (editingId === id) cancelEdit();
    } catch (err) {
      if (err.unauthorised) return onUnauthorised();
      setError(err.message);
    }
  }

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div>
      <form onSubmit={save} className="border border-ink/10 p-5 sm:p-6">
        <h3 className="text-lg font-normal">
          {editingId ? "Edit customer" : "Add customer"}
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            required
            placeholder="Name"
            aria-label="Name"
            value={form.name}
            onChange={set("name")}
            className={INPUT}
          />
          <input
            type="email"
            placeholder="Email"
            aria-label="Email"
            value={form.email}
            onChange={set("email")}
            className={INPUT}
          />
          <input
            placeholder="Phone"
            aria-label="Phone"
            value={form.phone}
            onChange={set("phone")}
            className={INPUT}
          />
          <input
            placeholder="Address"
            aria-label="Address"
            value={form.address}
            onChange={set("address")}
            className={INPUT}
          />
        </div>
        <textarea
          rows={2}
          placeholder="Comment"
          aria-label="Comment"
          value={form.comment}
          onChange={set("comment")}
          className={`${INPUT} mt-3 resize-y`}
        />

        {alreadyOnFile && (
          <p className="mt-3 border border-champagne bg-linen-deep px-3.5 py-2.5 text-sm font-light">
            Already on the list as{" "}
            <span className="font-normal">{alreadyOnFile.name}</span>
            {alreadyOnFile.phone ? ` · ${alreadyOnFile.phone}` : ""}.{" "}
            <button
              type="button"
              onClick={() => startEdit(alreadyOnFile)}
              className="underline decoration-champagne underline-offset-2"
            >
              Open that record
            </button>
          </p>
        )}

        <div className="mt-4 flex gap-2">
          <button type="submit" disabled={saving} className={BTN_PRIMARY}>
            {saving ? "Saving…" : editingId ? "Save changes" : "Add customer"}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className={BTN_SMALL}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      {notice && (
        <p className="mt-4 text-sm font-light text-ambleside">{notice}</p>
      )}

      {duplicateCount > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border border-champagne bg-linen-deep px-4 py-3">
          <p className="text-sm font-light">
            {duplicateCount} records share a phone number or email with another.
          </p>
          <button
            onClick={mergeDuplicates}
            disabled={merging}
            className={BTN_SMALL}
          >
            {merging ? "Merging…" : "Merge duplicates"}
          </button>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="relative w-full sm:max-w-sm">
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => search(e.target.value)}
              onFocus={() => setSuggestOpen(true)}
              onBlur={() => setSuggestOpen(false)}
              onKeyDown={onSearchKeyDown}
              placeholder="Search by name or number"
              aria-label="Search customers"
              autoComplete="off"
              role="combobox"
              aria-expanded={showSuggestions}
              aria-controls="customer-suggestions"
              aria-autocomplete="list"
              aria-activedescendant={
                showSuggestions ? `customer-suggestion-${activeSuggestion}` : undefined
              }
              className={INPUT}
            />
            {showSuggestions && (
              <ul
                id="customer-suggestions"
                role="listbox"
                className="absolute inset-x-0 top-full z-20 max-h-72 overflow-y-auto border border-ink/15 bg-linen"
              >
                {suggestions.map((c, i) => (
                  <li
                    key={c._id}
                    id={`customer-suggestion-${i}`}
                    role="option"
                    aria-selected={i === activeSuggestion}
                  >
                    <button
                      type="button"
                      // Keep focus in the input, or the blur closes this first
                      onMouseDown={(e) => e.preventDefault()}
                      onMouseEnter={() => setHighlighted(i)}
                      onClick={() => pickSuggestion(c)}
                      className={`flex w-full items-baseline justify-between gap-3 px-3.5 py-2.5 text-left text-sm font-light ${
                        i === activeSuggestion ? "bg-linen-deep" : ""
                      }`}
                    >
                      <span className="truncate">{c.name}</span>
                      <span className="shrink-0 text-ink/55">
                        {c.phone || c.email || "—"}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {query.trim() && (
            <p className="text-sm font-light text-ink/55">
              {matches.length} of {data.length}
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSuggestOpen(false);
                }}
                className="ml-3 underline decoration-champagne underline-offset-2"
              >
                Clear
              </button>
            </p>
          )}
        </div>
      )}

      {!rows ? (
        <p className="mt-6 text-sm font-light text-ink/55">Loading…</p>
      ) : !data.length ? (
        <p className="mt-6 text-sm font-light text-ink/55">No customers yet.</p>
      ) : !rows.length ? (
        <p className="mt-6 text-sm font-light text-ink/55">
          No customer matches “{query.trim()}”.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm font-light">
            <thead>
              <tr className="border-b border-ink/15 text-xs uppercase tracking-wide text-ink/50">
                <SortHeader
                  label="Name"
                  sortKey="name"
                  sort={sort}
                  onSort={toggleSort}
                />
                <SortHeader
                  label="Email"
                  sortKey="email"
                  sort={sort}
                  onSort={toggleSort}
                />
                <SortHeader
                  label="Phone"
                  sortKey="phone"
                  sort={sort}
                  onSort={toggleSort}
                />
                <th className="py-2.5 pr-4 font-normal">Address</th>
                <th className="py-2.5 pr-4 font-normal">Comment</th>
                <SortHeader
                  label="Added"
                  sortKey="createdAt"
                  sort={sort}
                  onSort={toggleSort}
                />
                <th className="py-2.5 font-normal" />
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c._id} className="border-b border-ink/5 align-top">
                  <td className="py-3 pr-4">
                    {c.name}
                    {isDuplicate(c) && (
                      <span
                        title="Shares a phone number or email with another record"
                        className="ml-2 whitespace-nowrap border border-champagne px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-ink/55"
                      >
                        duplicate
                      </span>
                    )}
                  </td>
                  <td className="py-3 pr-4 break-all">{c.email || "—"}</td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    {c.phone || "—"}
                  </td>
                  <td className="py-3 pr-4">{c.address || "—"}</td>
                  <td className="py-3 pr-4 whitespace-pre-wrap">
                    {c.comment || "—"}
                  </td>
                  <td className="py-3 pr-4 text-ink/50">
                    {formatDateTime(c.createdAt)}
                  </td>
                  <td className="py-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => startEdit(c)} className={BTN_SMALL}>
                        Edit
                      </button>
                      <button
                        onClick={() => remove(c._id)}
                        className={BTN_SMALL}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SortHeader({ label, sortKey, sort, onSort }) {
  const active = sort.key === sortKey;
  const ascending = sort.direction === 1;
  return (
    <th
      className="py-2.5 pr-4 font-normal"
      aria-sort={active ? (ascending ? "ascending" : "descending") : "none"}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`group flex items-center gap-1 uppercase tracking-wide transition-colors hover:text-ink ${
          active ? "text-ink" : ""
        }`}
      >
        {label}
        <span
          aria-hidden
          className={
            active
              ? "text-ambleside"
              : "opacity-0 transition-opacity group-hover:opacity-40"
          }
        >
          {active && !ascending ? "↓" : "↑"}
        </span>
      </button>
    </th>
  );
}
