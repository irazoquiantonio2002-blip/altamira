"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  motion,
  transform,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "motion/react";
import { useReducedMotion } from "@/lib/useMotionPrefs";
import { useScrollValue } from "@/lib/useScrollValue";
import { responsiveImg } from "@/lib/responsiveImg";

/**
 * SmoothScrollHero ("modern-hero") — the 21st.dev component, kept faithful.
 *
 * Same structure and numbers as the original: a `SECTION_HEIGHT` of 1500px
 * plus one viewport; a sticky centre image whose clip-path polygon opens from
 * 25%/75% to the full frame over the first 1500px while the photo zooms out
 * from 170% to 100% over 2000px and then fades out over the last 500px; four
 * photographs that fly up past it at their own speeds (start/end offsets of
 * -200/200, 200/-250, -200/200 and 0/-500); a gradient that dissolves the
 * block into the page; and the list that follows, each row rising into view.
 *
 * Differences, all needed to use it anywhere but the top of a page:
 *   · The original measures raw `window.scrollY`, i.e. it assumes it is the
 *     first thing on the page. Here every range is measured from where the
 *     section actually starts, so the timing is identical wherever it sits.
 *   · The zoom is a `scale` on an <img> instead of `background-size`. Same
 *     look on landscape screens, but `background-size: 100%` fits the width
 *     only, which on a portrait phone leaves the photo as a strip with empty
 *     bands above and below.
 *   · Light theme: it dissolves into white rather than zinc-950, and the
 *     list uses the site's type rather than black uppercase.
 */
const SECTION_HEIGHT = 1500;

export type ParallaxShot = {
  src: string;
  alt: string;
  start: number;
  end: number;
  className: string;
};

export type ScheduleItem = {
  title: string;
  date: string;
  location: string;
  href?: string;
};

export function SmoothScrollHero({
  image,
  shots,
  heading,
  label,
  items,
}: {
  image: { src: string; alt: string };
  shots: ParallaxShot[];
  heading: string;
  label?: string;
  items: ScheduleItem[];
}) {
  return (
    <div className="bg-paper">
      <Hero image={image} shots={shots} />
      <Schedule heading={heading} label={label} items={items} />
    </div>
  );
}

function Hero({
  image,
  shots,
}: {
  image: { src: string; alt: string };
  shots: ParallaxShot[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Document-space top of the section, kept current as the layout above it
  // changes (fonts, images and the pinned hero all shift it after load).
  const top = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      top.current = el.getBoundingClientRect().top + window.scrollY;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
      className="relative w-full"
    >
      <CenterImage image={image} top={top} />
      <ParallaxImages shots={shots} />
      <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-b from-paper/0 to-paper" />
    </div>
  );
}

function CenterImage({
  image,
  top,
}: {
  image: { src: string; alt: string };
  top: React.RefObject<number>;
}) {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();

  // All ranges are the original's, measured from the section's own top.
  const local = (v: number) => v - (top.current ?? 0);

  const clip1 = useTransform(scrollY, (v) =>
    transform(local(v), [0, SECTION_HEIGHT], [25, 0]),
  );
  const clip2 = useTransform(scrollY, (v) =>
    transform(local(v), [0, SECTION_HEIGHT], [75, 100]),
  );
  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;

  const scale = useTransform(scrollY, (v) =>
    transform(local(v), [0, SECTION_HEIGHT + 500], [1.7, 1]),
  );
  const opacity = useTransform(scrollY, (v) =>
    transform(local(v), [SECTION_HEIGHT, SECTION_HEIGHT + 500], [1, 0]),
  );

  // Reduced motion: the photo simply sits full-frame. Styles are dropped
  // rather than branched inside the transforms, because a transform function
  // is captured once and would not see `reduced` flip after mount.
  return (
    <motion.div
      style={reduced ? undefined : { clipPath, opacity }}
      className="sticky top-0 h-screen w-full overflow-hidden"
    >
      <motion.div style={reduced ? undefined : { scale }} className="size-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          {...responsiveImg(image.src, "100vw")}
          alt={image.alt}
          className="size-full object-cover object-center"
        />
      </motion.div>
    </motion.div>
  );
}

function ParallaxImages({ shots }: { shots: ParallaxShot[] }) {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-[200px]">
      {shots.map((shot) => (
        <ParallaxImg key={shot.src + shot.start} {...shot} />
      ))}
    </div>
  );
}

function ParallaxImg({ className, alt, src, start, end }: ParallaxShot) {
  const ref = useRef<HTMLImageElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    // Same shape as the original: begin `start`px before the image reaches the
    // bottom of the screen, finish `end`px after it leaves the top.
    offset: [`${start}px end`, `end ${end * -1}px`],
  });

  const opacity = useScrollValue(scrollYProgress, [0.75, 1], [1, 0]);
  const scale = useScrollValue(scrollYProgress, [0.75, 1], [1, 0.85]);
  const y = useScrollValue(scrollYProgress, [0, 1], [start, end]);
  const transformStyle = useMotionTemplate`translateY(${y}px) scale(${scale})`;

  return (
    <motion.img
      ref={ref}
      {...responsiveImg(src, "(max-width: 768px) 70vw, 40vw")}
      alt={alt}
      className={`relative z-10 ${className}`}
      style={reduced ? undefined : { transform: transformStyle, opacity }}
    />
  );
}

function Schedule({
  heading,
  label,
  items,
}: {
  heading: string;
  label?: string;
  items: ScheduleItem[];
}) {
  const reduced = useReducedMotion();
  const rise = reduced
    ? {}
    : {
        initial: { y: 48, opacity: 0 },
        whileInView: { y: 0, opacity: 1 },
        viewport: { once: true },
        transition: { ease: "easeInOut" as const, duration: 0.75 },
      };

  return (
    <section className="mx-auto max-w-5xl px-4 py-32 sm:py-48">
      {label ? (
        <span className="section-label mb-6">
          <span aria-hidden="true" className="size-[5px] bg-accent-600" />
          {label}
        </span>
      ) : null}

      <motion.h2
        data-reveal
        {...rise}
        className="mb-20 font-display text-[length:var(--text-4xl)]"
      >
        {heading}
      </motion.h2>

      {items.map((item) => {
        const inner = (
          <>
            <div>
              <p className="mb-1.5 font-display text-xl text-navy-700 sm:text-2xl">
                {item.title}
              </p>
              <p className="text-sm uppercase tracking-[0.14em] text-slate">
                {item.date}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-end text-sm uppercase tracking-[0.14em] text-slate transition-colors group-hover:text-accent-600">
              <p>{item.location}</p>
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="square"
              >
                {item.href ? (
                  <path d="M4 12h15M14 6l6 6-6 6" />
                ) : (
                  <>
                    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
                    <circle cx="12" cy="10" r="2.6" />
                  </>
                )}
              </svg>
            </div>
          </>
        );

        return (
          <motion.div data-reveal key={item.title} {...rise}>
            {item.href ? (
              <Link
                href={item.href}
                className="group mb-9 flex items-center justify-between border-b border-rule px-3 pb-9 transition-colors hover:border-accent-600"
              >
                {inner}
              </Link>
            ) : (
              <div className="group mb-9 flex items-center justify-between border-b border-rule px-3 pb-9">
                {inner}
              </div>
            )}
          </motion.div>
        );
      })}
    </section>
  );
}
