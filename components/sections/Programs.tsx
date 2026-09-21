import { programs } from "@/lib/site-data";
import { SectionHead } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { ImageReveal } from "@/components/ui/ImageReveal";
import { Button } from "@/components/ui/Button";

/**
 * The three academic levels, as alternating full-width rows rather than
 * cards: photo on one side, copy on the other, sides swapping each row.
 *
 * Rows give each level room for real copy and make the page read as a
 * document rather than a product grid — which is the whole difference
 * between a landing page and an institutional site.
 */
export function Programs({ withHead = true }: { withHead?: boolean }) {
  return (
    <section id="oferta" className="section-y bg-paper">
      <div className="container-x">
        {withHead ? (
          <Reveal direction="up">
            <SectionHead
              label={programs.label}
              title={programs.title}
              lead={programs.subtitle}
            />
          </Reveal>
        ) : null}

        <div className={withHead ? "mt-16" : ""}>
          {programs.items.map((item, i) => {
            const flip = i % 2 === 1;

            return (
              <article
                key={item.index}
                id={item.title.toLowerCase().split(" ")[0]}
                className="grid scroll-mt-28 items-center gap-10 border-t border-rule py-14 lg:grid-cols-2 lg:gap-16 lg:py-20"
              >
                <ImageReveal
                  src={item.image.src}
                  alt={item.image.alt}
                  width={900}
                  height={620}
                  sizes="(max-width: 1024px) 100vw, 46vw"
                  parallax={30}
                  className={`aspect-3/2 w-full ${flip ? "lg:order-2" : ""}`}
                />

                <Reveal direction="up" className={flip ? "lg:order-1" : ""}>
                  <span className="flex items-baseline gap-4">
                    <span className="font-display text-[length:var(--text-2xl)] text-rule-strong">
                      {item.index}
                    </span>
                    <span className="text-[length:var(--text-label)] font-semibold uppercase tracking-[0.2em] text-accent-600">
                      {item.grades}
                    </span>
                  </span>

                  <h3 className="mt-5 font-display text-[length:var(--text-3xl)]">
                    {item.title}
                  </h3>

                  <p className="mt-5 max-w-prose text-lg text-slate">
                    {item.text}
                  </p>

                  <div className="mt-8">
                    <Button href="/admisiones" variant="outline">
                      Solicita informes
                    </Button>
                  </div>
                </Reveal>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
