"use client";

import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "@/lib/useMotionPrefs";
import { Button } from "@/components/ui/Button";
import {
  ContainerAnimated,
  ContainerScroll,
  ContainerStagger,
  ContainerSticky,
  GalleryCol,
  GalleryContainer,
} from "@/components/ui/scroll/AnimatedGallery";

/**
 * Page hero built on the AnimatedGallery demo layout.
 *
 * Kept from the original: the headline block that blurs in line by line, the
 * soft haze under it, and the 350vh scroll in which a three-column wall of
 * photos stands up from 75° and then settles, the middle column offset by
 * half a column.
 *
 * Adapted: school photographs, real copy, the headline cleared below the
 * fixed navbar and kept under it (the original's z-[9999] would paint over
 * the navbar), and every blue in the brand navy — the headline accent, the
 * button, and the haze. The original haze screens a bright gradient over the
 * photos; `screen` can only lighten, so it could never tint them navy.
 * `color` keeps each photo's own light and shade and gives it the navy hue,
 * which is what reads as the site's dark blue.
 */

export type GalleryPhoto = { src: string; alt: string };

export type GalleryColumn = {
  yRange: [string, string];
  className: string;
  photos: GalleryPhoto[];
};

function Photo({ photo }: { photo: GalleryPhoto }) {
  return (
    <Image
      src={photo.src}
      alt={photo.alt}
      width={1200}
      height={675}
      sizes="(max-width: 768px) 34vw, 33vw"
      className="block aspect-video h-auto max-h-full w-full object-cover shadow"
    />
  );
}

export function GalleryHero({
  srTitle,
  titleLead,
  titleAccent,
  titleLine2,
  lead,
  primary,
  secondary,
  columns,
}: {
  /** The full heading, for assistive tech; the visual lines are split. */
  srTitle: string;
  titleLead: string;
  titleAccent: string;
  titleLine2: string;
  lead: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  columns: GalleryColumn[];
}) {
  const reduced = useReducedMotion();

  return (
    <section aria-labelledby="gallery-hero-title" className="relative bg-paper">
      <h1 id="gallery-hero-title" className="sr-only">
        {srTitle}
      </h1>

      <ContainerStagger className="relative z-20 -mb-12 place-self-center px-6 pt-32 text-center sm:pt-40">
        <ContainerAnimated>
          <p
            aria-hidden="true"
            className="font-display text-4xl font-normal text-navy-700 md:text-5xl"
          >
            {titleLead} <span className="text-navy-500">{titleAccent}</span>
          </p>
        </ContainerAnimated>
        <ContainerAnimated>
          <p
            aria-hidden="true"
            className="font-display text-4xl font-normal text-navy-700 md:text-5xl"
          >
            {titleLine2}
          </p>
        </ContainerAnimated>

        <ContainerAnimated className="my-6">
          <p className="mx-auto max-w-xl leading-normal tracking-tight text-slate">
            {lead}
          </p>
        </ContainerAnimated>

        <ContainerAnimated className="flex flex-wrap items-center justify-center gap-2">
          <Button href={primary.href} variant="solid">
            {primary.label}
          </Button>
          <Link
            href={secondary.href}
            className="inline-flex min-h-[48px] items-center px-5 text-sm font-semibold text-navy-700 underline-offset-4 hover:underline"
          >
            {secondary.label}
          </Link>
        </ContainerAnimated>
      </ContainerStagger>

      {/* The haze, in the site's navy. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-10 h-[70vh] w-full"
        style={{
          background: "linear-gradient(to right, #0f1c3a, #192e5e, #21396f)",
          filter: "blur(84px)",
          mixBlendMode: "color",
          opacity: 0.9,
        }}
      />

      {reduced ? (
        <div className="container-x grid grid-cols-3 gap-2 pb-20 pt-24">
          {columns.flatMap((col) => col.photos).map((photo) => (
            <Photo key={photo.src} photo={photo} />
          ))}
        </div>
      ) : (
        <ContainerScroll className="relative h-[350vh]">
          <ContainerSticky className="h-svh">
            <GalleryContainer>
              {columns.map((col) => (
                <GalleryCol
                  key={col.photos[0].src}
                  yRange={col.yRange}
                  className={col.className}
                >
                  {col.photos.map((photo) => (
                    <Photo key={photo.src} photo={photo} />
                  ))}
                </GalleryCol>
              ))}
            </GalleryContainer>
          </ContainerSticky>
        </ContainerScroll>
      )}
    </section>
  );
}
