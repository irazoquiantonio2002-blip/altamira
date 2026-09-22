"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, type MotionValue } from "motion/react";
import { useReducedMotion } from "@/lib/useMotionPrefs";
import { useScrollValue } from "@/lib/useScrollValue";
import { responsiveImg } from "@/lib/responsiveImg";

export type StackCard = {
  href: string;
  label: string;
  title: string;
  text: string;
  image: { src: string; alt: string };
};

/**
 * Cards that pin one on top of the other as the reader scrolls, each earlier
 * card easing back and dimming as the next one slides over it.
 *
 * Each card is `position: sticky` with a slightly deeper top offset than the
 * one before, which is what leaves a sliver of every previous card visible —
 * the stack reads as a pile rather than as cards replacing one another. The
 * scale-down is scroll-linked to the whole stack's progress, so a card only
 * starts receding once the cards after it begin to arrive.
 */
export function StackingCards({ cards }: { cards: StackCard[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={ref} className="relative">
      {cards.map((card, i) => (
        <Card
          key={card.href}
          card={card}
          index={i}
          total={cards.length}
          progress={scrollYProgress}
          reduced={reduced}
        />
      ))}
    </div>
  );
}

function Card({
  card,
  index,
  total,
  progress,
  reduced,
}: {
  card: StackCard;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  // Each card recedes a little further than the one above it lands.
  const targetScale = 1 - (total - 1 - index) * 0.05;
  const start = index / total;
  const scale = useScrollValue(progress, [start, 1], [1, targetScale]);

  // Dimming starts only once the NEXT card begins to arrive. Tying it to this
  // card's own start greyed the card out while it was still fully on screen
  // and uncovered, which read as a dirty white rather than as depth.
  const dimStart = Math.min((index + 1) / total, 0.99);
  const dim = useScrollValue(
    progress,
    [dimStart, 1],
    [0, (total - 1 - index) * 0.12],
  );

  return (
    <div
      // 70svh on a phone: the card inside is capped at 34rem, so nothing
      // is cropped — there is simply less scroll between one card and the
      // next.
      className="sticky flex h-[70svh] items-start justify-center sm:h-[88svh]"
      // Stagger the pin line so earlier cards stay peeking above later ones.
      style={{ top: `calc(6.5rem + ${index * 1.75}rem)` }}
    >
      <motion.div
        style={reduced ? undefined : { scale }}
        className="relative w-full origin-top border border-rule bg-paper"
      >
        <Link
          href={card.href}
          className="group grid h-[min(72svh,34rem)] grid-rows-[40%_1fr] lg:grid-cols-[1.25fr_1fr] lg:grid-rows-1"
        >
          <div className="relative overflow-hidden bg-ink-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              {...responsiveImg(card.image.src, "(max-width: 768px) 100vw, 50vw")}
              alt={card.image.alt}
              className="size-full object-cover saturate-[.8] transition-transform duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
            />
          </div>

          <div className="flex flex-col justify-between p-7 sm:p-12">
            <div>
              <span className="text-[length:var(--text-label)] font-semibold uppercase tracking-[0.2em] text-accent-600">
                {String(index + 1).padStart(2, "0")} · {card.label}
              </span>
              <h3 className="mt-4 font-display text-[length:var(--text-2xl)] sm:mt-6 sm:text-[length:var(--text-3xl)]">
                {card.title}
              </h3>
              <p className="mt-4 max-w-md text-slate sm:mt-5 sm:text-lg">{card.text}</p>
            </div>

            <span className="mt-8 inline-flex items-center gap-3 text-sm font-semibold text-navy-700">
              Ver más
              <svg
                viewBox="0 0 20 12"
                aria-hidden="true"
                className="w-5 transition-transform duration-300 group-hover:translate-x-1.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="square"
              >
                <path d="M0 6h18M13 1l5 5-5 5" />
              </svg>
            </span>
          </div>
        </Link>

        {/* Receding cards dim under the ones stacking on top of them. */}
        {!reduced ? (
          <motion.div
            aria-hidden="true"
            style={{ opacity: dim }}
            className="pointer-events-none absolute inset-0 bg-ink-950"
          />
        ) : null}
      </motion.div>
    </div>
  );
}
