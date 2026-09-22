/**
 * The responsive attributes `next/image` would produce, for the photographs
 * that have to stay a plain `<img>`.
 *
 * Most images on the site go through `next/image`. A handful cannot: the
 * scroll effects write the image's own `transform` every frame, or depend on
 * it being the direct child of a clipped or pinned box, and `next/image`
 * wraps the tag and manages its style. Those kept the plain tag — and with it
 * the full desktop original, which is how a phone ended up downloading 1.9MB
 * of photographs on the home page alone.
 *
 * This gives them the optimizer through its URL instead, so the browser picks
 * a file sized for its own screen. The same endpoint also content-negotiates
 * AVIF and WebP (see `images.formats` in next.config), so nothing extra is
 * needed to get the modern formats.
 *
 * The widths must be values Next is configured to serve — these are all from
 * its default `deviceSizes`, so a request for any of them is valid.
 */
const WIDTHS = [640, 828, 1080, 1920] as const;

export function responsiveImg(src: string, sizes: string, quality = 75) {
  const at = (w: number) =>
    `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=${quality}`;

  return {
    // The widest entry is the fallback for anything that ignores `srcSet`.
    src: at(1920),
    srcSet: WIDTHS.map((w) => `${at(w)} ${w}w`).join(", "),
    sizes,
  };
}
