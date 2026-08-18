"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PhotoDropzone from "@/components/quote/PhotoDropzone";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const SERVICES = [
  "Alterations",
  "Dry Cleaning",
  "Bridal Alterations",
  "Curtains & Interiors",
  "Leather & Specialist",
  "Something else",
];

const INPUT_CLASSES =
  "w-full border border-ink/15 bg-transparent px-4 py-3.5 text-[15px] font-light placeholder:text-ink/40 focus:border-ambleside focus:outline-none transition-colors";

function FieldLabel({ num, children, hint }) {
  return (
    <p className="mb-4 flex items-baseline gap-3 text-[15px] font-medium tracking-[0.01em]">
      <span className="text-[11px] font-semibold tracking-[0.18em] text-ambleside">
        {num}
      </span>
      {children}
      {hint && (
        <span className="ml-auto text-xs font-normal tracking-[0.04em] text-ink/40">
          {hint}
        </span>
      )}
    </p>
  );
}

export default function QuoteForm() {
  const router = useRouter();
  const [service, setService] = useState("");
  const [photos, setPhotos] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | sending | error
  const [errorMsg, setErrorMsg] = useState("");

  function addPhotos(newPhotos) {
    setPhotos((prev) => [...prev, ...newPhotos]);
  }

  function removePhoto(index) {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const fields = Object.fromEntries(new FormData(form));

    // Honeypot: real users never fill this
    if (fields.company) return;

    if (!service) {
      setErrorMsg("Please choose a service.");
      return;
    }
    if (!fields.phone && !fields.email) {
      setErrorMsg("Please leave a phone number or an email so we can reply.");
      return;
    }
    setErrorMsg("");

    // Backend not deployed yet — hand the enquiry to WhatsApp instead
    if (!siteConfig.apiUrl) {
      const text = encodeURIComponent(
        `Hello alterique — quote request.\n\nService: ${service}\nWork needed: ${fields.description}\nName: ${fields.name}\n\n(Photos to follow in this chat.)`
      );
      window.open(`${siteConfig.whatsapp.href}?text=${text}`, "_blank");
      return;
    }

    setStatus("sending");
    try {
      const payload = new FormData();
      payload.append("service", service);
      payload.append("description", fields.description);
      payload.append("name", fields.name);
      payload.append("phone", fields.phone);
      payload.append("email", fields.email);
      photos.forEach((p) => payload.append("photos", p.file));

      const res = await fetch(`${siteConfig.apiUrl}/api/quote`, {
        method: "POST",
        body: payload,
      });
      if (!res.ok) throw new Error("Request failed");

      photos.forEach((p) => URL.revokeObjectURL(p.url));
      setPhotos([]);
      router.push("/thank-you?type=quote");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full max-w-140">
      {/* 01 — Service */}
      <fieldset className="mb-10">
        <legend className="sr-only">Which service?</legend>
        <FieldLabel num="01">Which service?</FieldLabel>
        <div className="flex flex-wrap gap-2.5">
          {SERVICES.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setService(s)}
              aria-pressed={service === s}
              className={cn(
                "border px-4.5 py-2.75 text-sm transition-colors",
                service === s
                  ? "border-ink bg-ink text-linen"
                  : "border-ink/15 text-ink hover:border-ink"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </fieldset>

      {/* 02 — Describe */}
      <fieldset className="mb-10">
        <legend className="sr-only">Describe the work</legend>
        <FieldLabel num="02">Describe the work</FieldLabel>
        <textarea
          name="description"
          required
          rows={4}
          placeholder="e.g. Wedding dress — take in the bodice, shorten the hem, add a bustle. Ivory silk."
          aria-label="Describe the work"
          className={`${INPUT_CLASSES} resize-y leading-relaxed`}
        />
      </fieldset>

      {/* 03 — Photographs */}
      <fieldset className="mb-10">
        <legend className="sr-only">Add photographs</legend>
        <FieldLabel num="03" hint="up to 6">
          Add photographs
        </FieldLabel>
        <PhotoDropzone photos={photos} onAdd={addPhotos} onRemove={removePhoto} />
      </fieldset>

      {/* 04 — Details */}
      <fieldset className="mb-8">
        <legend className="sr-only">Your details</legend>
        <FieldLabel num="04">Your details</FieldLabel>
        <div className="mb-3 grid gap-3 sm:grid-cols-2">
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
          autoComplete="email"
          placeholder="Email"
          aria-label="Email"
          className={INPUT_CLASSES}
        />
      </fieldset>

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
        className="mt-2 w-full bg-ink px-7 py-4.25 text-[15px] tracking-[0.04em] text-linen transition-opacity hover:opacity-85 disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send request"}
      </button>

      {(errorMsg || status === "error") && (
        <p role="alert" className="mt-4 text-center text-sm text-destructive">
          {errorMsg ||
            `Something went wrong — please try again, or WhatsApp us on ${siteConfig.whatsapp.display}.`}
        </p>
      )}

      <p className="mt-4 text-center text-xs leading-relaxed text-ink/50">
        By sending, you agree to be contacted about your enquiry. See our{" "}
        <Link href="/privacy" className="text-ink underline underline-offset-2">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
