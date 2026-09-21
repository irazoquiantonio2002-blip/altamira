/* ============================================
   ALTAMIRA LA CIMA - App Initialization
   Preloader, back-to-top, lazy loading
   ============================================ */

class App {
  constructor() {
    this.init();
  }

  init() {
    this.setupPreloader();
    this.setupBackToTop();
    this.setupLazyImages();
    this.setupCurrentYear();
    this.setupFormValidation();
  }

  /* ── Preloader ── */
  setupPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hidden');
        /* Allow body scroll */
        document.body.style.overflow = '';
      }, 800);
    });

    /* Prevent body scroll during preload */
    document.body.style.overflow = 'hidden';
  }

  /* ── Back to Top ── */
  setupBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Lazy Loading ── */
  setupLazyImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length === 0) return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  /* ── Current Year for Copyright ── */
  setupCurrentYear() {
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  /* ── Form Micro-Validation ── */
  setupFormValidation() {
    const form = document.querySelector('.contact__form');
    if (!form) return;

    const inputs = form.querySelectorAll('.contact__form-input, .contact__form-textarea');
    
    inputs.forEach(input => {
      /* Focus animation */
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
      });
      
      input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');
        if (input.value.trim()) {
          input.classList.add('has-value');
        } else {
          input.classList.remove('has-value');
        }
      });
    });

    /* Submit handler */
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('.contact__form-submit');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Enviando...';
      submitBtn.disabled = true;
      
      /* Simulate submission */
      setTimeout(() => {
        submitBtn.textContent = '¡Enviado! ✓';
        submitBtn.style.background = 'var(--color-success)';
        submitBtn.style.color = '#fff';
        
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
          submitBtn.style.color = '';
          form.reset();
        }, 3000);
      }, 1500);
    });
  }
}

/* Initialize */
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
