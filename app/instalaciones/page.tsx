import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Facilities } from "@/components/sections/Facilities";
import { AdmissionsCTA } from "@/components/sections/AdmissionsCTA";
import { ScrollChoreography } from "@/components/ui/scroll/ScrollChoreography";
import { ParallaxColumn } from "@/components/ui/scroll/ParallaxColumn";
import { SectionHead } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { facilities, pageHeaders } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Instalaciones",
  description:
    "Más de 10,000 m² de campus: áreas verdes, canchas deportivas, laboratorios, biblioteca y sala de cómputo.",
};

/**
 * Signature scroll move on this page: the four-photo choreography that
 * converges to the centre and then opens out to full screen.
 */
export default function InstalacionesPage() {
  return (
    <>
      <PageHeader data={pageHeaders.instalaciones} breadcrumb="Instalaciones" />

      <ScrollChoreography
        heading={{
          label: facilities.label,
          title: facilities.subtitle,
        }}
        images={{
          topLeft: {
            src: "/img/elementary.jpg",
            alt: "Aula de Elementary en el campus",
          },
          topRight: {
            src: "/img/instalaciones.jpg",
            alt: "Vista aérea del campus de Colegio Altamira La Cima",
          },
          bottomLeft: {
            src: "/img/hero/futuro-basquetbol.jpg",
            alt: "Canchas deportivas del campus",
          },
          bottomRight: {
            src: "/img/middle.jpg",
            alt: "Laboratorio de ciencias del campus",
          },
        }}
      >
        <span className="section-label !text-white/70">
          <span aria-hidden="true" className="size-[5px] bg-accent-500" />
          {facilities.badge.label}
        </span>
        <p className="mt-4 max-w-2xl font-display text-[length:var(--text-3xl)] text-white">
          {facilities.badge.value} m² para crecer.
        </p>
      </ScrollChoreography>

      <Facilities withHead={false} />

      {/* Two-column gallery, columns drifting in opposite directions. */}
      <section className="section-y bg-paper-50">
        <div className="container-x">
          <Reveal direction="up">
            <SectionHead
              label="Galería"
              title="La vida en el campus"
              align="center"
            />
          </Reveal>
        </div>

        <div className="mt-12">
          <ParallaxColumn
            images={[
              { src: "/img/hero/formacion-ajedrez.jpg", alt: "Alumnos en actividad de concentración" },
              { src: "/img/hero/altamira-comunidad.jpg", alt: "Comunidad de Colegio Altamira La Cima" },
              { src: "/img/galeria/exposicion-arte.jpg", alt: "Exposición de trabajos de arte de los alumnos" },
              { src: "/img/high.jpg", alt: "Alumnos de High School en el campus" },
              { src: "/img/about.jpg", alt: "Alumnos trabajando en equipo" },
              { src: "/img/galeria/proyecto-maqueta.jpg", alt: "Alumnos presentando un proyecto de maqueta" },
            ]}
          />
        </div>
      </section>

      <AdmissionsCTA />
    </>
  );
}
