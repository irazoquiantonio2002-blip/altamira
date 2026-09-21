"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { heroActs } from "@/lib/site-data";
import { loadGsap } from "@/lib/gsap";
import { useIsMobile, useReducedMotion } from "@/lib/useMotionPrefs";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { EASE_OUT_EXPO } from "@/lib/animations";

/* ============================================================================
   HERO — ported from the previous site's pinned three-act scroll.

   WHAT WAS KEPT (the concept, per §5.1):
     · the three acts Altamira → Formación → Futuro, with their real copy
     · the campus backdrop revealing and growing as you scroll
     · the `nino-estudiando.png` foreground layer
     · the "Desliza" indicator with its 00 / 02 act counter
     · the CTA landing on the final act

   WHAT CHANGED, and why:
     · The Three.js starfield canvas is gone. §5.3 asks for less visual noise
       and §5.4 asks for a scale/clip-path/parallax reveal instead — and a
       WebGL scene was the single most expensive thing on the page, on the
       phones this section most needed to be fixed for. The old file is kept
       at `legacy/js/hero-cosmos.js` if it is ever wanted back.
     · Acts are laid out in normal flow inside a centered grid instead of
       `position:absolute` + `translate(-50%,-50%)`. That centering trick was
       the actual cause of the mobile breakage: it took the acts out of flow,
       so nothing reserved height for them and long lines overflowed sideways.
     · `100vh` → `100svh`. On mobile `100vh` counts the browser chrome that
       is not actually there, which is why the hero was clipped.
     · Backdrop zoom pulled back from `scale(1 + p * 2.2)` (up to 3.2×) to a
       1.06 → 1.22 drift. Past roughly 1.3× a 1600px-wide photo is visibly
       soft, and the old range read as a zoom effect rather than as depth.
     · The darkening ramp now stops at 0.82 instead of 0.99, so the campus
       stays legible through the whole scroll rather than going to black.
   ========================================================================= */

/** How far the backdrop travels, as a scale multiplier, across the full pin. */
const ZOOM_FROM = 1.06;
const ZOOM_TO = 1.22;

/** Scrim opacity at the start and end of the pin. */
const DARK_FROM = 0.42;
const DARK_TO = 0.82;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const reduced = useReducedMotion();
  const isMobile = useIsMobile();

  const [act, setAct] = useState(0);
  const total = heroActs.length;

  useEffect(() => {
    // Reduced motion gets a static, fully legible hero: first act only, no
    // pin, no scrub. §5.5.
    if (reduced) return;

    const pin = pinRef.current;
    const section = sectionRef.current;
    if (!pin || !section) return;

    let ctx: { revert: () => void } | null = null;
    let cancelled = false;

    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;

      ctx = gsap.context(() => {
        gsap.set(backdropRef.current, { scale: ZOOM_FROM });

        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          // One extra viewport of scroll per act after the first.
          end: `+=${(total - 1) * 100}%`,
          pin: pin,
          pinSpacing: true,
          scrub: 0.8,
          // `invalidateOnRefresh` re-measures after a mobile URL-bar resize,
          // which otherwise leaves the pin offset by the bar's height.
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;

            // Scale + parallax on the backdrop — the §5.4 enterprise reveal.
            if (backdropRef.current) {
              gsap.set(backdropRef.current, {
                scale: ZOOM_FROM + p * (ZOOM_TO - ZOOM_FROM),
                yPercent: p * (isMobile ? -3 : -6),
              });
            }

            if (scrimRef.current) {
              gsap.set(scrimRef.current, {
                opacity: DARK_FROM + p * (DARK_TO - DARK_FROM),
              });
            }

            // The foreground child drifts faster than the backdrop: two
            // speeds is what reads as depth.
            if (childRef.current) {
              gsap.set(childRef.current, {
                yPercent: p * (isMobile ? 8 : 16),
                opacity: 1 - Math.max(0, (p - 0.55) / 0.35),
              });
            }

            if (progressRef.current) {
              gsap.set(progressRef.current, { scaleX: p });
            }

            // Round to the nearest act so the counter and the copy switch
            // together, at the midpoint between acts.
            const next = Math.round(p * (total - 1));
            setAct((cur) => (cur === next ? cur : next));
          },
        });
      }, section);

      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [reduced, isMobile, total]);

  const current = heroActs[act] ?? heroActs[0];

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Colegio Altamira La Cima"
      className="relative"
    >
      <div
        ref={pinRef}
        className={[
          "relative flex w-full flex-col overflow-hidden",
          // `svh` is the small viewport height — it excludes the collapsible
          // mobile browser chrome, so the hero never gets clipped (§5.2).
          "h-[100svh] min-h-[560px]",
          // Respect the notch / home indicator.
          "pt-[max(env(safe-area-inset-top),0px)]",
          "pb-[max(env(safe-area-inset-bottom),0px)]",
        ].join(" ")}
      >
        {/* ── Backdrop ─────────────────────────────────────────────── */}
        <div
          ref={backdropRef}
          aria-hidden="true"
          className="absolute inset-0 will-change-transform"
          style={reduced ? { transform: "scale(1.04)" } : undefined}
        >
          <Image
            src="/img/hero/campus-backdrop.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            quality={82}
            // De-saturated and slightly dimmed at source (§5.3) so the photo
            // sits behind the type instead of competing with it.
            className="object-cover object-center saturate-[.7] brightness-[.92]"
          />
        </div>

        {/* Flat scrim: the layer that darkens across the scroll. */}
        <div
          ref={scrimRef}
          aria-hidden="true"
          className="absolute inset-0 bg-ink-950"
          style={{ opacity: reduced ? 0.55 : DARK_FROM }}
        />

        {/* Fixed gradient: keeps the navbar and the bottom rail legible
            regardless of where the flat scrim currently sits. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-ink-950/80 via-transparent to-ink-950/95"
        />
        {/* Left-weighted gradient. The copy column sits over the busiest,
            brightest part of the photo, and without this the subtitle lines
            fall below AA against the notebook page underneath them. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/75 to-transparent sm:via-ink-950/55"
        />
        {/* A touch of brand navy so the photo reads as Altamira, not stock. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-navy-700/25 mix-blend-multiply"
        />

        {/* ── Foreground child ─────────────────────────────────────── */}
        {/* Hidden below `sm`: at phone widths it either covered the headline
            or was cropped to an unreadable sliver. §5.2 allows relocating or
            simplifying it on mobile. */}
        <div
          ref={childRef}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-[4%] hidden w-[clamp(140px,18vw,280px)] origin-bottom sm:block lg:right-[8%]"
        >
          <Image
            src="/img/hero/nino-estudiando.png"
            alt=""
            width={280}
            height={380}
            className="h-auto w-full opacity-90"
          />
        </div>

        {/* ── Copy ─────────────────────────────────────────────────── */}
        <div className="container-x relative z-10 flex flex-1 items-center">
          <div className="w-full max-w-[min(100%,54rem)] pt-24 pb-36 sm:pb-32">
            <AnimatePresence mode="wait">
              <motion.div
                key={act}
                initial={reduced ? false : { opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -18 }}
                transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
              >
                <SectionLabel className="mb-6 text-paper/80">
                  {current.eyebrow}
                </SectionLabel>

                <h1 className="font-display text-[length:var(--text-hero)] leading-[0.92] tracking-[-0.03em] text-paper">
                  {/* Word-level mask reveal (§5.4). */}
                  {current.title.split("").map((ch, i) => (
                    <motion.span
                      key={`${act}-${i}`}
                      className="inline-block"
                      initial={reduced ? false : { y: "0.45em", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        duration: 0.8,
                        delay: reduced ? 0 : i * 0.035,
                        ease: EASE_OUT_EXPO,
                      }}
                    >
                      {ch}
                    </motion.span>
                  ))}
                </h1>

                <div className="mt-7 max-w-xl space-y-1">
                  {current.lines.map((line, i) => (
                    <motion.p
                      key={line}
                      className="text-lg text-paper/85"
                      initial={reduced ? false : { opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.7,
                        delay: reduced ? 0 : 0.25 + i * 0.08,
                        ease: EASE_OUT_EXPO,
                      }}
                    >
                      {line}
                    </motion.p>
                  ))}
                </div>

                {current.cta ? (
                  <motion.div
                    className="mt-10"
                    initial={reduced ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.7,
                      delay: reduced ? 0 : 0.45,
                      ease: EASE_OUT_EXPO,
                    }}
                  >
                    <Button
                      href={current.cta.href}
                      variant="white"
                      size="lg"
                      magnetic
                    >
                      {current.cta.label}
                    </Button>
                  </motion.div>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Scroll rail: "Desliza" + progress + 00 / 02 ───────────── */}
        <div className="container-x relative z-10 pb-8">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="shrink-0 font-sans text-[length:var(--text-label)] uppercase tracking-[0.22em] text-paper/60">
              Desliza
            </span>
            <div
              className="h-px flex-1 bg-white/15"
              role="progressbar"
              aria-label="Progreso del hero"
              aria-valuenow={act + 1}
              aria-valuemin={1}
              aria-valuemax={total}
            >
              <div
                ref={progressRef}
                className="h-px w-full origin-left scale-x-0 bg-accent-500"
              />
            </div>
            <span className="shrink-0 font-sans text-[length:var(--text-label)] tabular-nums tracking-[0.18em] text-paper/60">
              {String(act).padStart(2, "0")} / {String(total - 1).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Vertical brand mark — desktop only, purely typographic. */}
        <span
          aria-hidden="true"
          className="absolute left-6 top-1/2 hidden -translate-y-1/2 [writing-mode:vertical-rl] font-sans text-[length:var(--text-label)] uppercase tracking-[0.35em] text-paper/35 xl:block"
        >
          La Cima
        </span>
      </div>
    </section>
  );
}
