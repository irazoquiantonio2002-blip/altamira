import type { ReactNode } from "react";

/**
 * "● Quiénes somos" — the small uppercase eyebrow that opens every block.
 * The square mark is decorative and is hidden from assistive tech.
 */
export function SectionLabel({
  children,
  className = "",
  onDark = false,
}: {
  children: ReactNode;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <span
      className={`section-label ${onDark ? "!text-white/70" : ""} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`size-[5px] shrink-0 ${onDark ? "bg-accent-500" : "bg-accent-600"}`}
      />
      {children}
    </span>
  );
}

/**
 * Standard section opener: label, title and optional standfirst, with the
 * same spacing everywhere on the site.
 */
export function SectionHead({
  label,
  title,
  lead,
  align = "left",
  onDark = false,
  className = "",
}: {
  label: string;
  title: ReactNode;
  lead?: string;
  align?: "left" | "center";
  onDark?: boolean;
  className?: string;
}) {
  const centered = align === "center";

  return (
    <div
      className={`${centered ? "mx-auto max-w-2xl text-center" : "max-w-3xl"} ${className}`}
    >
      <SectionLabel onDark={onDark}>{label}</SectionLabel>
      <h2
        className={`mt-5 font-display text-[length:var(--text-3xl)] ${onDark ? "!text-white" : ""}`}
      >
        {title}
      </h2>
      {lead ? (
        <p
          className={`mt-5 text-lg ${onDark ? "text-white/70" : "text-slate"}`}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}
