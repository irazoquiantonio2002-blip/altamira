import fs from "node:fs";
import path from "node:path";

/**
 * The loading screen: the Altamira La Cima mark drawing itself, with a
 * spinner under it.
 *
 * The logo is read from the real brand file and inlined into the document, so
 * it paints with the first frame of HTML — a loading screen that has to wait
 * for its own image request would show an empty page for exactly the moment it
 * exists to cover. Inlining also lets CSS reach the individual paths, which is
 * what makes the drawing possible at all.
 *
 * The mark is a set of filled shapes, not outlines, so the draw works in two
 * passes: each path is first stroked along its own outline with a dash the
 * length of the path, then its fill fades in behind the finished line. That
 * reads as the logo being written and then inked.
 *
 * Everything animates in CSS, with no JavaScript involved, so the animation is
 * already running before React has hydrated. `LoaderDismiss` only takes it
 * away.
 */

/** Read at build time — these pages are all statically generated. */
function brandMark() {
  let svg = fs.readFileSync(
    path.join(process.cwd(), "public/img/logos/logo_altamira_lacima_navy.svg"),
    "utf8",
  );

  // Valid at the top of a standalone .svg file, invalid inside an HTML
  // document.
  svg = svg
    .replace(/<\?xml[\s\S]*?\?>/g, "")
    .replace(/<!DOCTYPE[\s\S]*?>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    // The exported stylesheet only sets the brand fill, which the loader's own
    // CSS has to control. Dropping it also keeps its very generic `.fil0` and
    // `.fil1` class names out of the page.
    .replace(/<defs>[\s\S]*?<\/defs>/g, "")
    // Fixed px width/height would pin the mark at its export size; the viewBox
    // is what the layout needs.
    .replace(/\s(?:width|height)="[^"]*"/g, "")
    .trim();

  const total = (svg.match(/<path\b/g) ?? []).length;

  // `pathLength="1"` normalises every path, however long its real outline is,
  // so a single `stroke-dasharray: 1` draws each one end to end.
  //
  // The index counts down: the shield is last in the exported file but sits
  // furthest left, and the stagger should run the way the mark is read.
  let i = 0;
  svg = svg.replace(
    /<path\b/g,
    () => `<path pathLength="1" style="--i:${total - 1 - i++}"`,
  );

  return svg;
}

export function BrandLoader() {
  return (
    <>
      {/* Without scripting nothing can ever take the screen away, so it must
          not be there in the first place. */}
      <noscript>
        <style>{`#brand-loader{display:none!important}`}</style>
      </noscript>

      <div id="brand-loader" className="brand-loader" role="status">
        <div
          className="brand-loader__mark"
          aria-hidden="true"
          // Build-time read of a file in this repository; no input reaches it.
          dangerouslySetInnerHTML={{ __html: brandMark() }}
        />
        {/* Drawn as an SVG rather than a bordered box: the global
            square-corner rule lives in a cascade layer, and a layered
            `!important` beats an unlayered one, so no `border-radius`
            here could ever round a div. */}
        <svg
          className="brand-loader__spinner"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="brand-loader__track" cx="12" cy="12" r="10" />
          <circle
            className="brand-loader__arc"
            cx="12"
            cy="12"
            r="10"
            pathLength={1}
          />
        </svg>
        <span className="sr-only">Cargando…</span>
      </div>
    </>
  );
}
