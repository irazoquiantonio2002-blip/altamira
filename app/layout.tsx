import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "@/styles/globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { site, contact, socials } from "@/lib/site-data";

/**
 * Display serif for headlines (Duke-style editorial Didone feel) and a clean
 * sans for body and UI. Both self-hosted by `next/font`, so there is no
 * render-blocking Google Fonts request and no FOUT.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Formación Integral en Zapopan, Jalisco`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  authors: [{ name: site.name }],
  alternates: { canonical: site.url },
  openGraph: {
    type: "website",
    title: `${site.name} | Formación Integral`,
    description:
      "Institución educativa de formación integral centrada en la persona. Elementary, Middle School y High School en Zapopan, Jalisco.",
    url: site.url,
    locale: site.locale,
    siteName: site.name,
    images: [{ url: "/img/hero/campus-backdrop.jpg", width: 1200, height: 630 }],
  },
  icons: {
    icon: "/img/favicon.png",
    apple: "/img/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#192e5e",
  width: "device-width",
  initialScale: 1,
  // Never block pinch-zoom (§9).
  maximumScale: 5,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: site.name,
  url: site.url,
  logo: `${site.url}${site.logo}`,
  description: "Institución educativa de formación integral centrada en la persona",
  address: {
    "@type": "PostalAddress",
    streetAddress: contact.address.street,
    addressLocality: contact.address.city,
    addressRegion: contact.address.region,
    postalCode: contact.address.postalCode,
    addressCountry: "MX",
  },
  telephone: "+523338342433",
  email: contact.email,
  sameAs: socials.map((s) => s.href),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-MX" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="bg-paper antialiased">
        <script
          type="application/ld+json"
          // Static object built at module scope — no user input reaches it.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-navy-700 focus:px-5 focus:py-3 focus:text-sm focus:text-white"
        >
          Saltar al contenido
        </a>
        <SmoothScroll />
        <Navbar />
        <main id="contenido">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
