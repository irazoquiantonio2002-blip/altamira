import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Programs } from "@/components/sections/Programs";
import { AdmissionsCTA } from "@/components/sections/AdmissionsCTA";
import { ClipRevealBand } from "@/components/ui/scroll/ClipRevealBand";
import { pageHeaders } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Oferta Educativa",
  description:
    "Elementary (1° a 4°), Middle School (5° a 9°) y High School (10° a 12°) en Colegio Altamira La Cima, Zapopan, Jalisco.",
};

/**
 * Signature scroll move on this page: the full-bleed frame that unfolds
 * between the levels and the CTA.
 */
export default function OfertaPage() {
  return (
    <>
      <PageHeader data={pageHeaders.oferta} breadcrumb="Oferta Educativa" />

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
