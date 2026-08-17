/**
 * Quiet credentials band (brief §16, marked TBC). Deliberately logo-free
 * until the client confirms which brand relationships can be named.
 */
export default function TrustedBy() {
  return (
    <section className="border-y border-ink/10">
      <div className="container-site flex flex-col items-center gap-4 py-12 text-center sm:py-14">
        <div className="hairline" />
        <p className="max-w-xl text-lg font-light leading-relaxed text-ink/75 sm:text-xl">
          Trusted by leading brands and private clients with their most
          treasured pieces.
        </p>
      </div>
    </section>
  );
}
