"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { contact, navigation, socials } from "@/lib/site-data";
import { ChevronDown, SocialIconGlyph, WhatsApp } from "@/components/ui/Icons";
import { EASE_IN_OUT_QUART, EASE_OUT_EXPO } from "@/lib/animations";
import { useReducedMotion } from "@/lib/useMotionPrefs";

/**
 * How the drawer arrives and leaves.
 *
 * The panel itself only fades. It covers the page edge to edge in the same
 * paper white the page already is, so anything more elaborate on the panel —
 * a wipe, a slide — would be a full-viewport repaint every frame to show a
 * white rectangle moving over white. The motion that reads is the content's:
 * the rows rise in sequence behind the fade, which is what makes the menu feel
 * like it is being laid out rather than switched on.
 *
 * Leaving is deliberately faster than arriving, and the rows go in reverse, so
 * the menu gets out of the way instead of playing an outro.
 */
const panelVariants: Variants = {
  closed: {
    opacity: 0,
    pointerEvents: "none",
    transition: {
      duration: 0.26,
      ease: EASE_IN_OUT_QUART,
      staggerChildren: 0.025,
      staggerDirection: -1,
    },
  },
  open: {
    opacity: 1,
    pointerEvents: "auto",
    transition: {
      duration: 0.32,
      ease: EASE_OUT_EXPO,
      staggerChildren: 0.055,
      delayChildren: 0.1,
    },
  },
};

const rowVariants: Variants = {
  closed: {
    opacity: 0,
    y: 14,
    transition: { duration: 0.2, ease: EASE_IN_OUT_QUART },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: EASE_OUT_EXPO },
  },
};

/** Reduced motion: the drawer is simply there, and simply gone. */
const panelInstant: Variants = {
  closed: { opacity: 0, pointerEvents: "none", transition: { duration: 0 } },
  open: { opacity: 1, pointerEvents: "auto", transition: { duration: 0 } },
};

/**
 * Full-screen mobile drawer.
 *
 * Handles the three things a modal overlay owes the keyboard: it traps focus,
 * closes on Escape, and restores focus to whatever opened it.
 */
export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  // Undefined leaves the rows out of the choreography entirely, rather than
  // giving them a zero-length one.
  const rows = reduced ? undefined : rowVariants;

  useEffect(() => {
    if (!open) return;

    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);

    const raf = requestAnimationFrame(() => {
      panelRef.current
        ?.querySelector<HTMLElement>('a[href], button:not([disabled])')
        ?.focus();
    });

    // Runs the moment `open` turns false — while the panel is still on screen
    // playing its exit. That is the right time: scrolling and focus belong
    // back with the page as soon as the menu is dismissed, not when the last
    // frame of the animation has finished.
    return () => {
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
      restoreFocusRef.current?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
          ref={panelRef}
          variants={reduced ? panelInstant : panelVariants}
          initial="closed"
          animate="open"
          exit="closed"
          className="fixed inset-0 z-[150] flex flex-col overflow-y-auto overscroll-contain bg-paper lg:hidden"
        >
          <motion.div
            variants={rows}
            className="container-x flex items-center justify-between py-4 pt-[max(1rem,env(safe-area-inset-top))]"
          >
            <span className="section-label">Menú</span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar menú"
              className="grid size-11 place-items-center border border-rule-strong text-navy-700 transition-colors hover:border-navy-700"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
                aria-hidden="true"
              >
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </motion.div>

          <nav className="container-x flex flex-1 flex-col border-t border-rule pb-10">
            {navigation.map((item) => {
              const hasChildren = !!item.children?.length;
              const isOpen = expanded === item.label;

              return (
                <motion.div
                  key={item.label}
                  variants={rows}
                  className="border-b border-rule"
                >
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="flex min-h-[60px] flex-1 items-center font-display text-2xl text-navy-700"
                    >
                      {item.label}
                    </Link>
                    {hasChildren ? (
                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : item.label)}
                        aria-expanded={isOpen}
                        aria-label={`Ver subsecciones de ${item.label}`}
                        className="grid size-12 shrink-0 place-items-center text-slate"
                      >
                        <ChevronDown
                          className={`size-4 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    ) : null}
                  </div>

                  {hasChildren && isOpen ? (
                    <div className="flex flex-col border-t border-rule pb-2 pl-4">
                      {item.children?.map((child) =>
                        child.external ? (
                          <a
                            key={child.label}
                            href={child.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex min-h-[46px] items-center text-slate transition-colors hover:text-navy-700"
                          >
                            {child.label}
                          </a>
                        ) : (
                          <Link
                            key={child.label}
                            href={child.href}
                            onClick={onClose}
                            className="flex min-h-[46px] items-center text-slate transition-colors hover:text-navy-700"
                          >
                            {child.label}
                          </Link>
                        ),
                      )}
                    </div>
                  ) : null}
                </motion.div>
              );
            })}

            <motion.div variants={rows} className="mt-8 flex flex-col gap-3">
              <Link
                href="/admisiones"
                onClick={onClose}
                className="inline-flex min-h-[54px] items-center justify-center bg-navy-700 px-8 font-semibold text-white"
              >
                Admisiones
              </Link>
              <a
                href={contact.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[54px] items-center justify-center gap-2 border border-rule-strong px-8 font-semibold text-navy-700"
              >
                <WhatsApp /> {contact.whatsapp.label}
              </a>

              <div className="mt-4 flex items-center gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid size-11 place-items-center border border-rule text-slate transition-colors hover:border-navy-700 hover:text-navy-700"
                  >
                    <SocialIconGlyph name={s.icon} />
                  </a>
                ))}
              </div>
            </motion.div>
          </nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
