"use client";

import { useRef } from "react";
import { motion, useScroll } from "motion/react";
import { useIsMobile, useReducedMotion } from "@/lib/useMotionPrefs";
import { useScrollValue } from "@/lib/useScrollValue";

export type ParallaxShot = {
  src: string;
  alt: string;
  /** Travel in px across the crossing. Opposite signs read as depth. */
  start: number;
  end: number;
  /** Tailwind width + alignment for this shot. */
  className: string;
};

/**
 * A loose editorial column where each photograph drifts at its own speed.
 *
 * Alternating the sign of `start`/`end` between neighbours is what produces
 * the depth: photos moving the same way at different speeds just look like
 * lag. On phones the whole range is halved, because the full travel there is
 * large relative to the viewport and reads as drift.
 */
export function ParallaxColumn({ shots }: { shots: ParallaxShot[] }) {
  return (
    <div className="container-x">
      <div className="mx-auto max-w-5xl">
        {shots.map((shot) => (
          <Shot key={shot.src + shot.start} shot={shot} />
        ))}
      </div>
    </div>
  );
}

function Shot({ shot }: { shot: ParallaxShot }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const factor = reduced ? 0 : isMobile ? 0.5 : 1;
  const y = useScrollValue(
    scrollYProgress,
    [0, 1],
    [shot.start * factor, shot.end * factor],
  );
  const scale = useScrollValue(scrollYProgress, [0.8, 1], [1, 0.94]);
  const opacity = useScrollValue(scrollYProgress, [0.82, 1], [1, 0.35]);

  return (
    <div ref={ref} className={`my-10 ${shot.className}`}>
      <motion.div
        style={reduced ? undefined : { y, scale, opacity }}
        className="will-change-transform"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={shot.src}
          alt={shot.alt}
          className="w-full object-cover saturate-[.8]"
        />
      </motion.div>
    </div>
  );
}
