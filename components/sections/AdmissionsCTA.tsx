import { admissionsCta } from "@/lib/site-data";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Chevrons } from "@/components/ui/Chevrons";

/**
 * CTA Admisiones (§6.10). The one navy band on the page — it reads as a
 * deliberate interruption between the campus imagery and the contact form.
 */
export function AdmissionsCTA() {
  return (
    <section
      aria-labelledby="cta-title"
      className="relative overflow-hidden bg-navy-700 py-24 sm:py-32"
    >
      {/* A single soft radial lift so the flat navy is not dead-flat. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_20%_10%,rgba(45,108,255,0.22),transparent_65%)]"
      />
      <Chevrons corner="bottom-right" className="opacity-60" />

      <div className="container-x relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal direction="up">
            <SectionLabel className="mb-7">{admissionsCta.label}</SectionLabel>
          </Reveal>

          <TextReveal
            as="h2"
            id="cta-title"
            lines={admissionsCta.titleLines}
            className="font-display text-[length:var(--text-5xl)] text-paper"
          />

          <Reveal direction="up" delay={0.2}>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                href={admissionsCta.primary.href}
                variant="white"
                size="lg"
                magnetic
                className="w-full sm:w-auto"
              >
                {admissionsCta.primary.label}
              </Button>
              <Button
                href={admissionsCta.secondary.href}
                variant="ghost"
                size="lg"
                arrow={false}
                className="w-full sm:w-auto"
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
