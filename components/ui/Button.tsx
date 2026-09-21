"use client";

import {
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { motion } from "motion/react";
import { useReducedMotion, useIsMobile } from "@/lib/useMotionPrefs";

type Variant = "primary" | "outline" | "ghost" | "white";
type Size = "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-3 rounded-pill " +
  "font-sans font-medium tracking-wide transition-colors duration-300 " +
  // §8: every target clears 44px.
  "min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-4";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent-600 text-white hover:bg-accent-700 focus-visible:outline-accent-400",
  white:
    "bg-paper text-ink-950 hover:bg-mist focus-visible:outline-paper",
  outline:
    "border border-hairline-strong text-paper hover:border-accent-500 hover:text-accent-400 focus-visible:outline-accent-400",
  ghost:
    "text-paper/90 hover:text-paper underline-offset-8 hover:underline focus-visible:outline-paper",
};

const sizes: Record<Size, string> = {
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

/** The circled arrow that rides in every pill button, Duke-style. */
function ArrowBadge({ variant }: { variant: Variant }) {
  const ring =
    variant === "white"
      ? "border-ink-950/25 group-hover:bg-ink-950 group-hover:text-paper"
      : variant === "primary"
        ? "border-white/40 group-hover:bg-white group-hover:text-accent-600"
        : "border-hairline-strong group-hover:border-accent-500 group-hover:bg-accent-500 group-hover:text-white";

  return (
    <span
      aria-hidden="true"
      className={`grid size-7 shrink-0 place-items-center rounded-full border transition-all duration-300 ${ring}`}
    >
      <svg
        viewBox="0 0 16 16"
        className="size-3 transition-transform duration-300 group-hover:translate-x-px"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 8h9M8.5 4l4 4-4 4" />
      </svg>
    </span>
  );
}

type ButtonProps = {
  children: ReactNode;
  href: string;
  variant?: Variant;
  size?: Size;
  /** Show the circled arrow badge. */
  arrow?: boolean;
  /** Pull toward the cursor on hover. Desktop only. */
  magnetic?: boolean;
  className?: string;
  // `motion.a` redefines the animation and drag handlers with its own
  // signatures, so the DOM versions have to be dropped from the passthrough
  // props or they collide.
} & Omit<
  ComponentPropsWithoutRef<"a">,
  | "href"
  | "className"
  | "children"
  | "style"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
>;

/**
 * The one button on the site. Every destination on this page is either an
 * in-page anchor, an external portal, a `tel:` or a `mailto:`, so a plain
 * anchor is always correct — only external http links get a new tab.
 */
export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  arrow = true,
  magnetic = false,
  className = "",
  ...rest
}: ButtonProps) {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const ref = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Magnetism is a fine-pointer affordance: on touch there is no hover state
  // to respond to, and it would only cost frames.
  const magnetOn = magnetic && !reduced && !isMobile;

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!magnetOn || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    // 0.25 keeps the pull subtle — the button leans, it does not chase.
    setOffset({ x: x * 0.25, y: y * 0.25 });
  };

  const reset = () => setOffset({ x: 0, y: 0 });

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  const isExternal = /^(https?:|tel:|mailto:)/.test(href);

  const inner = (
    <>
      <span>{children}</span>
      {arrow ? <ArrowBadge variant={variant} /> : null}
    </>
  );

  const motionProps = {
    animate: { x: offset.x, y: offset.y },
    transition: { type: "spring" as const, stiffness: 260, damping: 18 },
    onMouseMove: handleMove,
    onMouseLeave: reset,
    onBlur: reset,
  };

  const opensNewTab = isExternal && href.startsWith("http");

  return (
    <motion.a
      ref={ref}
      href={href}
      className={classes}
      target={opensNewTab ? "_blank" : undefined}
      rel={opensNewTab ? "noopener noreferrer" : undefined}
      {...motionProps}
      {...rest}
    >
      {inner}
    </motion.a>
  );
}

/** Same visual language, for real `<button>` elements inside forms. */
export function SubmitButton({
  children,
  pending,
  className = "",
}: {
  children: ReactNode;
  pending?: boolean;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${base} ${variants.primary} ${sizes.lg} w-full disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      <span>{children}</span>
      {!pending ? <ArrowBadge variant="primary" /> : null}
    </button>
  );
}
