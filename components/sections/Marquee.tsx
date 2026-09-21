import { marqueeItems } from "@/lib/site-data";

/**
 * Infinite value band (§6.4), adapted from the 21st.dev "Marquee" pattern.
 *
 * Two changes from the original React implementation: the scroll is a CSS
 * keyframe rather than a rAF loop, so it never touches the main thread; and
 * the track renders the list twice, which is what lets a single
 * `translateX(-50%)` loop seamlessly.
 *
 * The band is decorative — the same four values are stated as real headings
 * in the Modelo Educativo section — so the whole strip is hidden from
 * assistive tech rather than read out twice.
 */
export function Marquee() {
  // Rendered twice: one visible cycle plus its identical successor.
  const loop = [...marqueeItems, ...marqueeItems];

  return (
    <div
      aria-hidden="true"
      className="marquee relative flex overflow-hidden border-y border-hairline bg-navy-700/20 py-5"
    >
      {/* Edge fades so items dissolve instead of being chopped off. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink-950 to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink-950 to-transparent sm:w-32" />

      <div className="marquee__track">
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex shrink-0 items-center gap-8 px-8 font-display text-[length:var(--text-xl)] tracking-tight text-paper/80"
          >
            {item}
            <span className="text-[0.5em] text-accent-500">&#9670;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
