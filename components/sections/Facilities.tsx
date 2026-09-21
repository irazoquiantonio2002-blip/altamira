import { facilities } from "@/lib/site-data";
import { SectionHead } from "@/components/ui/SectionLabel";
import { Reveal, RevealItem, Stagger } from "@/components/ui/Reveal";
import { ImageReveal } from "@/components/ui/ImageReveal";
import { FacilityIconGlyph } from "@/components/ui/Icons";
import { CountUp } from "@/components/ui/CountUp";

/** Campus: a wide aerial with parallax, the m² figure, and the feature rules. */
export function Facilities({ withHead = true }: { withHead?: boolean }) {
  return (
    <section id="instalaciones" className="section-y bg-paper">
      <div className="container-x">
        {withHead ? (
          <Reveal direction="up">
            <SectionHead
              label={facilities.label}
              title={facilities.title}
              lead={facilities.subtitle}
            />
          </Reveal>
        ) : null}

        <div className={withHead ? "mt-14" : ""}>
          <ImageReveal
            src={facilities.showcase.image.src}
            alt={facilities.showcase.image.alt}
            width={1800}
            height={900}
            sizes="(max-width: 1360px) 100vw, 1360px"
            parallax={44}
            className="aspect-4/5 w-full sm:aspect-2/1"
          />
        </div>

        {/* The figure sits in the grid beside the copy rather than floating
            on the photo — nothing overlaps, so nothing needs a scrim. */}
        <div className="grid border-b border-t border-rule lg:grid-cols-[auto_1fr]">
          <Reveal direction="up" className="border-rule p-8 lg:border-r lg:p-10">
            <span className="block font-display text-[length:var(--text-4xl)] leading-none text-navy-700">
              <CountUp
                value={facilities.badge.number}
                suffix={facilities.badge.suffix}
                duration={2200}
              />
            </span>
            <span className="mt-2 block text-[length:var(--text-label)] uppercase tracking-[0.16em] text-slate">
              {facilities.badge.label}
            </span>
          </Reveal>

          <Reveal direction="up" className="p-8 lg:p-10">
            <h3 className="font-display text-[length:var(--text-2xl)]">
              {facilities.showcase.title}
            </h3>
            <p className="mt-4 max-w-2xl text-slate">
              {facilities.showcase.text}
            </p>
          </Reveal>
        </div>

        <Stagger
          className="grid border-b border-l border-rule sm:grid-cols-2 lg:grid-cols-4"
          gap={0.08}
        >
          {facilities.features.map((feature) => (
            <RevealItem
              key={feature.title}
              className="flex items-center gap-4 border-r border-rule px-6 py-7 transition-colors duration-500 hover:bg-paper-50"
            >
              <FacilityIconGlyph
                name={feature.icon}
                className="size-5 shrink-0 text-accent-600"
              />
              {/* `min-w-0` lets the label wrap instead of forcing the row
                  wider than its grid cell. */}
              <h4 className="min-w-0 font-sans text-sm font-semibold text-navy-700">
                {feature.title}
              </h4>
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
