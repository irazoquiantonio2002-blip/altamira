import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Contact } from "@/components/sections/Contact";
import { BackgroundPaths } from "@/components/ui/scroll/BackgroundPaths";
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

      {/* The drifting line-work sits behind the form so the page has some
          life without competing with a block the reader has to fill in. */}
      <div className="relative isolate overflow-hidden">
        <BackgroundPaths className="opacity-40" />
        <div className="relative">
          <Contact />
        </div>
      </div>
    </>
  );
}
