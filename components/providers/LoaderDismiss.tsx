"use client";

import { useEffect } from "react";

/** Long enough for the mark to finish drawing and be read as finished.
 *  The last path finishes inking at ~2.8s, so this clears it. */
const MIN_MS = 2900;
/** A slow asset must never be able to trap the visitor behind the screen. */
const MAX_MS = 6000;
/** Matches the fade in `.brand-loader` in globals.css. */
const FADE_MS = 700;

/**
 * Takes the loading screen away once the page is actually ready.
 *
 * Ready means both: the window has loaded, so nothing pops in underneath the
 * moment the screen lifts, and the mark has had time to finish drawing, so the
 * animation is never cut off mid-stroke on a fast connection. A hard cap
 * covers the case where some asset never arrives.
 *
 * `performance.now()` is measured from the navigation itself, not from this
 * effect, so the minimum covers the whole load rather than restarting at
 * hydration.
 */
export function LoaderDismiss() {
  useEffect(() => {
    const el = document.getElementById("brand-loader");
    if (!el) return;

    let settle: number | undefined;
    let cap: number | undefined;
    let remove: number | undefined;
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      window.clearTimeout(settle);
      window.clearTimeout(cap);
      window.removeEventListener("load", onLoad);
      el.classList.add("is-done");
      // Kept in the DOM until the fade has played, then taken out of the
      // layer tree entirely.
      remove = window.setTimeout(() => el.classList.add("is-gone"), FADE_MS);
    };

    const onLoad = () => {
      settle = window.setTimeout(finish, Math.max(0, MIN_MS - performance.now()));
    };

    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad);

    cap = window.setTimeout(finish, Math.max(0, MAX_MS - performance.now()));

    return () => {
      window.clearTimeout(settle);
      window.clearTimeout(cap);
      window.clearTimeout(remove);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return null;
}
