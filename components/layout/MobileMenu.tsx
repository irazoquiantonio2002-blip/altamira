"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { contact, navigation, socials } from "@/lib/site-data";
import { ChevronDown, SocialIconGlyph, WhatsApp } from "@/components/ui/Icons";

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

    return () => {
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
      restoreFocusRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menú de navegación"
      ref={panelRef}
      className="fixed inset-0 z-[150] flex flex-col overflow-y-auto overscroll-contain bg-paper lg:hidden"
    >
      <div className="container-x flex items-center justify-between py-4 pt-[max(1rem,env(safe-area-inset-top))]">
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
      </div>

      <nav className="container-x flex flex-1 flex-col border-t border-rule pb-10">
        {navigation.map((item) => {
          const hasChildren = !!item.children?.length;
          const isOpen = expanded === item.label;

          return (
            <div key={item.label} className="border-b border-rule">
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
            </div>
          );
        })}

        <div className="mt-8 flex flex-col gap-3">
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
        </div>
      </nav>
    </div>
  );
}
