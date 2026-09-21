"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navigation, site, contact } from "@/lib/site-data";
import { ChevronDown } from "@/components/ui/Icons";
import { MobileMenu } from "@/components/layout/MobileMenu";

/**
 * Corporate navbar.
 *
 * On the home page it starts transparent over the dark hero and turns solid
 * white once the hero is done. Every other page is light from the first
 * pixel, so it is solid immediately.
 *
 * The transparent/solid switch is driven by an IntersectionObserver on the
 * hero element rather than a `scrollY` threshold: the hero is pinned and
 * three viewports tall, so any fixed pixel threshold flips the bar to white
 * while the visitor is still inside the dark hero.
 */
export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [overHero, setOverHero] = useState(isHome);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!isHome) {
      setOverHero(false);
      return;
    }
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
  }, [isHome, pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenDropdown(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close the route's menus when navigating.
  useEffect(() => {
    setOpenDropdown(null);
    setMenuOpen(false);
  }, [pathname]);

  const onDark = isHome && overHero;

  // A small grace period stops the dropdown snapping shut while the pointer
  // crosses the gap between the trigger and the panel.
  const openNow = (label: string) => {
    window.clearTimeout(closeTimer.current);
    setOpenDropdown(label);
  };
  const closeSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenDropdown(null), 120);
  };

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-[100] transition-colors duration-500",
          onDark
            ? "border-b border-transparent bg-transparent"
            : "border-b border-rule bg-paper",
        ].join(" ")}
      >
        <nav
          aria-label="Menú principal"
          className="container-x flex items-center justify-between gap-6 py-4"
        >
          <Link
            href="/"
            className="relative z-10 shrink-0"
            aria-label={`${site.name} — inicio`}
          >
            <Image
              src={onDark ? site.logo : site.logoDark}
              alt={site.name}
              width={168}
              height={48}
              priority
              className="h-10 w-auto"
            />
          </Link>

          {/* ── Desktop ──────────────────────────────────────────── */}
          <ul className="hidden items-center lg:flex">
            {navigation.map((item) => {
              const hasChildren = !!item.children?.length;
              const isOpen = openDropdown === item.label;
              const active =
                item.href !== "/" && pathname.startsWith(item.href);

              return (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => hasChildren && openNow(item.label)}
                  onMouseLeave={() => hasChildren && closeSoon()}
                >
                  <Link
                    href={item.href}
                    aria-expanded={hasChildren ? isOpen : undefined}
                    aria-current={active ? "page" : undefined}
                    onFocus={() => hasChildren && openNow(item.label)}
                    className={[
                      "flex min-h-[44px] items-center gap-1.5 px-4 text-sm font-medium transition-colors duration-300",
                      onDark
                        ? "text-white/85 hover:text-white"
                        : active
                          ? "text-navy-700"
                          : "text-graphite hover:text-navy-700",
                    ].join(" ")}
                  >
                    {item.label}
                    {hasChildren ? (
                      <ChevronDown
                        className={`size-3 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    ) : null}
                  </Link>

                  {/* Active page marker — a square rule, never a pill. */}
                  {active && !onDark ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-4 bottom-0 h-px bg-accent-600"
                    />
                  ) : null}

                  {hasChildren ? (
                    <div
                      className={[
                        "absolute left-0 top-full w-64 border border-rule bg-paper py-2 shadow-[0_18px_50px_-24px_rgba(5,12,30,0.4)] transition-all duration-200",
                        isOpen
                          ? "pointer-events-auto translate-y-0 opacity-100"
                          : "pointer-events-none -translate-y-1 opacity-0",
                      ].join(" ")}
                    >
                      {item.children?.map((child) =>
                        child.external ? (
                          <a
                            key={child.label}
                            href={child.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            tabIndex={isOpen ? 0 : -1}
                            className="flex min-h-[44px] items-center px-5 text-sm text-graphite transition-colors hover:bg-paper-100 hover:text-navy-700"
                          >
                            {child.label}
                          </a>
                        ) : (
                          <Link
                            key={child.label}
                            href={child.href}
                            tabIndex={isOpen ? 0 : -1}
                            className="flex min-h-[44px] items-center px-5 text-sm text-graphite transition-colors hover:bg-paper-100 hover:text-navy-700"
                          >
                            {child.label}
                          </Link>
                        ),
                      )}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href={contact.primaryPhone.href}
              className={[
                "hidden text-sm font-medium transition-colors xl:inline-flex",
                onDark
                  ? "text-white/75 hover:text-white"
                  : "text-slate hover:text-navy-700",
              ].join(" ")}
            >
              {contact.primaryPhone.label}
            </a>

            <Link
              href="/admisiones"
              className={[
                "hidden min-h-[44px] items-center px-6 text-sm font-semibold tracking-wide transition-colors duration-300 lg:inline-flex",
                onDark
                  ? "bg-white text-ink-950 hover:bg-white/85"
                  : "bg-navy-700 text-white hover:bg-accent-700",
              ].join(" ")}
            >
              Admisiones
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className={[
                "grid size-11 place-items-center border transition-colors duration-300 lg:hidden",
                onDark
                  ? "border-white/25 text-white"
                  : "border-rule-strong text-navy-700",
              ].join(" ")}
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
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
