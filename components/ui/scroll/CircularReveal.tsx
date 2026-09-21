"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
} from "motion/react";
import { useReducedMotion } from "@/lib/useMotionPrefs";
import { useScrollValue } from "@/lib/useScrollValue";

/**
 * The circular opening: a photo starts as a small disc in the middle of the
 * page and grows outward as you scroll until it fills the viewport, with the
 * section's copy fading in inside it.
 *
 * The radius is driven in `vmax` rather than a percentage. A percentage
 * circle on a wide viewport reaches the left and right edges long before the
 * top and bottom, so the last third of the scroll would do nothing visible;
 * `vmax` guarantees the disc clears the longest side exactly at the end.
 */
export function CircularReveal({
  src,
  alt,
  children,
  height = "300vh",
}: {
  src: string;
  alt: string;
  children?: ReactNode;
  height?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Opens from a small visible disc — starting at 0 left an empty white
  // block under the page header until the reader happened to scroll — out
  // to 75vmax, past the far corner of any viewport.
  const radius = useScrollValue(scrollYProgress, [0, 0.7], [11, 75]);
  const clipPath = useMotionTemplate`circle(${radius}vmax at 50% 50%)`;

  // The photo settles from a slight over-scale as the disc opens.
  const scale = useScrollValue(scrollYProgress, [0, 0.7], [1.3, 1]);
  const copyOpacity = useScrollValue(scrollYProgress, [0.55, 0.75], [0, 1]);
  const copyY = useScrollValue(scrollYProgress, [0.55, 0.75], [32, 0]);

  if (reduced) {
    return (
      <section className="relative isolate flex min-h-[70svh] items-center overflow-hidden bg-ink-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 size-full object-cover saturate-[.7]"
        />
        <div className="photo-scrim" />
        <div className="container-x relative w-full py-20">{children}</div>
      </section>
    );
  }

  return (
    <div ref={ref} style={{ height }} className="relative w-full">
      {/* The page stays white behind the disc. Fading it to black as the
          disc grew passed through a flat mid grey that read as dirty, and
          the disc clears every corner by the end regardless. */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-paper">
        <motion.div style={{ clipPath }} className="absolute inset-0">
          <motion.div style={{ scale }} className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="size-full object-cover saturate-[.7]"
            />
          </motion.div>
          <div className="photo-scrim" />
        </motion.div>

        {children ? (
          <motion.div
            style={{ opacity: copyOpacity, y: copyY }}
            className="absolute inset-0 flex items-center"
          >
            <div className="container-x w-full">{children}</div>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
