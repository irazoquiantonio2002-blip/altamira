"use client";

import { useEffect, useState } from "react";

/**
 * `prefers-reduced-motion` as reactive state (§9).
 *
 * Returns `false` on the server and on the very first client paint, then
 * corrects itself in an effect. That order matters: components read this to
 * decide *how* to animate, never *whether* to render, so a one-frame
 * mismatch can never hide content.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/**
 * True on viewports below `breakpoint` px.
 *
 * Used to downgrade the heavier effects on phones (§8): parallax range is
 * cut, the pinned horizontal track becomes a swipeable row.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    setIsMobile(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [breakpoint]);

  return isMobile;
}

/**
 * True once the component has mounted on the client.
 *
 * Guards anything that must not run during SSR or hydration (canvas, window
 * measurements, ScrollTrigger setup).
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
