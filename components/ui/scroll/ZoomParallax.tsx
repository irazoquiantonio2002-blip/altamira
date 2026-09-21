"use client";

import Image from "next/image";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { motion, useScroll, type MotionValue } from "motion/react";
import { useReducedMotion } from "@/lib/useMotionPrefs";
import { useScrollValue } from "@/lib/useScrollValue";

/**
 * ZoomParallax — the 21st.dev component, kept faithful.
 *
 * Same layout and numbers as the original: a 300vh scroll with a sticky
 * viewport, seven photographs placed around a centred 25vw × 25vh frame, each
 * scaling from 1× to 4×, 5×, 6×, 5×, 6×, 8× and 9× — so the outer photos fly
 * past the edges while the centre one, at 4×, grows to exactly fill the
 * screen.
 *
 * Differences:
 *   · the per-photo positions are inline styles rather than the original's
 *     `[&>div]:!-top-[30vh]` arbitrary variants — same values, but they don't
 *     depend on Tailwind's important-modifier syntax;
 *   · scales go through `useScrollValue` (plain `useTransform` ranges get
 *     offloaded to a native ScrollTimeline that lags the scroll here);
 *   · an optional caption fades in over the centre photo once it fills the
 *     screen, with a scrim so it reads over any photo;
 *   · `next/image` with `sizes="100vw"`, since the centre photo ends up full
 *     screen and needs a full-width source.
 */

type Img = { src: string; alt: string };

// Positions of photos 2–7, as in the original; photo 1 is the centre frame.
const FRAMES: CSSProperties[] = [
  {},
  { top: "-30vh", left: "5vw", height: "30vh", width: "35vw" },
  { top: "-10vh", left: "-25vw", height: "45vh", width: "20vw" },
  { left: "27.5vw", height: "25vh", width: "25vw" },
  { top: "27.5vh", left: "5vw", height: "25vh", width: "20vw" },
  { top: "27.5vh", left: "-22.5vw", height: "25vh", width: "30vw" },
  { top: "22.5vh", left: "25vw", height: "15vh", width: "15vw" },
];

const SCALES = [4, 5, 6, 5, 6, 8, 9];

export function ZoomParallax({
  images,
  caption,
}: {
  /** Up to seven photos; the first becomes the full-screen one. */
  images: Img[];
  caption?: ReactNode;
}) {
  const container = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const captionOpacity = useScrollValue(scrollYProgress, [0.82, 1], [0, 1]);

  if (reduced) {
    return (
      <div className="container-x grid grid-cols-2 gap-3 py-16 md:grid-cols-4">
        {images.slice(0, 7).map((img, i) => (
          <div key={img.src} className={`relative aspect-4/3 ${i === 0 ? "col-span-2 row-span-2 aspect-auto" : ""}`}>
            <Image src={img.src} alt={img.alt} fill sizes="50vw" className="object-cover" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={container} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {images.slice(0, 7).map((img, index) => (
          <Frame
            key={img.src}
            img={img}
            progress={scrollYProgress}
            scale={SCALES[index % SCALES.length]}
            frame={FRAMES[index]}
          />
        ))}

        {caption ? (
          <motion.div
            style={{ opacity: captionOpacity }}
            className="pointer-events-none absolute inset-0 flex items-end"
          >
            <div className="photo-scrim" />
            <div className="container-x relative w-full pb-16 sm:pb-24">{caption}</div>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}

function Frame({
  img,
  progress,
  scale: to,
  frame,
}: {
  img: Img;
  progress: MotionValue<number>;
  scale: number;
  frame: CSSProperties;
}) {
  const scale = useScrollValue(progress, [0, 1], [1, to]);

  return (
    <motion.div
      style={{ scale }}
      className="absolute top-0 flex h-full w-full items-center justify-center will-change-transform"
    >
      <div className="relative h-[25vh] w-[25vw]" style={frame}>
        <Image
          src={img.src}
          alt={img.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </motion.div>
  );
}
