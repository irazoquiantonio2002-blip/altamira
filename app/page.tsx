import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Marquee } from "@/components/sections/Marquee";
import { About } from "@/components/sections/About";
import { Pillars } from "@/components/sections/Pillars";
import { Programs } from "@/components/sections/Programs";
import { Community } from "@/components/sections/Community";
import { Facilities } from "@/components/sections/Facilities";
import { AdmissionsCTA } from "@/components/sections/AdmissionsCTA";
import { Contact } from "@/components/sections/Contact";
import { SocialRail } from "@/components/layout/SocialRail";

/**
 * The landing page is nothing but a composition of sections, in the order
 * set out in §6. Each section owns its own copy (via `lib/site-data.ts`),
 * its own layout and its own animations.
 */
export default function Home() {
  return (
    <>
      <Navbar />
      <SocialRail />

      <main id="contenido">
        <Hero />
        <Stats />
        <Marquee />
        <About />
        <Pillars />
        <Programs />
        <Community />
        <Facilities />
        <AdmissionsCTA />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
