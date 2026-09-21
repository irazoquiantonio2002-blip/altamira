/**
 * Lazily loads GSAP + ScrollTrigger and registers the plugin exactly once.
 *
 * GSAP is only needed by the two scroll-pinned sections (Hero, Comunidad), so
 * it is kept out of the initial bundle (§10) and pulled in from an effect.
 * The module-level promise makes concurrent callers share one download.
 */

type GsapModule = typeof import("gsap");
type ScrollTriggerType = typeof import("gsap/ScrollTrigger").ScrollTrigger;

export type GsapBundle = {
  gsap: GsapModule["gsap"];
  ScrollTrigger: ScrollTriggerType;
};

let bundlePromise: Promise<GsapBundle> | null = null;

export function loadGsap(): Promise<GsapBundle> {
  if (!bundlePromise) {
    bundlePromise = Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]).then(([gsapMod, stMod]) => {
      const { gsap } = gsapMod;
      const { ScrollTrigger } = stMod;
      gsap.registerPlugin(ScrollTrigger);
      return { gsap, ScrollTrigger };
    });
  }
  return bundlePromise;
}
