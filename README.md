# Colegio Altamira La Cima — sitio web

Sitio institucional de **Colegio Altamira La Cima** (Zapopan, Jalisco).
Next.js (App Router) + TypeScript + Tailwind CSS v4, con animaciones
scroll-driven (Motion + GSAP/ScrollTrigger) y smooth scroll (Lenis).

---

## Cómo correrlo

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de producción
npm start       # sirve el build
```

Requiere Node 18.18+ (probado con Node 24). El primer `npm run dev` descarga
las fuentes (Fraunces + Inter) vía `next/font`, así que necesita red una vez.

---

## Estructura

```
app/
  layout.tsx            fuentes, metadata, JSON-LD, skip-link, smooth scroll
  page.tsx              la landing = composición de secciones, en orden
components/
  layout/
    Navbar.tsx          sticky, transparente sobre el hero → sólido después
    MobileMenu.tsx      drawer full-screen con stagger y focus trap
    Footer.tsx          footer oscuro multi-columna
    SocialRail.tsx      rail lateral de redes (solo ≥ xl)
  sections/             una sección = un archivo
    Hero.tsx  Stats.tsx  Marquee.tsx  About.tsx  Pillars.tsx
    Programs.tsx  Community.tsx  Facilities.tsx  AdmissionsCTA.tsx  Contact.tsx
  ui/                   primitivos reutilizables
    Button.tsx          pill + flecha circular, variante magnética
    Reveal.tsx          Reveal / Stagger / RevealItem
    TextReveal.tsx      reveal de títulos por línea o por palabra
    ImageReveal.tsx     clip-path wipe + parallax + scrim
    SpotlightCard.tsx   card con glow que sigue al cursor
    CountUp.tsx  SectionLabel.tsx  Chevrons.tsx  Icons.tsx
  providers/
    SmoothScroll.tsx    Lenis, enganchado al ticker de GSAP
lib/
  site-data.ts          ← TODO el contenido, cifras, enlaces y contactos
  animations.ts         variantes y easings compartidos
  gsap.ts               carga diferida de GSAP + ScrollTrigger
  useMotionPrefs.ts     useReducedMotion / useIsMobile / useMounted
styles/globals.css      design tokens (@theme), base, utilidades
public/img/             imágenes migradas
legacy/                 sitio estático anterior (referencia, no se compila)
```

### Dónde editar el contenido

**Todo el texto visible vive en [`lib/site-data.ts`](lib/site-data.ts).** Los
componentes no contienen copy. Para cambiar un teléfono, un párrafo, un enlace
de portal o una cifra, se edita ese archivo y nada más.

El sitio estático anterior se conservó íntegro en [`legacy/`](legacy/) — de ahí
salió el copy real, palabra por palabra. `next.config.ts` lo excluye del build.

---

## Sistema de diseño

Tokens en `@theme` dentro de [`styles/globals.css`](styles/globals.css).

| Token | Valor | Uso |
|---|---|---|
| `ink-950` | `#0a0e14` | fondo base |
| `ink-900` | `#0d1220` | banda alterna / superficies |
| `ink-800` | `#121a2c` | cards sobre oscuro |
| `navy-700` | `#192e5e` | **navy de marca** (banda CTA) |
| `accent-500` | `#2d6cff` | acento: reglas, chevrons, puntos |
| `accent-600` | `#1e63ff` | fondo de botones sólidos |
| `accent-400` | `#5b8cff` | texto de acento sobre oscuro |
| `mist` | `#b7c0d0` | texto de cuerpo |
| `hairline` | `rgba(255,255,255,.08)` | líneas sutiles |

Tipografía: **Fraunces** (display serif, títulos) + **Inter** (cuerpo y UI).
Toda la escala tipográfica es fluida con `clamp()`; no hay tamaños fijos.

**Nota de contraste:** `accent-500` da 4.47:1 con texto blanco encima, apenas
por debajo de AA, así que los botones sólidos usan `accent-600` (4.90:1) y el
texto de acento usa `accent-400`. `accent-500` queda para fondos y elementos
gráficos, donde el mínimo es 3:1.

---

## Animaciones

Catálogo, todo reutilizable desde `lib/animations.ts` y `components/ui/`:

| Efecto | Dónde |
|---|---|
| Scroll reveal + stagger | todas las secciones (`Reveal` / `Stagger`) |
| Text reveal por línea/palabra | títulos serif (`TextReveal`) |
| Image reveal (clip-path wipe) | todas las fotos (`ImageReveal`) |
| Parallax | About, Programs, Facilities |
| Pinned scroll de 3 actos | Hero |
| Pinned horizontal scroll | Comunidad (≥1024px) |
| Count-up | Trust bar |
| Marquee infinito (pausa en hover) | banda de valores |
| Magnetic button | CTAs principales |
| Navbar reactivo + auto-hide | Navbar |

Componentes adaptados de **21st.dev** (retematizados a los tokens Altamira, no
pegados tal cual): *Card Spotlight* (`SpotlightCard`, pilares), *Bento Grid*
(rejilla de pilares), *Hover Border Gradient* (cards de niveles), *Marquee*
(banda de valores), *Parallax scroll* (campus).

### Dos trampas que ya están resueltas (no reintroducir)

1. **`clip-path: inset(100%)` en el elemento observado.** Un elemento recortado
   a área cero nunca intersecta, así que el IntersectionObserver que debería
   revelarlo no dispara jamás y la foto queda invisible para siempre.
   En `ImageReveal` el recorte va en un hijo; el padre observado nunca se
   recorta. (`getBoundingClientRect` sí reporta la caja completa, lo que hace
   que el bug parezca imposible.)
2. **Intercambiar variantes de Motion desde un efecto.** `useReducedMotion` se
   resuelve en un efecto, es decir *después* de que Motion ya escribió su
   variante `initial` como estilo inline. Cambiar `variants` luego no borra ese
   inline, y el contenido se queda en `opacity: 0`. Por eso el estado de reposo
   bajo `prefers-reduced-motion` se fuerza en CSS (`[data-reveal]` en
   `globals.css`), que gana la carrera porque aplica antes del primer pintado.

---

## Accesibilidad y responsive

- `prefers-reduced-motion` desactiva pin, parallax, count-up, marquee y reveals;
  el contenido se muestra estático y completo (verificado: 0 elementos ocultos).
- Cero overflow horizontal verificado en 320 / 375 / 768 / 1024 / 1440 px.
- HTML semántico, `alt` reales, foco visible, targets ≥ 44px, drawer móvil con
  focus trap y Escape, formulario con labels asociadas y `aria-live`.
- El scroll horizontal fijado de Comunidad se degrada a carrusel táctil con
  scroll-snap por debajo de 1024px.

---

## TODO — datos que faltan por confirmar

Todo esto está marcado con `// TODO` en el código:

1. **`lib/site-data.ts` → `stats`**: "Años de experiencia" y "Alumnos formados"
   están en `null` y renderizan un guion largo (—). El sitio anterior mostraba
   30+ y 1200+, pero **no están confirmados por el colegio**, así que no se
   usaron. Poner el número real o retirar la métrica.
2. **`lib/site-data.ts` → `footer.columns`**: los cinco avisos de privacidad y
   la política de protección al menor apuntan a `#`. Faltan las URLs reales.
3. **`components/sections/Contact.tsx`**: el formulario valida y muestra el
   estado de éxito, pero **no envía nada**. Falta conectarlo a un endpoint real
   (API route, Formspree, o el correo de admisiones).
4. **Imágenes**: `about.jpg`, `elementary.jpg`, `middle.jpg`, `high.jpg` e
   `instalaciones.jpg` vienen del sitio anterior. Confirmar que son fotos
   reales del colegio y con derechos, o sustituirlas.
5. **`imagenes/`** (dentro de `legacy/`): volcado de fotos sin optimizar que
   nunca se usó. Revisar si alguna debe entrar a `public/img/`.
