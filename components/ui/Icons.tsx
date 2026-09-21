import type { SVGProps } from "react";
import type { FacilityIcon, PillarIcon, SocialIcon } from "@/lib/site-data";

/**
 * Inline SVG icon set.
 *
 * Replaces the Font Awesome CDN stylesheet the previous site loaded: that was
 * a render-blocking request plus a webfont for what amounts to a dozen
 * glyphs. These ship in the HTML, cost nothing extra, and inherit
 * `currentColor`.
 */

const stroke: SVGProps<SVGSVGElement> = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
};

export function PillarIconGlyph({
  name,
  className = "size-6",
}: {
  name: PillarIcon;
  className?: string;
}) {
  const paths: Record<PillarIcon, React.ReactNode> = {
    person: (
      <>
        <circle cx="12" cy="7.5" r="3.5" />
        <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
      </>
    ),
    heart: (
      <path d="M12 20s-7-4.4-7-9.2A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7 2.8C19 15.6 12 20 12 20Z" />
    ),
    cross: (
      <>
        <path d="M12 3v18" />
        <path d="M6.5 8.5h11" />
      </>
    ),
    balance: (
      <>
        <path d="M12 4v16" />
        <path d="M5 8h14" />
        <path d="M5 8 2.5 14h5L5 8Z" />
        <path d="M19 8l-2.5 6h5L19 8Z" />
      </>
    ),
  };

  return (
    <svg {...stroke} className={className} aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export function FacilityIconGlyph({
  name,
  className = "size-6",
}: {
  name: FacilityIcon;
  className?: string;
}) {
  const paths: Record<FacilityIcon, React.ReactNode> = {
    ball: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 3.5 9 8l1.5 4.5h3L15 8l-3-4.5ZM3.6 10.2 7.6 12M20.4 10.2 16.4 12M7.5 19.5 10.5 16M16.5 19.5 13.5 16" />
      </>
    ),
    flask: (
      <>
        <path d="M9.5 3v6L4.8 17.4A2 2 0 0 0 6.6 20.5h10.8a2 2 0 0 0 1.8-3.1L14.5 9V3" />
        <path d="M8.5 3h7M7.2 14.5h9.6" />
      </>
    ),
    book: (
      <>
        <path d="M4 5.5A2 2 0 0 1 6 3.5h5v16H6a2 2 0 0 0-2 2v-16Z" />
        <path d="M20 5.5a2 2 0 0 0-2-2h-5v16h5a2 2 0 0 1 2 2v-16Z" />
      </>
    ),
    laptop: (
      <>
        <rect x="4" y="5" width="16" height="10.5" rx="1.5" />
        <path d="M2.5 19h19" />
      </>
    ),
  };

  return (
    <svg {...stroke} className={className} aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export function SocialIconGlyph({
  name,
  className = "size-4",
}: {
  name: SocialIcon;
  className?: string;
}) {
  // Brand marks are solid shapes, not strokes.
  const paths: Record<SocialIcon, React.ReactNode> = {
    facebook: (
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.7V3.6A21 21 0 0 0 14.3 3.5c-2.4 0-4 1.45-4 4.12V9.9H7.6V13h2.7v8h3.2Z" />
    ),
    instagram: (
      <path d="M12 2.2c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.62 2.16 15.24 2.16 12s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.18 8.8 2.2 12 2.2Zm0 1.8c-3.14 0-3.5.01-4.73.07-2.35.1-3.1 1.02-3.2 3.2C4.01 8.5 4 8.86 4 12s.01 3.5.07 4.73c.1 2.17.85 3.1 3.2 3.2 1.23.06 1.59.07 4.73.07s3.5-.01 4.73-.07c2.35-.1 3.1-1.03 3.2-3.2.06-1.23.07-1.59.07-4.73s-.01-3.5-.07-4.73c-.1-2.18-.85-3.1-3.2-3.2C15.5 4.01 15.14 4 12 4Zm0 3.14a4.86 4.86 0 1 1 0 9.72 4.86 4.86 0 0 1 0-9.72Zm0 8a3.14 3.14 0 1 0 0-6.28 3.14 3.14 0 0 0 0 6.28Zm5.06-8.2a1.14 1.14 0 1 1 0-2.27 1.14 1.14 0 0 1 0 2.27Z" />
    ),
    youtube: (
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
    ),
    x: (
      <path d="M17.2 3h3.3l-7.2 8.24L21.75 21h-6.6l-4.6-6.02L5.3 21H2l7.7-8.8L2.4 3h6.75l4.16 5.5L17.2 3Zm-1.15 16h1.83L7.03 4.88H5.06L16.05 19Z" />
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export function ArrowUpRight({ className = "size-4" }: { className?: string }) {
  return (
    <svg {...stroke} className={className} aria-hidden="true">
      <path d="M7 17 17 7M8.5 7H17v8.5" />
    </svg>
  );
}

export function ChevronDown({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg {...stroke} className={className} aria-hidden="true">
      <path d="m6 9.5 6 5.5 6-5.5" />
    </svg>
  );
}

export function MapPin({ className = "size-5" }: { className?: string }) {
  return (
    <svg {...stroke} className={className} aria-hidden="true">
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

export function Mail({ className = "size-5" }: { className?: string }) {
  return (
    <svg {...stroke} className={className} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  );
}

export function Phone({ className = "size-5" }: { className?: string }) {
  return (
    <svg {...stroke} className={className} aria-hidden="true">
      <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z" />
    </svg>
  );
}

export function WhatsApp({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.9.5 3.68 1.37 5.2L2 22l5.1-1.53a9.8 9.8 0 0 0 4.94 1.3h.01c5.43 0 9.84-4.4 9.84-9.84 0-2.63-1.02-5.1-2.88-6.96A9.77 9.77 0 0 0 12.04 2Zm0 18.04a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.1.93.94-3.02-.2-.31a8.15 8.15 0 0 1-1.25-4.36A8.2 8.2 0 0 1 12.05 3.7a8.15 8.15 0 0 1 8.17 8.16 8.2 8.2 0 0 1-8.18 8.18Zm4.48-6.12c-.24-.12-1.45-.72-1.67-.8-.23-.08-.39-.12-.55.12-.17.25-.64.8-.78.97-.15.16-.29.18-.53.06a6.7 6.7 0 0 1-3.34-2.92c-.25-.43.25-.4.72-1.33.08-.17.04-.31-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.47-.4-.4-.55-.41h-.47c-.16 0-.43.06-.65.3-.23.25-.86.84-.86 2.05 0 1.2.88 2.37 1 2.53.12.17 1.72 2.63 4.17 3.69 1.55.67 2.16.72 2.94.61.47-.07 1.45-.59 1.65-1.17.2-.57.2-1.06.15-1.16-.06-.11-.22-.17-.46-.29Z" />
    </svg>
  );
}
