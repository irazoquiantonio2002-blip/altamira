import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { About } from "@/components/sections/About";
import { Pillars } from "@/components/sections/Pillars";
import { Marquee } from "@/components/sections/Marquee";
import { Stats } from "@/components/sections/Stats";
import { AdmissionsCTA } from "@/components/sections/AdmissionsCTA";
import { pageHeaders } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Institución educativa de formación integral centrada en la persona, con visión católica de la vida y el acompañamiento de la prelatura personal del Opus Dei.",
};

export default function NosotrosPage() {
  return (
    <>
      <PageHeader data={pageHeaders.nosotros} breadcrumb="Nosotros" />
      <About cta={false} />
      <Marquee />
      <Pillars />
      <Stats onDark />
      <AdmissionsCTA />
    </>
  );
}
