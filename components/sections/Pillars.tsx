import { pillars } from "@/lib/site-data";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal, RevealItem, Stagger } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { PillarIconGlyph } from "@/components/ui/Icons";
import { Chevrons } from "@/components/ui/Chevrons";

/**
 * Pilares de formación (§6.6) — a bento grid adapted from the 21st.dev
 * "Bento Grid" pattern, with the cards' spotlight hover from "Card Spotlight".
 *
 * The bento's uneven sizing is desktop-only: at phone widths every card
 * becomes full width, because a 2-up bento at 375px produces columns too
 * narrow to hold a three-word heading.
 */
export function Pillars() {
  return (
    <section
      id="modelo"
      className="relative overflow-hidden bg-ink-900 py-24 sm:py-32 lg:py-40"
    >
      <Chevrons corner="top-right" className="opacity-50" />

      <div className="container-x relative">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal direction="up">
            <SectionLabel className="mb-7">{pillars.label}</SectionLabel>
          </Reveal>

          <TextReveal
            as="h2"
            lines={[pillars.title]}
            byWord
            className="font-display text-[length:var(--text-4xl)] text-paper"
          />

          <Reveal direction="up" delay={0.15}>
            <p className="mt-6 text-mist">{pillars.subtitle}</p>
          </Reveal>
        </div>

        <Stagger
          className="mt-16 grid gap-4 sm:mt-20 lg:grid-cols-6"
          gap={0.1}
          tall
        >
          {pillars.items.map((item, i) => (
            <RevealItem
              key={item.index}
              direction="scale"
              // 01 and 04 span wider; 02 and 03 sit narrower. This is what
              // makes it read as a bento rather than a plain 2×2.
              className={
                i === 0 || i === 3 ? "lg:col-span-4" : "lg:col-span-2"
              }
            >
              <SpotlightCard as="article" className="h-full">
                <div className="relative flex h-full flex-col gap-5 p-7 sm:p-9">
                  {/* Oversized ghost index, Duke-style. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-5 top-3 font-display text-[clamp(3.5rem,8vw,6rem)] leading-none text-white/[0.04]"
                  >
                    {item.index}
                  </span>

                  <span className="grid size-12 place-items-center rounded-full border border-hairline text-accent-400 transition-colors duration-500 group-hover:border-accent-500/50">
                    <PillarIconGlyph name={item.icon} />
                  </span>

                  <h3 className="font-display text-[length:var(--text-xl)] text-paper">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-mist">
                    {item.text}
                  </p>
                </div>
              </SpotlightCard>
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
