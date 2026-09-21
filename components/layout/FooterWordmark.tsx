"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "@/lib/useMotionPrefs";

/**
 * The oversized "Altamira" that rises out of the bottom of the footer as the
 * reader reaches the end of the page — a signature to close every route on.
 *
 * Sized in `vw` so the word always spans the width without wrapping or
 * overflowing, and clipped by its own box so the rising letters are cut
 * cleanly by the footer's bottom edge.
 */
export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["65%", "8%"]);
  // A function transform, deliberately. With a plain range, the motion
  // library hands a scroll-linked `opacity` to the browser's native
  // ScrollTimeline, and for this element — the very last thing in the
  // document — that native timeline never reaches its end: the wordmark
  // rose into place (`y`, computed in JS) but stayed at opacity ~0.003.
  // A function cannot be offloaded, so it is always evaluated in JS against
  // the same progress value `y` uses.
  const opacity = useTransform(scrollYProgress, (v) => Math.min(1, v / 0.6));

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none overflow-hidden"
    >
      <motion.p
        style={reduced ? undefined : { y, opacity }}
        className="select-none whitespace-nowrap text-center font-display text-[18.5vw] leading-[0.85] text-white/[0.07]"
      >
        Altamira
      </motion.p>
    </div>
  );
}
