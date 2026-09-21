/**
 * The recurring diagonal blue chevron accent (§4). Sits in a section's top-
 * or bottom-right corner as a geometric signature, never as content.
 *
 * Purely decorative: `aria-hidden` and pointer-events off everywhere.
 */
export function Chevrons({
  className = "",
  count = 3,
  corner = "top-right",
}: {
  className?: string;
  count?: number;
  corner?: "top-right" | "bottom-right" | "bottom-left";
}) {
  const place =
    corner === "top-right"
      ? "top-0 right-0"
      : corner === "bottom-right"
        ? "bottom-0 right-0"
        : "bottom-0 left-0";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute ${place} overflow-hidden ${className}`}
    >
      <svg
        viewBox="0 0 120 120"
        className="h-24 w-24 sm:h-36 sm:w-36"
        fill="none"
        preserveAspectRatio="none"
      >
        {Array.from({ length: count }).map((_, i) => (
          <path
            key={i}
            d={`M${40 + i * 26} 0 L${68 + i * 26} 0 L${28 + i * 26} 120 L${i * 26} 120 Z`}
            fill="var(--color-accent-500)"
            // Each successive band is fainter, so the accent fades outward
            // instead of reading as a solid slab of blue.
            opacity={0.5 - i * 0.14}
          />
        ))}
      </svg>
    </div>
  );
}
