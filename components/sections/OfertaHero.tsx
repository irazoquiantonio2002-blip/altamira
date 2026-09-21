"use client";

import Image from "next/image";
import Link from "next/link";
import { programs } from "@/lib/site-data";
import { useReducedMotion } from "@/lib/useMotionPrefs";
import { Button } from "@/components/ui/Button";
import {
  ContainerAnimated,
  ContainerScroll,
  ContainerStagger,
  ContainerSticky,
  GalleryCol,
  GalleryContainer,
} from "@/components/ui/scroll/AnimatedGallery";

/**
 * Oferta Educativa hero — the AnimatedGallery demo layout, adapted.
 *
 * Kept from the original: the headline block that blurs in line by line,
 * the soft gradient haze under it (blur 84px, screen blend), and the
 * 350vh scroll in which a three-column wall of photos stands up from 75° and
 * then settles, the middle column offset by half a column.
 *
 * Adapted: school photographs grouped roughly by level (younger years on the
 * left, middle school in the centre, older years and community on the
 * right), real Oferta copy, brand colours for the haze instead of purple, the
 * headline cleared below the fixed navbar and kept under it (the original's
 * z-[9999] would paint over the navbar).
 */

type Photo = { src: string; alt: string };

const COLUMNS: { yRange: [string, string]; className: string; photos: Photo[] }[] = [
  {
    yRange: ["-10%", "2%"],
    className: "-mt-2",
    photos: [
      { src: "/img/elementary.jpg", alt: "Alumnos de Elementary pintando en el aula" },
      { src: "/img/galeria/juego-aula.jpg", alt: "Profesor y alumnos en una actividad de juego en el aula" },
      { src: "/img/galeria/exposicion-arte.jpg", alt: "Exposición de trabajos de arte de los alumnos" },
      { src: "/img/about.jpg", alt: "Alumnos trabajando en equipo" },
    ],
  },
  {
    yRange: ["15%", "5%"],
    className: "mt-[-50%]",
    photos: [
      { src: "/img/middle.jpg", alt: "Alumnos de Middle School en el laboratorio" },
      { src: "/img/galeria/proyecto-maqueta.jpg", alt: "Alumnos presentando un proyecto de maqueta" },
      { src: "/img/hero/formacion-ajedrez.jpg", alt: "Alumnos jugando ajedrez" },
      { src: "/img/instalaciones.jpg", alt: "Vista aérea del campus" },
    ],
  },
  {
    yRange: ["-10%", "2%"],
    className: "-mt-2",
    photos: [
      { src: "/img/high.jpg", alt: "Alumnos de High School en una presentación" },
      { src: "/img/hero/futuro-basquetbol.jpg", alt: "Equipo de básquetbol del colegio" },
      { src: "/img/hero/altamira-comunidad.jpg", alt: "Profesor con alumnos de Altamira La Cima" },
      { src: "/img/galeria/reunion-aula.jpg", alt: "Reunión en un aula del colegio" },
    ],
  },
];

function Photo({ photo }: { photo: Photo }) {
  return (
    <Image
      src={photo.src}
      alt={photo.alt}
      width={1200}
      height={675}
      sizes="(max-width: 768px) 34vw, 33vw"
      className="block aspect-video h-auto max-h-full w-full object-cover shadow"
    />
  );
}

export function OfertaHero() {
  const reduced = useReducedMotion();

  return (
    <section aria-labelledby="oferta-title" className="relative bg-paper">
      <h1 id="oferta-title" className="sr-only">
        Oferta Educativa: Elementary, Middle School y High School
      </h1>

      <ContainerStagger className="relative z-20 -mb-12 place-self-center px-6 pt-32 text-center sm:pt-40">
        <ContainerAnimated>
          <p
            aria-hidden="true"
            className="font-display text-4xl font-normal text-navy-700 md:text-5xl"
          >
            Oferta <span className="text-accent-600">Educativa</span>
          </p>
        </ContainerAnimated>
        <ContainerAnimated>
          <p
            aria-hidden="true"
            className="font-display text-4xl font-normal text-navy-700 md:text-5xl"
          >
            doce años, tres niveles
          </p>
        </ContainerAnimated>

        <ContainerAnimated className="my-6">
          <p className="mx-auto max-w-xl leading-normal tracking-tight text-slate">
            {programs.subtitle}
          </p>
        </ContainerAnimated>

        <ContainerAnimated className="flex flex-wrap items-center justify-center gap-2">
          <Button href="/admisiones" variant="accent">
            Solicita informes
          </Button>
          <Link
            href="#elementary"
            className="inline-flex min-h-[48px] items-center px-5 text-sm font-semibold text-navy-700 underline-offset-4 hover:underline"
          >
            Ver niveles
          </Link>
        </ContainerAnimated>
      </ContainerStagger>

      {/* The haze: a blurred brand gradient screened over the top of the
          gallery, as in the original (which used grey → purple → blue). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-10 h-[70vh] w-full"
        style={{
          background: "linear-gradient(to right, #8fa3c7, #2d6cff, #429be3)",
          filter: "blur(84px)",
          mixBlendMode: "screen",
        }}
      />

      {reduced ? (
        <div className="container-x grid grid-cols-3 gap-2 pb-20 pt-24">
          {COLUMNS.flatMap((col) => col.photos).map((photo) => (
            <Photo key={photo.src} photo={photo} />
          ))}
        </div>
      ) : (
        <ContainerScroll className="relative h-[350vh]">
          <ContainerSticky className="h-svh">
            <GalleryContainer>
              {COLUMNS.map((col) => (
                <GalleryCol key={col.photos[0].src} yRange={col.yRange} className={col.className}>
                  {col.photos.map((photo) => (
                    <Photo key={photo.src} photo={photo} />
                  ))}
                </GalleryCol>
              ))}
            </GalleryContainer>
          </ContainerSticky>
        </ContainerScroll>
      )}
    </section>
  );
}
