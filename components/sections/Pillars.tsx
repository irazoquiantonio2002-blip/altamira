import { pillars } from "@/lib/site-data";
import { SectionHead } from "@/components/ui/SectionLabel";
import { Reveal, RevealItem, Stagger } from "@/components/ui/Reveal";
import { PillarIconGlyph } from "@/components/ui/Icons";

/**
 * The four pillars, as a rule grid.
 *
 * Structure here comes entirely from hairlines: the cells sit inside one
 * bordered block and are divided by the grid's own rules, so there are no
 * nested boxes and no shadows. The index number is the largest thing in the
 * cell — it does the visual work a card border would otherwise do.
 */
export function Pillars() {
  return (
    <section id="modelo" className="section-y bg-paper">
      <div className="container-x">
        <Reveal direction="up">
          <SectionHead
            label={pillars.label}
            title={pillars.title}
            lead={pillars.subtitle}
          />
        </Reveal>

        <Stagger
          className="mt-14 grid border-t border-l border-rule sm:grid-cols-2 lg:grid-cols-4"
          gap={0.1}
          tall
        >
          {pillars.items.map((item) => (
            <RevealItem
              key={item.index}
              className="group relative border-b border-r border-rule p-8 transition-colors duration-500 hover:bg-paper-50 lg:p-10"
            >
              {/* The accent rule that draws itself on hover — the only
                  motion a static cell needs. */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent-600 transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100"
              />

              <div className="flex items-center justify-between">
                <span className="font-display text-[length:var(--text-2xl)] text-rule-strong transition-colors duration-500 group-hover:text-accent-600">
                  {item.index}
                </span>
                <PillarIconGlyph
                  name={item.icon}
                  className="size-6 text-navy-700"
                />
              </div>

              <h3 className="mt-10 font-display text-[length:var(--text-xl)]">
                {item.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-slate">
                {item.text}
              </p>
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
