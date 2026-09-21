"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll } from "motion/react";
import { useIsMobile, useReducedMotion } from "@/lib/useMotionPrefs";
import { useScrollValue } from "@/lib/useScrollValue";

/**
 * A panel that starts tipped away from the reader and rotates flat as the
 * section scrolls, as if it were being laid down on the page.
 *
 * Adapted from the 21st.dev `ContainerScroll` pattern, with the chrome
 * stripped out: the original wrapped the content in a rounded, bevelled,
 * heavily shadowed dark frame, none of which belongs in a square, flat,
 * hairline-based system. What is kept is the perspective and the rotateX.
 *
 * `rotateX` is a compositor-only transform, so the whole effect runs off the
 * main thread.
 */
export function TiltCardScroll({
  header,
  children,
}: {
  header?: ReactNode;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Only the first half of the crossing is used: the panel should be flat and
  // readable well before it leaves, not still tilting on the way out.
  const rotate = useScrollValue(scrollYProgress, [0, 0.5], [18, 0]);
  const scale = useScrollValue(
    scrollYProgress,
    [0, 0.5],
    isMobile ? [0.92, 1] : [0.88, 1],
  );
  const headerY = useScrollValue(scrollYProgress, [0, 0.5], [60, 0]);

  if (reduced) {
    return (
      <div className="container-x">
        {header ? <div className="mb-12">{header}</div> : null}
        <div className="border border-rule bg-paper">{children}</div>
      </div>
    );
  }

  return (
    <div ref={ref} className="container-x">
      <div style={{ perspective: "1200px" }}>
        {header ? (
          <motion.div style={{ y: headerY }} className="mb-12">
            {header}
          </motion.div>
        ) : null}

        <motion.div
          style={{ rotateX: rotate, scale, transformOrigin: "50% 0%" }}
          className="border border-rule bg-paper will-change-transform"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
