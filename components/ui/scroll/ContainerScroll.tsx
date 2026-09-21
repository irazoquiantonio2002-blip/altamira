"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, type MotionValue } from "motion/react";
import { useIsMobile, useReducedMotion } from "@/lib/useMotionPrefs";
import { useScrollValue } from "@/lib/useScrollValue";

/**
 * ContainerScroll — the 21st.dev / Aceternity component, kept faithful.
 *
 * Same geometry as the original: a 60rem/80rem stage, 1000px perspective, the
 * card tipped back 20° and rotating flat as you scroll, scaling 1.05 → 1 on
 * desktop and 0.7 → 0.9 on phones, the title lifting 100px, the thick grey
 * bezel on a #222 frame and the six-layer drop shadow that sells the depth.
 *
 * Two deliberate differences, both from the site's rules rather than taste:
 *   · square corners (the original is rounded-[30px]); the site has none.
 *   · the scroll values go through `useScrollValue`. Plain `useTransform`
 *     ranges get offloaded to a native ScrollTimeline that lags the real
 *     scroll on this site, which would leave the card stuck half-tilted.
 */
export function ContainerScroll({
  titleComponent,
  children,
}: {
  titleComponent: ReactNode;
  children: ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rotate = useScrollValue(scrollYProgress, [0, 1], reduced ? [0, 0] : [20, 0]);
  const scale = useScrollValue(
    scrollYProgress,
    [0, 1],
    reduced ? [1, 1] : isMobile ? [0.7, 0.9] : [1.05, 1],
  );
  const translate = useScrollValue(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -100]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-[60rem] items-center justify-center p-2 md:h-[80rem] md:p-20"
    >
      <div
        className="relative w-full py-10 md:py-40"
        style={{ perspective: "1000px" }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
}

function Header({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: ReactNode;
}) {
  return (
    <motion.div
      style={{ translateY: translate }}
      className="mx-auto max-w-5xl text-center"
    >
      {titleComponent}
    </motion.div>
  );
}

function Card({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  children: ReactNode;
}) {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="mx-auto -mt-12 h-[30rem] w-full max-w-5xl border-4 border-[#6C6C6C] bg-[#222222] p-2 md:h-[40rem] md:p-6"
    >
      <div className="size-full overflow-hidden bg-gray-100 md:p-4">
        {children}
      </div>
    </motion.div>
  );
}
