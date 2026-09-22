"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { useIsMobile, useReducedMotion } from "@/lib/useMotionPrefs";
import { EASE_OUT_EXPO } from "@/lib/animations";
import { responsiveImg } from "@/lib/responsiveImg";

export type SwapItem = {
  index: string;
  title: string;
  text: string;
  image: { src: string; alt: string };
};

const OPEN = "inset(0% 0% 0% 0%)";
const CLOSED = "inset(100% 0% 0% 0%)";

/**
 * A pinned photograph that changes as the reader moves through a column of
 * text beside it.
 *
 * Which photo shows is decided by which text block is crossing the middle of
 * the screen — not by slicing the section's scroll into equal parts. The
 * slicing version drifted out of step with the text (by the third block the
 * fourth photo was already taking over) and cross-faded two photos at partial
 * opacity and different scales for long stretches, which read as a broken
 * double exposure.
 *
 * The change itself is a wipe: the incoming photo uncovers upward over the
 * outgoing one, which stays fully opaque underneath until it is covered. Two
 * photos are never both half-visible.
 *
 * Below `lg` the pinned column does not fit beside the text, so each block
 * simply carries its own photo above it.
 */
export function StickySwapGallery({ items }: { items: SwapItem[] }) {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile(1024);
  // One state object, so the pair always changes together and the updater
  // stays pure.
  const [{ active, previous }, setSwap] = useState({ active: 0, previous: -1 });

  const activate = (i: number) =>
    setSwap((s) => (s.active === i ? s : { active: i, previous: s.active }));

  if (reduced || isMobile) {
    return (
      <div className="container-x">
        <div className="border-t border-rule">
          {items.map((item) => (
            <article key={item.index} className="border-b border-rule py-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                {...responsiveImg(item.image.src, "100vw")}
                alt={item.image.alt}
                className="aspect-3/2 w-full object-cover saturate-[.8]"
              />
              <span className="mt-6 block font-display text-[length:var(--text-2xl)] text-rule-strong">
                {item.index}
              </span>
              <h3 className="mt-2 font-display text-[length:var(--text-xl)]">
                {item.title}
              </h3>
              <p className="mt-3 text-slate">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container-x">
      <div className="grid gap-16 lg:grid-cols-[1fr_1fr]">
        {/* Pinned photo column. */}
        <div className="relative hidden lg:block">
          <div className="sticky top-[18vh] aspect-4/5 w-full overflow-hidden bg-paper-100">
            {items.map((item, i) => {
              const isActive = i === active;
              // The outgoing photo stays open underneath the incoming one.
              const isOpen = isActive || i === previous;
              return (
                <motion.div
                  key={item.image.src}
                  className="absolute inset-0"
                  style={{ zIndex: isActive ? 2 : i === previous ? 1 : 0 }}
                  initial={false}
                  animate={{ clipPath: isOpen ? OPEN : CLOSED }}
                  transition={{
                    duration: isActive ? 1.05 : 0,
                    ease: EASE_OUT_EXPO,
                  }}
                >
                  <motion.div
                    className="size-full"
                    initial={false}
                    animate={{ scale: isActive ? 1 : 1.08 }}
                    transition={{ duration: isActive ? 1.4 : 0, ease: EASE_OUT_EXPO }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      {...responsiveImg(item.image.src, "(max-width: 1024px) 100vw, 50vw")}
                      alt={item.image.alt}
                      className="size-full object-cover saturate-[.8]"
                    />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Text column — one block per photo. */}
        <div>
          {items.map((item, i) => (
            <SwapBlock key={item.index} item={item} onActive={() => activate(i)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SwapBlock({ item, onActive }: { item: SwapItem; onActive: () => void }) {
  const ref = useRef<HTMLElement>(null);
  // A zero-height line across the middle of the viewport: the block crossing
  // it is the one being read.
  const crossing = useInView(ref, { margin: "-50% 0px -50% 0px" });

  useEffect(() => {
    if (crossing) onActive();
    // `onActive` is recreated every render; only the crossing state matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crossing]);

  return (
    <article
      ref={ref}
      className="flex min-h-[86vh] flex-col justify-center border-b border-rule"
    >
      <span className="font-display text-[length:var(--text-3xl)] text-rule-strong">
        {item.index}
      </span>
      <h3 className="mt-4 font-display text-[length:var(--text-2xl)]">{item.title}</h3>
      <p className="mt-5 max-w-prose text-lg text-graphite">{item.text}</p>
    </article>
  );
}
