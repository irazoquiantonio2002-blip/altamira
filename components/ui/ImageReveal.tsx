"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { EASE_OUT_EXPO } from "@/lib/animations";
import { useIsMobile, useReducedMotion } from "@/lib/useMotionPrefs";

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
  /** Apply the shared dark scrim over the photo. */
  scrim?: boolean;
};

const CLIPPED = "inset(100% 0% 0% 0%)";
const OPEN = "inset(0% 0% 0% 0%)";

/**
 * A photo in the house treatment: a clip-path wipe on entry, gentle parallax
 * on scroll, and the shared dark scrim so every image on the page reads as
 * one system (§4).
 *
 * IMPORTANT — why the clip is on an inner element rather than on the observed
 * one: `clip-path: inset(100% …)` collapses an element to zero visible area,
 * and IntersectionObserver measures the *clipped* box. Observing the clipped
 * element therefore deadlocks — it can never report as intersecting, so the
 * reveal never fires and the photo stays invisible forever. (`getBoundingClientRect`
 * still reports the full box, which makes this look like it should work.)
 * The outer element is never clipped and is what gets observed; the inner one
 * carries the wipe.
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
  scrim = true,
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
  const y = useTransform(scrollYProgress, [0, 1], [range, -range]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        data-reveal
        className="relative size-full"
        initial={{ clipPath: CLIPPED }}
        animate={{ clipPath: shown ? OPEN : CLIPPED }}
        transition={{ duration: reduced ? 0 : 1.2, ease: EASE_OUT_EXPO }}
      >
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
            // `saturate-[.85]` is the de-saturation pass from §5.3, applied
            // to all photography rather than the hero alone.
            className={`size-full object-cover saturate-[.85] ${imgClassName}`}
          />
        </motion.div>
        {scrim ? <div className="photo-scrim" /> : null}
      </motion.div>
    </div>
  );
}
