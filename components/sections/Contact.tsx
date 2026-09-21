"use client";

import { useState, type FormEvent } from "react";
import { contact, contactSection } from "@/lib/site-data";
import { Reveal } from "@/components/ui/Reveal";
import { SubmitButton } from "@/components/ui/Button";
import { Mail, MapPin, Phone, WhatsApp } from "@/components/ui/Icons";

type Errors = Partial<Record<"name" | "phone" | "email" | "message", string>>;
type Status = "idle" | "sending" | "sent";

const fieldBase =
  "w-full border bg-paper px-4 py-3.5 text-navy-700 placeholder:text-slate/55 " +
  "transition-colors duration-300 focus:outline-none";

/** Contacto — details column with the map, plus a validated form. */
export function Contact() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const validate = (data: FormData): Errors => {
    const next: Errors = {};
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (name.length < 2) next.name = "Escribe tu nombre completo.";
    // Deliberately loose: Mexican numbers are written with spaces, dashes and
    // an optional +52, and rejecting any of those forms only loses leads.
    if (phone.replace(/\D/g, "").length < 10)
      next.phone = "Escribe un teléfono a 10 dígitos.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Escribe un correo válido.";
    if (message.length < 10) next.message = "Cuéntanos un poco más.";

    return next;
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const found = validate(new FormData(form));
    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus("sending");

    // TODO: conectar a un endpoint real (API route, Formspree, o el correo
    // de admisiones). Hoy sólo valida y muestra el estado de éxito — no se
    // envía nada a ningún lado.
    window.setTimeout(() => {
      setStatus("sent");
      form.reset();
    }, 700);
  };

  const fieldClass = (key: keyof Errors) =>
    `${fieldBase} ${
      errors[key]
        ? "border-red-600 focus:border-red-700"
        : "border-rule-strong focus:border-accent-600"
    }`;

  return (
    <section id="contacto" className="section-y bg-paper">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* ── Details ────────────────────────────────────────────── */}
          <Reveal direction="up" tall>
            <h2 className="font-display text-[length:var(--text-2xl)]">
              {contactSection.infoTitle}
            </h2>
            <p className="mt-4 max-w-prose text-slate">
              {contactSection.infoText}
            </p>

            <dl className="mt-10 border-t border-rule">
              <div className="flex gap-5 border-b border-rule py-6">
                <dt className="sr-only">Dirección</dt>
                <MapPin
                  className="mt-0.5 size-5 shrink-0 text-accent-600"
                  aria-hidden="true"
                />
                <dd>
                  <span className="block text-[length:var(--text-label)] uppercase tracking-[0.16em] text-slate">
                    Dirección
                  </span>
                  <address className="mt-2 not-italic text-navy-700">
                    {contact.address.street}, {contact.address.neighborhood}.
                    <br />
                    {contact.address.city}, {contact.address.region},{" "}
                    {contact.address.country}
                  </address>
                </dd>
              </div>

              <div className="flex gap-5 border-b border-rule py-6">
                <dt className="sr-only">Correo</dt>
                <Mail
                  className="mt-0.5 size-5 shrink-0 text-accent-600"
                  aria-hidden="true"
                />
                <dd>
                  <span className="block text-[length:var(--text-label)] uppercase tracking-[0.16em] text-slate">
                    Correo
                  </span>
                  <a
                    href={`mailto:${contact.email}`}
                    className="mt-2 inline-block text-navy-700 underline-offset-4 hover:underline"
                  >
                    {contact.email}
                  </a>
                </dd>
              </div>

              <div className="flex gap-5 border-b border-rule py-6">
                <dt className="sr-only">Teléfonos</dt>
                <Phone
                  className="mt-0.5 size-5 shrink-0 text-accent-600"
                  aria-hidden="true"
                />
                <dd>
                  <span className="block text-[length:var(--text-label)] uppercase tracking-[0.16em] text-slate">
                    Teléfonos
                  </span>
                  <div className="mt-2 flex flex-col">
                    {contact.phones.map((p) => (
                      <a
                        key={p}
                        href={`tel:+52${p.replace(/\s/g, "")}`}
                        className="min-h-[32px] text-navy-700 underline-offset-4 hover:underline"
                      >
                        {p}
                      </a>
                    ))}
                  </div>
                </dd>
              </div>

              <div className="flex gap-5 border-b border-rule py-6">
                <dt className="sr-only">WhatsApp</dt>
                <WhatsApp
                  className="mt-0.5 size-5 shrink-0 text-accent-600"
                  aria-hidden="true"
                />
                <dd>
                  <span className="block text-[length:var(--text-label)] uppercase tracking-[0.16em] text-slate">
                    WhatsApp
                  </span>
                  <a
                    href={contact.whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-navy-700 underline-offset-4 hover:underline"
                  >
                    {contact.whatsapp.number}
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mt-10 border border-rule">
              <iframe
                src={contact.mapEmbed}
                title="Ubicación de Colegio Altamira La Cima"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                // Explicit height keeps CLS at zero while the map loads.
                className="h-[340px] w-full border-0 grayscale-[.35] contrast-[1.05]"
              />
            </div>
          </Reveal>

          {/* ── Form ───────────────────────────────────────────────── */}
          <Reveal direction="up" tall>
            <div className="border border-rule bg-paper-50 p-7 sm:p-10">
              <h2 className="font-display text-[length:var(--text-2xl)]">
                {contactSection.formTitle}
              </h2>

              <form onSubmit={onSubmit} noValidate className="mt-8 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field
                    id="name"
                    label="Nombre"
                    placeholder="Tu nombre completo"
                    autoComplete="name"
                    error={errors.name}
                    className={fieldClass("name")}
                  />
                  <Field
                    id="phone"
                    label="Teléfono"
                    type="tel"
                    inputMode="tel"
                    placeholder="33 1234 5678"
                    autoComplete="tel"
                    error={errors.phone}
                    className={fieldClass("phone")}
                  />
                </div>

                <Field
                  id="email"
                  label="Correo electrónico"
                  type="email"
                  inputMode="email"
                  placeholder="tu@email.com"
                  autoComplete="email"
                  error={errors.email}
                  className={fieldClass("email")}
                />

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-semibold text-navy-700"
                  >
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="¿En qué podemos ayudarte?"
                    aria-invalid={!!errors.message}
                    aria-describedby={
                      errors.message ? "message-error" : undefined
                    }
                    className={`${fieldClass("message")} resize-y`}
                  />
                  <FieldError id="message-error" message={errors.message} />
                </div>

                <SubmitButton pending={status === "sending"}>
                  {status === "sending" ? "Enviando…" : "Enviar mensaje"}
                </SubmitButton>

                {/* One live region for the whole form, so a screen reader
                    announces the outcome once rather than per field. */}
                <div aria-live="polite" className="min-h-[1.5rem]">
                  {status === "sent" ? (
                    <p className="border-l-2 border-accent-600 bg-accent-100 px-4 py-3 text-sm text-navy-700">
                      Gracias. Hemos recibido tus datos y te contactaremos
                      pronto.
                    </p>
                  ) : null}
                </div>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-sm text-red-700">
      {message}
    </p>
  );
}

function Field({
  id,
  label,
  error,
  className,
  ...rest
}: {
  id: string;
  label: string;
  error?: string;
  className: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-navy-700"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={className}
        {...rest}
      />
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}
