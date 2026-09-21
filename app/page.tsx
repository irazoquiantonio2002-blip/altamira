import Link from "next/link";
import Image from "next/image";
import { CosmosHero } from "@/components/sections/CosmosHero";
import { Stats } from "@/components/sections/Stats";
import { Marquee } from "@/components/sections/Marquee";
import { About } from "@/components/sections/About";
import { AdmissionsCTA } from "@/components/sections/AdmissionsCTA";
import { SectionHead } from "@/components/ui/SectionLabel";
import { Reveal, RevealItem, Stagger } from "@/components/ui/Reveal";
import { pillars } from "@/lib/site-data";
import { PillarIconGlyph } from "@/components/ui/Icons";

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
    image: "/img/elementary.jpg",
    alt: "Alumnos de Elementary en Colegio Altamira La Cima",
  },
  {
    href: "/comunidad",
    label: "Comunidad",
    title: "Padres, profesores, alumnos y alumni",
    text: "Cuatro pilares que sostienen la vida del colegio y acompañan a cada familia.",
    image: "/img/hero/altamira-comunidad.jpg",
    alt: "Comunidad de Colegio Altamira La Cima",
  },
  {
    href: "/instalaciones",
    label: "Campus",
    title: "Más de 10,000 m²",
    text: "Áreas verdes, canchas deportivas, laboratorios y espacios diseñados para cada nivel.",
    image: "/img/instalaciones.jpg",
    alt: "Vista aérea del campus de Colegio Altamira La Cima",
  },
];

export default function Home() {
  return (
    <>
      <CosmosHero />

      <Stats />
      <Marquee />

      <About />

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

          <Stagger
            className="mt-14 grid border-l border-t border-rule sm:grid-cols-2 lg:grid-cols-4"
            gap={0.09}
          >
            {pillars.items.map((item) => (
              <RevealItem
                key={item.index}
                className="border-b border-r border-rule bg-paper p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-[length:var(--text-2xl)] text-rule-strong">
                    {item.index}
                  </span>
                  <PillarIconGlyph
                    name={item.icon}
                    className="size-6 text-navy-700"
                  />
                </div>
                <h3 className="mt-10 font-display text-[length:var(--text-lg)]">
                  {item.title}
                </h3>
              </RevealItem>
            ))}
          </Stagger>
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

          <Stagger className="mt-14 grid gap-px bg-rule lg:grid-cols-3" gap={0.1} tall>
            {destinations.map((d) => (
              <RevealItem key={d.href}>
                <Link
                  href={d.href}
                  className="group flex h-full flex-col bg-paper transition-colors duration-500 hover:bg-paper-50"
                >
                  <div className="relative aspect-3/2 w-full overflow-hidden">
                    <Image
                      src={d.image}
                      alt={d.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover saturate-[.8] transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-8">
                    <span className="text-[length:var(--text-label)] font-semibold uppercase tracking-[0.2em] text-accent-600">
                      {d.label}
                    </span>
                    <h3 className="mt-4 font-display text-[length:var(--text-xl)]">
                      {d.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate">
                      {d.text}
                    </p>

                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy-700">
                      Ver más
                      <svg
                        viewBox="0 0 20 12"
                        aria-hidden="true"
                        className="w-4 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="square"
                      >
                        <path d="M0 6h18M13 1l5 5-5 5" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>

      <AdmissionsCTA />
    </>
  );
}
