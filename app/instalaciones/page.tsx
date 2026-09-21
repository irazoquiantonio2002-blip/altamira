import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Facilities } from "@/components/sections/Facilities";
import { AdmissionsCTA } from "@/components/sections/AdmissionsCTA";
import { pageHeaders } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Instalaciones",
  description:
    "Más de 10,000 m² de campus: áreas verdes, canchas deportivas, laboratorios, biblioteca y sala de cómputo.",
};

export default function InstalacionesPage() {
  return (
    <>
      <PageHeader data={pageHeaders.instalaciones} breadcrumb="Instalaciones" />
      <Facilities withHead={false} />
      <AdmissionsCTA />
    </>
  );
}
