"use client";

import { useState } from "react";
import { api } from "@/components/admin/api";
import { services } from "@/lib/data/services";
import {
  useAdminList,
  INPUT,
  BTN_SMALL,
  BTN_PRIMARY,
} from "@/components/admin/shared";

/**
 * The article body is edited as plain text: lines starting with "## " begin
 * a new section heading, blank lines separate paragraphs.
 */
function bodyToText(body) {
  return (body || [])
    .map(
      (section) =>
        `## ${section.heading}\n\n${(section.paragraphs || []).join("\n\n")}`
    )
    .join("\n\n");
}

function textToBody(text) {
  const sections = [];
  let current = null;
  for (const block of text.split(/\n{2,}/)) {
    const trimmed = block.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("## ")) {
      current = { heading: trimmed.slice(3).trim(), paragraphs: [] };
      sections.push(current);
    } else {
      if (!current) {
        current = { heading: "", paragraphs: [] };
        sections.push(current);
      }
      current.paragraphs.push(trimmed.replace(/\n/g, " "));
    }
  }
  return sections;
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const EMPTY = {
  title: "",
  slug: "",
  category: "",
  date: new Date().toISOString().slice(0, 10),
  readTime: "4 min read",
  excerpt: "",
  imageSrc: "",
  imageLabel: "",
  relatedService: "",
  published: true,
  content: "",
};

function toForm(post) {
  return {
    title: post.title || "",
    slug: post.slug || "",
    category: post.category || "",
    date: post.date || "",
    readTime: post.readTime || "",
    excerpt: post.excerpt || "",
    imageSrc: post.image?.src || "",
    imageLabel: post.image?.label || "",
    relatedService: post.relatedService || "",
    published: post.published !== false,
    content: bodyToText(post.body),
  };
}

function toPayload(form) {
  return {
    title: form.title,
    slug: form.slug || slugify(form.title),
    category: form.category,
    date: form.date,
    readTime: form.readTime,
    excerpt: form.excerpt,
    image: form.imageSrc
      ? { src: form.imageSrc, label: form.imageLabel, tone: "linen" }
      : undefined,
    relatedService: form.relatedService || undefined,
    published: form.published,
    body: textToBody(form.content),
  };
}

export default function JournalTab({ onUnauthorised }) {
  const { data, setData, error, setError, reload } = useAdminList(
    "/api/admin/journal",
    onUnauthorised
  );
  const [editing, setEditing] = useState(null); // null | "new" | post._id
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  function startNew() {
    setEditing("new");
    setForm(EMPTY);
  }

  function startEdit(post) {
    setEditing(post._id);
    setForm(toForm(post));
  }

  function cancel() {
    setEditing(null);
    setForm(EMPTY);
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing === "new") {
        await api("/api/admin/journal", { method: "POST", body: toPayload(form) });
      } else {
        await api(`/api/admin/journal/${editing}`, {
          method: "PUT",
          body: toPayload(form),
        });
      }
      cancel();
      reload();
    } catch (err) {
      if (err.unauthorised) return onUnauthorised();
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(post) {
    try {
      const updated = await api(`/api/admin/journal/${post._id}`, {
        method: "PUT",
        body: { published: !post.published },
      });
      setData((list) => list.map((p) => (p._id === post._id ? updated : p)));
    } catch (err) {
      if (err.unauthorised) return onUnauthorised();
      setError(err.message);
    }
  }

  async function remove(id) {
    if (!window.confirm("Delete this article permanently?")) return;
    try {
      await api(`/api/admin/journal/${id}`, { method: "DELETE" });
      setData((list) => list.filter((p) => p._id !== id));
      if (editing === id) cancel();
    } catch (err) {
      if (err.unauthorised) return onUnauthorised();
      setError(err.message);
    }
  }

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  if (editing !== null) {
    return (
      <form onSubmit={save} className="border border-ink/10 p-5 sm:p-6">
        <h3 className="text-lg font-normal">
          {editing === "new" ? "New article" : "Edit article"}
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            required
            placeholder="Title"
            aria-label="Title"
            value={form.title}
            onChange={set("title")}
            className={`${INPUT} sm:col-span-2`}
          />
          <input
            placeholder="Slug (auto from title if empty)"
            aria-label="Slug"
            value={form.slug}
            onChange={set("slug")}
            className={INPUT}
          />
          <input
            placeholder="Category (e.g. Garment Care)"
            aria-label="Category"
            value={form.category}
            onChange={set("category")}
            className={INPUT}
          />
          <input
            type="date"
            aria-label="Date"
            value={form.date}
            onChange={set("date")}
            className={INPUT}
          />
          <input
            placeholder="Read time (e.g. 4 min read)"
            aria-label="Read time"
            value={form.readTime}
            onChange={set("readTime")}
            className={INPUT}
          />
          <input
            placeholder="Image URL"
            aria-label="Image URL"
            value={form.imageSrc}
            onChange={set("imageSrc")}
            className={INPUT}
          />
          <input
            placeholder="Image description (alt text)"
            aria-label="Image description"
            value={form.imageLabel}
            onChange={set("imageLabel")}
            className={INPUT}
          />
          <select
            value={form.relatedService}
            onChange={set("relatedService")}
            aria-label="Related service"
            className={INPUT}
          >
            <option value="">No related service</option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.title}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm font-light">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            Published (visible on the website)
          </label>
        </div>
        <textarea
          rows={2}
          placeholder="Excerpt — short summary shown on the journal page"
          aria-label="Excerpt"
          value={form.excerpt}
          onChange={set("excerpt")}
          className={`${INPUT} mt-3 resize-y`}
        />
        <textarea
          rows={14}
          placeholder={`Article body. Start a section with "## Heading", separate paragraphs with a blank line:\n\n## The short answer\n\nFirst paragraph…\n\nSecond paragraph…`}
          aria-label="Article body"
          value={form.content}
          onChange={set("content")}
          className={`${INPUT} mt-3 resize-y leading-relaxed`}
        />
        <div className="mt-4 flex gap-2">
          <button type="submit" disabled={saving} className={BTN_PRIMARY}>
            {saving ? "Saving…" : "Save article"}
          </button>
          <button type="button" onClick={cancel} className={BTN_SMALL}>
            Cancel
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      </form>
    );
  }

  return (
    <div>
      <button onClick={startNew} className={BTN_PRIMARY}>
        New article
      </button>
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      {!data ? (
        <p className="mt-6 text-sm font-light text-ink/55">Loading…</p>
      ) : !data.length ? (
        <p className="mt-6 text-sm font-light text-ink/55">No articles yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {data.map((post) => (
            <div
              key={post._id}
              className="flex flex-wrap items-center justify-between gap-3 border border-ink/10 p-4"
            >
              <div className="min-w-0">
                <p className="truncate font-light">
                  {post.title}
                  {!post.published && (
                    <span className="ml-2 text-xs uppercase tracking-wide text-ink/45">
                      hidden
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-xs font-light text-ink/50">
                  /journal/{post.slug} · {post.category || "Uncategorised"} ·{" "}
                  {post.date || "no date"}
                </p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button
                  onClick={() => togglePublished(post)}
                  className={BTN_SMALL}
                >
                  {post.published ? "Hide" : "Publish"}
                </button>
                <button onClick={() => startEdit(post)} className={BTN_SMALL}>
                  Edit
                </button>
                <button onClick={() => remove(post._id)} className={BTN_SMALL}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
