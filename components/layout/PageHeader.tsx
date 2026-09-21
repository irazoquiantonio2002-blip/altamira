"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { PageHeader as PageHeaderData } from "@/lib/site-data";
import { useReducedMotion } from "@/lib/useMotionPrefs";
import { EASE_OUT_EXPO } from "@/lib/animations";
import { useScrollValue } from "@/lib/useScrollValue";

/**
 * The short dark band that opens every inner page.
 *
 * On entry the title rises into place; on the way out the band plays a
 * scroll-linked exit — the photo sinks and slowly zooms while the copy lifts
 * away faster and fades. The two layers moving in opposite directions at
 * different speeds is what makes the band read as depth rather than as a
 * flat picture scrolling off the top of the screen.
 */
export function PageHeader({
  data,
  breadcrumb,
}: {
  data: PageHeaderData;
  breadcrumb: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const imageScale = useScrollValue(scrollYProgress, [0, 1], [1, 1.14]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-45%"]);
  const copyOpacity = useScrollValue(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[clamp(22rem,52vh,34rem)] items-end overflow-hidden bg-ink-950 pt-28"
    >
      <motion.div
        style={reduced ? undefined : { y: imageY, scale: imageScale }}
        className="absolute inset-0"
      >
        <Image
          src={data.image.src}
          alt={data.image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover saturate-[.65]"
        />
      </motion.div>
      <div className="photo-scrim" />

      <motion.div
        style={reduced ? undefined : { y: copyY, opacity: copyOpacity }}
        className="container-x relative w-full pb-12 sm:pb-16"
      >
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

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.1 }}
        >
          <span className="section-label !text-white/70">
            <span aria-hidden="true" className="size-[5px] bg-accent-500" />
            {data.label}
          </span>

          <h1 className="mt-5 max-w-4xl font-display text-[length:var(--text-4xl)] !text-white">
            {data.title}
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-white/75">{data.lead}</p>
        </motion.div>

        {/* A hairline that draws itself under the standfirst on load. */}
        <motion.span
          aria-hidden="true"
          initial={reduced ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.4, ease: EASE_OUT_EXPO, delay: 0.45 }}
          className="mt-10 block h-px w-full max-w-md origin-left bg-accent-500"
        />
      </motion.div>
    </section>
  );
}
