"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useIsMobile, useReducedMotion } from "@/lib/useMotionPrefs";

type Corners = {
  topLeft: { src: string; alt: string };
  topRight: { src: string; alt: string };
  bottomLeft: { src: string; alt: string };
  bottomRight: { src: string; alt: string };
};

/**
 * Four photographs that travel across three acts as the section scrolls:
 * they swap corners diagonally, then collapse into a single stack at the
 * centre, then the top card opens out to fill the screen.
 *
 * The progress is run through a spring so the three acts hand off with
 * weight instead of switching on a hard keyframe boundary.
 *
 * On phones the four cards would each be smaller than a thumbnail and the
 * choreography would read as noise, so the section degrades to a plain
 * stacked set of photos with the same content.
 */
export function ScrollChoreography({
  images,
  children,
  height = "320vh",
}: {
  images: Corners;
  /** Copy revealed inside the final, full-screen card. */
  children?: ReactNode;
  height?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile(1024);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const p = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 44,
    mass: 1.1,
    restDelta: 0.001,
  });

  const L = "-21vw";
  const R = "21vw";
  const T = "-15vh";
  const B = "15vh";

  // Act 1 (0 → .3) diagonal swap · Act 2 (.35 → .65) stack · Act 3 (.7 → .95) open.
  const tlX = useTransform(p, [0, 0.3, 0.35, 0.65, 1], [L, L, L, "0vw", "0vw"]);
  const tlY = useTransform(p, [0, 0.3, 0.35, 0.65, 1], [T, B, B, "0vh", "0vh"]);
  const brX = useTransform(p, [0, 0.3, 0.35, 0.65, 1], [R, R, R, "0vw", "0vw"]);
  const brY = useTransform(p, [0, 0.3, 0.35, 0.65, 1], [B, T, T, "0vh", "0vh"]);
  const blX = useTransform(p, [0, 0.3, 0.35, 0.65, 1], [L, L, L, "0vw", "0vw"]);
  const blY = useTransform(p, [0, 0.3, 0.35, 0.65, 1], [B, B, B, "0vh", "0vh"]);
  const trX = useTransform(p, [0, 0.3, 0.35, 0.65, 1], [R, R, R, "0vw", "0vw"]);
  const trY = useTransform(p, [0, 0.3, 0.35, 0.65, 1], [T, T, T, "0vh", "0vh"]);

  const heroW = useTransform(
    p,
    [0.65, 0.7, 0.92, 1],
    ["38vw", "38vw", "100vw", "100vw"],
  );
  const heroH = useTransform(
    p,
    [0.65, 0.7, 0.92, 1],
    ["26vh", "26vh", "100svh", "100svh"],
  );

  const underOpacity = useTransform(p, [0.74, 0.86], [1, 0]);
  const copyOpacity = useTransform(p, [0.9, 1], [0, 1]);

  const cardBase =
    "absolute left-1/2 top-1/2 h-[26vh] w-[38vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-paper-100 will-change-transform";

  if (reduced || isMobile) {
    const all = [
      images.topLeft,
      images.topRight,
      images.bottomLeft,
      images.bottomRight,
    ];
    return (
      <section className="bg-ink-950">
        <div className="grid grid-cols-2">
          {all.map((img) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={img.src}
              src={img.src}
              alt={img.alt}
              className="aspect-square w-full object-cover saturate-[.7]"
            />
          ))}
        </div>
        {children ? (
          <div className="container-x py-16">{children}</div>
        ) : null}
      </section>
    );
  }

  return (
    <div ref={ref} style={{ height }} className="relative w-full">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-ink-950">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            style={{ x: tlX, y: tlY, opacity: underOpacity }}
            className={`${cardBase} z-10`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images.topLeft.src}
              alt={images.topLeft.alt}
              className="size-full object-cover saturate-[.7]"
            />
          </motion.div>

          <motion.div
            style={{ x: brX, y: brY, opacity: underOpacity }}
            className={`${cardBase} z-20`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images.bottomRight.src}
              alt={images.bottomRight.alt}
              className="size-full object-cover saturate-[.7]"
            />
          </motion.div>

          <motion.div
            style={{ x: blX, y: blY, opacity: underOpacity }}
            className={`${cardBase} z-30`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images.bottomLeft.src}
              alt={images.bottomLeft.alt}
              className="size-full object-cover saturate-[.7]"
            />
          </motion.div>

          {/* The card that opens out at the end. */}
          <motion.div
            style={{ x: trX, y: trY, width: heroW, height: heroH }}
            className={`${cardBase} z-40 origin-center`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images.topRight.src}
              alt={images.topRight.alt}
              className="size-full object-cover saturate-[.7]"
            />
            <div className="photo-scrim" />

            {children ? (
              <motion.div
                style={{ opacity: copyOpacity }}
                className="absolute inset-0 flex items-end"
              >
                <div className="container-x w-full pb-16 sm:pb-24">
                  {children}
                </div>
              </motion.div>
            ) : null}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
