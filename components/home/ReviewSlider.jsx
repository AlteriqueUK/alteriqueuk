"use client";

import { useEffect, useState } from "react";

/** How long each review holds before the next one slides in. */
const HOLD_MS = 4500;

/**
 * Reviews, one at a time, moving along on their own — no arrows to press.
 * It waits while someone is reading (pointer over it or a dot focused) and
 * stays still altogether for anyone who has asked for reduced motion; the
 * dots underneath then remain as the way through.
 */
export default function ReviewSlider({ reviews }) {
  const count = reviews.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [stillness, setStillness] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setStillness(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (paused || stillness || count < 2) return;
    const timer = setInterval(
      () => setIndex((current) => (current + 1) % count),
      HOLD_MS
    );
    return () => clearInterval(timer);
  }, [paused, stillness, count]);

  if (!count) return null;

  return (
    <div
      className="mt-14"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        className="overflow-hidden"
        aria-roledescription="carousel"
        aria-label="What customers say"
      >
        <div
          className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {reviews.map((review, i) => (
            <figure
              key={review.name}
              className="w-full shrink-0 px-2 text-center sm:px-10"
              aria-hidden={i !== index}
            >
              <p
                role="img"
                aria-label="Five stars"
                className="text-sm tracking-[0.3em] text-champagne"
              >
                ★★★★★
              </p>
              <blockquote className="mx-auto mt-6 max-w-3xl text-xl font-light leading-relaxed text-ink/85 sm:text-2xl sm:leading-[1.6]">
                &ldquo;{review.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 text-[13px] tracking-[0.06em] text-ink/55">
                {review.name} · {review.source}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {count > 1 && (
        <div className="mt-10 flex justify-center">
          {reviews.map((review, i) => (
            <button
              key={review.name}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show review ${i + 1} of ${count}`}
              aria-current={i === index}
              className="group p-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ambleside"
            >
              <span
                className={`block size-1.5 rounded-full transition-colors ${
                  i === index
                    ? "bg-ambleside"
                    : "bg-ink/20 group-hover:bg-ink/45"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
