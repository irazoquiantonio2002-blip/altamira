"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { marqueeItems } from "@/lib/site-data";
import { useReducedMotion } from "@/lib/useMotionPrefs";

/** Keeps `v` inside [min, max), wrapping around like a clock face. */
function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

/**
 * The value band, driven by the scroll.
 *
 * It drifts on its own at a slow base speed, accelerates with the speed of
 * the scroll, and reverses when the reader scrolls back up — so the band
 * visibly responds to the reader instead of looping on a timer.
 *
 * The track holds the item list twice and the offset wraps at -50%, which is
 * exactly one copy's width, so the loop has no seam.
 *
 * Decorative: the same four values are real headings on the Nosotros page,
 * so the strip is hidden from assistive tech.
 */
export function Marquee({ baseVelocity = -2.2 }: { baseVelocity?: number }) {
  const reduced = useReducedMotion();
  const loop = [...marqueeItems, ...marqueeItems];

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(1);
  const paused = useRef(false);

  useAnimationFrame((_, delta) => {
    if (reduced || paused.current) return;

    let moveBy = direction.current * baseVelocity * (delta / 1000);

    // Flip with the scroll direction, then add the scroll's own speed.
    if (velocityFactor.get() < 0) direction.current = -1;
    else if (velocityFactor.get() > 0) direction.current = 1;

    moveBy += direction.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div
      aria-hidden="true"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      className="relative flex overflow-hidden border-y border-rule bg-paper-50 py-6"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-paper-50 to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-paper-50 to-transparent sm:w-28" />

      <motion.div
        style={reduced ? undefined : { x }}
        className="flex w-max will-change-transform"
      >
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex shrink-0 items-center gap-10 px-10 font-display text-[length:var(--text-xl)] text-navy-700"
          >
            {item}
            <span className="size-[5px] shrink-0 bg-accent-600" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
