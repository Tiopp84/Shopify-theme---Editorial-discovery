class AboutRevealController {
  constructor(section) {
    this.section = section;
    this.observer = null;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.onMotionChange = () => this.refresh();
  }

  init() {
    this.reducedMotion.addEventListener('change', this.onMotionChange);
    this.refresh();
  }

  refresh() {
    this.observer?.disconnect();
    this.observer = null;
    this.section.classList.remove('about-story--motion-enabled', 'about-values--motion-enabled', 'about-closing--motion-enabled', 'is-revealed');
    if (this.reducedMotion.matches) return;

    if (!('IntersectionObserver' in window)) {
      this.reveal();
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      this.reveal();
      this.observer?.disconnect();
      this.observer = null;
    }, { threshold: 0.18 });
    this.observer.observe(this.section);
  }

  reveal() {
    if (this.section.classList.contains('about-story')) this.section.classList.add('about-story--motion-enabled');
    if (this.section.classList.contains('about-values')) this.section.classList.add('about-values--motion-enabled');
    if (this.section.classList.contains('about-closing')) this.section.classList.add('about-closing--motion-enabled');
    void this.section.offsetWidth;
    this.section.classList.add('is-revealed');
  }

  destroy() {
    this.observer?.disconnect();
    this.reducedMotion.removeEventListener('change', this.onMotionChange);
  }
}

class AboutRevealRegistry {
  constructor() {
    this.instances = new Map();
    this.initAll(document);
    document.addEventListener('shopify:section:load', (event) => this.initAll(event.target));
    document.addEventListener('shopify:section:unload', (event) => this.destroy(event.target));
  }

  initAll(root) {
    root.querySelectorAll?.('[data-about-reveal]').forEach((section) => {
      if (this.instances.has(section)) return;
      const controller = new AboutRevealController(section);
      controller.init();
      this.instances.set(section, controller);
    });
  }

  destroy(root) {
    root.querySelectorAll?.('[data-about-reveal]').forEach((section) => {
      const controller = this.instances.get(section);
      controller?.destroy();
      this.instances.delete(section);
    });
  }
}

if (!window.aboutRevealRegistry) window.aboutRevealRegistry = new AboutRevealRegistry();
