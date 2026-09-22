"use client";

import { useEffect, useRef } from "react";
import { community } from "@/lib/site-data";
import { loadGsap } from "@/lib/gsap";
import { useIsMobile, useReducedMotion } from "@/lib/useMotionPrefs";
import { SectionHead } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The four community pillars, as a pinned horizontal scroll.
 *
 * Desktop: the section pins and the panel track translates sideways as you
 * scroll down.
 *
 * Mobile and reduced-motion: no pin, no ScrollTrigger. The same track becomes
 * a natively swipeable row with scroll-snap. A pinned horizontal scroll on a
 * phone fights the browser's own gesture handling, so it degrades rather than
 * being forced.
 */
export function Community() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
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
        // Measured in a function so `invalidateOnRefresh` re-runs it after a
        // resize instead of keeping a stale width.
        const distance = () => track.scrollWidth - section.offsetWidth;

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            // Pin the inner wrapper, never the <section> itself. To pin an
            // element GSAP wraps it in a `.pin-spacer` div, which reparents
            // it. When the pinned element is the section — a direct child of
            // the React-rendered <main> — React later tries
            // `main.removeChild(section)` on navigation, the section is no
            // longer main's child, and the whole app dies with
            // "Failed to execute 'removeChild' on 'Node'". Pinning a node
            // React never has to remove directly keeps the spacer inside the
            // section, where it is harmless.
            pin: pinRef.current,
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
      className="overflow-hidden bg-paper-50 py-20 lg:py-0"
    >
      <div ref={pinRef} className="lg:flex lg:h-[100svh] lg:flex-col lg:justify-center">
        <div className="container-x">
          <Reveal direction="up">
            <SectionHead
              label={community.label}
              title={community.title}
              lead={community.subtitle}
            />
          </Reveal>
        </div>

        <div
          className={[
            "mt-12 sm:mt-16",
            "px-[clamp(1.25rem,5vw,4.5rem)]",
            "lg:overflow-visible",
            "max-lg:flex max-lg:snap-x max-lg:snap-mandatory max-lg:overflow-x-auto max-lg:pb-4",
            "max-lg:[scrollbar-width:none] max-lg:[&::-webkit-scrollbar]:hidden",
          ].join(" ")}
        >
          <div
            ref={trackRef}
            className="flex border-l border-rule lg:w-max lg:will-change-transform"
          >
            {community.items.map((item) => (
              <article
                key={item.index}
                className="group flex w-[min(80vw,22rem)] shrink-0 snap-start flex-col justify-between border-r border-rule bg-paper p-8 transition-colors duration-500 hover:bg-paper-100 lg:w-[26rem] lg:p-12"
              >
                <div>
                  <div className="flex items-baseline justify-between">
                    {/* Serif drop-cap — the editorial device that carries
                        these panels instead of an icon. */}
                    <span
                      aria-hidden="true"
                      className="font-display text-[clamp(3.5rem,6vw,5.5rem)] leading-none text-accent-600"
                    >
                      {item.dropCap}
                    </span>
                    <span className="text-[length:var(--text-label)] tracking-[0.2em] text-slate">
                      {item.index}
                    </span>
                  </div>

                  <h3 className="mt-10 font-display text-[length:var(--text-xl)]">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-slate">
                    {item.text}
                  </p>
                </div>

                <span
                  aria-hidden="true"
                  className="mt-10 block h-px w-full origin-left scale-x-0 bg-accent-600 transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100"
                />
              </article>
            ))}
          </div>
        </div>

        <p className="container-x mt-6 text-[length:var(--text-label)] uppercase tracking-[0.2em] text-slate lg:hidden">
          Desliza para ver más
        </p>
      </div>
    </section>
  );
}
