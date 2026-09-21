import { stats } from "@/lib/site-data";
import { CountUp } from "@/components/ui/CountUp";
import { RevealItem, Stagger } from "@/components/ui/Reveal";

/**
 * Figures band. A four-column rule grid — the separators are the hairlines
 * themselves, so nothing needs a border box of its own.
 *
 * Two figures are still `null` pending real numbers from the school; those
 * render an em dash rather than a placeholder that would read as a claim.
 */
export function Stats({ onDark = false }: { onDark?: boolean }) {
  return (
    <section
      aria-label="Altamira La Cima en cifras"
      className={onDark ? "bg-navy-700" : "border-y border-rule bg-paper"}
    >
      <div className="container-x">
        <Stagger
          className={`grid grid-cols-2 lg:grid-cols-4 ${
            onDark ? "divide-white/15" : "divide-rule"
          } divide-x divide-y lg:divide-y-0`}
          gap={0.08}
        >
          {stats.map((stat) => (
            <RevealItem
              key={stat.label}
              className="flex flex-col gap-2 px-5 py-9 sm:px-8 sm:py-12"
            >
              <span
                className={`font-display text-[length:var(--text-4xl)] leading-none ${
                  onDark ? "text-white" : "text-navy-700"
                }`}
              >
                <CountUp value={stat.value} suffix={stat.suffix} />
              </span>
              <span
                className={`text-[length:var(--text-label)] uppercase tracking-[0.16em] ${
                  onDark ? "text-white/60" : "text-slate"
                }`}
              >
                {stat.label}
              </span>
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
