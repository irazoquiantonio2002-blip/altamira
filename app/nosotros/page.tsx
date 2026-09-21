import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { About } from "@/components/sections/About";
import { Marquee } from "@/components/sections/Marquee";
import { Stats } from "@/components/sections/Stats";
import { AdmissionsCTA } from "@/components/sections/AdmissionsCTA";
import { SectionHead } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollTextHighlight } from "@/components/ui/scroll/ScrollTextHighlight";
import { StickySwapGallery } from "@/components/ui/scroll/StickySwapGallery";
import { BackgroundPaths } from "@/components/ui/scroll/BackgroundPaths";
import { ZoomParallax } from "@/components/ui/scroll/ZoomParallax";
import { community, pageHeaders, pillars, statements } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Institución educativa de formación integral centrada en la persona, con visión católica de la vida y el acompañamiento de la prelatura personal del Opus Dei.",
};

/**
 * Signature scroll move on this page: the pinned photo column that swaps
 * image as the reader moves through the four pillars.
 */
export default function NosotrosPage() {
  return (
    <>
      <PageHeader data={pageHeaders.nosotros} breadcrumb="Nosotros" />

      <About cta={false} />

      {/* ZoomParallax — seven photos zoom past; the centre one fills the
          screen and the caption appears over it. */}
      <section aria-labelledby="zoom-title" className="bg-paper">
        <div className="container-x flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
          <Reveal direction="up">
            <SectionHead
              label={community.label}
              title={<span id="zoom-title">{community.title}</span>}
              lead={community.subtitle}
              align="center"
            />
          </Reveal>
        </div>

        <ZoomParallax
          images={[
            { src: "/img/hero/altamira-comunidad.jpg", alt: "Profesor con alumnos de Altamira La Cima" },
            { src: "/img/about.jpg", alt: "Alumnos trabajando en equipo" },
            { src: "/img/high.jpg", alt: "Alumnos de High School en una presentación" },
            { src: "/img/galeria/exposicion-arte.jpg", alt: "Exposición de trabajos de arte de los alumnos" },
            { src: "/img/elementary.jpg", alt: "Alumnos de Elementary pintando en el aula" },
            { src: "/img/hero/futuro-basquetbol.jpg", alt: "Equipo de básquetbol del colegio" },
            { src: "/img/galeria/proyecto-maqueta.jpg", alt: "Alumnos presentando un proyecto de maqueta" },
          ]}
          caption={
            <>
              <span className="section-label !text-white/70">
                <span aria-hidden="true" className="size-[5px] bg-accent-500" />
                {community.label}
              </span>
              <p className="mt-4 max-w-2xl font-display text-[length:var(--text-3xl)] text-white">
                Padres, profesores, alumnos y alumni.
              </p>
            </>
          }
        />
      </section>

      {/* Scroll-linked statement over the flowing white line field. */}
      <section className="relative isolate overflow-hidden bg-navy-900 py-28 sm:py-40">
        <BackgroundPaths density={44} clear="center" />
        <div className="container-x relative">
          <ScrollTextHighlight
            text={statements.nosotros}
            onDark
            className="mx-auto max-w-4xl justify-center text-center text-[length:var(--text-3xl)] leading-[1.25]"
          />
        </div>
      </section>

      <Marquee />

      <section id="modelo" className="section-y bg-paper">
        <div className="container-x">
          <Reveal direction="up">
            <SectionHead
              label={pillars.label}
              title={pillars.title}
              lead={pillars.subtitle}
            />
          </Reveal>
        </div>

        <div className="mt-16">
          <StickySwapGallery items={[...pillars.items]} />
        </div>
      </section>

      <Stats onDark />
      <AdmissionsCTA />
    </>
  );
}
