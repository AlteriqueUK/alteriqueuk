"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/lib/site-config";

const INPUT_CLASSES =
  "w-full border border-ink/15 bg-transparent px-4 py-3.5 text-[15px] font-light placeholder:text-ink/40 focus:border-ambleside focus:outline-none transition-colors";

export default function ContactForm() {
  const router = useRouter();
  const [status, setStatus] = useState("idle"); // idle | sending | error

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    // Honeypot: real users never fill this
    if (data.company) return;

    if (!siteConfig.apiUrl) {
      // Backend not deployed yet — fall back to the visitor's email client
      const body = encodeURIComponent(
        `Name: ${data.name}\nPhone: ${data.phone}\n\n${data.message}`
      );
      window.open(
        `${siteConfig.email.href}?subject=Website enquiry&body=${body}`,
        "_self"
      );
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(`${siteConfig.apiUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      form.reset();
      router.push("/thank-you?type=message");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          name="name"
          required
          autoComplete="name"
          placeholder="Full name"
          aria-label="Full name"
          className={INPUT_CLASSES}
        />
        <input
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="Phone"
          aria-label="Phone"
          className={INPUT_CLASSES}
        />
      </div>
      <input
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="Email"
        aria-label="Email"
        className={INPUT_CLASSES}
      />
      <textarea
        name="message"
        required
        rows={5}
        placeholder="How can we help?"
        aria-label="Message"
        className={`${INPUT_CLASSES} resize-y leading-relaxed`}
      />
      {/* Honeypot — hidden from real users */}
      <input
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-ink px-7 py-4 text-sm tracking-[0.04em] text-linen transition-opacity hover:opacity-85 disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      {status === "error" && (
        <p role="alert" className="text-sm text-destructive">
          Something went wrong — please try again, or call us on{" "}
          {siteConfig.phone.display}.
        </p>
      )}
    </form>
  );
}
