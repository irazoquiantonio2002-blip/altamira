"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
} from "motion/react";
import { useIsMobile, useReducedMotion } from "@/lib/useMotionPrefs";
import { useScrollValue } from "@/lib/useScrollValue";
import { responsiveImg } from "@/lib/responsiveImg";

/**
 * A full-bleed photo that unfolds from a centered rectangle to the full
 * viewport as the section scrolls, while the photo itself zooms out from an
 * over-scaled crop to its natural framing.
 *
 * The two moves run in opposite directions on purpose: the window grows while
 * the image shrinks, which reads as the frame opening onto a scene that was
 * always there, rather than as a picture being scaled up.
 *
 * Adapted from the `SmoothScrollHero` clip-path pattern, rebuilt on a section
 * scroll range instead of the raw window `scrollY` so several of these can
 * live on one page without fighting each other.
 */
export function ClipRevealBand({
  src,
  alt,
  children,
  height = "260vh",
  mobileHeight,
}: {
  src: string;
  alt: string;
  children?: ReactNode;
  /** Total scroll distance the effect plays over. */
  height?: string;
  /**
   * Track height below `md`. Opt-in, because the right length depends on
   * what else the page asks the reader to scroll through: on a page built
   * out of several scroll effects, 260vh of dragging for one of them is a
   * lot on a phone. Pages that leave it unset keep the full travel.
   */
  mobileHeight?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Inset percentages: the window opens from a centered box to the full frame.
  const inset = useScrollValue(scrollYProgress, [0, 0.75], [14, 0]);
  const insetTo = useScrollValue(scrollYProgress, [0, 0.75], [86, 100]);
  const clipPath = useMotionTemplate`polygon(${inset}% ${inset}%, ${insetTo}% ${inset}%, ${insetTo}% ${insetTo}%, ${inset}% ${insetTo}%)`;

  // Counter-zoom, tighter on phones where an over-scaled crop loses the subject.
  const scale = useScrollValue(
    scrollYProgress,
    [0, 0.75],
    isMobile ? [1.25, 1] : [1.45, 1],
  );
  const copyOpacity = useScrollValue(scrollYProgress, [0.45, 0.68], [0, 1]);
  const copyY = useScrollValue(scrollYProgress, [0.45, 0.68], [40, 0]);

  if (reduced) {
    return (
      <section className="relative isolate flex min-h-[70svh] items-center overflow-hidden bg-ink-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          {...responsiveImg(src, "100vw")}
          alt={alt}
          className="absolute inset-0 size-full object-cover saturate-[.7]"
        />
        <div className="photo-scrim" />
        <div className="container-x relative w-full py-20">{children}</div>
      </section>
    );
  }

  return (
    <div
      ref={ref}
      style={{ height: isMobile && mobileHeight ? mobileHeight : height }}
      className="relative w-full"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-paper">
        <motion.div
          style={{ clipPath }}
          className="absolute inset-0 overflow-hidden bg-ink-950"
        >
          <motion.div style={{ scale }} className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              {...responsiveImg(src, "100vw")}
              alt={alt}
              className="size-full object-cover saturate-[.7]"
            />
          </motion.div>
          <div className="photo-scrim" />

          {children ? (
            <motion.div
              style={{ opacity: copyOpacity, y: copyY }}
              className="absolute inset-0 flex items-end"
            >
              <div className="container-x w-full pb-16 sm:pb-24">{children}</div>
            </motion.div>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}
