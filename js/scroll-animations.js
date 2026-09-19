/* ============================================
   ALTAMIRA LA CIMA - Scroll Animations Engine
   GSAP ScrollTrigger reveals, counters, parallax
   ============================================ */

class ScrollAnimations {
  constructor() {
    const gsapReady = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
    if (!gsapReady) {
      /* Fallback: no GSAP — just show everything, no animation */
      document.querySelectorAll('[data-reveal]').forEach((el) => { el.style.opacity = 1; });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    this.init();
  }

  init() {
    this.setupReveals();
    this.setupLineReveals();
    this.setupCounters();
    this.setupParallax();
  }

  /* ── Masked line-by-line heading reveal: .line-mask > .line-mask__inner ── */
  setupLineReveals() {
    const lines = document.querySelectorAll('.line-mask__inner');
    if (!lines.length) return;

    gsap.set(lines, { yPercent: 110 });

    lines.forEach((el, i) => {
      gsap.to(el, {
        yPercent: 0,
        duration: 1.1,
        delay: i * 0.08,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          once: true,
        },
      });
    });
  }

  /* ── Scroll reveals: data-reveal="up|down|left|right|scale" ── */
  setupReveals() {
    const presets = {
      up: { x: 0, y: 56 },
      down: { x: 0, y: -56 },
      left: { x: -56, y: 0 },
      right: { x: 56, y: 0 },
      scale: { x: 0, y: 24, scale: 0.92 },
    };

    document.querySelectorAll('[data-stagger]').forEach((group) => {
      group.querySelectorAll('[data-reveal]').forEach((el, i) => {
        el.dataset.revealDelay = (i * 0.1).toFixed(2);
      });
    });

    document.querySelectorAll('[data-reveal]').forEach((el) => {
      const type = el.getAttribute('data-reveal') || 'up';
      const from = presets[type] || presets.up;
      const delay = parseFloat(el.dataset.revealDelay || '0');

      gsap.fromTo(
        el,
        { opacity: 0, x: from.x, y: from.y, scale: from.scale || 1 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 1,
          delay,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        }
      );
    });
  }

  /* ── Counter Animation ── */
  setupCounters() {
    document.querySelectorAll('[data-counter]').forEach((el) => {
      const target = parseFloat(el.getAttribute('data-counter'));
      const suffix = el.getAttribute('data-counter-suffix') || '';
      const prefix = el.getAttribute('data-counter-prefix') || '';
      const counterObj = { val: 0 };

      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(counterObj, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = `${prefix}${Math.floor(counterObj.val).toLocaleString()}${suffix}`;
            },
          });
        },
      });
    });
  }

  /* ── Subtle scrub parallax: data-parallax-speed="0.3" ── */
  setupParallax() {
    document.querySelectorAll('[data-parallax-speed]').forEach((el) => {
      const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0.3;
      gsap.to(el, {
        yPercent: speed * 30,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('[data-parallax-container]') || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ScrollAnimations();
});
