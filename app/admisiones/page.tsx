import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Stats } from "@/components/sections/Stats";
import { SectionHead } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { MapPin, Mail, Phone, WhatsApp } from "@/components/ui/Icons";
import { ClipRevealBand } from "@/components/ui/scroll/ClipRevealBand";
import { ScrollTimeline } from "@/components/ui/scroll/ScrollTimeline";
import { admissionSteps, contact, pageHeaders } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Admisiones",
  description:
    "Proceso de admisión a Colegio Altamira La Cima. Agenda una cita para conocer el campus y el modelo educativo.",
};

export default function AdmisionesPage() {
  return (
    <>
      <PageHeader data={pageHeaders.admisiones} breadcrumb="Admisiones" />

      {/* The photograph opens out of a centred frame and the invitation
          arrives with it. This block used to be a circle expanding over
          three screens of scrolling to deliver one line of copy; it is now
          shorter than a page and carries the two actions the whole page
          exists for, so the reader can act without reaching the bottom. */}
      <ClipRevealBand
        src="/img/hero/campus-backdrop.jpg"
        alt="Campus de Colegio Altamira La Cima"
        height="175vh"
        mobileHeight="135vh"
      >
        <span className="section-label !text-white/70">
          <span aria-hidden="true" className="size-[5px] bg-accent-500" />
          Admisiones abiertas
        </span>
        <p className="mt-4 max-w-2xl font-display text-[length:var(--text-3xl)] text-white">
          El primer paso es conocernos.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/contacto" variant="light" size="lg">
            Agenda tu cita
          </Button>
          <Button
            href={contact.whatsapp.href}
            variant="quiet"
            size="lg"
            arrow={false}
          >
            WhatsApp
          </Button>
        </div>
      </ClipRevealBand>

      {/* Process — numbered rows, one per step. */}
      <section className="section-y bg-paper">
        <div className="container-x">
          <Reveal direction="up">
            <SectionHead
              label="El proceso"
              title="Cuatro pasos para unirte"
              lead="Te acompañamos en cada etapa, desde la primera visita hasta la bienvenida."
            />
          </Reveal>

          <div className="mt-16 max-w-4xl">
            <ScrollTimeline steps={admissionSteps} />
          </div>
        </div>
      </section>

      <Stats onDark />

      {/* Direct contact routes. */}
      <section className="section-y bg-paper-50">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <Reveal direction="up">
              <SectionHead
                label="Siguiente paso"
                title="Agenda tu cita"
                lead="Escríbenos, llámanos o mándanos un WhatsApp. Te respondemos el mismo día hábil."
              />

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button href="/contacto" variant="solid" size="lg">
                  Escríbenos
                </Button>
                <Button
                  href={contact.whatsapp.href}
                  variant="outline"
                  size="lg"
                  arrow={false}
                >
                  WhatsApp
                </Button>
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.12}>
              <dl className="border-t border-rule">
                <div className="flex gap-5 border-b border-rule py-6">
                  <dt className="sr-only">Teléfonos</dt>
                  <Phone
                    className="mt-0.5 size-5 shrink-0 text-accent-600"
                    aria-hidden="true"
                  />
                  <dd className="flex flex-col">
                    {contact.phones.map((p) => (
                      <a
                        key={p}
                        href={`tel:+52${p.replace(/\s/g, "")}`}
                        className="min-h-[32px] text-navy-700 underline-offset-4 hover:underline"
                      >
                        {p}
                      </a>
                    ))}
                  </dd>
                </div>

                <div className="flex gap-5 border-b border-rule py-6">
                  <dt className="sr-only">Correo</dt>
                  <Mail
                    className="mt-0.5 size-5 shrink-0 text-accent-600"
                    aria-hidden="true"
                  />
                  <dd>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-navy-700 underline-offset-4 hover:underline"
                    >
                      {contact.email}
                    </a>
                  </dd>
                </div>

                <div className="flex gap-5 border-b border-rule py-6">
                  <dt className="sr-only">WhatsApp</dt>
                  <WhatsApp
                    className="mt-0.5 size-5 shrink-0 text-accent-600"
                    aria-hidden="true"
                  />
                  <dd>
                    <a
                      href={contact.whatsapp.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-navy-700 underline-offset-4 hover:underline"
                    >
                      {contact.whatsapp.number}
                    </a>
                  </dd>
                </div>

                <div className="flex gap-5 border-b border-rule py-6">
                  <dt className="sr-only">Dirección</dt>
                  <MapPin
                    className="mt-0.5 size-5 shrink-0 text-accent-600"
                    aria-hidden="true"
                  />
                  <dd>
                    <address className="not-italic text-navy-700">
                      {contact.address.street}, {contact.address.neighborhood}.
                      <br />
                      {contact.address.city}, {contact.address.region}.
                    </address>
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
