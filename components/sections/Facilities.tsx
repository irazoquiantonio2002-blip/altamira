import { facilities } from "@/lib/site-data";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal, RevealItem, Stagger } from "@/components/ui/Reveal";
import { ImageReveal } from "@/components/ui/ImageReveal";
import { FacilityIconGlyph } from "@/components/ui/Icons";

/** Instalaciones / Campus (§6.9) — wide aerial showcase with parallax + chips. */
export function Facilities() {
  return (
    <section
      id="instalaciones"
      className="relative bg-ink-950 py-24 sm:py-32 lg:py-40"
    >
      <div className="container-x">
        <div className="max-w-2xl">
          <Reveal direction="up">
            <SectionLabel className="mb-7">{facilities.label}</SectionLabel>
          </Reveal>

          <TextReveal
            as="h2"
            lines={[facilities.title]}
            byWord
            className="font-display text-[length:var(--text-4xl)] text-paper"
          />

          <Reveal direction="up" delay={0.15}>
            <p className="mt-6 text-mist">{facilities.subtitle}</p>
          </Reveal>
        </div>

        <div className="relative mt-14 sm:mt-20">
          <ImageReveal
            src={facilities.showcase.image.src}
            alt={facilities.showcase.image.alt}
            width={1600}
            height={900}
            sizes="(max-width: 1440px) 100vw, 1440px"
            parallax={48}
            className="aspect-4/5 w-full rounded-card sm:aspect-16/9"
          />

          {/* Backing for the overlaid copy — an aerial shot is bright enough
              that the shared scrim alone leaves the body text below AA. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 rounded-b-card bg-gradient-to-t from-ink-950 via-ink-950/85 to-transparent"
          />

          {/* Overlaid copy. Stacked below the badge on phones so the two never
              collide inside a narrow frame. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-6 p-6 sm:p-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <h3 className="font-display text-[length:var(--text-2xl)] text-paper">
                {facilities.showcase.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-mist sm:text-base">
                {facilities.showcase.text}
              </p>
            </div>

            <div className="shrink-0 rounded-card border border-hairline-strong bg-ink-950/70 px-6 py-4 backdrop-blur-md">
              <span className="block font-display text-[length:var(--text-3xl)] leading-none text-paper">
                {facilities.badge.value}
              </span>
              <span className="mt-1 block text-[length:var(--text-label)] uppercase tracking-[0.18em] text-mist-dim">
                {facilities.badge.label}
              </span>
            </div>
          </div>
        </div>

        {/* Single column until `sm`: at 320px a two-up split leaves ~36px for
            the label, which is not enough for "Sala de Cómputo" even wrapped. */}
        <Stagger
          className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          gap={0.08}
        >
          {facilities.features.map((feature) => (
            <RevealItem
              key={feature.title}
              className="flex items-center gap-4 rounded-card border border-hairline bg-ink-900 px-5 py-5 transition-colors duration-500 hover:border-hairline-strong"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full border border-hairline text-accent-400">
                <FacilityIconGlyph name={feature.icon} className="size-5" />
              </span>
              {/* `min-w-0` lets the label wrap instead of forcing the flex
                  row wider than its grid cell. */}
              <h4 className="min-w-0 font-sans text-sm font-medium text-paper">
                {feature.title}
              </h4>
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
