"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll } from "motion/react";
import { useIsMobile, useReducedMotion } from "@/lib/useMotionPrefs";
import { useScrollValue } from "@/lib/useScrollValue";

type Img = { src: string; alt: string };

/**
 * A two-column photo gallery where the columns drift in opposite directions
 * as the section crosses the screen.
 *
 * This replaces a loose collage in which every photo moved on its own offset
 * (up to 260px) with only 40px between them: neighbouring photos slid into
 * each other and left large empty bands — it read as a broken layout. Here
 * the photos in a column move together, so they can never overlap one
 * another, and the columns sit side by side, so they can't either. The
 * opposite drift is what reads as depth.
 *
 * On phones it is a single static column.
 */
export function ParallaxColumn({ images }: { images: Img[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const travel = reduced || isMobile ? 0 : 70;
  const yLeft = useScrollValue(scrollYProgress, [0, 1], [travel, -travel]);
  const yRight = useScrollValue(scrollYProgress, [0, 1], [-travel, travel]);

  const left = images.filter((_, i) => i % 2 === 0);
  const right = images.filter((_, i) => i % 2 === 1);
  // Alternating frame shapes keep the two columns from reading as a grid.
  const shape = (i: number, col: 0 | 1) =>
    (i + col) % 2 === 0 ? "aspect-4/5" : "aspect-3/2";

  return (
    <div ref={ref} className="container-x">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 md:gap-10">
        <motion.div style={{ y: yLeft }} className="flex flex-col gap-6 md:gap-10">
          {left.map((img, i) => (
            <Photo key={img.src} img={img} className={shape(i, 0)} />
          ))}
        </motion.div>
        <motion.div
          style={{ y: yRight }}
          className="flex flex-col gap-6 md:mt-28 md:gap-10"
        >
          {right.map((img, i) => (
            <Photo key={img.src} img={img} className={shape(i, 1)} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function Photo({ img, className }: { img: Img; className: string }) {
  return (
    <div className={`relative w-full overflow-hidden bg-paper-100 ${className}`}>
      <Image
        src={img.src}
        alt={img.alt}
        fill
        sizes="(max-width: 768px) 100vw, 40vw"
        className="object-cover saturate-[.8]"
      />
    </div>
  );
}
