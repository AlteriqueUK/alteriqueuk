"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { api, getToken, setToken, clearToken } from "@/components/admin/api";
import QuotesTab from "@/components/admin/QuotesTab";
import MessagesTab from "@/components/admin/MessagesTab";
import JournalTab from "@/components/admin/JournalTab";
import CustomersTab from "@/components/admin/CustomersTab";

const TABS = [
  { id: "quotes", label: "Quotations" },
  { id: "messages", label: "Messages" },
  { id: "journal", label: "Journal" },
  { id: "customers", label: "Customers" },
];

const INPUT_CLASSES =
  "w-full border border-ink/15 bg-transparent px-4 py-3.5 text-[15px] font-light placeholder:text-ink/40 focus:border-ambleside focus:outline-none transition-colors";

export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [tab, setTab] = useState("quotes");

  useEffect(() => {
    setAuthed(!!getToken());
    setChecked(true);
  }, []);

  function handleLogout() {
    clearToken();
    setAuthed(false);
  }

  if (!checked) return null;

  if (!siteConfig.apiUrl) {
    return (
      <div className="container-site py-20">
        <p className="text-lg font-light">
          The admin panel needs the backend API. Set{" "}
          <code className="text-sm">NEXT_PUBLIC_API_URL</code> and redeploy.
        </p>
      </div>
    );
  }

  if (!authed) {
    return <LoginForm onSuccess={() => setAuthed(true)} />;
  }

  return (
    <div className="container-site py-10 sm:py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="display mt-2 text-3xl sm:text-4xl">Workroom panel</h1>
        </div>
        <button
          onClick={handleLogout}
          className="border border-ink/20 px-5 py-2.5 text-sm font-light transition-colors hover:border-ink"
        >
          Sign out
        </button>
      </div>

      <div className="mt-10 flex flex-wrap gap-2 border-b border-ink/10 pb-px">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm transition-colors ${
              tab === t.id
                ? "border-b-2 border-ambleside font-normal text-ink"
                : "font-light text-ink/55 hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "quotes" && <QuotesTab onUnauthorised={handleLogout} />}
        {tab === "messages" && <MessagesTab onUnauthorised={handleLogout} />}
        {tab === "journal" && <JournalTab onUnauthorised={handleLogout} />}
        {tab === "customers" && <CustomersTab onUnauthorised={handleLogout} />}
      </div>
    </div>
  );
}

function LoginForm({ onSuccess }) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setStatus("sending");
    setError("");
    try {
      const { token } = await api("/api/admin/login", {
        method: "POST",
        body: { email: data.email, password: data.password },
      });
      setToken(token);
      onSuccess();
    } catch (err) {
      setStatus("idle");
      setError(err.message);
    }
  }

  return (
    <div className="container-site flex justify-center py-20">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <p className="eyebrow">Admin</p>
        <h1 className="display text-3xl">Sign in</h1>
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          placeholder="Email"
          aria-label="Email"
          className={INPUT_CLASSES}
        />
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="Password"
          aria-label="Password"
          className={INPUT_CLASSES}
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full bg-ink px-7 py-4 text-sm tracking-[0.04em] text-linen transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          {status === "sending" ? "Signing in…" : "Sign in"}
        </button>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
