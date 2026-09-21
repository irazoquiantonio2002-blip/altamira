"use client";

import { useState, type ElementType, type MouseEvent, type ReactNode } from "react";
import { useIsMobile, useReducedMotion } from "@/lib/useMotionPrefs";

/**
 * Card Spotlight — adapted from the 21st.dev community pattern of the same
 * name, retuned for this design system.
 *
 * Changes from the original: the glow is a single low-opacity accent radial
 * instead of a saturated multi-stop gradient, the border lifts by one
 * hairline step rather than switching color, and the whole effect is skipped
 * on touch devices where there is no cursor to follow.
 *
 * The cursor position is read from `event.currentTarget` rather than a ref,
 * which keeps the component polymorphic over `as` without a ref cast.
 */
export function SpotlightCard({
  children,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();

  const enabled = !isMobile && !reduced;
  const Tag = as as ElementType;

  const onMove = (e: MouseEvent<HTMLElement>) => {
    if (!enabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <Tag
      onMouseMove={onMove}
      onMouseEnter={() => enabled && setActive(true)}
      onMouseLeave={() => setActive(false)}
      className={`group relative overflow-hidden rounded-card border border-hairline bg-ink-800/60 transition-colors duration-500 hover:border-hairline-strong ${className}`}
    >
      {enabled ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-500"
          style={{
            opacity: active ? 1 : 0,
            background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, rgba(45,108,255,0.13), transparent 62%)`,
          }}
        />
      ) : null}
      <div className="relative">{children}</div>
    </Tag>
  );
}
