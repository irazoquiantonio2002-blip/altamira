"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useMotionPrefs";

/**
 * Slow drifting line-work behind a section.
 *
 * Retuned from the 21st.dev "Background Paths" pattern: the original ran 36
 * high-contrast strokes in both directions, which on a white institutional
 * page reads as a graphic rather than as a texture. Here it is 18 strokes at
 * a fraction of the opacity, in the brand blue, animating `pathLength` and
 * `pathOffset` only — both of which the compositor can handle without
 * repainting.
 */
function Paths({
  direction,
  light,
}: {
  direction: 1 | -1;
  light: boolean;
}) {
  const paths = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 10 * direction} -${189 + i * 12}C-${
      380 - i * 10 * direction
    } -${189 + i * 12} -${312 - i * 10 * direction} ${216 - i * 12} ${
      152 - i * 10 * direction
    } ${343 - i * 12}C${616 - i * 10 * direction} ${470 - i * 12} ${
      684 - i * 10 * direction
    } ${875 - i * 12} ${684 - i * 10 * direction} ${875 - i * 12}`,
    width: 0.5 + i * 0.04,
  }));

  return (
    <svg
      className={`absolute inset-0 size-full ${light ? "text-white" : "text-accent-600"}`}
      viewBox="0 0 696 316"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {paths.map((path) => (
        <motion.path
          key={path.id}
          d={path.d}
          stroke="currentColor"
          strokeWidth={path.width}
          initial={{ pathLength: 0.3, opacity: 0.4 }}
          animate={{
            pathLength: 1,
            opacity: [0.15, 0.35, 0.15],
            pathOffset: [0, 1, 0],
          }}
          transition={{
            // Each stroke gets its own duration so the field never pulses in
            // unison, which would read as a loading state.
            duration: 26 + path.id * 1.4,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </svg>
  );
}

export function BackgroundPaths({
  className = "",
  light = false,
}: {
  className?: string;
  /** White strokes, for use on the navy and ink surfaces. */
  light?: boolean;
}) {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden opacity-[0.55] ${className}`}
    >
      <Paths direction={1} light={light} />
      <Paths direction={-1} light={light} />
    </div>
  );
}
