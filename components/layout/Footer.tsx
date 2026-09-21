import Image from "next/image";
import { contact, footer, site, socials } from "@/lib/site-data";
import { SocialIconGlyph } from "@/components/ui/Icons";

/** Multi-column dark footer (§6.12). */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-hairline bg-ink-950 pt-20 sm:pt-28">
      {/* Oversized wordmark bleeding off the bottom edge. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-[0.18em] select-none text-center font-display text-[clamp(5rem,20vw,16rem)] leading-none text-white/[0.03]"
      >
        Altamira
      </span>

      <div className="container-x relative">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Image
              src={site.logo}
              alt={site.name}
              width={160}
              height={48}
              className="h-11 w-auto"
            />

            <address className="mt-6 not-italic leading-relaxed text-mist">
              {contact.address.street}, {contact.address.neighborhood}.
              <br />
              {contact.address.city}, {contact.address.region},{" "}
              {contact.address.country}.
            </address>

            <div className="mt-5 flex flex-col">
              {contact.phones.map((p) => (
                <a
                  key={p}
                  href={`tel:+52${p.replace(/\s/g, "")}`}
                  className="min-h-[34px] font-medium text-paper underline-offset-4 hover:underline"
                >
                  {p}
                </a>
              ))}
              <a
                href={`mailto:${contact.email}`}
                className="mt-2 min-h-[34px] text-mist underline-offset-4 hover:text-paper hover:underline"
              >
                {contact.email}
              </a>
            </div>

            <div className="mt-7 flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid size-11 place-items-center rounded-full border border-hairline text-mist transition-colors duration-300 hover:border-accent-500 hover:text-paper"
                >
                  <SocialIconGlyph name={s.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footer.columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="font-sans text-[length:var(--text-label)] uppercase tracking-[0.22em] text-paper">
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
                        className="flex min-h-[36px] items-center text-sm text-mist transition-colors duration-300 hover:text-paper"
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

        <div className="mt-16 flex flex-col gap-3 border-t border-hairline py-8 text-sm text-mist-dim sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {site.name}. Todos los derechos reservados.
          </p>
          <p>
            {contact.address.city}, {contact.address.region}.
          </p>
        </div>
      </div>
    </footer>
  );
}
