"use client";

import { useState } from "react";
import { api } from "@/components/admin/api";
import {
  useAdminList,
  formatDateTime,
  INPUT,
  BTN_SMALL,
  BTN_PRIMARY,
} from "@/components/admin/shared";

const EMPTY = { name: "", email: "", phone: "", address: "", comment: "" };

export default function CustomersTab({ onUnauthorised }) {
  const { data, setData, error, setError } = useAdminList(
    "/api/admin/customers",
    onUnauthorised
  );
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

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
    try {
      if (editingId) {
        const updated = await api(`/api/admin/customers/${editingId}`, {
          method: "PUT",
          body: form,
        });
        setData((list) =>
          list.map((c) => (c._id === editingId ? updated : c))
        );
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
      setError(err.message);
    } finally {
      setSaving(false);
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

      {!data ? (
        <p className="mt-6 text-sm font-light text-ink/55">Loading…</p>
      ) : !data.length ? (
        <p className="mt-6 text-sm font-light text-ink/55">No customers yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm font-light">
            <thead>
              <tr className="border-b border-ink/15 text-xs uppercase tracking-wide text-ink/50">
                <th className="py-2.5 pr-4 font-normal">Name</th>
                <th className="py-2.5 pr-4 font-normal">Email</th>
                <th className="py-2.5 pr-4 font-normal">Phone</th>
                <th className="py-2.5 pr-4 font-normal">Address</th>
                <th className="py-2.5 pr-4 font-normal">Comment</th>
                <th className="py-2.5 pr-4 font-normal">Added</th>
                <th className="py-2.5 font-normal" />
              </tr>
            </thead>
            <tbody>
              {data.map((c) => (
                <tr key={c._id} className="border-b border-ink/5 align-top">
                  <td className="py-3 pr-4">{c.name}</td>
                  <td className="py-3 pr-4 break-all">{c.email || "—"}</td>
                  <td className="py-3 pr-4">{c.phone || "—"}</td>
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
                      <button onClick={() => remove(c._id)} className={BTN_SMALL}>
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
