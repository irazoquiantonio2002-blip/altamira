import type { Metadata } from "next";
import { GalleryHero } from "@/components/sections/GalleryHero";
import { Community } from "@/components/sections/Community";
import { Marquee } from "@/components/sections/Marquee";
import { AdmissionsCTA } from "@/components/sections/AdmissionsCTA";
import { ScrollTextHighlight } from "@/components/ui/scroll/ScrollTextHighlight";
import { about, community, statements } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Comunidad",
  description:
    "Padres, profesores, alumnos y alumni: los cuatro pilares que sostienen la comunidad educativa de Altamira La Cima.",
};

/**
 * Signature scroll moves on this page: the gallery hero (a wall of photos
 * that stands up from 75° as you scroll) and the pinned horizontal track of
 * the four pillars.
 */
export default function ComunidadPage() {
  return (
    <>
      <GalleryHero
        srTitle="Nuestra Comunidad: padres, profesores, alumnos y alumni"
        titleLead="Nuestra"
        titleAccent="Comunidad"
        titleLine2="padres, profesores, alumnos y alumni"
        lead={about.paragraphs[0]}
        primary={{ label: "Agenda una cita", href: "/admisiones" }}
        secondary={{ label: "Ver los cuatro pilares", href: "#comunidad" }}
        columns={[
          {
            yRange: ["-10%", "2%"],
            className: "-mt-2",
            photos: [
              { src: "/img/hero/altamira-comunidad.jpg", alt: "Profesor con alumnos de Altamira La Cima" },
              { src: "/img/galeria/reunion-aula.jpg", alt: "Reunión en un aula del colegio" },
              { src: "/img/elementary.jpg", alt: "Alumnos de Elementary pintando en el aula" },
              { src: "/img/galeria/juego-aula.jpg", alt: "Profesor y alumnos en una actividad de juego en el aula" },
            ],
          },
          {
            yRange: ["15%", "5%"],
            className: "mt-[-50%]",
            photos: [
              { src: "/img/galeria/proyecto-maqueta.jpg", alt: "Familias y alumnos ante un proyecto de maqueta" },
              { src: "/img/hero/futuro-basquetbol.jpg", alt: "Equipo de básquetbol del colegio" },
              { src: "/img/about.jpg", alt: "Alumnos trabajando en equipo" },
              { src: "/img/galeria/exposicion-arte.jpg", alt: "Exposición de trabajos de arte de los alumnos" },
            ],
          },
          {
            yRange: ["-10%", "2%"],
            className: "-mt-2",
            photos: [
              { src: "/img/high.jpg", alt: "Alumnos de High School en una presentación" },
              { src: "/img/hero/formacion-ajedrez.jpg", alt: "Alumnos jugando ajedrez" },
              { src: "/img/middle.jpg", alt: "Alumnos de Middle School en el laboratorio" },
              { src: "/img/instalaciones.jpg", alt: "Vista aérea del campus" },
            ],
          },
        ]}
      />

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
