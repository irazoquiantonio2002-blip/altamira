import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Programs } from "@/components/sections/Programs";
import { AdmissionsCTA } from "@/components/sections/AdmissionsCTA";
import { ContainerScroll } from "@/components/ui/scroll/ContainerScroll";
import { ClipRevealBand } from "@/components/ui/scroll/ClipRevealBand";
import { SectionHead } from "@/components/ui/SectionLabel";
import { pageHeaders, programs } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Oferta Educativa",
  description:
    "Elementary (1° a 4°), Middle School (5° a 9°) y High School (10° a 12°) en Colegio Altamira La Cima, Zapopan, Jalisco.",
};

/**
 * Signature scroll moves on this page: the panel that lays itself flat as it
 * enters, and the full-bleed frame that unfolds between the levels and the CTA.
 */
export default function OfertaPage() {
  return (
    <>
      <PageHeader data={pageHeaders.oferta} breadcrumb="Oferta Educativa" />

      {/* ContainerScroll: the three levels on a panel that lays itself flat. */}
      <section className="overflow-hidden bg-paper-50">
        <ContainerScroll
          titleComponent={
            <SectionHead
              label="Doce años"
              title="Un proyecto continuo"
              lead={programs.subtitle}
              align="center"
            />
          }
        >
          <div className="grid size-full grid-rows-3 gap-2 md:grid-cols-3 md:grid-rows-1 md:gap-4">
            {programs.items.map((item) => (
              <div key={item.index} className="relative overflow-hidden bg-ink-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image.src}
                  alt={item.image.alt}
                  draggable={false}
                  className="absolute inset-0 size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                  <span className="text-[length:var(--text-label)] font-semibold uppercase tracking-[0.18em] text-white/75">
                    {item.grades}
                  </span>
                  <h3 className="mt-2 font-display text-[length:var(--text-xl)] !text-white">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </ContainerScroll>
      </section>

      <Programs withHead={false} />

      <ClipRevealBand
        src="/img/hero/futuro-basquetbol.jpg"
        alt="Alumnos de Altamira La Cima en actividad deportiva"
      >
        <span className="section-label !text-white/70">
          <span aria-hidden="true" className="size-[5px] bg-accent-500" />
          Formación integral
        </span>
        <p className="mt-4 max-w-2xl font-display text-[length:var(--text-3xl)] text-white">
          Cuerpo, corazón, inteligencia y voluntad.
        </p>
      </ClipRevealBand>

      <AdmissionsCTA />
    </>
  );
}
