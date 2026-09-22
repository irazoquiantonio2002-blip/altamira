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

  /* Marks the document while a scroll is in flight.
   *
   * Some decorative animations are far cheaper to hold still for the length
   * of a scroll than to keep running through it. The line fields are the
   * case that forced this: each one keeps ~88 SVG strokes animating, and an
   * active animation on that many elements makes the browser restyle and
   * re-raster the whole field every frame. Measured while scrolling
   * /nosotros, that alone took the 95th-percentile frame from 17ms to
   * 50-70ms.
   *
   * `animation-play-state` freezes in place and resumes from the same
   * point, so nothing restarts or jumps. The frozen drift is invisible
   * during a scroll — the field travels up the screen far faster than the
   * light travels along it — and it starts again the moment the page
   * settles.
   *
   * Deliberately outside the effect below: this has to work whether or not
   * Lenis is running, including under reduced motion and before the smooth
   * scroll chunk has loaded. */
  useEffect(() => {
    const el = document.documentElement;
    let timer: number | undefined;
    const onScroll = () => {
      el.classList.add("is-scrolling");
      window.clearTimeout(timer);
      timer = window.setTimeout(() => el.classList.remove("is-scrolling"), 140);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      el.classList.remove("is-scrolling");
    };
  }, []);

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
