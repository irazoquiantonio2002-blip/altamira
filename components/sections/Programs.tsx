import { programs } from "@/lib/site-data";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal, RevealItem, Stagger } from "@/components/ui/Reveal";
import { ImageReveal } from "@/components/ui/ImageReveal";
import { ArrowUpRight } from "@/components/ui/Icons";

/**
 * Oferta educativa (§6.7). Three tall photo cards with a hover-border-gradient
 * treatment adapted from the 21st.dev pattern of the same name, and a slow
 * parallax on the photo inside each frame.
 *
 * The gradient border is drawn with a masked pseudo-element rather than a
 * second wrapper div, so the hover state costs no extra DOM per card.
 */
export function Programs() {
  return (
    <section id="oferta" className="relative bg-ink-950 py-24 sm:py-32 lg:py-40">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal direction="up">
            <SectionLabel className="mb-7">{programs.label}</SectionLabel>
          </Reveal>

          <TextReveal
            as="h2"
            lines={[programs.title]}
            byWord
            className="font-display text-[length:var(--text-4xl)] text-paper"
          />

          <Reveal direction="up" delay={0.15}>
            <p className="mt-6 text-mist">{programs.subtitle}</p>
          </Reveal>
        </div>

        <Stagger className="mt-16 grid gap-5 sm:mt-20 lg:grid-cols-3" gap={0.12} tall>
          {programs.items.map((item) => (
            <RevealItem key={item.index} direction="scale">
              <a
                href={item.href}
                className="group relative block h-full overflow-hidden rounded-card border border-hairline transition-colors duration-500 hover:border-accent-500/40"
              >
                <div className="relative aspect-4/5 w-full sm:aspect-3/2 lg:aspect-4/5">
                  <ImageReveal
                    src={item.image.src}
                    alt={item.image.alt}
                    width={720}
                    height={900}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 32vw"
                    parallax={24}
                    className="absolute inset-0 size-full"
                    imgClassName="transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
                  />
                </div>

                {/* Top and bottom backings. The shared `photo-scrim` unifies
                    the photography, but it is not dark enough on its own for
                    body copy to clear AA over a bright classroom shot. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink-950/80 to-transparent"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink-950 via-ink-950/90 to-transparent"
                />

                <span
                  aria-hidden="true"
                  className="absolute left-6 top-5 font-display text-[length:var(--text-xl)] text-paper/70"
                >
                  {item.index}
                </span>

                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 sm:p-7">
                  <span className="inline-flex w-fit rounded-pill border border-hairline-strong bg-ink-950/50 px-3 py-1 text-[length:var(--text-label)] uppercase tracking-[0.18em] text-paper/80 backdrop-blur-sm">
                    {item.grades}
                  </span>

                  <h3 className="font-display text-[length:var(--text-2xl)] text-paper">
                    {item.title}
                  </h3>

                  <p className="max-w-prose text-sm leading-relaxed text-mist">
                    {item.text}
                  </p>

                  <span className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-accent-400">
                    Conocer más
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </a>
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
