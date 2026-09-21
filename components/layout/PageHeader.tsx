import Image from "next/image";
import Link from "next/link";
import type { PageHeader as PageHeaderData } from "@/lib/site-data";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The short dark band that opens every inner page.
 *
 * Deliberately restrained: one photo, one scrim, a label, a title and a
 * standfirst. No parallax and no scroll effect here — this band's job is to
 * orient the reader in the first second, and the scroll work belongs to the
 * sections underneath it.
 */
export function PageHeader({
  data,
  breadcrumb,
}: {
  data: PageHeaderData;
  breadcrumb: string;
}) {
  return (
    <section className="relative isolate flex min-h-[clamp(20rem,46vh,30rem)] items-end overflow-hidden bg-ink-950 pt-28">
      <Image
        src={data.image.src}
        alt={data.image.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover saturate-[.65]"
      />
      <div className="photo-scrim" />

      <div className="container-x relative w-full pb-12 sm:pb-16">
        <nav aria-label="Ruta de navegación" className="mb-6">
          <ol className="flex items-center gap-2 text-[length:var(--text-label)] uppercase tracking-[0.18em] text-white/55">
            <li>
              <Link href="/" className="transition-colors hover:text-white">
                Inicio
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-white/85">{breadcrumb}</li>
          </ol>
        </nav>

        <Reveal direction="up">
          <span className="section-label !text-white/70">
            <span aria-hidden="true" className="size-[5px] bg-accent-500" />
            {data.label}
          </span>

          <h1 className="mt-5 max-w-4xl font-display text-[length:var(--text-4xl)] !text-white">
            {data.title}
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-white/75">{data.lead}</p>
        </Reveal>
      </div>
    </section>
  );
}
