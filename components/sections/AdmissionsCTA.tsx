import { admissionsCta } from "@/lib/site-data";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { BackgroundPaths } from "@/components/ui/scroll/BackgroundPaths";

/**
 * The closing navy band. The one saturated surface on an otherwise white
 * site, so it reads as a deliberate stop rather than as decoration.
 *
 * White line-work flows behind the copy, so the band that closes almost
 * every page is never a flat slab of colour. The field clears out under
 * the heading on the left, because the heading is white too.
 */
export function AdmissionsCTA() {
  return (
    <section
      aria-labelledby="cta-title"
      className="relative isolate overflow-hidden bg-navy-700 py-20 sm:py-28"
    >
      <BackgroundPaths density={40} clear="left" />
      <div className="container-x relative">
        <div className="grid items-end gap-10 lg:grid-cols-[1.3fr_auto] lg:gap-16">
          <div>
            <Reveal direction="up">
              <SectionLabel onDark>{admissionsCta.label}</SectionLabel>
            </Reveal>

            <TextReveal
              as="h2"
              id="cta-title"
              lines={admissionsCta.titleLines}
              className="mt-6 max-w-3xl font-display text-[length:var(--text-4xl)] !text-white"
            />
          </div>

          <Reveal direction="up" delay={0.15}>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Button href="/admisiones" variant="light" size="lg">
                Agenda una cita
              </Button>
              <Button
                href={admissionsCta.secondary.href}
                variant="quiet"
                size="lg"
                arrow={false}
              >
                {admissionsCta.secondary.label}
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
