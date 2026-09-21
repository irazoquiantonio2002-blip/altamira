import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The one button on the site. Square, flat, no shadow — the emphasis comes
 * from fill weight, not from ornament.
 *
 * `solid` is navy for primary actions on paper; `accent` is the blue used
 * where the page already carries navy; `outline` is a hairline box; `light`
 * is the inverse pair for dark bands.
 */
type Variant = "solid" | "accent" | "outline" | "light" | "quiet";
type Size = "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-3 font-sans font-semibold tracking-wide " +
  "transition-colors duration-300 min-h-[48px]";

const variants: Record<Variant, string> = {
  solid: "bg-navy-700 text-white hover:bg-accent-700",
  accent: "bg-accent-600 text-white hover:bg-accent-700",
  outline:
    "border border-rule-strong text-navy-700 hover:border-navy-700 hover:bg-navy-700 hover:text-white",
  light: "bg-white text-ink-950 hover:bg-white/85",
  quiet:
    "border border-white/30 text-white hover:border-white hover:bg-white hover:text-ink-950",
};

const sizes: Record<Size, string> = {
  md: "px-6 text-sm",
  lg: "px-8 text-base",
};

function Arrow() {
  return (
    <svg
      viewBox="0 0 20 12"
      aria-hidden="true"
      className="w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="square"
    >
      <path d="M0 6h18M13 1l5 5-5 5" />
    </svg>
  );
}

export function Button({
  children,
  href,
  variant = "solid",
  size = "md",
  arrow = true,
  className = "",
}: {
  children: ReactNode;
  href: string;
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
}) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  const isExternal = /^(https?:|tel:|mailto:)/.test(href);

  if (isExternal) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className={classes}
      >
        {children}
        {arrow ? <Arrow /> : null}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
      {arrow ? <Arrow /> : null}
    </Link>
  );
}

/** Same language, for real `<button>` elements inside forms. */
export function SubmitButton({
  children,
  pending,
}: {
  children: ReactNode;
  pending?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${base} ${variants.solid} ${sizes.lg} w-full disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {children}
      {!pending ? <Arrow /> : null}
    </button>
  );
}
