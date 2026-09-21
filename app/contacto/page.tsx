import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Contact } from "@/components/sections/Contact";
import { pageHeaders } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Av. La Cima 614, Zapopan, Jalisco. Teléfonos, correo de admisiones, WhatsApp y formulario de contacto.",
};

export default function ContactoPage() {
  return (
    <>
      <PageHeader data={pageHeaders.contacto} breadcrumb="Contacto" />
      <Contact />
    </>
  );
}
