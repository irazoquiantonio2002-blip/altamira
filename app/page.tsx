import { CosmosHero } from "@/components/sections/CosmosHero";
import { Stats } from "@/components/sections/Stats";
import { Marquee } from "@/components/sections/Marquee";
import { About } from "@/components/sections/About";
import { SectionHead } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { ContainerScroll } from "@/components/ui/scroll/ContainerScroll";
import { ScrollChoreography } from "@/components/ui/scroll/ScrollChoreography";
import { SmoothScrollHero } from "@/components/ui/scroll/SmoothScrollHero";
import { BackgroundPathsSection } from "@/components/ui/scroll/BackgroundPaths";
import { ExpandingPanels } from "@/components/ui/scroll/ExpandingPanels";
import { StackingCards } from "@/components/ui/scroll/StackingCards";
import { pillars, programs } from "@/lib/site-data";

/**
 * Home. The showcase page: around the original cosmos hero (untouched) it
 * carries all four scroll components the client asked for by name —
 * ContainerScroll, ScrollChoreography, the SmoothScrollHero parallax reveal
 * and BackgroundPaths — and routes into the inner pages.
 */

const destinations = [
  {
    href: "/oferta",
    label: "Oferta Educativa",
    title: "Tres niveles, doce años",
    text: "Elementary, Middle School y High School, cada uno ajustado a las características propias de la edad.",
    image: {
      src: "/img/elementary.jpg",
      alt: "Alumnos de Elementary en Colegio Altamira La Cima",
    },
  },
  {
    href: "/comunidad",
    label: "Comunidad",
    title: "Padres, profesores, alumnos y alumni",
    text: "Cuatro pilares que sostienen la vida del colegio y acompañan a cada familia.",
    image: {
      src: "/img/hero/altamira-comunidad.jpg",
      alt: "Comunidad de Colegio Altamira La Cima",
    },
  },
  {
    href: "/instalaciones",
    label: "Campus",
    title: "Más de 10,000 m²",
    text: "Áreas verdes, canchas deportivas, laboratorios y espacios diseñados para cada nivel.",
    image: {
      src: "/img/instalaciones.jpg",
      alt: "Vista aérea del campus de Colegio Altamira La Cima",
    },
  },
];

export default function Home() {
  return (
    <>
      <CosmosHero />

      <Stats />
      <Marquee />

      <About />

      {/* ① ContainerScroll — the tipped panel that lays itself flat. */}
      <section className="overflow-hidden bg-paper-50">
        <ContainerScroll
          titleComponent={
            <>
              <p className="section-label justify-center">
                <span aria-hidden="true" className="size-[5px] bg-accent-600" />
                Cuerpo, corazón, inteligencia y voluntad
              </p>
              <h2 className="mt-6 font-display text-3xl sm:text-4xl">
                Una educación que forma el carácter
                <span className="mt-2 block text-5xl leading-none md:text-[6rem]">
                  Formación Integral
                </span>
              </h2>
            </>
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/hero/formacion-ajedrez.jpg"
            alt="Alumnos de Altamira La Cima en una actividad de concentración"
            draggable={false}
            className="mx-auto size-full object-cover object-center"
          />
        </ContainerScroll>
      </section>

      {/* ② ScrollChoreography — four photos swap, stack, and one opens out. */}
      <ScrollChoreography
        images={{
          topLeft: { src: "/img/high.jpg", alt: "Alumnos de High School" },
          topRight: {
            src: "/img/hero/altamira-comunidad.jpg",
            alt: "Comunidad de Colegio Altamira La Cima",
          },
          bottomLeft: {
            src: "/img/hero/futuro-basquetbol.jpg",
            alt: "Alumnos en actividad deportiva",
          },
          bottomRight: {
            src: "/img/elementary.jpg",
            alt: "Alumnos de Elementary",
          },
        }}
      />

      {/* Pillars as hover-expanding panels. */}
      <section className="section-y bg-paper-50">
        <div className="container-x">
          <Reveal direction="up">
            <SectionHead
              label={pillars.label}
              title={pillars.title}
              lead={pillars.subtitle}
            />
          </Reveal>
          <div className="mt-14">
            <ExpandingPanels
              panels={pillars.items.map((item) => ({
                index: item.index,
                title: item.title,
                text: item.text,
                image: item.image,
                href: "/nosotros#modelo",
              }))}
            />
          </div>
        </div>
      </section>

      {/* ③ SmoothScrollHero — the campus opens out of a centred frame while
          photos fly past it, then the list of levels. */}
      <SmoothScrollHero
        image={{
          src: "/img/instalaciones.jpg",
          alt: "Vista aérea del campus de Colegio Altamira La Cima",
        }}
        shots={[
          {
            src: "/img/hero/formacion-ajedrez.jpg",
            alt: "Alumnos en actividad de concentración",
            start: -200,
            end: 200,
            className: "w-1/2 md:w-1/3",
          },
          {
            src: "/img/middle.jpg",
            alt: "Alumnos de Middle School en el laboratorio",
            start: 200,
            end: -250,
            className: "mx-auto w-5/6 md:w-2/3",
          },
          {
            src: "/img/hero/futuro-basquetbol.jpg",
            alt: "Alumnos en la cancha de básquetbol",
            start: -200,
            end: 200,
            className: "ml-auto w-1/2 md:w-1/3",
          },
          {
            src: "/img/about.jpg",
            alt: "Alumnos trabajando en equipo",
            start: 0,
            end: -500,
            className: "ml-8 w-2/3 md:ml-24 md:w-5/12",
          },
        ]}
        label={programs.label}
        heading={programs.title}
        items={programs.items.map((item) => ({
          title: item.title,
          date: item.grades,
          location: "Ver nivel",
          href: `/oferta#${item.title.toLowerCase().split(" ")[0]}`,
        }))}
      />

      {/* Routes into the rest of the site. */}
      <section className="section-y bg-paper">
        <div className="container-x">
          <Reveal direction="up">
            <SectionHead
              label="Explora el colegio"
              title="Conoce Altamira La Cima"
            />
          </Reveal>
          <div className="mt-14">
            <StackingCards cards={destinations} />
          </div>
        </div>
      </section>

      {/* ④ BackgroundPaths — the full-screen white line field closing the page. */}
      <BackgroundPathsSection
        kicker="Admisiones Abiertas"
        title="Conoce Altamira"
        cta={{ label: "Agenda una cita", href: "/admisiones" }}
      />
    </>
  );
}
