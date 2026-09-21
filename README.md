# Colegio Altamira La Cima — sitio web

Sitio institucional **multipágina** de Colegio Altamira La Cima (Zapopan, Jalisco).
Next.js (App Router) + TypeScript + Tailwind CSS v4. Tema claro corporativo,
con el hero oscuro de Three.js reservado a la portada.

---

## Cómo correrlo

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm start
```

Node 18.18+ (probado con Node 24). El primer arranque descarga las fuentes
(Playfair Display + Inter) vía `next/font`, así que necesita red una vez.

---

## Páginas

Es un sitio de varias páginas reales, no una landing con anclas.

| Ruta | Contenido |
|---|---|
| `/` | Hero Three.js + cifras + quiénes somos + pilares + accesos al resto |
| `/nosotros` | Quiénes somos, valores y los 4 pilares del modelo educativo |
| `/oferta` | Elementary · Middle School · High School (anclas `#elementary`, `#middle`, `#high`) |
| `/comunidad` | Padres · Profesores · Alumnos · Alumni (scroll horizontal fijado) |
| `/instalaciones` | Campus, m² y servicios |
| `/admisiones` | Proceso en 4 pasos + vías de contacto directo |
| `/contacto` | Datos, mapa y formulario |

La navbar y el footer viven en `app/layout.tsx`, así que son comunes a todas.

---

## Estructura

```
app/
  layout.tsx              fuentes, metadata, JSON-LD, navbar, footer
  page.tsx                Inicio
  nosotros/ oferta/ comunidad/ instalaciones/ admisiones/ contacto/
components/
  layout/    Navbar · MobileMenu · Footer · PageHeader
  sections/  CosmosHero · Stats · Marquee · About · Pillars
             Programs · Community · Facilities · AdmissionsCTA · Contact
  ui/        Button · Reveal · TextReveal · ImageReveal · CountUp
             SectionLabel · Icons
  ui/scroll/ los 11 efectos de scroll (ver tabla de Animaciones)
  providers/ SmoothScroll (Lenis + ticker de GSAP)
lib/
  site-data.ts            ← TODO el contenido, cifras, enlaces y contactos
  animations.ts           variantes y easings compartidos
  gsap.ts                 carga diferida de GSAP + ScrollTrigger
  useMotionPrefs.ts       useReducedMotion / useIsMobile / useMounted
  useScrollValue.ts       valores ligados al scroll, siempre evaluados en JS
styles/globals.css        design tokens (@theme), base, hero, utilidades
public/img/               imágenes
legacy/                   sitio estático anterior (referencia, no se compila)
```

**Todo el texto visible vive en [`lib/site-data.ts`](lib/site-data.ts).** Los
componentes no contienen copy.

---

## Sistema de diseño

Tokens en `@theme` dentro de [`styles/globals.css`](styles/globals.css).

| Token | Valor | Uso |
|---|---|---|
| `paper` / `paper-50` / `paper-100` | `#fff` · `#fafafa` · `#f4f5f7` | fondos |
| `navy-700` | `#192e5e` | **navy de marca**: títulos, banda CTA |
| `accent-600` | `#1a57e6` | única azul válida bajo texto blanco (5.9:1) |
| `accent-500` | `#2d6cff` | rellenos, reglas y marcas — nunca texto sobre blanco |
| `graphite` | `#343b47` | cuerpo (10.6:1) |
| `slate` | `#5d6675` | secundario (6.3:1) |
| `rule` / `rule-strong` | `#e3e6ec` · `#c9ced9` | hairlines |
| `ink-950` | `#05070c` | hero y footer |

Tipografía: **Playfair Display** (display serif) + **Inter** (cuerpo y UI),
fluida con `clamp()` en toda la escala. Playfair trae numerales de estilo
antiguo por defecto (el 3 baja de la línea); el `body` fuerza
`font-variant-numeric: lining-nums` para que cifras e índices se alineen.
Cambiar la serif es una línea en `app/layout.tsx`.

**Tres reglas del sistema:**
1. **Cero bordes redondeados.** Hay un `border-radius: 0 !important` global,
   así que ninguna utilidad ni librería puede reintroducirlos.
2. La estructura sale de **hairlines y aire**, nunca de sombras, cards
   anidadas ni degradados.
3. Un acento por pantalla.

---

## El hero

`components/sections/CosmosHero.tsx` es el hero original del sitio, portado
desde `legacy/js/hero-cosmos.js` **sin cambiarle el comportamiento**: campo de
estrellas, nebulosa, siluetas de montaña "La Cima" en el azul de marca, vuelo
de cámara en tres actos, push-in del fondo, entrada del título con GSAP y el
icono del niño estudiando.

El detalle que hay que preservar si se toca: **el icono no está colocado con
CSS.** Se proyecta cada frame desde un punto 3D real de la cresta de la
montaña (`iconAnchor3D`), que es lo que lo mantiene pegado al relieve mientras
la cámara vuela. Una posición CSS sólo cuadraría en un punto del scroll y
derivaría en todos los demás. Los móviles en vertical tienen un campo de
visión horizontal mucho más estrecho, por eso usan su propio anclaje.

Three.js, GSAP y Lenis se cargan diferidos desde efectos: ninguno entra en el
bundle inicial, y la portada es la única página que descarga Three.js.

---

## Animaciones

### Los cuatro componentes de referencia (21st.dev)

Implementados **fieles al código original** — mismos valores de rotación,
escala, recorte, resorte y rutas — con sólo lo imprescindible adaptado: fotos y
textos reales, esquinas cuadradas y que funcionen a media página.

| Componente | Archivo | Dónde |
|---|---|---|
| **ContainerScroll** — panel con bisel que llega inclinado 20° y se aplana | `ContainerScroll.tsx` | Inicio, Oferta |
| **ScrollChoreography** — 4 fotos se cruzan, se apilan y una se abre a pantalla completa | `ScrollChoreography.tsx` | Inicio, Instalaciones |
| **SmoothScrollHero** — imagen que se abre de un marco central con fotos en parallax y lista | `SmoothScrollHero.tsx` | Inicio |
| **BackgroundPaths** — campo de líneas blancas con título letra por letra | `BackgroundPaths.tsx` | Inicio, Contacto (sección completa) · Nosotros y banda CTA (de fondo) |

Adaptaciones concretas respecto al original:
- `SmoothScrollHero` medía `window.scrollY` crudo, o sea, asumía ser lo primero
  de la página. Aquí cada rango se mide desde donde empieza la sección, con los
  mismos píxeles (1500 / 2000). El zoom es un `scale` sobre `<img>` en vez de
  `background-size`, que en un móvil vertical dejaba la foto como una franja.
- `BackgroundPathsSection` anima el título al entrar en pantalla, no al montar:
  a media página la animación de montaje terminaba antes de que nadie llegara.
- `BackgroundPaths` va en **blanco y más denso** (44–48 líneas por dirección en
  vez de 36), sólo sobre fondos oscuros, y con `clear` las líneas se apartan de
  debajo del texto para que se lea.

### Efectos propios

| Efecto | Componente | Dónde |
|---|---|---|
| Vuelo de cámara 3D en 3 actos | `CosmosHero` | Inicio (no tocar) |
| Marco que se despliega a pantalla completa | `ClipRevealBand` | Oferta |
| Paneles que se expanden al pasar el cursor | `ExpandingPanels` | Inicio |
| Tarjetas que se apilan al hacer scroll | `StackingCards` | Inicio |
| Foto fija que cambia de imagen según el texto | `StickySwapGallery` | Nosotros |
| Frase que se ilumina palabra por palabra | `ScrollTextHighlight` | Nosotros, Comunidad |
| Apertura circular de imagen | `CircularReveal` | Comunidad, Admisiones |
| Scroll horizontal fijado | `Community` | Comunidad |
| Galería con fotos a distinta velocidad | `ParallaxColumn` | Instalaciones |
| Línea de tiempo que se dibuja con el scroll | `ScrollTimeline` | Admisiones |
| Parallax de salida de la cabecera | `PageHeader` | las 6 páginas internas |
| Marquee ligado a la velocidad del scroll | `Marquee` | Inicio, Nosotros, Comunidad |
| Wordmark gigante que sube | `FooterWordmark` | las 7 páginas |

### Cinco trampas resueltas (no reintroducir)

1. **`clip-path: inset(100%)` en el elemento observado.** Un elemento recortado
   a área cero nunca intersecta, así que el IntersectionObserver que debería
   revelarlo no dispara jamás. En `ImageReveal` el recorte va en un hijo; el
   padre observado nunca se recorta.
2. **Intercambiar variantes de Motion desde un efecto.** `useReducedMotion` se
   resuelve *después* de que Motion ya escribió su variante `initial` inline,
   y cambiar `variants` luego no borra ese inline. Por eso el estado de reposo
   bajo `prefers-reduced-motion` se fuerza en CSS (`[data-reveal]`).
3. **`last:` no sirve para teñir la última línea de un título.** Cada línea vive
   sola dentro de su propia máscara, así que todas son "último hijo" y el
   título entero se coloreaba. Se usa el prop `lastLineClassName` de
   `TextReveal`.
4. **No usar `useTransform(progress, [..], [..])` para valores ligados al
   scroll — usar `useScrollValue`** (`lib/useScrollValue.ts`). Con un rango,
   Motion delega la opacidad y los transforms a la `ScrollTimeline` nativa
   del navegador, y aquí esa línea de tiempo no coincide con el progreso JS:
   medido en navegador, el texto del final de cada reveal quedaba al ~10% de
   opacidad y el wordmark del footer al 0.3%, mientras un `y` calculado del
   mismo progreso llegaba exacto. `useScrollValue` usa una función, que no se
   puede delegar, así que siempre se evalúa contra el progreso real. Compila y
   no da error en consola: sólo se ve midiendo `getComputedStyle` en el punto
   final del efecto.
5. **El parpadeo de `BackgroundPaths`.** En el original cada línea anima
   `pathOffset` de 0 a 1 y pulsa su opacidad: cuando el trazo llega al final
   de la curva se sale y la línea **desaparece**, luego reaparece. Con decenas
   de líneas en temporizadores aleatorios (`Math.random()`, distintos en cada
   carga) el fondo entero parpadeaba y a veces se veía bien y a veces mal. Ahora
   cada curva tiene una línea base estática (nunca desaparece) y un destello que
   la recorre con una animación CSS de `stroke-dashoffset`: `pathLength={1}` y
   un patrón de guiones que suma exactamente 1 hacen el bucle continuo, sin
   salto. Las velocidades salen de un hash fijo del índice, idénticas en cada
   carga.

---

## Accesibilidad y responsive

- `prefers-reduced-motion` desactiva pin, parallax, count-up, marquee y reveals
  (verificado: 0 elementos ocultos).
- Cero overflow horizontal verificado en las 7 rutas a 375 y 1440 px.
- HTML semántico, `alt` reales, foco visible, targets ≥ 44px, breadcrumb por
  página, drawer móvil con focus trap y Escape, formulario con labels y
  `aria-live`.
- El scroll horizontal fijado se degrada a carrusel táctil con scroll-snap por
  debajo de 1024px.

---

## TODO — datos que faltan por confirmar

Todo esto está marcado con `// TODO` en el código:

1. **`lib/site-data.ts` → `stats`**: "Años de experiencia" y "Alumnos formados"
   están en `null` y renderizan un guion (—). El sitio anterior mostraba 30+ y
   1200+, pero **no están confirmados por el colegio**.
2. **`lib/site-data.ts` → `admissionSteps`**: los 4 pasos del proceso de
   admisión son un proceso estándar, **no validado por la institución**.
   Revisar antes de publicar.
3. **`lib/site-data.ts` → `footer.columns`**: los avisos de privacidad y la
   política de protección al menor apuntan a `#`. Faltan las URLs reales.
4. **`components/sections/Contact.tsx`**: el formulario valida y muestra el
   estado de éxito, pero **no envía nada**. Falta conectarlo a un endpoint.
5. **Imágenes**: las fotos de secciones vienen del sitio anterior. Confirmar
   que son reales del colegio y con derechos.
