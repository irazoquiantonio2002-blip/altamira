import { socials } from "@/lib/site-data";
import { SocialIconGlyph } from "@/components/ui/Icons";

/**
 * Fixed social rail on the right edge, carried over from the previous site.
 *
 * Desktop only: on a phone it would sit on top of the content and eat a
 * thumb-width of every section. The same links are in the footer and the
 * mobile drawer, so nothing is lost.
 */
export function SocialRail() {
  return (
    <aside
      aria-label="Redes sociales"
      className="fixed right-5 top-1/2 z-[90] hidden -translate-y-1/2 flex-col gap-3 xl:flex"
    >
      {socials.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          className="grid size-10 place-items-center rounded-full border border-hairline bg-ink-950/40 text-mist backdrop-blur-sm transition-colors duration-300 hover:border-accent-500 hover:text-paper"
        >
          <SocialIconGlyph name={s.icon} className="size-3.5" />
        </a>
      ))}
    </aside>
  );
}
