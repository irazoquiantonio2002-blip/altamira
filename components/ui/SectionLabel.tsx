import type { ReactNode } from "react";

/**
 * "● Quiénes somos" — the small uppercase eyebrow that opens every section.
 *
 * The dot is decorative and carries no meaning, so it is hidden from
 * assistive tech rather than read out as a bullet.
 */
export function SectionLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`section-label ${className}`}>
      <span
        aria-hidden="true"
        className="size-[6px] shrink-0 rounded-full bg-accent-500"
      />
      {children}
    </span>
  );
}
