"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  transform,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useIsMobile, useReducedMotion } from "@/lib/useMotionPrefs";
import { responsiveImg } from "@/lib/responsiveImg";

type Img = { src: string; alt: string };

/**
 * ScrollChoreography — four photographs, one headline, three acts.
 *
 * Built on the 21st.dev ScrollChoreography idea (four photos converge and one
 * opens out to full screen), with the opening reworked because the original
 * one read as four identical 3:1 strips in a rigid 2×2 grid with heavy
 * shadows — windows on a desktop, with every face cropped.
 *
 *   Entrance — as the section rises into view, the photos arrive one after
 *              another from below, each settling from a tilt, around a
 *              headline that fades up in the middle.
 *   Act 1    — pinned: the loose composition drifts, each photo at its own
 *              speed.
 *   Act 2    — the photos gather into a pile at the centre, each at a slight
 *              angle like prints dropped on a table; the headline clears.
 *   Act 3    — the top photo opens out to the full screen and the others
 *              fade beneath it; the optional caption appears.
 *
 * Portrait frames of different sizes replace the equal strips, so the photos
 * show people rather than slices of them. The pinned acts run through the
 * original's spring (stiffness 400, damping 50, mass 1.2) for weight; the
 * entrance is driven by the section's own approach, so it plays before the
 * pin engages instead of the photos simply already being there.
 */

type Pose = { x: number; y: number; r: number; s: number };

type CardSpec = {
  /** Width in vw; height follows from the aspect ratio. */
  w: number;
  aspect: string;
  start: Pose;
  drift: Pose;
  stack: Pose;
  /** Entrance window, as a fraction of the section's approach. */
  enter: [number, number];
  /** Direction of the entrance tilt. */
  spin: 1 | -1;
};

type HeroSpec = {
  start: Pose & { w: number; h: number };
  drift: Pose;
  stack: { w: number; h: number };
  enter: [number, number];
};

// x/y are offsets from the centre in vw/vh; r is degrees; s is scale.
const DESKTOP: { cards: CardSpec[]; hero: HeroSpec } = {
  cards: [
    {
      w: 15,
      aspect: "3 / 4",
      start: { x: -33, y: -15, r: -6, s: 1 },
      drift: { x: -34, y: -20, r: -4, s: 1 },
      stack: { x: -1.2, y: 1.4, r: -7, s: 1.3 },
      enter: [0.15, 0.62],
      spin: -1,
    },
    {
      w: 12,
      aspect: "4 / 5",
      start: { x: -28, y: 26, r: 5, s: 1 },
      drift: { x: -29, y: 30, r: 3, s: 1 },
      stack: { x: 1.4, y: -1, r: 5, s: 1.62 },
      enter: [0.3, 0.76],
      spin: 1,
    },
    {
      w: 13,
      aspect: "4 / 5",
      start: { x: 31, y: 25, r: -4, s: 1 },
      drift: { x: 32, y: 21, r: -2, s: 1 },
      stack: { x: -0.6, y: 0.8, r: -3, s: 1.5 },
      enter: [0.42, 0.88],
      spin: 1,
    },
  ],
  hero: {
    start: { x: 30, y: -14, r: 3, s: 1, w: 18, h: 40 },
    drift: { x: 29, y: -18, r: 2, s: 1 },
    stack: { w: 20, h: 44 },
    enter: [0.24, 0.7],
  },
};

// On phones the top pair sits lower than a mirror of the bottom pair would:
// the fixed navbar takes the top ~9% of a portrait screen.
const MOBILE: { cards: CardSpec[]; hero: HeroSpec } = {
  cards: [
    {
      w: 36,
      aspect: "3 / 4",
      start: { x: -24, y: -25, r: -6, s: 1 },
      drift: { x: -25, y: -28, r: -4, s: 1 },
      stack: { x: -1.5, y: 1.2, r: -7, s: 1.35 },
      enter: [0.15, 0.62],
      spin: -1,
    },
    {
      w: 34,
      aspect: "4 / 5",
      start: { x: -23, y: 30, r: 5, s: 1 },
      drift: { x: -24, y: 33, r: 3, s: 1 },
      stack: { x: 1.5, y: -1, r: 5, s: 1.45 },
      enter: [0.3, 0.76],
      spin: 1,
    },
    {
      w: 34,
      aspect: "4 / 5",
      start: { x: 24, y: 31, r: -4, s: 1 },
      drift: { x: 25, y: 28, r: -2, s: 1 },
      stack: { x: -0.8, y: 0.8, r: -3, s: 1.42 },
      enter: [0.42, 0.88],
      spin: 1,
    },
  ],
  hero: {
    start: { x: 24, y: -24, r: 3, s: 1, w: 40, h: 24 },
    drift: { x: 25, y: -27, r: 2, s: 1 },
    stack: { w: 52, h: 32 },
    enter: [0.24, 0.7],
  },
};

// Pinned timeline: drift → gather → hold → open.
const STOPS = [0, 0.3, 0.56, 0.66, 1];

/** Ease-out for the entrance, so each photo lands softly. */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function ScrollChoreography({
  images,
  heading,
  children,
  compact = false,
}: {
  images: { topLeft: Img; topRight: Img; bottomLeft: Img; bottomRight: Img };
  /** Headline shown in the middle of the opening composition. */
  heading?: { label: string; title: string };
  /** Optional caption shown once the top photo has opened to full screen. */
  children?: ReactNode;
  /** Shorten the scroll track on phones. See the track below. */
  compact?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const spec = isMobile ? MOBILE : DESKTOP;

  // Entrance: 0 when the section's top reaches the bottom of the screen,
  // 1 when it reaches the top and the pin engages.
  const { scrollYProgress: approach } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"],
  });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const spring = { stiffness: 400, damping: 50, mass: 1.2, restDelta: 0.001 };
  const p = useSpring(scrollYProgress, spring);
  const e = useSpring(approach, spring);

  if (reduced) {
    return (
      <section className="bg-paper py-20">
        {heading ? <Headline heading={heading} className="container-x mb-12" /> : null}
        <div className="container-x grid grid-cols-2 gap-4">
          {[images.topLeft, images.topRight, images.bottomLeft, images.bottomRight].map(
            (img) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={img.src}
                {...responsiveImg(img.src, "(max-width: 768px) 60vw, 30vw")}
                alt={img.alt}
                className="aspect-[4/5] w-full object-cover"
              />
            ),
          )}
        </div>
        {children ? <div className="container-x mt-10">{children}</div> : null}
      </section>
    );
  }

  const cardImages = [images.topLeft, images.bottomLeft, images.bottomRight];

  return (
    <div
      ref={containerRef}
      /* `compact` shortens the track on phones only — same choreography,
         less dragging. Opt-in for the same reason as ClipRevealBand: it
         depends on how much scrolling the rest of the page already asks
         for. */
      className={`relative w-full ${
        compact && isMobile ? "h-[175vh]" : "h-[300vh]"
      }`}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-paper">
        {heading ? <PinnedHeadline heading={heading} p={p} e={e} /> : null}

        {spec.cards.map((card, i) => (
          <Card key={cardImages[i].src} img={cardImages[i]} spec={card} p={p} e={e} />
        ))}

        <Hero img={images.topRight} spec={spec.hero} p={p} e={e}>
          {children}
        </Hero>
      </div>
    </div>
  );
}

/** A card's pose value at pinned progress `p`: start → drift → stack. */
function poseAt(p: number, s: CardSpec, key: keyof Pose) {
  const stack = s.stack[key];
  return transform(p, STOPS, [s.start[key], s.drift[key], stack, stack, stack]);
}

function Card({
  img,
  spec,
  p,
  e,
}: {
  img: Img;
  spec: CardSpec;
  p: MotionValue<number>;
  e: MotionValue<number>;
}) {
  const entered = (v: number) => easeOut(transform(v, spec.enter, [0, 1]));

  const x = useTransform(p, (v) => `${poseAt(v, spec, "x")}vw`);
  const y = useTransform([p, e], ([v, a]: number[]) => {
    // Arrives from 32vh below its place.
    return `${poseAt(v, spec, "y") + (1 - entered(a)) * 32}vh`;
  });
  const rotate = useTransform([p, e], ([v, a]: number[]) => {
    return poseAt(v, spec, "r") + (1 - entered(a)) * 12 * spec.spin;
  });
  const scale = useTransform([p, e], ([v, a]: number[]) => {
    return poseAt(v, spec, "s") * (0.86 + 0.14 * entered(a));
  });
  const opacity = useTransform([p, e], ([v, a]: number[]) => {
    // Fades as the top photo opens out over it.
    return entered(a) * transform(v, [0.7, 0.82], [1, 0]);
  });

  return (
    <motion.div
      style={{ x, y, rotate, scale, opacity, width: `${spec.w}vw`, aspectRatio: spec.aspect }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-paper-100 shadow-[0_30px_60px_-30px_rgba(5,12,30,0.45)] will-change-transform"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        {...responsiveImg(img.src, "(max-width: 768px) 70vw, 40vw")}
        alt={img.alt}
        className="size-full object-cover"
        draggable={false}
      />
    </motion.div>
  );
}

function Hero({
  img,
  spec,
  p,
  e,
  children,
}: {
  img: Img;
  spec: HeroSpec;
  p: MotionValue<number>;
  e: MotionValue<number>;
  children?: ReactNode;
}) {
  const entered = (v: number) => easeOut(transform(v, spec.enter, [0, 1]));
  const OPEN = [0, 0.3, 0.56, 0.66, 0.92, 1];

  const x = useTransform(p, (v) =>
    `${transform(v, OPEN, [spec.start.x, spec.drift.x, 0, 0, 0, 0])}vw`,
  );
  const y = useTransform([p, e], ([v, a]: number[]) => {
    const base = transform(v, OPEN, [spec.start.y, spec.drift.y, 0, 0, 0, 0]);
    return `${base + (1 - entered(a)) * 32}vh`;
  });
  const rotate = useTransform([p, e], ([v, a]: number[]) => {
    const base = transform(v, OPEN, [spec.start.r, spec.drift.r, 0, 0, 0, 0]);
    return base + (1 - entered(a)) * 10;
  });
  const scale = useTransform(e, (a) => 0.86 + 0.14 * entered(a));
  const opacity = useTransform(e, (a) => entered(a));
  const width = useTransform(p, (v) =>
    `${transform(v, OPEN, [spec.start.w, spec.start.w, spec.stack.w, spec.stack.w, 100, 100])}vw`,
  );
  const height = useTransform(p, (v) =>
    `${transform(v, OPEN, [spec.start.h, spec.start.h, spec.stack.h, spec.stack.h, 100, 100])}vh`,
  );
  // The photo inside settles from a slight over-scale as the frame opens.
  const imgScale = useTransform(p, (v) => transform(v, [0.66, 0.92], [1.12, 1]));
  const captionOpacity = useTransform(p, (v) => transform(v, [0.9, 1], [0, 1]));

  return (
    <motion.div
      style={{ x, y, rotate, scale, opacity, width, height }}
      className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-paper-100 shadow-[0_30px_60px_-30px_rgba(5,12,30,0.5)] will-change-transform"
    >
      <motion.div style={{ scale: imgScale }} className="size-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          {...responsiveImg(img.src, "100vw")}
          alt={img.alt}
          className="size-full object-cover"
          draggable={false}
        />
      </motion.div>

      {children ? (
        <motion.div
          style={{ opacity: captionOpacity }}
          className="absolute inset-0 flex items-end"
        >
          <div className="photo-scrim" />
          <div className="container-x relative w-full pb-16 sm:pb-24">{children}</div>
        </motion.div>
      ) : null}
    </motion.div>
  );
}

function PinnedHeadline({
  heading,
  p,
  e,
}: {
  heading: { label: string; title: string };
  p: MotionValue<number>;
  e: MotionValue<number>;
}) {
  const opacity = useTransform([p, e], ([v, a]: number[]) => {
    const inFade = easeOut(transform(a, [0.45, 0.95], [0, 1]));
    return inFade * transform(v, [0.3, 0.46], [1, 0]);
  });
  const y = useTransform([p, e], ([v, a]: number[]) => {
    const inFade = easeOut(transform(a, [0.45, 0.95], [0, 1]));
    return (1 - inFade) * 30 + transform(v, [0.3, 0.46], [0, -30]);
  });
  const scale = useTransform(p, (v) => transform(v, [0.3, 0.46], [1, 0.96]));

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <Headline heading={heading} className="max-w-[min(34rem,86vw)] text-center" />
    </motion.div>
  );
}

function Headline({
  heading,
  className = "",
}: {
  heading: { label: string; title: string };
  className?: string;
}) {
  return (
    <div className={className}>
      <span className="section-label justify-center">
        <span aria-hidden="true" className="size-[5px] bg-accent-600" />
        {heading.label}
      </span>
      <h2 className="mt-5 font-display text-[length:var(--text-3xl)] leading-[1.15]">
        {heading.title}
      </h2>
    </div>
  );
}

export default ScrollChoreography;
