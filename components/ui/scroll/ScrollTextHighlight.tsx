"use client";

import { useRef } from "react";
import { motion, useScroll, type MotionValue } from "motion/react";
import { useReducedMotion } from "@/lib/useMotionPrefs";
import { useScrollValue } from "@/lib/useScrollValue";

/**
 * A statement that lights up word by word as it passes through the viewport,
 * scroll-linked rather than time-based — the reader controls the pace.
 *
 * Dim words sit at 18% opacity instead of a lighter colour so the effect
 * works unchanged on both the paper and the navy surfaces.
 */
export function ScrollTextHighlight({
  text,
  className = "",
  onDark = false,
}: {
  text: string;
  className?: string;
  onDark?: boolean;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    // Starts once the block is well into view and finishes before it leaves,
    // so the last word is lit while the sentence is still comfortably read.
    offset: ["start 0.85", "start 0.28"],
  });

  const words = text.split(" ");

  if (reduced) {
    return (
      <p
        className={`font-display ${onDark ? "text-white" : "text-navy-700"} ${className}`}
      >
        {text}
      </p>
    );
  }

  return (
    <p
      ref={ref}
      className={`flex flex-wrap font-display ${onDark ? "text-white" : "text-navy-700"} ${className}`}
    >
      {words.map((word, i) => (
        <Word
          key={`${word}-${i}`}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
        >
          {word}
        </Word>
      ))}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useScrollValue(progress, range, [0.18, 1]);
  return (
    <span className="mr-[0.28em] inline-block">
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
}
