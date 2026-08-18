"use client";

import { api } from "@/components/admin/api";
import {
  useAdminList,
  formatDateTime,
  BTN_SMALL,
} from "@/components/admin/shared";

const STATUSES = ["new", "quoted", "accepted", "closed"];

export default function QuotesTab({ onUnauthorised }) {
  const { data, setData, error, setError } = useAdminList(
    "/api/admin/quotes",
    onUnauthorised
  );

  async function updateStatus(id, status) {
    try {
      await api(`/api/admin/quotes/${id}`, { method: "PATCH", body: { status } });
      setData((list) => list.map((q) => (q._id === id ? { ...q, status } : q)));
    } catch (err) {
      if (err.unauthorised) return onUnauthorised();
      setError(err.message);
    }
  }

  async function remove(id) {
    if (!window.confirm("Delete this quotation permanently?")) return;
    try {
      await api(`/api/admin/quotes/${id}`, { method: "DELETE" });
      setData((list) => list.filter((q) => q._id !== id));
    } catch (err) {
      if (err.unauthorised) return onUnauthorised();
      setError(err.message);
    }
  }

  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (!data) return <p className="text-sm font-light text-ink/55">Loading…</p>;
  if (!data.length)
    return <p className="text-sm font-light text-ink/55">No quotations yet.</p>;

  return (
    <div className="space-y-5">
      {data.map((quote) => (
        <article key={quote._id} className="border border-ink/10 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-light text-ink/50">
                {formatDateTime(quote.createdAt)}
              </p>
              <h3 className="mt-1 text-lg font-normal">{quote.service}</h3>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={quote.status}
                onChange={(e) => updateStatus(quote._id, e.target.value)}
                className="border border-ink/15 bg-transparent px-2.5 py-1.5 text-xs font-light focus:border-ambleside focus:outline-none"
                aria-label="Quotation status"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button onClick={() => remove(quote._id)} className={BTN_SMALL}>
                Delete
              </button>
            </div>
          </div>

          <dl className="mt-4 grid gap-x-8 gap-y-1.5 text-sm font-light sm:grid-cols-3">
            <div>
              <dt className="inline text-ink/50">Name: </dt>
              <dd className="inline">{quote.name}</dd>
            </div>
            <div>
              <dt className="inline text-ink/50">Phone: </dt>
              <dd className="inline">{quote.phone || "—"}</dd>
            </div>
            <div>
              <dt className="inline text-ink/50">Email: </dt>
              <dd className="inline break-all">{quote.email || "—"}</dd>
            </div>
          </dl>

          <p className="mt-3 whitespace-pre-wrap text-sm font-light leading-relaxed text-ink/75">
            {quote.description}
          </p>

          {quote.photoUrls?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {quote.photoUrls.map((url, i) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                  title={`Open photo ${i + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Uploaded photo ${i + 1}`}
                    className="h-20 w-20 border border-ink/10 object-cover"
                  />
                </a>
              ))}
            </div>
          )}
          {quote.photoKeys?.length > 0 && !quote.photoUrls?.length && (
            <p className="mt-3 text-xs font-light text-ink/50">
              {quote.photoKeys.length} photo(s) uploaded — photo storage not
              configured, links unavailable.
            </p>
          )}
        </article>
      ))}
    </div>
  );
}
