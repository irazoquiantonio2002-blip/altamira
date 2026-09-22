"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { useReducedMotion } from "@/lib/useMotionPrefs";

/**
 * Count-up for the trust-bar figures (§7).
 *
 * A `null` value renders an em dash. That is deliberate: the real figures are
 * still pending from the school (see the TODOs in `lib/site-data.ts`), and a
 * placeholder number would read as a factual claim.
 */
export function CountUp({
  value,
  suffix = "",
  duration = 1800,
  className = "",
}: {
  value: number | null;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === null || !inView) return;

    if (reduced) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // Same ease-out-expo as the rest of the page, so the number settles
      // on the same curve the cards travel on.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setDisplay(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration, reduced]);

  if (value === null) {
    return (
      <span ref={ref} className={className} aria-label="Dato por confirmar">
        —
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {/* Thousands separators, Mexican locale. */}
      {display.toLocaleString("es-MX")}
      {suffix}
    </span>
  );
}
 