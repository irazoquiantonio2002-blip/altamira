"use client";

import { transform, useTransform, type MotionValue } from "motion/react";

/**
 * Maps a scroll progress value through `input` → `output`, evaluated in JS.
 *
 * Use this instead of `useTransform(progress, input, output)` for every
 * scroll-linked numeric value on this site.
 *
 * Why: given a plain range, the motion library offloads scroll-linked
 * `opacity` and transforms to the browser's native ScrollTimeline. On this
 * site that native timeline disagrees with the JS progress value it was
 * derived from — measured in the browser, text that should be fully visible
 * at the end of a reveal sat at ~10% opacity, and the footer wordmark never
 * rose above 0.3%, while a `y` computed from the very same progress landed
 * exactly where expected. A function transform cannot be offloaded, so it is
 * always evaluated against the real progress value. The cost is one
 * interpolation per frame per value, which is negligible.
 *
 * `transform` clamps to the output range by default.
 */
export function useScrollValue(
  progress: MotionValue<number>,
  input: number[],
  output: number[],
): MotionValue<number> {
  return useTransform(progress, (v) => transform(v, input, output));
}
