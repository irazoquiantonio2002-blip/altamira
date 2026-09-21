# PROMPT PARA CLAUDE CODE — Sitio web "Colegio Altamira La Cima"

> Pega esto tal cual en Claude Code, dentro de la carpeta de tu repo `altamira`.

---

## 0. Rol y objetivo

Actúa como un **desarrollador Front-end senior + diseñador UX/UI senior** especializado en sitios institucionales premium con animaciones scroll-driven de nivel "enterprise".

Tu misión: **transformar el proyecto actual (HTML/CSS/JS plano de una sola página) en un sitio web completo, multi-sección y multi-archivo**, con una identidad visual oscura e institucional inspirada en la referencia de Duke University que te adjunto, y con un sistema de animaciones profesionales al scroll (no adornos gratuitos: animaciones que refuercen la narrativa y la elegancia de la marca).

**Idioma del sitio:** español (México). Todo el copy visible al usuario en español.

---

## 1. Contexto del proyecto (léelo antes de tocar nada)

- Repo actual: `github.com/irazoquiantonio2002-blip/altamira`, deploy en `altamira-bice.vercel.app`.
- Estado actual: **vanilla HTML + CSS + JS**, un solo `index.html`, con `assets/img`, `css`, `js`, `imagenes`.
- **Importantísimo:** el sitio actual ya tiene TODO el contenido real y correcto (textos, secciones, datos de contacto, enlaces a portales). **NO inventes contenido nuevo ni cifras falsas.** Reutiliza el copy existente palabra por palabra salvo pulido tipográfico menor.
- Marca real:
  - Nombre: **Colegio Altamira La Cima**
  - Ubicación: **Zapopan, Jalisco, México** (Av. La Cima 614)
  - Identidad: **formación integral, centrada en la persona, católica, acompañamiento del Opus Dei, educación diferenciada**
  - Color de marca (theme actual): **navy `#192e5e`**
  - Logo: `assets/img/logos/logo_altamira_lacima_blanco.svg`
  - Contacto: 33 3834 2433 / 33 3834 1809 / 33 3834 3981 · admisiones@altamira.edu.mx · WhatsApp +52 1 33 1768 0743
  - Redes: Facebook /ColegioAltamiraLaCima · Instagram /colegioaltamiralacima · YouTube · Twitter/X @altamiralacima
  - Portales externos (deben seguir enlazando): Servoescolar, SIE, Algebraix, HighSights, Calendario Google

**Antes de escribir código:** lee el repo completo, `index.html`, el CSS y el JS actuales, y haz un inventario de: (a) el contenido/secciones, (b) las imágenes en `assets/img`, (c) cómo está construido el hero actual. Deja ese inventario resumido antes de empezar.

---

## 2. Stack técnico objetivo

Migra a un stack moderno pensado para animaciones de alta calidad y arquitectura multi-archivo:

- **Next.js (App Router) + TypeScript**
- **Tailwind CSS** (con design tokens vía CSS variables)
- **Framer Motion** (`motion`) para entrada/salida, variantes y layout animations
- **GSAP + ScrollTrigger** para scroll-driven avanzado (pin, horizontal scroll, timelines encadenadas)
- **Lenis** para smooth scroll (bien integrado con ScrollTrigger, con fallback y respeto a `prefers-reduced-motion`)
- Fuentes vía `next/font` (self-hosted, sin FOUT)
- Imágenes con `next/image` (formatos modernos, `sizes` correctos, priority solo en el hero)

Migra las imágenes del repo actual a `/public`. Conserva los assets del hero (`campus-backdrop.jpg`, `nino-estudiando.png`) y los del resto de secciones (`about.jpg`, `elementary.jpg`, `middle.jpg`, `high.jpg`, `instalaciones.jpg`, logos).

> Nota: los componentes de **21st.dev** están hechos justo para React + Tailwind + Framer Motion, así que este stack te permite integrarlos directamente.

---

## 3. Arquitectura multi-sección / multi-archivo (obligatorio)

Nada de un archivo monolítico. **Cada sección = su propio componente en su propio archivo.** Estructura sugerida:

```
app/
  layout.tsx
  page.tsx                    # landing = composición de secciones
  (rutas opcionales para páginas profundas: /oferta, /nosotros, /admisiones)
components/
  layout/  Navbar.tsx  Footer.tsx  MobileMenu.tsx
  sections/
    Hero.tsx
    Stats.tsx                 # contadores animados
    Marquee.tsx               # cinta "Centrada en la Persona ◆ ..."
    About.tsx                 # Quiénes somos
    Pillars.tsx               # 4 pilares de formación
    Programs.tsx              # Niveles: Elementary / Middle / High
    Community.tsx             # Padres / Profesores / Alumnos / Alumni
    Facilities.tsx            # Instalaciones / campus
    AdmissionsCTA.tsx
    Contact.tsx               # form + mapa + info
  ui/                         # botones, cards, labels, primitivos animados
lib/
  animations.ts               # variantes Framer + helpers GSAP reutilizables
  useScroll*.ts               # hooks (lenis, reveal, parallax, count-up)
styles/  globals.css          # design tokens
public/  (imágenes migradas)
```

La landing (`page.tsx`) importa las secciones en orden. Cada sección es autónoma, testeable y con sus animaciones encapsuladas. Extrae toda animación repetida a `lib/animations.ts` (no dupliques variantes).

---

## 4. Sistema de diseño (Duke → Altamira)

Toma como **norte visual** la referencia de Duke University adjunta, y adáptala a la marca Altamira. NO copies textos de Duke; solo el lenguaje visual.

### Paleta (define como CSS variables / tokens Tailwind)
- **Base oscura:** casi-negro `#0A0E14` → `#0D1220` para fondos principales.
- **Navy institucional:** `#192e5e` (marca) para secciones y superficies.
- **Azul acento (CTA, líneas, chevrons):** un azul más vivo tipo `#2D6CFF`/`#1E63FF` para botones, detalles geométricos y estados hover.
- **Neutros:** blanco `#FFFFFF`, gris texto `#B7C0D0`, líneas sutiles `rgba(255,255,255,.08)`.
- Mantén contraste AA. Elegancia > saturación. **Nada de colores chillones.**

### Tipografía
- **Display serif** para títulos grandes (estilo editorial/Didone como en Duke): p. ej. *Fraunces* o *Playfair Display*. Úsala en los H1/H2 grandes ("Formación", "Futuro", nombres de sección).
- **Sans limpia** para cuerpo, labels y UI: p. ej. *Inter*, *Geist* o *Manrope*.
- **Labels de sección**: uppercase, tracking amplio, tamaño pequeño, con un **punto/● azul** antes del texto (como "● News." de Duke).

### Elementos gráficos característicos (replicar el "sabor" Duke)
- **Chevrons / cintas diagonales azules** en bordes (esquina derecha) como acento geométrico recurrente.
- **Bento cards** oscuras con borde fino, ícono + título + flecha; distintas alturas/anchos en grid.
- **Botones pill** con flecha circular (estilo "READ NEWS ▸" / "Agenda una cita ▸"), con micro-interacción en hover.
- Fotografía aérea/campus con **overlay oscuro en degradado** para legibilidad.
- Números grandes de índice (01, 02, 03) en secciones tipo listado (pilares, niveles).

### UX / principios
- Jerarquía clara, mucho aire, ritmo vertical consistente (escala de spacing basada en 4/8px).
- Máximo ~2 acentos por pantalla; que respire.
- Estados hover/focus/active definidos en TODOS los interactivos.
- Navbar sticky con cambio de fondo al hacer scroll (transparente sobre hero → sólido oscuro + blur después).

---

## 5. EL HERO — regla especial (leer con atención)

El hero actual **ya existe y me gusta su concepto y su animación**. Reglas:

1. **Conserva el concepto y la animación del hero. NO lo rediseñes desde cero.** Pórtalo a React/Framer/GSAP manteniendo su idea (slider/reveal del fondo `campus-backdrop.jpg` + capa frontal `nino-estudiando.png`, título serif grande, indicador "Desliza", contador de slides 00/02).
2. **Arregla el responsive:** hoy en móvil se ve **muy roto**. Debe verse impecable en móvil, tablet y desktop: sin overflow horizontal, tipografía fluida (`clamp()`), capas bien posicionadas, el `nino-estudiando.png` recolocado o simplificado en móvil si estorba, alturas con `100svh`/`100dvh` (no `100vh` que rompe en móvil), safe-areas respetadas.
3. **Baja la saturación / el ruido visual:** que se sienta **más limpio, sobrio y "enterprise"**, no recargado. Trata la media con overlay/gradiente oscuro y menor saturación; menos elementos compitiendo; más aire.
4. **Elévalo a nivel enterprise:** añade un efecto **scroll-driven** tipo la referencia de Tilton School (uno de mis videos): a medida que se hace scroll, el fondo se **escala/revela suavemente** (p. ej. clip-path circular o scale + parallax) y el título hace un **reveal por líneas/palabras**. Sutil, elegante, 60fps. Nada brusco.
5. Respeta `prefers-reduced-motion`: si está activo, muestra el hero estático y legible sin movimiento.

Documenta qué cambiaste del hero y por qué.

---

## 6. Secciones del sitio (orden y contenido real)

Usa el contenido que YA existe en el sitio actual. Orden de la landing:

1. **Navbar** (logo blanco + menú: Oferta Educativa, Conócenos, Elementary/Middle/High, Instalaciones, Portal Padres [Servoescolar, SIE], Algebraix, Servicios [HighSights, Calendario], Contacto, botón **Admisiones**). Menú móvil animado (drawer full-screen con stagger).
2. **Hero** (ver sección 5).
3. **Stats** — contadores: Años de experiencia · Alumnos formados · Formación integral · Niveles académicos. Hoy están en "0": déjalos como **constantes configurables** en un archivo (ej. `lib/site-data.ts`) con un comentario `// TODO: reemplazar con cifras reales`; **no inventes números**. Animación count-up al entrar en viewport.
4. **Marquee** — cinta infinita: "Centrada en la Persona ◆ Formación Integral ◆ Identidad Católica ◆ Educación Diferenciada ◆".
5. **About / Quiénes Somos** — texto real + `about.jpg`, con image-reveal (clip-path) y text-reveal.
6. **Pilares de formación** (01–04: Centrada en la Persona, Formación Integral, Identidad Católica, Educación Diferenciada) — grid/bento con reveal escalonado.
7. **Oferta Educativa / Niveles** (Elementary 1–4°, Middle 5–9°, High 10–12°) con `elementary/middle/high.jpg` — cards con hover elegante (spotlight/border-gradient sutil) y parallax en imagen.
8. **Nuestra Comunidad** (Padres / Profesores / Alumnos / Alumni) — **candidata ideal para el scroll horizontal fijado** (ver sección 7, referencia duck.school): tarjetas ligeramente inclinadas con drop-cap serif, que avanzan horizontalmente mientras el bloque queda "pineado".
9. **Instalaciones / Campus** — `instalaciones.jpg`, dato "10,000+ m²", chips (Canchas, Laboratorios, Biblioteca, Cómputo) con reveal + parallax.
10. **CTA Admisiones** — "¿Listo para conocer el modelo Altamira?" con botones Agenda una cita / Llámanos.
11. **Contacto** — info + formulario + mapa Google embed. Form con estados (focus, error, éxito) y micro-animaciones.
12. **Footer** oscuro multi-columna (logo, dirección, teléfonos, redes con íconos circulares, sitios de interés, avisos de privacidad, protección al menor). Réplica del look de footer de Duke.

---

## 7. Sistema de animaciones (el corazón del encargo)

Quiero animaciones **profesionales, con propósito y coherentes en toda la página** (no solo en el hero, sino sección por sección), inspiradas en mis 3 videos de referencia y en **21st.dev/community/components**. Que se vean perfectas **tanto en desktop como en responsive**.

### Catálogo a implementar (reutilizable desde `lib/animations.ts`)
- **Scroll reveal**: fade + translateY + micro-scale al entrar en viewport, con **stagger** en grupos (referencia Wellington: las tarjetas/stats aparecen coreografiadas).
- **Parallax** en imágenes/fondos (velocidades distintas por capa; sutil).
- **Pinned horizontal scroll** con GSAP ScrollTrigger para la sección Comunidad/Alumni (referencia duck.school): pin del contenedor + traslación horizontal del track de tarjetas al scrollear vertical; tarjetas con leve rotación e interacción en hover.
- **Text reveal** por líneas/palabras (clip/`overflow:hidden` + translateY) para los títulos serif grandes.
- **Image reveal** con `clip-path` (barrido).
- **Count-up** para las estadísticas.
- **Marquee** infinito (pausa en hover).
- **Magnetic buttons** y micro-interacciones en pills/flechas.
- **Sticky/scroll-linked** transiciones entre secciones (fondo que cambia, o efecto de "reveal" del hero al scrollear).
- **Navbar** que reacciona al scroll (fondo/blur/altura).

### 21st.dev — úsalo
Trae y **adapta** componentes de `21st.dev/community/components` que encajen con el tono institucional-elegante (no los más ruidosos). Patrones que quedan bien aquí:
- *Infinite Moving Cards* → testimonios/comunidad
- *Bento Grid* → pilares / instalaciones
- *Sticky Scroll Reveal* → modelo educativo / niveles
- *Text reveal / Text generate effect* → títulos
- *Card Spotlight / Hover Border Gradient* → cards de niveles
- *Marquee* → la cinta de valores
- *Parallax scroll* → galería/campus

Regla de oro: **solo agrega la animación si le queda a la página y se ve bien en móvil.** Adapta colores/tokens a la paleta Altamira; nada debe verse "pegado" o genérico. Prioriza elegancia sobre cantidad.

---

## 8. Responsive (requisito duro)

- **Mobile-first.** Breakpoints coherentes (sm/md/lg/xl). Cero overflow horizontal en cualquier ancho (prueba 320px, 375px, 768px, 1024px, 1440px).
- Tipografía fluida con `clamp()`. Toca-objetivos ≥ 44px. Alturas con `svh/dvh`.
- **Cada animación debe funcionar o degradar bien en móvil.** El scroll horizontal fijado debe tener versión móvil usable (o convertirse en carrusel táctil / stack vertical si en móvil no aporta). El parallax debe reducirse en móvil para no marear ni penalizar rendimiento.
- Verifica el hero especialmente (hoy es lo más roto).

---

## 9. Accesibilidad

- Respeta **`prefers-reduced-motion`** globalmente: desactiva/reduce parallax, pin, count-up y reveals a estados estáticos.
- HTML semántico (`header/nav/main/section/footer`, headings jerárquicos, `alt` reales en imágenes).
- Foco visible en todos los interactivos, navegación por teclado, `aria-*` donde aplique, formulario con labels asociadas.
- Contraste AA mínimo sobre fondos oscuros.

---

## 10. Rendimiento

- Anima **solo `transform` y `opacity`**; evita animar layout. Usa `will-change` con criterio.
- Objetivo **60fps**; nada de jank en scroll.
- `next/image`, lazy-load fuera del viewport, `priority` solo en hero. Cuida LCP y **CLS = 0**.
- Code-splitting por sección; carga diferida de GSAP/plugins pesados donde se pueda.
- Limpia listeners/ScrollTriggers en `useEffect` cleanup.

---

## 11. Contenido y datos

- Centraliza textos, cifras, enlaces y datos de contacto en `lib/site-data.ts` para editar fácil.
- **No inventes estadísticas, testimonios ni datos.** Donde falte un dato real (ej. contadores en 0, testimonios de comunidad), deja placeholder claro con `// TODO` y un valor neutro, y avísame en tu resumen final qué debo completar.
- Conserva todos los enlaces externos reales (portales, redes, mapa).

---

## 12. Entregables y criterios de aceptación (checklist)

- [ ] Proyecto Next.js + TS + Tailwind funcionando (`npm run dev` sin errores).
- [ ] Arquitectura multi-archivo: 1 componente por sección + `layout/`, `ui/`, `lib/`.
- [ ] Hero portado, **responsive arreglado**, menos saturado, con efecto scroll enterprise, y `prefers-reduced-motion` OK.
- [ ] Todas las secciones de la §6 con contenido real y sus animaciones de la §7.
- [ ] Al menos: scroll reveal + stagger, parallax, count-up, marquee, un pinned horizontal scroll, text/image reveal, navbar reactivo.
- [ ] Integración de ≥3 componentes adaptados de 21st.dev que encajen visualmente.
- [ ] Sin overflow horizontal ni CLS; 60fps en scroll; Lighthouse decente (Perf/A11y/Best Practices).
- [ ] README con: cómo correrlo, estructura, dónde editar contenido (`site-data.ts`), y lista de `// TODO` pendientes.
- [ ] Resumen final de: qué migraste, qué cambiaste en el hero, qué datos debo completar.

---

## 13. Cómo trabajar

1. Primero **explora el repo** y entrega el inventario (§1). No borres nada sin entenderlo.
2. Propón la estructura de carpetas y el design system (tokens + tipografías) y créalos.
3. Monta layout (Navbar/Footer) + página base.
4. Porta y arregla el **Hero** (prioridad #1 por el responsive).
5. Construye el resto de secciones una por una, con su animación, verificando responsive en cada una.
6. Integra/adapta componentes de 21st.dev.
7. Pasada final: rendimiento, accesibilidad, `prefers-reduced-motion`, QA en 320/768/1440.
8. Trabaja en ramas/commits pequeños y descriptivos. No rompas lo que ya funciona; si algo requiere decisión de diseño ambigua, elige la opción más sobria y anótalo.

---

## 14. Restricciones

- Elegante y sobrio por encima de todo: **"enterprise", no recargado.** Ante la duda, quita, no agregues.
- No colores chillones, no animaciones que mareen, no efectos sin propósito.
- No inventar contenido, cifras ni logos.
- Todo debe verse igual de bien en móvil que en desktop.
- Mantén la identidad de marca (navy + azul acento + blanco, tono formal católico-institucional).

Cuando termines cada fase, muéstrame un resumen breve de lo hecho y qué sigue.
