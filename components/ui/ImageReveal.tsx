"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView, useScroll } from "motion/react";
import { EASE_OUT_EXPO } from "@/lib/animations";
import { useIsMobile, useReducedMotion } from "@/lib/useMotionPrefs";
import { useScrollValue } from "@/lib/useScrollValue";

type ImageRevealProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Vertical drift range in px as the frame crosses the viewport. */
  parallax?: number;
  /** Apply the shared dark scrim. Only for photos that carry text. */
  scrim?: boolean;
};

/**
 * A photo in the house treatment: gentle parallax on scroll, a slow settle
 * out of a slight overscale, and the shared dark scrim so every image on the
 * page reads as one system (§4).
 *
 * The photograph itself is never hidden or masked. An earlier version wiped
 * each one in with a `clip-path` as it entered the viewport, which uncovered
 * the picture a band at a time and read as an image still downloading rather
 * than as an effect. Photographs here are shown whole from the first frame;
 * the motion is the frame drifting and the picture settling, never the
 * picture arriving in pieces.
 *
 * Parallax is reduced on phones (§8) — the full range there reads as drift
 * rather than depth, and costs frames on the devices least able to spare them.
 */
export function ImageReveal({
  src,
  alt,
  width,
  height,
  className = "",
  imgClassName = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  parallax = 0,
  scrim = false,
}: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const shown = reduced || inView;
  const range = reduced ? 0 : isMobile ? parallax * 0.4 : parallax;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useScrollValue(scrollYProgress, [0, 1], [range, -range]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        data-reveal
        className="relative size-full"
        style={range ? { y } : undefined}
        initial={{ scale: 1.18 }}
        animate={{ scale: shown ? 1 : 1.18 }}
        transition={{ duration: reduced ? 0 : 1.4, ease: EASE_OUT_EXPO }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          // One de-saturation pass on every photo, so the imagery reads
          // as one system rather than as assorted stock.
          className={`size-full object-cover saturate-[.8] ${imgClassName}`}
        />
      </motion.div>
      {scrim ? <div className="photo-scrim" /> : null}
    </div>
  );
}
