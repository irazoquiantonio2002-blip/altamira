import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Community } from "@/components/sections/Community";
import { Marquee } from "@/components/sections/Marquee";
import { AdmissionsCTA } from "@/components/sections/AdmissionsCTA";
import { pageHeaders } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Comunidad",
  description:
    "Padres, profesores, alumnos y alumni: los cuatro pilares que sostienen la comunidad educativa de Altamira La Cima.",
};

export default function ComunidadPage() {
  return (
    <>
      <PageHeader data={pageHeaders.comunidad} breadcrumb="Comunidad" />
      <Community />
      <Marquee />
      <AdmissionsCTA />
    </>
  );
}
