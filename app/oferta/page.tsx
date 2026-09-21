import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Programs } from "@/components/sections/Programs";
import { AdmissionsCTA } from "@/components/sections/AdmissionsCTA";
import { pageHeaders } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Oferta Educativa",
  description:
    "Elementary (1° a 4°), Middle School (5° a 9°) y High School (10° a 12°) en Colegio Altamira La Cima, Zapopan, Jalisco.",
};

export default function OfertaPage() {
  return (
    <>
      <PageHeader data={pageHeaders.oferta} breadcrumb="Oferta Educativa" />
      <Programs withHead={false} />
      <AdmissionsCTA />
    </>
  );
}
