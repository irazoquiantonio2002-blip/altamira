import { about } from "@/lib/site-data";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/ui/TextReveal";
import { ImageReveal } from "@/components/ui/ImageReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

/**
 * Quiénes somos.
 *
 * An asymmetric two-column split: the copy sits in a narrower measure than
 * the photo, which is what makes the block read as editorial rather than as
 * two equal halves.
 */
export function About({ cta = true }: { cta?: boolean }) {
  return (
    <section id="nosotros" className="section-y bg-paper">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-20">
          <div>
            <Reveal direction="up">
              <SectionLabel>{about.label}</SectionLabel>
            </Reveal>

            <TextReveal
              as="h2"
              lines={[about.titleLead, about.titleAccent]}
              className="mt-6 font-display text-[length:var(--text-4xl)]"
              lastLineClassName="text-accent-600"
            />

            <div className="mt-8 space-y-5">
              {about.paragraphs.map((p, i) => (
                <Reveal key={p.slice(0, 24)} direction="up" delay={0.08 + i * 0.08}>
                  <p className="max-w-prose text-lg text-graphite">{p}</p>
                </Reveal>
              ))}
            </div>

            {cta ? (
              <Reveal direction="up" delay={0.28}>
                <div className="mt-10">
                  <Button href="/nosotros" variant="outline">
                    Conoce nuestro modelo
                  </Button>
                </div>
              </Reveal>
            ) : null}
          </div>

          <ImageReveal
            src={about.image.src}
            alt={about.image.alt}
            width={1000}
            height={1150}
            sizes="(max-width: 1024px) 100vw, 52vw"
            parallax={34}
            className="aspect-4/5 w-full"
          />
        </div>
      </div>
    </section>
  );
}
