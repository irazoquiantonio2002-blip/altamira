import Image from "next/image";
import Link from "next/link";
import { contact, footer, navigation, site, socials } from "@/lib/site-data";
import { SocialIconGlyph } from "@/components/ui/Icons";
import { FooterWordmark } from "@/components/layout/FooterWordmark";

/** Dark multi-column footer — the page's closing block. */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-950 pt-20 text-white/70 sm:pt-24">
      <div className="container-x">
        <div className="grid gap-12 border-b border-rule-dark pb-14 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Image
              src={site.logo}
              alt={site.name}
              width={160}
              height={48}
              className="h-10 w-auto"
            />

            <address className="mt-7 not-italic leading-relaxed">
              {contact.address.street}, {contact.address.neighborhood}.
              <br />
              {contact.address.city}, {contact.address.region},{" "}
              {contact.address.country}.
            </address>

            <div className="mt-6 flex flex-col">
              {contact.phones.map((p) => (
                <a
                  key={p}
                  href={`tel:+52${p.replace(/\s/g, "")}`}
                  className="min-h-[34px] font-medium text-white underline-offset-4 hover:underline"
                >
                  {p}
                </a>
              ))}
              <a
                href={`mailto:${contact.email}`}
                className="mt-2 min-h-[34px] underline-offset-4 hover:text-white hover:underline"
              >
                {contact.email}
              </a>
            </div>

            <div className="mt-8 flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid size-11 place-items-center border border-rule-dark transition-colors duration-300 hover:border-white hover:bg-white hover:text-ink-950"
                >
                  <SocialIconGlyph name={s.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Site map — real pages, so the footer doubles as navigation. */}
          <nav aria-label="Mapa del sitio">
            <h2 className="font-sans text-[length:var(--text-label)] font-semibold uppercase tracking-[0.2em] text-white">
              Navegación
            </h2>
            <ul className="mt-6 space-y-1">
              {navigation
                .filter((item) => !item.external)
                .map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="flex min-h-[36px] items-center text-sm transition-colors duration-300 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              <li>
                <Link
                  href="/admisiones"
                  className="flex min-h-[36px] items-center text-sm transition-colors duration-300 hover:text-white"
                >
                  Admisiones
                </Link>
              </li>
            </ul>
          </nav>

          {footer.columns.slice(0, 2).map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="font-sans text-[length:var(--text-label)] font-semibold uppercase tracking-[0.2em] text-white">
                {col.title}
              </h2>
              <ul className="mt-6 space-y-1">
                {col.links.map((link) => {
                  const external = link.href.startsWith("http");
                  return (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="flex min-h-[36px] items-center text-sm transition-colors duration-300 hover:text-white"
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>

        {/* Child protection gets its own line — it is a commitment, not a
            link column. */}
        <div className="flex flex-col gap-3 border-b border-rule-dark py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[length:var(--text-label)] font-semibold uppercase tracking-[0.2em] text-white">
            Protección al Menor
          </span>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {footer.columns[2].links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 py-8 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {site.name}. Todos los derechos reservados.
          </p>
          <p>
            {contact.address.city}, {contact.address.region}.
          </p>
        </div>
      </div>

      <FooterWordmark />
    </footer>
  );
}
