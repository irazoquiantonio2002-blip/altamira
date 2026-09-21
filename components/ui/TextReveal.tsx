"use client";

import { motion } from "motion/react";
import type { ElementType } from "react";
import {
  inViewOnce,
  lineMaskChild,
  lineMaskParent,
  wordMaskChild,
} from "@/lib/animations";
import { useReducedMotion } from "@/lib/useMotionPrefs";

type TextRevealProps = {
  /** One entry per rendered line. Lines are NOT auto-wrapped. */
  lines: ReadonlyArray<string>;
  as?: ElementType;
  className?: string;
  /** Per-line class, e.g. to italicise the accent line. */
  lineClassName?: string;
  /** Animate word-by-word inside each line instead of line-by-line. */
  byWord?: boolean;
  /** Set when a section labels itself by this heading. */
  id?: string;
};

/**
 * Editorial title reveal (§7): each line sits in an `overflow:hidden` mask
 * and slides up into place.
 *
 * The mask is a `block` wrapper rather than inline, because an inline mask
 * clips descenders (the tail of a "g" or "ó") on the display serif.
 *
 * With reduced motion the text renders as plain static lines — no masks, no
 * transforms.
 */
export function TextReveal({
  lines,
  as = "h2",
  className,
  lineClassName,
  byWord = false,
  id,
}: TextRevealProps) {
  const reduced = useReducedMotion();
  const Tag = as;

  if (reduced) {
    return (
      <Tag id={id} className={className}>
        {lines.map((line) => (
          <span key={line} className={`block ${lineClassName ?? ""}`}>
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  const MotionTag = motion[as as keyof typeof motion] as typeof motion.h2;

  return (
    <MotionTag
      id={id}
      className={className}
      variants={lineMaskParent}
      initial="hidden"
      whileInView="visible"
      viewport={inViewOnce}
    >
      {lines.map((line) => (
        <span
          key={line}
          // `pb-[0.12em]` + matching negative margin gives descenders room
          // inside the clip without adding visible leading.
          className="block overflow-hidden pb-[0.12em] mb-[-0.12em]"
        >
          {byWord ? (
            <span className={`block ${lineClassName ?? ""}`}>
              {line.split(" ").map((word, i) => (
                <span
                  key={`${word}-${i}`}
                  className="inline-block overflow-hidden pb-[0.12em] mb-[-0.12em]"
                >
                  <motion.span
                    data-reveal
                    className="inline-block"
                    variants={wordMaskChild}
                  >
                    {word}
                    {/* Preserve the inter-word space the split removed. */}
                    {i < line.split(" ").length - 1 ? " " : ""}
                  </motion.span>
                </span>
              ))}
            </span>
          ) : (
            <motion.span
              data-reveal
              className={`block ${lineClassName ?? ""}`}
              variants={lineMaskChild}
            >
              {line}
            </motion.span>
          )}
        </span>
      ))}
    </MotionTag>
  );
}
