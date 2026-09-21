"use client";

import { useRef } from "react";
import { motion, useScroll, type MotionValue } from "motion/react";
import { useIsMobile, useReducedMotion } from "@/lib/useMotionPrefs";
import { useScrollValue } from "@/lib/useScrollValue";

export type SwapItem = {
  index: string;
  title: string;
  text: string;
  image: { src: string; alt: string };
};

/**
 * A pinned photograph that cross-fades from one image to the next as the
 * reader moves through a column of text beside it.
 *
 * Each image owns a slice of the section's scroll range and fades in and out
 * within it. The slices deliberately overlap: without the overlap there is a
 * frame where both images are partly transparent and the dark background
 * shows through as a flash.
 *
 * Below `lg` the pinned column does not fit beside the text, so each block
 * simply carries its own photo above it.
 */
export function StickySwapGallery({ items }: { items: SwapItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile(1024);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  if (reduced || isMobile) {
    return (
      <div className="container-x">
        <div className="border-t border-rule">
          {items.map((item) => (
            <article key={item.index} className="border-b border-rule py-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image.src}
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
    <div ref={ref} className="container-x">
      <div className="grid gap-16 lg:grid-cols-[1fr_1fr]">
        {/* Pinned photo column. */}
        <div className="relative hidden lg:block">
          <div className="sticky top-[18vh] aspect-4/5 w-full overflow-hidden bg-paper-100">
            {items.map((item, i) => (
              <SwapImage
                key={item.image.src}
                src={item.image.src}
                alt={item.image.alt}
                progress={scrollYProgress}
                index={i}
                total={items.length}
              />
            ))}
          </div>
        </div>

        {/* Text column — each block is one viewport-ish tall so the image
            change lands with the block it belongs to. */}
        <div>
          {items.map((item) => (
            <article
              key={item.index}
              className="flex min-h-[86vh] flex-col justify-center border-b border-rule"
            >
              <span className="font-display text-[length:var(--text-3xl)] text-rule-strong">
                {item.index}
              </span>
              <h3 className="mt-4 font-display text-[length:var(--text-2xl)]">
                {item.title}
              </h3>
              <p className="mt-5 max-w-prose text-lg text-graphite">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function SwapImage({
  src,
  alt,
  progress,
  index,
  total,
}: {
  src: string;
  alt: string;
  progress: MotionValue<number>;
  index: number;
  total: number;
}) {
  const slice = 1 / total;
  const start = index * slice;
  const end = start + slice;
  // A fifth of a slice of overlap on each side — enough to cross-fade
  // without ever leaving a gap where neither image is opaque.
  const bleed = slice * 0.2;

  /**
   * The bleed pushes the first slice below 0 and the last one above 1. Kept
   * inside [0, 1]: when these ranges were still passed to `useTransform`
   * directly, the motion library handed them to the Web Animations API as
   * keyframe offsets, and an out-of-range first/last offset threw
   * "Offsets must be monotonically non-decreasing" at mount.
   */
  const clamp = (v: number) => Math.min(1, Math.max(0, v));

  const opacity = useScrollValue(
    progress,
    [
      clamp(start - bleed),
      clamp(start + bleed),
      clamp(end - bleed),
      clamp(end + bleed),
    ],
    // The first image starts visible and the last one stays visible, so the
    // column is never empty at either end of the scroll.
    [index === 0 ? 1 : 0, 1, 1, index === total - 1 ? 1 : 0],
  );

  const scale = useScrollValue(
    progress,
    [clamp(start - bleed), clamp(end + bleed)],
    [1.08, 1],
  );

  return (
    <motion.div style={{ opacity }} className="absolute inset-0">
      <motion.div style={{ scale }} className="size-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="size-full object-cover saturate-[.8]"
        />
      </motion.div>
    </motion.div>
  );
}
