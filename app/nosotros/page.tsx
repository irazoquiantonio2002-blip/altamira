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
import { pageHeaders, pillars, statements } from "@/lib/site-data";

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

      {/* Scroll-linked statement over the drifting line-work. */}
      <section className="relative isolate overflow-hidden bg-paper-50 py-24 sm:py-32">
        <BackgroundPaths />
        <div className="container-x relative">
          <ScrollTextHighlight
            text={statements.nosotros}
            className="mx-auto max-w-4xl text-center text-[length:var(--text-3xl)] leading-[1.25]"
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
