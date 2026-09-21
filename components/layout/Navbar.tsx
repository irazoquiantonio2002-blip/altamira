"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { navigation, site } from "@/lib/site-data";
import { ChevronDown } from "@/components/ui/Icons";
import { MobileMenu } from "@/components/layout/MobileMenu";

/**
 * Sticky navbar that reacts to scroll (§7):
 *   · transparent while the hero is on screen, solid + blurred afterwards
 *   · shorter once it is solid
 *   · hides on scroll-down, returns instantly on scroll-up
 *
 * The transparent/solid switch is driven by an IntersectionObserver on the
 * hero element, not by a `scrollY` threshold. The hero is pinned and three
 * viewports tall, so any fixed pixel threshold flips the navbar to solid
 * while the visitor is still inside the hero. Observing the element itself is
 * the only way to key off "the hero is actually done".
 */
export function Navbar() {
  const [overHero, setOverHero] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) {
      setOverHero(false);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => setOverHero(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      // 80px of grace so the bar does not flicker on small corrections.
      if (y > lastY.current && y > 80) {
        setHidden(true);
        setOpenDropdown(null);
      } else {
        setHidden(false);
      }
      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close any open dropdown when focus or the pointer leaves the bar.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenDropdown(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const solid = !overHero;

  return (
    <>
      <motion.header
        className={[
          "fixed inset-x-0 top-0 z-[100] transition-[background-color,backdrop-filter,border-color,height] duration-500",
          solid
            ? "border-b border-hairline bg-ink-950/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        ].join(" ")}
        animate={{ y: hidden && !menuOpen ? "-100%" : "0%" }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav
          aria-label="Menú principal"
          className={[
            "container-x flex items-center justify-between gap-6 transition-[padding] duration-500",
            solid ? "py-3" : "py-5",
          ].join(" ")}
        >
          <a
            href="#hero"
            className="relative z-10 shrink-0"
            aria-label={`${site.name} — inicio`}
          >
            <Image
              src={site.logo}
              alt={site.name}
              width={168}
              height={48}
              priority
              className={[
                "w-auto transition-[height] duration-500",
                solid ? "h-9" : "h-11",
              ].join(" ")}
            />
          </a>

          {/* ── Desktop menu ─────────────────────────────────────── */}
          <ul className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => {
              const hasChildren = !!item.children?.length;
              const isOpen = openDropdown === item.label;

              return (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() =>
                    hasChildren && setOpenDropdown(item.label)
                  }
                  onMouseLeave={() => hasChildren && setOpenDropdown(null)}
                >
                  <a
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    aria-expanded={hasChildren ? isOpen : undefined}
                    aria-haspopup={hasChildren ? "true" : undefined}
                    onFocus={() => hasChildren && setOpenDropdown(item.label)}
                    className="flex min-h-[44px] items-center gap-1.5 rounded-pill px-4 text-sm font-medium text-paper/85 transition-colors duration-300 hover:text-paper"
                  >
                    {item.label}
                    {hasChildren ? (
                      <ChevronDown
                        className={`size-3 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    ) : null}
                  </a>

                  {hasChildren ? (
                    <motion.div
                      initial={false}
                      animate={
                        isOpen
                          ? { opacity: 1, y: 0, pointerEvents: "auto" }
                          : { opacity: 0, y: 8, pointerEvents: "none" }
                      }
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute left-0 top-full w-60 overflow-hidden rounded-card border border-hairline bg-ink-900/95 p-2 shadow-2xl backdrop-blur-xl"
                    >
                      {item.children?.map((child) => (
                        <a
                          key={child.label}
                          href={child.href}
                          target={child.external ? "_blank" : undefined}
                          rel={
                            child.external ? "noopener noreferrer" : undefined
                          }
                          tabIndex={isOpen ? 0 : -1}
                          className="flex min-h-[44px] items-center rounded-lg px-4 text-sm text-mist transition-colors duration-200 hover:bg-white/5 hover:text-paper"
                        >
                          {child.label}
                        </a>
                      ))}
                    </motion.div>
                  ) : null}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href="#contacto"
              className="hidden min-h-[44px] items-center rounded-pill bg-accent-600 px-6 text-sm font-medium text-white transition-colors duration-300 hover:bg-accent-700 lg:inline-flex"
            >
              Admisiones
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="grid size-11 place-items-center rounded-full border border-hairline text-paper transition-colors duration-300 hover:border-hairline-strong lg:hidden"
            >
              <span className="sr-only">Abrir menú</span>
              <span aria-hidden="true" className="flex flex-col gap-[5px]">
                <span className="block h-px w-5 bg-current" />
                <span className="block h-px w-5 bg-current" />
                <span className="block h-px w-3.5 bg-current" />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
