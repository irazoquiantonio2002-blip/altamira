import { about } from "@/lib/site-data";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/ui/TextReveal";
import { ImageReveal } from "@/components/ui/ImageReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

/** Quiénes somos (§6.5) — text reveal on the left, clip-path image reveal on the right. */
export function About() {
  return (
    <section id="nosotros" className="relative bg-ink-950 py-24 sm:py-32 lg:py-40">
      <div className="container-x">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal direction="up">
              <SectionLabel className="mb-7">{about.label}</SectionLabel>
            </Reveal>

            <TextReveal
              as="h2"
              lines={[about.titleLead, about.titleAccent]}
              className="font-display text-[length:var(--text-4xl)] text-paper"
              // The second line carries the accent treatment; the mask
              // component applies this class to every line, and the italic
              // only reads as emphasis because the first line is short.
              lineClassName="last:text-accent-400 last:italic"
            />

            <div className="mt-8 space-y-5">
              {about.paragraphs.map((p, i) => (
                <Reveal key={p.slice(0, 24)} direction="up" delay={0.1 + i * 0.1}>
                  <p className="max-w-prose text-mist">{p}</p>
                </Reveal>
              ))}
            </div>

            <Reveal direction="up" delay={0.3}>
              <div className="mt-10">
                <Button href={about.cta.href} variant="outline" size="lg">
                  {about.cta.label}
                </Button>
              </div>
            </Reveal>
          </div>

          <div className="relative">
            <ImageReveal
              src={about.image.src}
              alt={about.image.alt}
              width={760}
              height={900}
              sizes="(max-width: 1024px) 100vw, 46vw"
              parallax={36}
              className="aspect-4/5 w-full rounded-card sm:aspect-3/2 lg:aspect-4/5"
            />
            {/* Thin navy frame offset behind the photo — a quiet editorial
                device rather than a drop shadow. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-card border border-hairline"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
