import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Programs } from "@/components/sections/Programs";
import { AdmissionsCTA } from "@/components/sections/AdmissionsCTA";
import { TiltCardScroll } from "@/components/ui/scroll/TiltCardScroll";
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

      <section className="section-y bg-paper-50">
        <TiltCardScroll
          header={
            <SectionHead
              label="Doce años"
              title="Un proyecto continuo"
              lead={programs.subtitle}
              align="center"
            />
          }
        >
          <div className="grid divide-rule sm:grid-cols-3 sm:divide-x">
            {programs.items.map((item) => (
              <div key={item.index} className="p-8 text-center sm:p-10">
                <span className="font-display text-[length:var(--text-2xl)] text-rule-strong">
                  {item.index}
                </span>
                <h3 className="mt-6 font-display text-[length:var(--text-xl)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[length:var(--text-label)] font-semibold uppercase tracking-[0.18em] text-accent-600">
                  {item.grades}
                </p>
              </div>
            ))}
          </div>
        </TiltCardScroll>
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
