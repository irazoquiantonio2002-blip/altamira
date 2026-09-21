"use client";

import { useEffect, useRef } from "react";
import { community } from "@/lib/site-data";
import { loadGsap } from "@/lib/gsap";
import { useIsMobile, useReducedMotion } from "@/lib/useMotionPrefs";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Chevrons } from "@/components/ui/Chevrons";

/**
 * Nuestra Comunidad (§6.8) — the pinned horizontal scroll.
 *
 * Desktop: the section pins and the card track translates sideways as you
 * scroll down. Cards carry a slight alternating tilt and a serif drop-cap.
 *
 * Mobile and reduced-motion: no pin, no ScrollTrigger. The same track becomes
 * a natively swipeable row with scroll-snap. A pinned horizontal scroll on a
 * phone fights the browser's own gesture handling and is the exact kind of
 * effect §8 says must degrade rather than be forced.
 */
export function Community() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const reduced = useReducedMotion();
  const isMobile = useIsMobile(1024);

  useEffect(() => {
    if (reduced || isMobile) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    let ctx: { revert: () => void } | null = null;
    let cancelled = false;

    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;

      ctx = gsap.context(() => {
        // Measured inside a function so `invalidateOnRefresh` can re-run it
        // after a resize instead of keeping a stale width.
        const distance = () => track.scrollWidth - section.offsetWidth;

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.9,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
      }, section);

      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [reduced, isMobile]);

  return (
    <section
      ref={sectionRef}
      id="comunidad"
      className="relative overflow-hidden bg-ink-900 py-24 sm:py-32 lg:py-0"
    >
      <Chevrons corner="bottom-left" className="opacity-40" />

      <div className="lg:flex lg:h-[100svh] lg:flex-col lg:justify-center">
        <div className="container-x">
          <div className="max-w-2xl">
            <Reveal direction="up">
              <SectionLabel className="mb-7">{community.label}</SectionLabel>
            </Reveal>

            <TextReveal
              as="h2"
              lines={[community.title]}
              byWord
              className="font-display text-[length:var(--text-4xl)] text-paper"
            />

            <Reveal direction="up" delay={0.15}>
              <p className="mt-6 text-mist">{community.subtitle}</p>
            </Reveal>
          </div>
        </div>

        {/* Track. On desktop GSAP translates it; on mobile the user swipes it. */}
        <div
          className={[
            "mt-12 sm:mt-16",
            // The horizontal padding matches `container-x` so the first card
            // lines up with the heading above it.
            "px-[clamp(1.25rem,5vw,4rem)]",
            "lg:overflow-visible",
            "max-lg:flex max-lg:snap-x max-lg:snap-mandatory max-lg:overflow-x-auto max-lg:pb-4",
            "max-lg:[scrollbar-width:none] max-lg:[&::-webkit-scrollbar]:hidden",
          ].join(" ")}
        >
          <div
            ref={trackRef}
            className="flex gap-5 lg:w-max lg:will-change-transform"
          >
            {community.items.map((item, i) => (
              <article
                key={item.index}
                className={[
                  "group relative flex shrink-0 snap-start flex-col justify-between",
                  "w-[min(78vw,20rem)] lg:w-[24rem]",
                  "rounded-card border border-hairline bg-ink-800/60 p-7 sm:p-9",
                  "transition-[transform,border-color] duration-500 ease-[cubic-bezier(.16,1,.3,1)]",
                  "hover:border-hairline-strong lg:hover:-translate-y-2",
                  // Alternating tilt — only on desktop, and only ~0.6deg.
                  // Anything more and the text edges look misprinted.
                  i % 2 === 0 ? "lg:rotate-[-0.6deg]" : "lg:rotate-[0.6deg]",
                ].join(" ")}
              >
                <div>
                  <div className="mb-6 flex items-baseline justify-between gap-4">
                    <span
                      aria-hidden="true"
                      className="font-display text-[clamp(3rem,5vw,4.5rem)] leading-none text-accent-500/70"
                    >
                      {item.dropCap}
                    </span>
                    <span className="font-sans text-[length:var(--text-label)] tracking-[0.22em] text-mist-dim">
                      {item.index}
                    </span>
                  </div>

                  <h3 className="font-display text-[length:var(--text-xl)] text-paper">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-sm leading-relaxed text-mist">
                    {item.text}
                  </p>
                </div>

                <span
                  aria-hidden="true"
                  className="mt-8 block h-px w-full origin-left scale-x-0 bg-accent-500 transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100"
                />
              </article>
            ))}
          </div>
        </div>

        {/* Swipe affordance — mobile only, where the track is a real scroller. */}
        <p className="container-x mt-6 text-[length:var(--text-label)] uppercase tracking-[0.22em] text-mist-dim lg:hidden">
          Desliza para ver más
        </p>
      </div>
    </section>
  );
}
