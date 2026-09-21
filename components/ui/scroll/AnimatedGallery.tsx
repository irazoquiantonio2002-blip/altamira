"use client";

import * as React from "react";
import {
  motion,
  transform,
  useScroll,
  useTransform,
  type HTMLMotionProps,
  type MotionValue,
  type Variants,
} from "motion/react";
import { useScrollValue } from "@/lib/useScrollValue";

/**
 * AnimatedGallery — the 21st.dev "animated-gallery" component, kept faithful.
 *
 * Same parts and numbers as the original: a 3-column gallery lying back at
 * 75° that stands up to 0° over the first half of its scroll, then eases from
 * 1.2× to 1× while each column drifts on its own `yRange`; and the headline
 * block whose lines arrive one after another out of a 10px blur on the
 * original spring.
 *
 * Differences, all forced by the site rather than taste:
 *   · square corners (the site has none);
 *   · the scroll values go through `useScrollValue`, because plain
 *     `useTransform` ranges get offloaded to a native ScrollTimeline that
 *     lags the real scroll on this site;
 *   · `cn` is replaced by plain template strings (the project has no shadcn
 *     `lib/utils`).
 */

const SPRING_CONFIG = {
  type: "spring" as const,
  stiffness: 100,
  damping: 16,
  mass: 0.75,
  restDelta: 0.005,
  duration: 0.3,
};

const blurVariants: Variants = {
  hidden: { filter: "blur(10px)", opacity: 0 },
  visible: { filter: "blur(0px)", opacity: 1 },
};

type ContainerScrollContextValue = { scrollYProgress: MotionValue<number> };

const ContainerScrollContext = React.createContext<
  ContainerScrollContextValue | undefined
>(undefined);

function useContainerScrollContext() {
  const context = React.useContext(ContainerScrollContext);
  if (!context) {
    throw new Error(
      "useContainerScrollContext must be used within a ContainerScroll Component",
    );
  }
  return context;
}

export const ContainerScroll = ({
  children,
  className = "",
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  // Same default as the original: "start start" → "end end".
  const { scrollYProgress } = useScroll({ target: scrollRef });

  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <div
        ref={scrollRef}
        className={`relative min-h-[120vh] ${className}`}
        style={{
          perspective: "1000px",
          perspectiveOrigin: "center top",
          transformStyle: "preserve-3d",
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  );
};
ContainerScroll.displayName = "ContainerScroll";

export const ContainerSticky = ({
  className = "",
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`sticky left-0 top-0 min-h-[30rem] w-full overflow-hidden ${className}`}
    style={{
      perspective: "1000px",
      perspectiveOrigin: "center top",
      transformStyle: "preserve-3d",
      transformOrigin: "50% 50%",
      ...style,
    }}
    {...props}
  />
);
ContainerSticky.displayName = "ContainerSticky";

export const GalleryContainer = ({
  children,
  className = "",
  style,
  ...props
}: HTMLMotionProps<"div">) => {
  const { scrollYProgress } = useContainerScrollContext();
  const rotateX = useScrollValue(scrollYProgress, [0, 0.5], [75, 0]);
  const scale = useScrollValue(scrollYProgress, [0.5, 0.9], [1.2, 1]);

  return (
    <motion.div
      className={`relative grid size-full grid-cols-3 gap-2 ${className}`}
      style={{
        rotateX,
        scale,
        transformStyle: "preserve-3d",
        perspective: "1000px",
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
GalleryContainer.displayName = "GalleryContainer";

export const GalleryCol = ({
  className = "",
  style,
  yRange = ["0%", "-10%"],
  ...props
}: HTMLMotionProps<"div"> & { yRange?: string[] }) => {
  const { scrollYProgress } = useContainerScrollContext();
  // Same range as the original, interpolated in JS (see header).
  const from = parseFloat(yRange[0]);
  const to = parseFloat(yRange[1]);
  const y = useTransform(
    scrollYProgress,
    (v) => `${transform(v, [0.5, 1], [from, to])}%`,
  );

  return (
    <motion.div
      className={`relative flex w-full flex-col gap-2 ${className}`}
      style={{ y, ...style }}
      {...props}
    />
  );
};
GalleryCol.displayName = "GalleryCol";

export const ContainerStagger = React.forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div">
>(({ className = "", viewport, transition, ...props }, ref) => (
  <motion.div
    className={`relative ${className}`}
    ref={ref}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, ...viewport }}
    transition={{
      staggerChildren: transition?.staggerChildren || 0.2,
      ...transition,
    }}
    {...props}
  />
));
ContainerStagger.displayName = "ContainerStagger";

export const ContainerAnimated = React.forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div">
>(({ className, transition, ...props }, ref) => (
  <motion.div
    ref={ref}
    data-reveal
    className={className}
    variants={blurVariants}
    transition={SPRING_CONFIG || transition}
    {...props}
  />
));
ContainerAnimated.displayName = "ContainerAnimated";
