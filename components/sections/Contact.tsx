"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { contact, contactSection } from "@/lib/site-data";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { SubmitButton } from "@/components/ui/Button";
import { Mail, MapPin, Phone } from "@/components/ui/Icons";
import { EASE_OUT_EXPO } from "@/lib/animations";

type Errors = Partial<Record<"name" | "phone" | "email" | "message", string>>;
type Status = "idle" | "sending" | "sent";

const fieldBase =
  "w-full rounded-lg border bg-ink-900 px-4 py-3.5 text-paper placeholder:text-mist-dim/60 " +
  "transition-colors duration-300 focus:outline-none focus-visible:outline-none";

/** Contacto (§6.11) — info column with map, plus a validated form. */
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
    const data = new FormData(form);
    const found = validate(data);
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
        ? "border-red-400/60 focus:border-red-400"
        : "border-hairline focus:border-accent-500"
    }`;

  return (
    <section id="contacto" className="relative bg-ink-950 py-24 sm:py-32 lg:py-40">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal direction="up">
            <SectionLabel className="mb-7">{contactSection.label}</SectionLabel>
          </Reveal>

          <TextReveal
            as="h2"
            lines={[contactSection.title]}
            byWord
            className="font-display text-[length:var(--text-4xl)] text-paper"
          />

          <Reveal direction="up" delay={0.15}>
            <p className="mt-6 text-mist">{contactSection.subtitle}</p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-10 sm:mt-20 lg:grid-cols-2 lg:gap-14">
          {/* ── Info ───────────────────────────────────────────────── */}
          <Reveal direction="right" tall>
            <h3 className="font-display text-[length:var(--text-2xl)] text-paper">
              {contactSection.infoTitle}
            </h3>
            <p className="mt-4 max-w-prose text-mist">
              {contactSection.infoText}
            </p>

            <dl className="mt-10 space-y-8">
              <div className="flex gap-5">
                <dt className="sr-only">Dirección</dt>
                <span
                  aria-hidden="true"
                  className="grid size-11 shrink-0 place-items-center rounded-full border border-hairline text-accent-400"
                >
                  <MapPin />
                </span>
                <dd>
                  <span className="block text-[length:var(--text-label)] uppercase tracking-[0.18em] text-mist-dim">
                    Dirección
                  </span>
                  <address className="mt-1 not-italic text-paper">
                    {contact.address.street},<br />
                    {contact.address.neighborhood}.<br />
                    {contact.address.city}, {contact.address.region},{" "}
                    {contact.address.country}
                  </address>
                </dd>
              </div>

              <div className="flex gap-5">
                <dt className="sr-only">Correo</dt>
                <span
                  aria-hidden="true"
                  className="grid size-11 shrink-0 place-items-center rounded-full border border-hairline text-accent-400"
                >
                  <Mail />
                </span>
                <dd>
                  <span className="block text-[length:var(--text-label)] uppercase tracking-[0.18em] text-mist-dim">
                    Correo
                  </span>
                  <a
                    href={`mailto:${contact.email}`}
                    className="mt-1 inline-block text-paper underline-offset-4 hover:underline"
                  >
                    {contact.email}
                  </a>
                </dd>
              </div>

              <div className="flex gap-5">
                <dt className="sr-only">Teléfonos</dt>
                <span
                  aria-hidden="true"
                  className="grid size-11 shrink-0 place-items-center rounded-full border border-hairline text-accent-400"
                >
                  <Phone />
                </span>
                <dd>
                  <span className="block text-[length:var(--text-label)] uppercase tracking-[0.18em] text-mist-dim">
                    Teléfonos
                  </span>
                  <div className="mt-1 flex flex-col">
                    {contact.phones.map((p) => (
                      <a
                        key={p}
                        href={`tel:+52${p.replace(/\s/g, "")}`}
                        className="min-h-[32px] text-paper underline-offset-4 hover:underline"
                      >
                        {p}
                      </a>
                    ))}
                  </div>
                </dd>
              </div>
            </dl>

            <div className="mt-10 overflow-hidden rounded-card border border-hairline">
              <iframe
                src={contact.mapEmbed}
                title="Ubicación de Colegio Altamira La Cima"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                // Explicit height keeps CLS at zero while the map loads.
                // Google's embed has no dark theme, and a white rectangle is
                // the one thing on this page that breaks the dark palette —
                // invert + 180° hue rotation brings it into the system while
                // keeping roads and labels readable.
                className="h-[320px] w-full border-0 invert-[.92] hue-rotate-180 saturate-[.7] contrast-[.9]"
              />
            </div>
          </Reveal>

          {/* ── Form ───────────────────────────────────────────────── */}
          <Reveal direction="left" tall>
            <div className="rounded-card border border-hairline bg-ink-900 p-7 sm:p-10">
              <h3 className="font-display text-[length:var(--text-2xl)] text-paper">
                {contactSection.formTitle}
              </h3>

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
                    className="mb-2 block text-sm font-medium text-paper"
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
                  <AnimatePresence>
                    {status === "sent" ? (
                      <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                        className="text-sm text-accent-400"
                      >
                        Gracias. Hemos recibido tus datos y te contactaremos
                        pronto.
                      </motion.p>
                    ) : null}
                  </AnimatePresence>
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
    <p id={id} className="mt-2 text-sm text-red-400">
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
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-paper">
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
