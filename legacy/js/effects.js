/* ============================================
   ALTAMIRA LA CIMA - Premium Interaction Effects
   Spotlight cards, magnetic buttons, marquee clone
   ============================================ */

class PremiumEffects {
  constructor() {
    this.isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    this.init();
  }

  init() {
    this.initSpotlightCards();
    this.initMagneticButtons();
    this.cloneMarquees();
  }

  /* ── Cursor-tracked radial glow on .spotlight-card ── */
  initSpotlightCards() {
    if (this.isCoarsePointer) return;

    document.querySelectorAll('.spotlight-card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
        card.style.setProperty('--y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
      });
    });
  }

  /* ── Buttons that gently follow the cursor ── */
  initMagneticButtons() {
    if (this.isCoarsePointer) return;

    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const rect = btn.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        btn.style.transition = 'transform 0.15s ease-out';
        btn.style.transform = `translate(${relX * 0.22}px, ${relY * 0.28}px)`;
      });

      btn.addEventListener('pointerleave', () => {
        btn.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ── Duplicate marquee track content for a seamless loop ── */
  cloneMarquees() {
    document.querySelectorAll('.marquee__track').forEach((track) => {
      if (track.dataset.cloned) return;
      const clone = track.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.parentElement.appendChild(clone);
      track.dataset.cloned = 'true';
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PremiumEffects();
});
