import type { Variants, Transition } from "motion/react";

/**
 * Shared motion vocabulary. Every section imports from here so the whole
 * page moves with one rhythm — no per-component one-offs.
 *
 * Performance rule (§10): these variants only ever touch `transform` and
 * `opacity`. Nothing here triggers layout.
 */

/** The house easing. Fast out of the gate, long soft landing. */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT_QUART = [0.76, 0, 0.24, 1] as const;

export const baseTransition: Transition = {
  duration: 0.9,
  ease: EASE_OUT_EXPO,
};

/** How far a revealing element travels. Small — this is a nudge, not a leap. */
const RISE = 28;

export const revealUp: Variants = {
  hidden: { opacity: 0, y: RISE },
  visible: { opacity: 1, y: 0, transition: baseTransition },
};

export const revealDown: Variants = {
  hidden: { opacity: 0, y: -RISE },
  visible: { opacity: 1, y: 0, transition: baseTransition },
};

export const revealLeft: Variants = {
  hidden: { opacity: 0, x: RISE },
  visible: { opacity: 1, x: 0, transition: baseTransition },
};

export const revealRight: Variants = {
  hidden: { opacity: 0, x: -RISE },
  visible: { opacity: 1, x: 0, transition: baseTransition },
};

/** Fade + micro-scale. Used for cards, never for text. */
export const revealScale: Variants = {
  hidden: { opacity: 0, y: RISE, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...baseTransition, duration: 1 },
  },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: baseTransition },
};

export type RevealDirection =
  | "up"
  | "down"
  | "left"
  | "right"
  | "scale"
  | "fade";

export const revealVariants: Record<RevealDirection, Variants> = {
  up: revealUp,
  down: revealDown,
  left: revealLeft,
  right: revealRight,
  scale: revealScale,
  fade,
};

/**
 * Parent for choreographed groups. Children animate in sequence rather than
 * all at once — the Wellington-style stagger from the brief.
 */
export const staggerParent = (stagger = 0.09, delay = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

/**
 * Per-line text reveal. The line sits inside an `overflow:hidden` mask and
 * slides up into view — the classic editorial title reveal.
 */
export const lineMaskParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export const lineMaskChild: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: 1.05, ease: EASE_OUT_EXPO },
  },
};

/** Per-word variant of the same idea, for shorter headlines. */
export const wordMaskChild: Variants = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.85, ease: EASE_OUT_EXPO },
  },
};

/**
 * Image reveal: a clip-path wipe from bottom to top, with the image itself
 * counter-scaling so the frame feels like it is uncovering a still photo
 * rather than sliding one in.
 */
export const imageClipReveal: Variants = {
  hidden: { clipPath: "inset(100% 0% 0% 0%)" },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 1.2, ease: EASE_OUT_EXPO },
  },
};

export const imageCounterScale: Variants = {
  hidden: { scale: 1.18 },
  visible: {
    scale: 1,
    transition: { duration: 1.4, ease: EASE_OUT_EXPO },
  },
};

/** Shared `whileInView` config — one threshold for the entire site. */
export const inViewOnce = {
  once: true,
  amount: 0.25,
} as const;

/** Looser threshold for tall blocks that never reach 25% on a phone. */
export const inViewTall = {
  once: true,
  amount: 0.12,
} as const;

/**
 * Returns variants with all movement stripped out, leaving only the final
 * state. Used when `prefers-reduced-motion` is set: content still appears,
 * it just does not travel.
 */
export const staticVariants: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { duration: 0 } },
};
