"use client";

import { api } from "@/components/admin/api";
import {
  useAdminList,
  formatDateTime,
  BTN_SMALL,
} from "@/components/admin/shared";

export default function MessagesTab({ onUnauthorised }) {
  const { data, setData, error, setError } = useAdminList(
    "/api/admin/messages",
    onUnauthorised
  );

  async function remove(id) {
    if (!window.confirm("Delete this message permanently?")) return;
    try {
      await api(`/api/admin/messages/${id}`, { method: "DELETE" });
      setData((list) => list.filter((m) => m._id !== id));
    } catch (err) {
      if (err.unauthorised) return onUnauthorised();
      setError(err.message);
    }
  }

  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (!data) return <p className="text-sm font-light text-ink/55">Loading…</p>;
  if (!data.length)
    return <p className="text-sm font-light text-ink/55">No messages yet.</p>;

  return (
    <div className="space-y-5">
      {data.map((msg) => (
        <article key={msg._id} className="border border-ink/10 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-light text-ink/50">
                {formatDateTime(msg.createdAt)}
              </p>
              <h3 className="mt-1 text-lg font-normal">{msg.name}</h3>
            </div>
            <button onClick={() => remove(msg._id)} className={BTN_SMALL}>
              Delete
            </button>
          </div>
          <p className="mt-2 text-sm font-light text-ink/60">
            <a
              href={`mailto:${msg.email}`}
              className="underline decoration-champagne underline-offset-2"
            >
              {msg.email}
            </a>
            {msg.phone ? ` · ${msg.phone}` : ""}
          </p>
          <p className="mt-3 whitespace-pre-wrap text-sm font-light leading-relaxed text-ink/75">
            {msg.message}
          </p>
        </article>
      ))}
    </div>
  );
}
