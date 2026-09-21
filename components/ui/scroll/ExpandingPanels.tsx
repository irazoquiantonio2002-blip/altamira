"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { EASE_OUT_EXPO } from "@/lib/animations";

export type Panel = {
  index: string;
  title: string;
  text: string;
  image: { src: string; alt: string };
  href: string;
};

/**
 * A row of photo panels where the active one opens wide to show its copy and
 * the others narrow to slivers.
 *
 * Active follows the pointer AND keyboard focus, so it works identically for
 * someone tabbing through the links. Only the active panel shows its body
 * text; the rest keep just their index and title, which is the whole point —
 * four long paragraphs side by side at a quarter width each would be
 * unreadable.
 *
 * Below `lg` there is not enough width to expand into, so the panels become a
 * plain stack with every one fully open.
 */
export function ExpandingPanels({ panels }: { panels: Panel[] }) {
  const [active, setActive] = useState(0);

  return (
    <>
      {/* ── Desktop: expanding row ─────────────────────────────── */}
      <div className="hidden h-[34rem] gap-px bg-rule lg:flex">
        {panels.map((panel, i) => {
          const isActive = active === i;

          return (
            <Link
              key={panel.index}
              href={panel.href}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              style={{ flexGrow: isActive ? 3.4 : 1 }}
              className="group relative basis-0 overflow-hidden bg-ink-950 transition-[flex-grow] duration-700 ease-[cubic-bezier(.16,1,.3,1)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={panel.image.src}
                alt={panel.image.alt}
                className={`absolute inset-0 size-full object-cover saturate-[.7] transition-transform duration-[1200ms] ease-[cubic-bezier(.16,1,.3,1)] ${
                  isActive ? "scale-100" : "scale-110"
                }`}
              />
              <div
                className={`absolute inset-0 transition-colors duration-700 ${
                  isActive ? "bg-ink-950/45" : "bg-ink-950/70"
                }`}
              />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink-950/90 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-between p-8">
                <span className="font-display text-[length:var(--text-2xl)] text-white/60">
                  {panel.index}
                </span>

                <div>
                  <h3 className="max-w-md font-display text-[length:var(--text-xl)] !text-white">
                    {panel.title}
                  </h3>

                  <AnimatePresence initial={false}>
                    {isActive ? (
                      <motion.p
                        key="text"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          // Waits for the panel to open before the text
                          // appears, so it never wraps inside a narrow column.
                          transition: {
                            duration: 0.6,
                            delay: 0.25,
                            ease: EASE_OUT_EXPO,
                          },
                        }}
                        exit={{ opacity: 0, transition: { duration: 0.15 } }}
                        className="mt-4 max-w-md text-sm leading-relaxed text-white/80"
                      >
                        {panel.text}
                      </motion.p>
                    ) : null}
                  </AnimatePresence>

                  <span
                    aria-hidden="true"
                    className={`mt-6 block h-px origin-left bg-accent-500 transition-transform duration-700 ${
                      isActive ? "w-24 scale-x-100" : "w-24 scale-x-0"
                    }`}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Mobile / tablet: open stack ────────────────────────── */}
      <div className="grid gap-px bg-rule lg:hidden">
        {panels.map((panel) => (
          <Link
            key={panel.index}
            href={panel.href}
            className="relative isolate block min-h-[22rem] overflow-hidden bg-ink-950"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={panel.image.src}
              alt={panel.image.alt}
              className="absolute inset-0 -z-10 size-full object-cover saturate-[.7]"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-950/95 via-ink-950/60 to-ink-950/30" />
            <div className="flex min-h-[22rem] flex-col justify-between p-7">
              <span className="font-display text-[length:var(--text-2xl)] text-white/60">
                {panel.index}
              </span>
              <div>
                <h3 className="font-display text-[length:var(--text-xl)] !text-white">
                  {panel.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/80">
                  {panel.text}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
