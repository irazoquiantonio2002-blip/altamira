import { marqueeItems } from "@/lib/site-data";

/**
 * Infinite value band. The scroll is a CSS keyframe rather than a rAF loop,
 * so it never touches the main thread, and the track renders the item list
 * twice, which is what lets a single `translateX(-50%)` loop seamlessly.
 *
 * Decorative: the same four values are stated as real headings on the
 * Nosotros page, so the strip is hidden from assistive tech.
 */
export function Marquee() {
  const loop = [...marqueeItems, ...marqueeItems];

  return (
    <div
      aria-hidden="true"
      className="marquee relative flex overflow-hidden border-y border-rule bg-paper-50 py-6"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-paper-50 to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-paper-50 to-transparent sm:w-28" />

      <div className="marquee__track">
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex shrink-0 items-center gap-10 px-10 font-display text-[length:var(--text-xl)] text-navy-700"
          >
            {item}
            <span className="size-[5px] shrink-0 bg-accent-600" />
          </span>
        ))}
      </div>
    </div>
  );
}
