"use client";

import { stats } from "@/lib/site-data";
import { CountUp } from "@/components/ui/CountUp";
import { RevealItem, Stagger } from "@/components/ui/Reveal";
import { Chevrons } from "@/components/ui/Chevrons";

/**
 * Trust bar. Sits directly under the hero and overlaps it slightly, so the
 * hero's last frame hands off into the page rather than ending flat.
 *
 * Figures come from `lib/site-data.ts` and two of them are still `null`
 * pending real numbers from the school — those render an em dash.
 */
export function Stats() {
  return (
    <section
      aria-label="Altamira La Cima en cifras"
      className="relative z-20 bg-ink-950"
    >
      <div className="container-x">
        <Stagger
          className="relative -mt-px grid grid-cols-2 gap-px overflow-hidden rounded-card border border-hairline bg-hairline lg:grid-cols-4"
          gap={0.1}
        >
          <Chevrons corner="top-right" count={2} className="z-10 opacity-40" />

          {stats.map((stat) => (
            <RevealItem
              key={stat.label}
              className="flex flex-col gap-2 bg-ink-900 px-6 py-8 sm:px-8 sm:py-10"
            >
              <span className="font-display text-[length:var(--text-4xl)] leading-none text-paper">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </span>
              <span className="text-sm text-mist-dim">{stat.label}</span>
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
