"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useReducedMotion } from "@/lib/useMotionPrefs";
import { useScrollValue } from "@/lib/useScrollValue";

export type TimelineStep = {
  index: string;
  title: string;
  text: string;
};

/**
 * A vertical process timeline whose spine draws itself as the reader scrolls
 * through it, lighting each step's marker the moment the line reaches it.
 *
 * The line is a `scaleY` on a 1px element, so it is a compositor transform —
 * no height animation, no layout. The window is set so the line finishes
 * while the last step is still mid-screen; finishing only as it leaves would
 * mean the reader never sees the timeline complete.
 */
export function ScrollTimeline({ steps }: { steps: ReadonlyArray<TimelineStep> }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.7", "end 0.55"],
  });

  return (
    <ol ref={ref} className="relative">
      {/* Spine: a faint track with the drawn line on top. */}
      <span
        aria-hidden="true"
        className="absolute bottom-3 left-[1.1rem] top-3 w-px bg-rule sm:left-[1.35rem]"
      />
      <motion.span
        aria-hidden="true"
        style={reduced ? undefined : { scaleY: scrollYProgress }}
        className="absolute bottom-3 left-[1.1rem] top-3 w-px origin-top bg-accent-600 sm:left-[1.35rem]"
      />

      {steps.map((step, i) => (
        <Step
          key={step.index}
          step={step}
          progress={scrollYProgress}
          // The marker lights as the line reaches it, not before.
          at={steps.length > 1 ? i / (steps.length - 1) : 0}
          reduced={reduced}
        />
      ))}
    </ol>
  );
}

function Step({
  step,
  progress,
  at,
  reduced,
}: {
  step: TimelineStep;
  progress: MotionValue<number>;
  at: number;
  reduced: boolean;
}) {
  // Clamped so the window never leaves [0, 1] — the motion library hands
  // these ranges to the Web Animations API as keyframe offsets.
  const from = Math.max(0, at - 0.06);
  const to = Math.min(1, at + 0.02);
  const lit = useScrollValue(
    progress,
    [from, to === from ? from + 0.001 : to],
    [0, 1],
  );

  const markerBg = useTransform(lit, [0, 1], ["#ffffff", "#1a57e6"]);
  const markerBorder = useTransform(lit, [0, 1], ["#c9ced9", "#1a57e6"]);
  const markerText = useTransform(lit, [0, 1], ["#5d6675", "#ffffff"]);
  const copyOpacity = useTransform(lit, [0, 1], [0.45, 1]);
  const copyX = useTransform(lit, [0, 1], [-10, 0]);

  return (
    <li className="relative grid grid-cols-[auto_1fr] gap-6 pb-14 last:pb-0 sm:gap-10">
      <motion.span
        style={
          reduced
            ? undefined
            : {
                backgroundColor: markerBg,
                borderColor: markerBorder,
                color: markerText,
              }
        }
        className={`relative z-10 grid size-9 place-items-center border text-[length:var(--text-label)] font-semibold tabular-nums sm:size-11 ${
          reduced ? "border-accent-600 bg-accent-600 text-white" : ""
        }`}
      >
        {step.index}
      </motion.span>

      <motion.div
        style={reduced ? undefined : { opacity: copyOpacity, x: copyX }}
        className="pt-1 sm:pt-2"
      >
        <h3 className="font-display text-[length:var(--text-2xl)]">
          {step.title}
        </h3>
        <p className="mt-3 max-w-prose text-lg text-graphite">{step.text}</p>
      </motion.div>
    </li>
  );
}
