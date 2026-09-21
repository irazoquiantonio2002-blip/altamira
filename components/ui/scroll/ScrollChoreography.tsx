"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useIsMobile, useReducedMotion } from "@/lib/useMotionPrefs";

type Img = { src: string; alt: string };

/**
 * ScrollChoreography — the 21st.dev component, kept faithful.
 *
 * Same three acts and the same numbers as the original: four 36vw × 24vh
 * photographs at ±20vw / ±14vh around the centre swap corners diagonally
 * (0 → 0.3), collapse into one stack (0.35 → 0.65), and the top-right card
 * opens out to the full screen (0.7 → 0.9) while the others fade beneath it.
 * The progress runs through the original spring (stiffness 400, damping 50,
 * mass 1.2), which is what gives the hand-offs their weight.
 *
 * Differences: phones get proportionally larger cards (36vw is ~135px on a
 * 375px screen, too small to read as a photograph), an optional caption can
 * fade in over the opened card, and under reduced motion the four photos
 * simply sit in a grid.
 */
export function ScrollChoreography({
  images,
  children,
}: {
  images: { topLeft: Img; topRight: Img; bottomLeft: Img; bottomRight: Img };
  /** Optional caption shown once the last card has opened to full screen. */
  children?: ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 50,
    mass: 1.2,
    restDelta: 0.001,
  });

  const xLeft = isMobile ? "-24vw" : "-20vw";
  const xRight = isMobile ? "24vw" : "20vw";
  const yTop = isMobile ? "-13vh" : "-14vh";
  const yBottom = isMobile ? "13vh" : "14vh";
  const cardW = isMobile ? "44vw" : "36vw";
  const cardH = isMobile ? "20vh" : "24vh";

  const steps = [0, 0.3, 0.35, 0.65, 1];

  // Top Left → Bottom Left, then centre.
  const tlX = useTransform(smoothProgress, steps, [xLeft, xLeft, xLeft, "0vw", "0vw"]);
  const tlY = useTransform(smoothProgress, steps, [yTop, yBottom, yBottom, "0vh", "0vh"]);
  // Bottom Right → Top Right, then centre.
  const brX = useTransform(smoothProgress, steps, [xRight, xRight, xRight, "0vw", "0vw"]);
  const brY = useTransform(smoothProgress, steps, [yBottom, yTop, yTop, "0vh", "0vh"]);
  // Bottom Left stays, then centre.
  const blX = useTransform(smoothProgress, steps, [xLeft, xLeft, xLeft, "0vw", "0vw"]);
  const blY = useTransform(smoothProgress, steps, [yBottom, yBottom, yBottom, "0vh", "0vh"]);
  // Top Right stays, then centre, then expands.
  const trX = useTransform(smoothProgress, steps, [xRight, xRight, xRight, "0vw", "0vw"]);
  const trY = useTransform(smoothProgress, steps, [yTop, yTop, yTop, "0vh", "0vh"]);

  const heroWidth = useTransform(
    smoothProgress,
    [0.65, 0.7, 0.9, 1],
    [cardW, cardW, "100vw", "100vw"],
  );
  const heroHeight = useTransform(
    smoothProgress,
    [0.65, 0.7, 0.9, 1],
    [cardH, cardH, "100vh", "100vh"],
  );

  const underImagesOpacity = useTransform(smoothProgress, [0.75, 0.85], [1, 0]);
  const captionOpacity = useTransform(smoothProgress, [0.9, 1], [0, 1]);

  if (reduced) {
    return (
      <section className="grid grid-cols-2">
        {[images.topLeft, images.topRight, images.bottomLeft, images.bottomRight].map(
          (img) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={img.src}
              src={img.src}
              alt={img.alt}
              className="aspect-3/2 w-full object-cover"
            />
          ),
        )}
      </section>
    );
  }

  const base =
    "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-paper-100 shadow-2xl will-change-transform";
  const size = { width: cardW, height: cardH };

  return (
    <div ref={containerRef} className="relative h-[300vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            style={{ ...size, x: tlX, y: tlY, opacity: underImagesOpacity }}
            className={`${base} z-10`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images.topLeft.src} alt={images.topLeft.alt} className="size-full object-cover" />
          </motion.div>

          <motion.div
            style={{ ...size, x: brX, y: brY, opacity: underImagesOpacity }}
            className={`${base} z-20`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images.bottomRight.src} alt={images.bottomRight.alt} className="size-full object-cover" />
          </motion.div>

          <motion.div
            style={{ ...size, x: blX, y: blY, opacity: underImagesOpacity }}
            className={`${base} z-30`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images.bottomLeft.src} alt={images.bottomLeft.alt} className="size-full object-cover" />
          </motion.div>

          {/* The card that opens out to the full screen. */}
          <motion.div
            style={{ x: trX, y: trY, width: heroWidth, height: heroHeight }}
            className={`${base} z-40 origin-center`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images.topRight.src} alt={images.topRight.alt} className="size-full object-cover" />

            {children ? (
              <motion.div
                style={{ opacity: captionOpacity }}
                className="absolute inset-0 flex items-end"
              >
                <div className="photo-scrim" />
                <div className="container-x relative w-full pb-16 sm:pb-24">
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

export default ScrollChoreography;
