"use client";

import { useEffect } from "react";
import { useReducedMotion } from "@/lib/useMotionPrefs";
import { loadGsap } from "@/lib/gsap";

/**
 * Lenis smooth scroll, wired into GSAP's ticker so ScrollTrigger and Lenis
 * read the same clock. Without this handshake the pinned sections drift
 * against the smoothed scroll position and visibly judder.
 *
 * Skipped entirely when the visitor prefers reduced motion — native scrolling
 * is the correct behaviour there, not a slower smoothed version of it.
 */
export function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    let destroyed = false;
    // Kept outside the async body so cleanup can reach them.
    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ default: Lenis }, { gsap, ScrollTrigger }] = await Promise.all([
        import("lenis"),
        loadGsap(),
      ]);

      // The effect may have been torn down while the chunks were in flight.
      if (destroyed) return;

      const lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        // Touch devices already have momentum scrolling; smoothing it again
        // feels laggy and costs frames.
        syncTouch: false,
      });

      document.documentElement.classList.add("lenis-active");

      const onScroll = () => ScrollTrigger.update();
      lenis.on("scroll", onScroll);

      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      // GSAP's lag smoothing would freeze Lenis after a long frame.
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        lenis.off("scroll", onScroll);
        gsap.ticker.remove(raf);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
        document.documentElement.classList.remove("lenis-active");
      };
    })();

    return () => {
      destroyed = true;
      cleanup?.();
    };
  }, [reduced]);

  return null;
}
