/**
 * Single source of truth for every piece of copy, figure, link and contact
 * detail on the site. Edit here — never inside a component.
 *
 * All copy below is the real, existing copy of the school, carried over
 * verbatim from the previous site (see `legacy/index.html`). Nothing is invented.
 */

export const site = {
  name: "Colegio Altamira La Cima",
  shortName: "Altamira La Cima",
  url: "https://altamiralacima.mx",
  locale: "es_MX",
  description:
    "Colegio Altamira La Cima: institución educativa de formación integral centrada en la persona. Elementary, Middle School y High School en Zapopan, Jalisco. Agenda tu cita de admisión.",
  keywords: [
    "Colegio Altamira La Cima",
    "escuela privada Zapopan",
    "formación integral",
    "educación diferenciada",
    "elementary",
    "middle school",
    "high school",
    "admisiones Jalisco",
  ],
  /** White mark — for dark surfaces (the hero, the footer). */
  logo: "/img/logos/logo_altamira_lacima_blanco.svg",
  /** Navy mark — same file with the two `fill:white` classes recolored to
      the brand navy, for the light navbar. */
  logoDark: "/img/logos/logo_altamira_lacima_navy.svg",
} as const;

export const contact = {
  address: {
    street: "Av. La Cima 614",
    neighborhood: "La Cima 45134",
    city: "Zapopan",
    region: "Jalisco",
    country: "México",
    postalCode: "45134",
  },
  email: "admisiones@altamira.edu.mx",
  childProtectionEmail: "proteccionalmenor_lacima@altamira.edu.mx",
  phones: ["33 3834 2433", "33 3834 1809", "33 3834 3981"],
  /** Primary line, used for `tel:` links. */
  primaryPhone: { label: "33 3834 2433", href: "tel:+523338342433" },
  whatsapp: {
    label: "WhatsApp",
    number: "+52 1 33 1768 0743",
    href: "https://api.whatsapp.com/send?phone=5213317680743",
  },
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2680.3409545954114!2d-103.4131797217716!3d20.750969861481067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428af7c5028b38b%3A0xfbd18fc1ac06ef92!2sColegio+Altamira+La+Cima!5e0!3m2!1ses-419!2smx!4v1518112287789",
} as const;

export type SocialIcon = "facebook" | "instagram" | "youtube" | "x";

export const socials: ReadonlyArray<{
  label: string;
  href: string;
  icon: SocialIcon;
}> = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/ColegioAltamiraLaCima",
    icon: "facebook",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/colegioaltamiralacima/",
    icon: "instagram",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UC_RV6VjGYYCR2OpDoFXYv8g",
    icon: "youtube",
  },
  { label: "X", href: "https://twitter.com/altamiralacima", icon: "x" },
];

/** External school portals. These links must keep working. */
export const portals = {
  servoescolar: "https://lacima.servoescolar.mx/Inicio.aspx",
  sie: "https://lacima.ecolmenares.net/",
  algebraix:
    "https://c1-altamiralacima.algebraix.com/bin/g/start/default/?x_load=0",
  highsights: "https://highsights.mx/",
  calendar:
    "https://calendar.google.com/calendar/u/0?cid=Y18wM2E2OTBkYTcwOWQ5ODJmZjQwMzg1ZGE4MjEwYzY3YTQyMTc1ZTBhZmJjMDZkZDg2NmRmM2YwY2I5YjBkODY1QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20",
} as const;

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
  children?: ReadonlyArray<NavItem>;
};

/**
 * Primary navigation. Every entry is a real page — this is a multi-page
 * site, not a single landing with anchor links.
 */
export const navigation: ReadonlyArray<NavItem> = [
  { label: "Nosotros", href: "/nosotros" },
  {
    label: "Oferta Educativa",
    href: "/oferta",
    children: [
      { label: "Elementary · 1° a 4°", href: "/oferta#elementary" },
      { label: "Middle School · 5° a 9°", href: "/oferta#middle" },
      { label: "High School · 10° a 12°", href: "/oferta#high" },
    ],
  },
  { label: "Comunidad", href: "/comunidad" },
  { label: "Instalaciones", href: "/instalaciones" },
  {
    label: "Portales",
    href: "/contacto",
    children: [
      { label: "Servoescolar", href: portals.servoescolar, external: true },
      { label: "SIE", href: portals.sie, external: true },
      { label: "Algebraix", href: portals.algebraix, external: true },
      { label: "High Sights", href: portals.highsights, external: true },
      { label: "Calendario", href: portals.calendar, external: true },
    ],
  },
  { label: "Contacto", href: "/contacto" },
];

/**
 * The short dark band that opens every inner page: section label, title,
 * standfirst and the photo behind it.
 */
export type PageHeader = {
  label: string;
  title: string;
  lead: string;
  image: { src: string; alt: string };
};

export const pageHeaders: Record<string, PageHeader> = {
  nosotros: {
    label: "Quiénes Somos",
    title: "Formando personas de excelencia",
    lead: "Una institución centrada en la persona, con visión católica de la vida y el acompañamiento del Opus Dei.",
    image: {
      src: "/img/about.jpg",
      alt: "Estudiantes de Altamira La Cima en actividad colaborativa",
    },
  },
  oferta: {
    label: "Oferta Educativa",
    title: "Niveles académicos",
    lead: "Un proyecto educativo de doce años que responde a las características propias de cada edad.",
    image: {
      src: "/img/middle.jpg",
      alt: "Alumnos de Altamira La Cima en clase",
    },
  },
  comunidad: {
    label: "Nuestra Comunidad",
    title: "Formación que trasciende",
    lead: "Cuatro pilares que sostienen nuestra comunidad educativa: padres, profesores, alumnos y alumni.",
    image: {
      src: "/img/hero/altamira-comunidad.jpg",
      alt: "Comunidad de Colegio Altamira La Cima",
    },
  },
  instalaciones: {
    label: "Campus",
    title: "Nuestras instalaciones",
    lead: "Más de 10,000 m² diseñados para inspirar el aprendizaje y el desarrollo integral.",
    image: {
      src: "/img/instalaciones.jpg",
      alt: "Vista aérea del campus de Colegio Altamira La Cima",
    },
  },
  admisiones: {
    label: "Admisiones Abiertas",
    title: "Únete a Altamira La Cima",
    lead: "Agenda una cita para conocer nuestras instalaciones y nuestro modelo educativo.",
    image: {
      src: "/img/high.jpg",
      alt: "Alumnos de High School en Colegio Altamira La Cima",
    },
  },
  contacto: {
    label: "Contacto",
    title: "Contáctanos",
    lead: "Estamos listos para resolver tus dudas y acompañarte en el proceso de admisión.",
    image: {
      src: "/img/elementary.jpg",
      alt: "Alumnos de Elementary en Colegio Altamira La Cima",
    },
  },
};

/**
 * Admissions steps.
 *
 * TODO: confirmar el proceso real de admisión con el colegio. Los cuatro
 * pasos de abajo describen un proceso estándar y NO están validados por la
 * institución — revisar antes de publicar.
 */
export const admissionSteps = [
  {
    index: "01",
    title: "Agenda tu cita",
    text: "Escríbenos o llámanos para programar una visita guiada por el campus y conocer el modelo educativo.",
  },
  {
    index: "02",
    title: "Visita el campus",
    text: "Recorre las instalaciones y resuelve tus dudas con el equipo de admisiones y la dirección del nivel.",
  },
  {
    index: "03",
    title: "Entrega de documentos",
    text: "Reúne la documentación académica del alumno y completa la solicitud de ingreso.",
  },
  {
    index: "04",
    title: "Bienvenida",
    text: "Confirmamos el lugar e iniciamos el acompañamiento con el preceptor asignado a la familia.",
  },
] as const;

/**
 * Trust-bar figures.
 *
 * TODO: reemplazar con las cifras reales del colegio. Un `value: null`
 * renderiza un guion largo (—) en lugar de inventar un número.
 */
export const stats: ReadonlyArray<{
  value: number | null;
  suffix: string;
  label: string;
}> = [
  // TODO: confirmar años de experiencia reales
  { value: null, suffix: "+", label: "Años de experiencia" },
  // TODO: confirmar total de alumnos formados
  { value: null, suffix: "+", label: "Alumnos formados" },
  { value: 100, suffix: "%", label: "Formación integral" },
  { value: 3, suffix: "", label: "Niveles académicos" },
];

export const marqueeItems = [
  "Centrada en la Persona",
  "Formación Integral",
  "Identidad Católica",
  "Educación Diferenciada",
] as const;

export const about = {
  label: "Quiénes Somos",
  titleLead: "Formando personas",
  titleAccent: "de excelencia",
  paragraphs: [
    "Somos una institución educativa que busca el desarrollo integral de las personas que participan en nuestra comunidad: padres, profesores, alumnos y alumni. Con una visión católica de la vida y buscando en los quehaceres cotidianos el lugar de nuestro crecimiento personal.",
    "Nuestra institución cuenta con el acompañamiento de la prelatura personal del Opus Dei quien vela por el crecimiento espiritual de nuestra comunidad. Con la centralidad en la persona, nuestro modelo educativo promueve que el alumno sea el protagonista de su propio aprendizaje.",
  ],
  cta: { label: "Conoce nuestro modelo", href: "#modelo" },
  image: {
    src: "/img/about.jpg",
    alt: "Estudiantes de Altamira La Cima en actividad colaborativa",
  },
} as const;

export type PillarIcon = "person" | "heart" | "cross" | "balance";

export const pillars = {
  label: "Modelo Educativo",
  title: "Nuestros pilares de formación",
  subtitle:
    "Al reconocer la grandeza de la persona, ofrecemos oportunidades de crecimiento en todas las dimensiones.",
  items: [
    {
      index: "01",
      title: "Centrada en la Persona",
      text: "Cada alumno es singular, autónomo y protagonista de su vida y de su aprendizaje. Cada persona es una gran novedad por descubrir y formar.",
      icon: "person" as PillarIcon,
      image: {
        src: "/img/about.jpg",
        alt: "Alumnos trabajando en equipo en Altamira La Cima",
      },
    },
    {
      index: "02",
      title: "Formación Integral",
      text: "Cuerpo mediante el deporte, corazón para manejar emociones, inteligencia con pensamiento crítico, y voluntad para adquirir virtudes.",
      icon: "heart" as PillarIcon,
      image: {
        src: "/img/hero/futuro-basquetbol.jpg",
        alt: "Alumnos en actividad deportiva en Altamira La Cima",
      },
    },
    {
      index: "03",
      title: "Identidad Católica",
      text: "El espíritu se enriquece dentro de la fe católica. Con el acompañamiento del Opus Dei, enseñamos que todos podemos ser santos en nuestras ocupaciones.",
      icon: "cross" as PillarIcon,
      image: {
        src: "/img/hero/altamira-comunidad.jpg",
        alt: "Comunidad de Colegio Altamira La Cima",
      },
    },
    {
      index: "04",
      title: "Educación Diferenciada",
      text: "Reconocemos las diferencias entre hombres y mujeres, adecuando estrategias pedagógicas para mejores resultados académicos y deportivos.",
      icon: "balance" as PillarIcon,
      image: {
        src: "/img/hero/formacion-ajedrez.jpg",
        alt: "Alumnos de Altamira La Cima en actividad de concentración",
      },
    },
  ],
} as const;

/** Scroll-linked statements. Real copy, condensed from the About text. */
export const statements = {
  nosotros:
    "Buscamos el desarrollo integral de cada persona de nuestra comunidad: padres, profesores, alumnos y alumni, con una visión católica de la vida.",
  comunidad:
    "El alumno es una persona única e irrepetible, protagonista de su propio aprendizaje y de su propia vida.",
} as const;

export const programs = {
  label: "Oferta Educativa",
  title: "Niveles académicos",
  subtitle:
    "Nuestro proyecto educativo de doce años responde a las características propias de cada edad y a los intereses de los alumnos.",
  items: [
    {
      index: "01",
      grades: "1° – 4° Grado",
      title: "Elementary",
      text: "Formamos hábitos de laboriosidad, orden y amistad. Basados en aprendizaje cooperativo y proyectos, desarrollamos alumnos lectores con gusto por las matemáticas y las artes.",
      image: {
        src: "/img/elementary.jpg",
        alt: "Alumnos de Elementary en Colegio Altamira La Cima",
      },
      href: "#contacto",
    },
    {
      index: "02",
      grades: "5° – 9° Grado",
      title: "Middle School",
      text: "Etapa de consolidación académica con enfoque en pensamiento crítico, trabajo en equipo y desarrollo de habilidades socioemocionales para la adolescencia.",
      image: {
        src: "/img/middle.jpg",
        alt: "Alumnos de Middle School en Colegio Altamira La Cima",
      },
      href: "#contacto",
    },
    {
      index: "03",
      grades: "10° – 12° Grado",
      title: "High School",
      text: "Preparación universitaria con proyectos de alto impacto, orientación vocacional personalizada y formación en liderazgo para jóvenes protagonistas.",
      image: {
        src: "/img/high.jpg",
        alt: "Alumnos de High School en Colegio Altamira La Cima",
      },
      href: "#contacto",
    },
  ],
} as const;

export const community = {
  label: "Nuestra Comunidad",
  title: "Formación que trasciende",
  subtitle: "Cuatro pilares que sostienen nuestra comunidad educativa.",
  items: [
    {
      index: "01",
      /** Drop-cap letter, rendered in the display serif. */
      dropCap: "P",
      title: "Padres, Primeros Formadores",
      text: "La familia es la fuente de toda virtud, lugar de encuentro y escuela de valores por naturaleza. Es en casa donde se adquieren los aprendizajes que habilitan para la vida.",
    },
    {
      index: "02",
      dropCap: "P",
      title: "Profesores como Mediadores",
      text: "El docente es un experto que diseña clases únicas y significativas. Cada profesor tiene un plan de desarrollo personal con programas de coaching y mentoría.",
    },
    {
      index: "03",
      dropCap: "A",
      title: "Alumnos como Protagonistas",
      text: "El alumno es una persona única e irrepetible. Con preceptores y la familia, elaboramos un plan de desarrollo personal para formar personas libres y felices.",
    },
    {
      index: "04",
      dropCap: "A",
      title: "Alumni Comprometidos",
      text: "Son todos aquellos que ya pasaron por nuestro colegio y hoy se comprometen con nuestra labor formativa, siendo generadores de cambio y embajadores institucionales.",
    },
  ],
} as const;

export type FacilityIcon = "ball" | "flask" | "book" | "laptop";

export const facilities = {
  label: "Campus",
  title: "Nuestras instalaciones",
  subtitle:
    "Un entorno diseñado para inspirar el aprendizaje y el desarrollo integral.",
  badge: { value: "10,000+", number: 10000, suffix: "+", label: "m² de campus" },
  showcase: {
    title: "Campus La Cima",
    text: "Más de 10,000 m² de áreas verdes, canchas deportivas, laboratorios de ciencias y tecnología, y espacios diseñados para cada nivel educativo.",
    image: {
      src: "/img/instalaciones.jpg",
      alt: "Vista aérea del campus de Colegio Altamira La Cima",
    },
  },
  features: [
    { title: "Canchas Deportivas", icon: "ball" as FacilityIcon },
    { title: "Laboratorios", icon: "flask" as FacilityIcon },
    { title: "Biblioteca", icon: "book" as FacilityIcon },
    { title: "Sala de Cómputo", icon: "laptop" as FacilityIcon },
  ],
} as const;

export const admissionsCta = {
  label: "Admisiones Abiertas",
  titleLines: ["¿Listo para conocer", "el modelo Altamira?"],
  primary: { label: "Agenda una cita", href: "#contacto" },
  secondary: {
    label: `Llámanos: ${contact.primaryPhone.label}`,
    href: contact.primaryPhone.href,
  },
} as const;

export const contactSection = {
  label: "Contacto",
  title: "Contáctanos",
  subtitle:
    "Estamos listos para resolver tus dudas y acompañarte en el proceso de admisión.",
  infoTitle: "Información de contacto",
  infoText:
    "Agenda una cita para conocer nuestras instalaciones y modelo educativo. ¡Te esperamos!",
  formTitle: "Envíanos un mensaje",
} as const;

/** Hero acts. Order defines the pinned scroll narrative and the 00/02 counter. */
export const heroActs: ReadonlyArray<{
  eyebrow: string;
  title: string;
  lines: ReadonlyArray<string>;
  cta?: { label: string; href: string };
}> = [
  {
    eyebrow: "Zapopan, Jalisco",
    title: "Altamira",
    lines: [
      "Formación integral centrada en la persona,",
      "en el corazón de Zapopan, Jalisco.",
    ],
  },
  {
    eyebrow: "Modelo Educativo",
    title: "Formación",
    lines: [
      "Cuerpo, corazón, inteligencia y voluntad:",
      "una educación que forma el carácter completo.",
    ],
  },
  {
    eyebrow: "Admisiones Abiertas",
    title: "Futuro",
    lines: [
      "Protagonistas de su propio aprendizaje,",
      "listos para transformar el mundo.",
    ],
    cta: { label: "Agenda una cita", href: "#contacto" },
  },
];

export const footer = {
  columns: [
    {
      title: "Sitios de interés",
      links: [
        { label: "HighSights", href: portals.highsights },
        { label: "Colmenares", href: "http://www.colmenares.org.mx/" },
        { label: "Opus Dei", href: "https://opusdei.org/es-mx/" },
        {
          label: "Capellanía",
          href: "https://sites.google.com/altamira.edu.mx/capellanalacima/inicio",
        },
      ],
    },
    {
      title: "Avisos de Privacidad",
      links: [
        // TODO: sustituir "#" por las URLs reales de cada aviso de privacidad.
        { label: "Protección al menor", href: "#" },
        { label: "Acuerdo de servicios educativos", href: "#" },
        { label: "Padres y alumnos", href: "#" },
        { label: "Empleados y candidatos", href: "#" },
        { label: "Proveedores y terceros", href: "#" },
      ],
    },
    {
      title: "Protección al Menor",
      links: [
        // TODO: sustituir "#" por la URL real de la política de protección.
        { label: "Política de protección", href: "#" },
        { label: "Denuncias", href: `mailto:${contact.childProtectionEmail}` },
      ],
    },
  ],
} as const;
