"use client";

import { motion, type Variants } from "motion/react";
import type { ElementType, ReactNode } from "react";
import {
  inViewOnce,
  inViewTall,
  revealVariants,
  staggerParent,
  staticVariants,
  type RevealDirection,
} from "@/lib/animations";
import { useReducedMotion } from "@/lib/useMotionPrefs";

/**
 * Lateral reveals translate a block sideways by 28px. When that block already
 * spans the viewport — which it does on a phone — the offset widens the
 * document and reintroduces horizontal overflow (§8).
 *
 * The fix is structural rather than conditional: a lateral reveal gets a
 * wrapper that clips on the x axis only. `overflow-x: clip` is used instead
 * of `hidden` precisely because it leaves the y axis `visible`, so nothing
 * vertical is cut off and no scroll container is created (which would break
 * the pinned ScrollTriggers elsewhere on the page).
 *
 * Doing it this way also avoids a subtle trap: swapping the variant after
 * mount based on a viewport hook does not work, because the initial variant
 * has already been committed and the incoming `visible` variant would not
 * reset the axis the old one moved.
 */
const isLateral = (d: RevealDirection) => d === "left" || d === "right";

type RevealProps = {
  children: ReactNode;
  /** Direction of travel. `fade` moves nothing. */
  direction?: RevealDirection;
  /** Seconds to wait before starting. Prefer `Stagger` over manual delays. */
  delay?: number;
  className?: string;
  as?: ElementType;
  /** Use a lower in-view threshold for blocks taller than the viewport. */
  tall?: boolean;
};

/**
 * Fade + translate on scroll-in. The workhorse of the page (§7).
 *
 * Under `prefers-reduced-motion` the element renders in its final state
 * immediately — it never stays hidden.
 */
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  className,
  as = "div",
  tall = false,
}: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  const variants: Variants = reduced ? staticVariants : revealVariants[direction];

  const node = (
    <MotionTag
      data-reveal
      className={isLateral(direction) ? undefined : className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={tall ? inViewTall : inViewOnce}
      transition={delay && !reduced ? { delay } : undefined}
    >
      {children}
    </MotionTag>
  );

  if (!isLateral(direction) || reduced) return node;

  // The wrapper takes the caller's className so it keeps the grid/flex slot
  // the Reveal was placed in.
  return <div className={`overflow-x-clip ${className ?? ""}`}>{node}</div>;
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Gap between children, in seconds. */
  gap?: number;
  delay?: number;
  tall?: boolean;
};

/**
 * Parent that choreographs its `RevealItem` children in sequence.
 *
 * Children must be `RevealItem` (or any motion element using the
 * hidden/visible variant names) — they inherit the animation state from here
 * rather than each running their own viewport observer.
 */
export function Stagger({
  children,
  className,
  as = "div",
  gap = 0.09,
  delay = 0,
  tall = false,
}: StaggerProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <MotionTag
      data-reveal
      className={className}
      variants={reduced ? staticVariants : staggerParent(gap, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={tall ? inViewTall : inViewOnce}
    >
      {children}
    </MotionTag>
  );
}

type RevealItemProps = {
  children: ReactNode;
  direction?: RevealDirection;
  className?: string;
  as?: ElementType;
};

/** A single child of `Stagger`. Has no viewport observer of its own. */
export function RevealItem({
  children,
  direction = "up",
  className,
  as = "div",
}: RevealItemProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <MotionTag
      data-reveal
      className={className}
      variants={reduced ? staticVariants : revealVariants[direction]}
    >
      {children}
    </MotionTag>
  );
}
