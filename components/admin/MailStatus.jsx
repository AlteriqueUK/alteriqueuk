"use client";

import { useEffect, useState } from "react";
import { api } from "@/components/admin/api";
import { formatDateTime, BTN_SMALL } from "@/components/admin/shared";

/**
 * Whether a quote request actually reaches the inbox, and a button to prove
 * it. Email used to fail silently — nothing configured meant nothing sent
 * and nothing said, so the first anyone knew was a missing enquiry.
 */
export default function MailStatus({ onUnauthorised }) {
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    let live = true;
    api("/api/admin/mail")
      .then((data) => live && setStatus(data))
      .catch((err) => {
        if (err.unauthorised) return onUnauthorised();
        // An older API without this endpoint — say nothing rather than alarm
        if (live) setStatus({ unavailable: true });
      });
    return () => {
      live = false;
    };
  }, [onUnauthorised]);

  async function sendTest() {
    setSending(true);
    setResult(null);
    try {
      const { to } = await api("/api/admin/mail/test", { method: "POST" });
      setResult({
        ok: true,
        message: `Test email sent to ${to} — check the inbox, and the spam folder if it isn't there.`,
      });
      setStatus(await api("/api/admin/mail"));
    } catch (err) {
      if (err.unauthorised) return onUnauthorised();
      setResult({ ok: false, message: err.message });
    } finally {
      setSending(false);
    }
  }

  if (!status || status.unavailable) return null;

  const on = status.configured;

  return (
    <div
      className={`mb-6 border px-4 py-3 ${
        on ? "border-ink/10" : "border-champagne bg-linen-deep"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-light">
          {on ? (
            <>
              Quote notifications go to{" "}
              <span className="font-normal">{status.notify}</span>
              {status.provider && (
                <span className="text-ink/50"> via {status.provider}</span>
              )}
            </>
          ) : (
            <>Email is off — quote requests are saved here, but not emailed.</>
          )}
          {status.lastSentAt && (
            <span className="text-ink/50">
              {" "}
              · last sent {formatDateTime(status.lastSentAt)}
            </span>
          )}
        </p>
        <button onClick={sendTest} disabled={sending} className={BTN_SMALL}>
          {sending ? "Sending…" : "Send test email"}
        </button>
      </div>

      {!on && status.problem && (
        <p className="mt-2 text-xs font-light text-ink/60">{status.problem}</p>
      )}

      {on && status.lastError && !result && (
        <p className="mt-2 text-xs text-destructive">
          Last problem: {status.lastError}
        </p>
      )}

      {result && (
        <p
          className={`mt-2 text-xs ${
            result.ok ? "text-ambleside" : "text-destructive"
          }`}
        >
          {result.message}
        </p>
      )}
    </div>
  );
}
