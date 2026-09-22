"use client";

import Link from "next/link";
import { useMemo, useRef } from "react";
import { motion, useInView } from "motion/react";
import { useIsMobile, useReducedMotion } from "@/lib/useMotionPrefs";

/**
 * BackgroundPaths — the 21st.dev line field, in white, denser, and without
 * the flicker.
 *
 * Same curves as the original (its exact path formula), but the animation is
 * rebuilt. In the original every stroke animates `pathLength` and
 * `pathOffset` from 0 → 1 → 0 and pulses its opacity: when the offset nears 1
 * the visible part of the stroke slides off the end of the path and the line
 * vanishes, then pops back. With dozens of strokes on random 20–30s timers
 * that reads as the whole background blinking, and because the timers were
 * re-rolled with `Math.random()` on every load, it looked right on some loads
 * and wrong on others.
 *
 * Here each curve is drawn twice:
 *   · a base stroke, static and always visible — the lines never disappear;
 *   · a bright segment that travels along it on a CSS `stroke-dashoffset`
 *     loop. `pathLength={1}` normalises every curve to length 1 and the dash
 *     pattern sums to exactly 1, so the loop is seamless — no pop at the wrap.
 * Durations and phases come from a fixed hash of the line's index, so the
 * field looks the same on every load.
 *
 * Lines are always white, so they belong on the dark surfaces only.
 */

/** Deterministic 0–1 value per index — stable across renders and loads. */
function hash(n: number) {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function FloatingPaths({
  position,
  count,
  strength,
}: {
  position: 1 | -1;
  count: number;
  strength: number;
}) {
  const paths = useMemo(() => {
    // The original spaces 36 lines 5px/6px apart. More lines are packed into
    // the same spread rather than pushed further out, so "more lines" reads
    // as a denser field, not a wider one.
    const step = 36 / count;
    return Array.from({ length: count }, (_, i) => {
      const k = i * step;
      const t = i / (count - 1);
      return {
        id: i,
        d: `M-${380 - k * 5 * position} -${189 + k * 6}C-${
          380 - k * 5 * position
        } -${189 + k * 6} -${312 - k * 5 * position} ${216 - k * 6} ${
          152 - k * 5 * position
        } ${343 - k * 6}C${616 - k * 5 * position} ${470 - k * 6} ${
          684 - k * 5 * position
        } ${875 - k * 6} ${684 - k * 5 * position} ${875 - k * 6}`,
        width: 0.5 + t * 1.05,
        base: (0.14 + t * 0.26) * strength,
        flow: Math.min(1, (0.45 + t * 0.55) * strength),
        duration: 14 + hash(i + position * 101) * 12,
        // Negative delay starts each segment part-way along its line, so the
        // field is already in motion on the first frame instead of every
        // segment setting off from the same point in a single wave.
        delay: -hash(i * 3 + position * 57) * 26,
      };
    });
  }, [position, count, strength]);

  return (
    <svg
      className="absolute inset-0 size-full text-white"
      viewBox="0 0 696 316"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {paths.map((p) => (
        <g key={p.id}>
          <path
            d={p.d}
            stroke="currentColor"
            strokeWidth={p.width}
            strokeOpacity={p.base}
          />
          <path
            d={p.d}
            pathLength={1}
            stroke="currentColor"
            strokeWidth={p.width * 1.25}
            strokeOpacity={p.flow}
            strokeLinecap="round"
            className="path-flow"
            style={{
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        </g>
      ))}
    </svg>
  );
}

/**
 * White lines behind white text cut straight through the letters. `clear`
 * masks the field out where the copy sits — the lines fade away under the
 * text and stay at full strength everywhere else — which keeps the copy
 * legible without laying a dark veil over the whole effect.
 */
const CLEAR_MASKS = {
  center:
    "[mask-image:radial-gradient(ellipse_55%_42%_at_50%_50%,transparent_25%,black_80%)]",
  left: "[mask-image:radial-gradient(ellipse_55%_70%_at_22%_50%,transparent_25%,black_85%)]",
} as const;

/**
 * The line field on its own, behind other content on a dark surface.
 * `density` is lines per direction; `strength` scales every stroke's opacity.
 */
export function BackgroundPaths({
  className = "",
  density = 44,
  strength = 1,
  clear,
}: {
  className?: string;
  density?: number;
  strength?: number;
  /** Where the copy sits, so the lines can clear out from under it. */
  clear?: keyof typeof CLEAR_MASKS;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  // Mount on first approach and then stay mounted. Unmounting whenever the
  // block left the viewport restarted every line on the way back in, which
  // was its own source of flicker.
  const reached = useInView(ref, { once: true, margin: "400px" });

  // Fewer strokes on phones: the field is smaller there, so the same density
  // looks just as full, and there are fewer lines to repaint.
  const count = isMobile ? Math.round(density * 0.6) : density;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      /* `transform-gpu` puts the field on its own compositing layer.
         Without it the browser re-rasters all ~176 strokes as the section
         scrolls past, which costs about as much as the animation itself. */
      className={`pointer-events-none absolute inset-0 transform-gpu overflow-hidden ${
        clear ? CLEAR_MASKS[clear] : ""
      } ${className}`}
    >
      {reached || reduced ? (
        <>
          <FloatingPaths position={1} count={count} strength={strength} />
          <FloatingPaths position={-1} count={count} strength={strength} />
        </>
      ) : null}
    </div>
  );
}

/**
 * The original full-screen BackgroundPaths block, in its dark variant: white
 * line field, the title dropping in letter by letter on a spring, white
 * gradient text and the glass button.
 *
 * The title animates when it scrolls into view rather than on mount — placed
 * mid-page, a mount animation would finish before anyone got there.
 */
export function BackgroundPathsSection({
  title,
  cta,
  kicker,
}: {
  title: string;
  cta: { label: string; href: string };
  kicker?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const words = title.split(" ");
  const show = reduced || inView;
  const external = /^(https?:|tel:|mailto:)/.test(cta.href);

  const buttonClass =
    "inline-flex items-center border border-white/10 bg-ink-950/95 px-8 py-5 text-lg font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-ink-950 hover:shadow-md hover:shadow-black/40 group-hover:-translate-y-0.5";
  const buttonInner = (
    <>
      <span className="opacity-90 transition-opacity group-hover:opacity-100">
        {cta.label}
      </span>
      <span className="ml-3 opacity-70 transition-all duration-300 group-hover:translate-x-1.5 group-hover:opacity-100">
        →
      </span>
    </>
  );

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-navy-900"
    >
      <BackgroundPaths density={48} clear="center" />

      <div className="container-x relative z-10 text-center">
        <motion.div
          data-reveal
          initial={{ opacity: reduced ? 1 : 0 }}
          animate={{ opacity: show ? 1 : 0 }}
          transition={{ duration: 2 }}
          className="mx-auto max-w-4xl"
        >
          {kicker ? (
            <span className="section-label mb-8 justify-center !text-white/70">
              <span aria-hidden="true" className="size-[5px] bg-accent-500" />
              {kicker}
            </span>
          ) : null}

          <h2 className="mb-10 font-display text-5xl tracking-tighter !text-white sm:text-7xl md:text-8xl">
            <span className="sr-only">{title}</span>
            <span aria-hidden="true">
              {words.map((word, wordIndex) => (
                <span key={wordIndex} className="mr-4 inline-block last:mr-0">
                  {word.split("").map((letter, letterIndex) => (
                    <motion.span
                      key={`${wordIndex}-${letterIndex}`}
                      data-reveal
                      initial={reduced ? false : { y: 100, opacity: 0 }}
                      animate={show ? { y: 0, opacity: 1 } : undefined}
                      transition={{
                        delay: wordIndex * 0.1 + letterIndex * 0.03,
                        type: "spring",
                        stiffness: 150,
                        damping: 25,
                      }}
                      className="inline-block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              ))}
            </span>
          </h2>

          {/* The glass button: a 1px gradient rim around a frosted face. */}
          <div className="group relative inline-block overflow-hidden bg-gradient-to-b from-white/10 to-black/10 p-px shadow-lg backdrop-blur-lg transition-shadow duration-300 hover:shadow-xl">
            {external ? (
              <a
                href={cta.href}
                target={cta.href.startsWith("http") ? "_blank" : undefined}
                rel={cta.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className={buttonClass}
              >
                {buttonInner}
              </a>
            ) : (
              <Link href={cta.href} className={buttonClass}>
                {buttonInner}
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
