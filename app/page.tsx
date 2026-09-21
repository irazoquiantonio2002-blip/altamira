import { CosmosHero } from "@/components/sections/CosmosHero";
import { Stats } from "@/components/sections/Stats";
import { Marquee } from "@/components/sections/Marquee";
import { About } from "@/components/sections/About";
import { AdmissionsCTA } from "@/components/sections/AdmissionsCTA";
import { SectionHead } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { ClipRevealBand } from "@/components/ui/scroll/ClipRevealBand";
import { ExpandingPanels } from "@/components/ui/scroll/ExpandingPanels";
import { StackingCards } from "@/components/ui/scroll/StackingCards";
import { pillars } from "@/lib/site-data";

/**
 * Home. Its job is to set the tone and route people into the real pages —
 * not to hold the whole site. Each block below is a summary that ends in a
 * link to the page that carries the full content.
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

      <ClipRevealBand
        src="/img/instalaciones.jpg"
        alt="Vista aérea del campus de Colegio Altamira La Cima"
      >
        <span className="section-label !text-white/70">
          <span aria-hidden="true" className="size-[5px] bg-accent-500" />
          Campus La Cima
        </span>
        <p className="mt-4 max-w-2xl font-display text-[length:var(--text-3xl)] text-white">
          Más de 10,000 m² en el corazón de Zapopan.
        </p>
      </ClipRevealBand>

      {/* Model summary — the four pillars in brief, linking to Nosotros. */}
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

      <AdmissionsCTA />
    </>
  );
}
