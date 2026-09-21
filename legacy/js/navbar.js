/* ============================================
   ALTAMIRA LA CIMA - Navbar Controller
   Scroll effects, dropdowns, mobile menu
   ============================================ */

class NavbarController {
  constructor() {
    this.navbar = document.getElementById('navbar-main');
    this.toggle = document.querySelector('.navbar__toggle');
    this.mobileMenu = document.querySelector('.navbar__mobile');
    this.mobileOverlay = document.querySelector('.navbar__mobile-overlay');
    this.mobileItems = document.querySelectorAll('.navbar__mobile-item');
    
    if (!this.navbar) return;
    
    this.isScrolled = false;
    this.isMobileOpen = false;
    
    this.init();
  }

  init() {
    this.bindScrollEffect();
    this.bindHideOnScroll();
    this.bindMobileMenu();
    this.bindMobileDropdowns();
    this.bindSmoothScroll();
  }

  /* ── Hide on scroll-down, reveal on scroll-up ──
     Independent of bindScrollEffect's background toggle — this only
     ever translates the bar off/on screen, everywhere on the page
     (including through the hero's pinned scroll, since window.scrollY
     advances normally there too). */
  bindHideOnScroll() {
    let lastY = window.scrollY;
    let ticking = false;
    const revealThreshold = 80;
    const minDelta = 6; // ignore tiny jitter (trackpad momentum, etc.) so it doesn't flicker

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const delta = currentY - lastY;

          if (Math.abs(delta) > minDelta) {
            if (currentY > revealThreshold && delta > 0) {
              this.navbar.classList.add('nav-hidden');
            } else {
              this.navbar.classList.remove('nav-hidden');
            }
            lastY = currentY;
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── Scroll glassmorphism effect ──
     Skipped when the page has a pinned cosmos hero (js/hero-cosmos.js) —
     that hero owns the navbar's transparent/opaque state itself, since
     only it knows when its scroll-jacked pin has actually been cleared
     (raw scrollY crosses 50px almost immediately, long before the pin
     releases, which would flash the glass background mid-hero). */
  bindScrollEffect() {
    if (document.querySelector('.hero__pin')) return;

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;

          if (scrollY > 50 && !this.isScrolled) {
            this.navbar.classList.add('scrolled');
            this.isScrolled = true;
          } else if (scrollY <= 50 && this.isScrolled) {
            this.navbar.classList.remove('scrolled');
            this.isScrolled = false;
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── Mobile menu toggle ── */
  bindMobileMenu() {
    if (!this.toggle || !this.mobileMenu) return;

    this.toggle.addEventListener('click', () => {
      this.isMobileOpen = !this.isMobileOpen;
      
      this.toggle.classList.toggle('active', this.isMobileOpen);
      this.mobileMenu.classList.toggle('active', this.isMobileOpen);
      
      if (this.mobileOverlay) {
        this.mobileOverlay.classList.toggle('active', this.isMobileOpen);
      }
      
      document.body.style.overflow = this.isMobileOpen ? 'hidden' : '';
    });

    /* Close on overlay click */
    if (this.mobileOverlay) {
      this.mobileOverlay.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    }
  }

  closeMobileMenu() {
    this.isMobileOpen = false;
    this.toggle.classList.remove('active');
    this.mobileMenu.classList.remove('active');
    
    if (this.mobileOverlay) {
      this.mobileOverlay.classList.remove('active');
    }
    
    document.body.style.overflow = '';
  }

  /* ── Mobile dropdown accordions ── */
  bindMobileDropdowns() {
    this.mobileItems.forEach(item => {
      const link = item.querySelector('.navbar__mobile-link');
      const dropdown = item.querySelector('.navbar__mobile-dropdown');
      
      if (link && dropdown) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          
          /* Close other open items */
          this.mobileItems.forEach(other => {
            if (other !== item) {
              other.classList.remove('open');
            }
          });
          
          item.classList.toggle('open');
        });
      }
    });
  }

  /* ── Smooth scroll for anchor links ──
     Offset from the fixed navbar comes from `scroll-margin-top` in
     main.css, so every scroll path (this handler, native hash links,
     browser history) honors the same single value. */
  bindSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          this.closeMobileMenu();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
}

/* Initialize */
document.addEventListener('DOMContentLoaded', () => {
  new NavbarController();
});
