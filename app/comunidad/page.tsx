import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Community } from "@/components/sections/Community";
import { Marquee } from "@/components/sections/Marquee";
import { AdmissionsCTA } from "@/components/sections/AdmissionsCTA";
import { ScrollTextHighlight } from "@/components/ui/scroll/ScrollTextHighlight";
import { CircularReveal } from "@/components/ui/scroll/CircularReveal";
import { pageHeaders, statements } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Comunidad",
  description:
    "Padres, profesores, alumnos y alumni: los cuatro pilares que sostienen la comunidad educativa de Altamira La Cima.",
};

/**
 * Signature scroll moves on this page: the circular opening that introduces
 * the section, and the pinned horizontal track of the four pillars.
 */
export default function ComunidadPage() {
  return (
    <>
      <PageHeader data={pageHeaders.comunidad} breadcrumb="Comunidad" />

      <CircularReveal
        src="/img/hero/altamira-comunidad.jpg"
        alt="Comunidad de Colegio Altamira La Cima"
      >
        <div className="mx-auto max-w-3xl text-center">
          <span className="section-label justify-center !text-white/70">
            <span aria-hidden="true" className="size-[5px] bg-accent-500" />
            Centrada en la persona
          </span>
          <p className="mt-5 font-display text-[length:var(--text-3xl)] text-white">
            Cada alumno es una gran novedad por descubrir y formar.
          </p>
        </div>
      </CircularReveal>

      <Community />

      <section className="bg-paper py-24 sm:py-32">
        <div className="container-x">
          <ScrollTextHighlight
            text={statements.comunidad}
            className="mx-auto max-w-4xl justify-center text-center text-[length:var(--text-3xl)] leading-[1.25]"
          />
        </div>
      </section>

      <Marquee />
      <AdmissionsCTA />
    </>
  );
}
