import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Stats } from "@/components/sections/Stats";
import { SectionHead } from "@/components/ui/SectionLabel";
import { Reveal, RevealItem, Stagger } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { MapPin, Mail, Phone, WhatsApp } from "@/components/ui/Icons";
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

          <Stagger className="mt-14 border-t border-rule" gap={0.1} tall>
            {admissionSteps.map((step) => (
              <RevealItem
                key={step.index}
                className="group grid gap-4 border-b border-rule py-9 transition-colors duration-500 hover:bg-paper-50 lg:grid-cols-[6rem_1fr_1.4fr] lg:items-baseline lg:gap-10"
              >
                <span className="font-display text-[length:var(--text-2xl)] text-rule-strong transition-colors duration-500 group-hover:text-accent-600">
                  {step.index}
                </span>
                <h3 className="font-display text-[length:var(--text-xl)]">
                  {step.title}
                </h3>
                <p className="max-w-prose text-slate">{step.text}</p>
              </RevealItem>
            ))}
          </Stagger>
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
