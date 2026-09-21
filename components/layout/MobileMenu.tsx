"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { contact, navigation, socials } from "@/lib/site-data";
import { ChevronDown, SocialIconGlyph, WhatsApp } from "@/components/ui/Icons";
import { EASE_OUT_EXPO } from "@/lib/animations";
import { useReducedMotion } from "@/lib/useMotionPrefs";

/**
 * Full-screen mobile drawer with a staggered entrance (§6.1).
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

  useEffect(() => {
    if (!open) return;

    restoreFocusRef.current = document.activeElement as HTMLElement | null;

    // Lock the page behind the drawer.
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

    // Move focus into the drawer on the next frame, once it is mounted.
    const raf = requestAnimationFrame(() => {
      panelRef.current
        ?.querySelector<HTMLElement>('a[href], button:not([disabled])')
        ?.focus();
    });

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
          className="fixed inset-0 z-[150] flex flex-col overflow-y-auto overscroll-contain bg-ink-950 lg:hidden"
          initial={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
          animate={
            reduced ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }
          }
          exit={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
        >
          <div className="container-x flex items-center justify-between py-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
            <span className="section-label text-paper/60">Menú</span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar menú"
              className="grid size-11 place-items-center rounded-full border border-hairline text-paper transition-colors hover:border-hairline-strong"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <motion.nav
            className="container-x flex flex-1 flex-col gap-1 pb-10"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.06, delayChildren: 0.15 },
              },
            }}
          >
            {navigation.map((item) => {
              const hasChildren = !!item.children?.length;
              const isOpen = expanded === item.label;

              return (
                <motion.div
                  key={item.label}
                  className="border-b border-hairline"
                  variants={{
                    hidden: reduced ? { opacity: 1 } : { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.6, ease: EASE_OUT_EXPO },
                    },
                  }}
                >
                  {hasChildren ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : item.label)}
                        aria-expanded={isOpen}
                        className="flex min-h-[56px] w-full items-center justify-between gap-4 py-2 text-left font-display text-2xl text-paper"
                      >
                        {item.label}
                        <ChevronDown
                          className={`size-4 shrink-0 text-mist transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen ? (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col pb-3 pl-1">
                              {item.children?.map((child) => (
                                <a
                                  key={child.label}
                                  href={child.href}
                                  onClick={onClose}
                                  target={
                                    child.external ? "_blank" : undefined
                                  }
                                  rel={
                                    child.external
                                      ? "noopener noreferrer"
                                      : undefined
                                  }
                                  className="flex min-h-[44px] items-center text-mist transition-colors hover:text-paper"
                                >
                                  {child.label}
                                </a>
                              ))}
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </>
                  ) : (
                    <a
                      href={item.href}
                      onClick={onClose}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="flex min-h-[56px] items-center py-2 font-display text-2xl text-paper"
                    >
                      {item.label}
                    </a>
                  )}
                </motion.div>
              );
            })}

            <motion.div
              className="mt-8 flex flex-col gap-4"
              variants={{
                hidden: reduced ? { opacity: 1 } : { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: EASE_OUT_EXPO },
                },
              }}
            >
              <a
                href="#contacto"
                onClick={onClose}
                className="inline-flex min-h-[52px] items-center justify-center rounded-pill bg-accent-600 px-8 font-medium text-white transition-colors hover:bg-accent-700"
              >
                Admisiones
              </a>
              <a
                href={contact.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-pill border border-hairline-strong px-8 text-paper"
              >
                <WhatsApp /> {contact.whatsapp.label}
              </a>

              <div className="mt-4 flex items-center gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid size-11 place-items-center rounded-full border border-hairline text-mist transition-colors hover:border-accent-500 hover:text-paper"
                  >
                    <SocialIconGlyph name={s.icon} />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
