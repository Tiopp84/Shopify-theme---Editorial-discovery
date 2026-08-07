class AboutHeroController {
  constructor(section) {
    this.section = section;
    this.slides = [...section.querySelectorAll('[data-about-hero-slide]')];
    this.previousButton = section.querySelector('[data-about-hero-previous]');
    this.nextButton = section.querySelector('[data-about-hero-next]');
    this.current = section.querySelector('[data-about-hero-current]');
    this.index = 0;
    this.timer = null;
    this.transitionTimer = null;
    this.observer = null;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.onPrevious = () => this.activate(this.index - 1, true);
    this.onNext = () => this.activate(this.index + 1, true);
    this.onPointerEnter = () => this.stopAutoplay();
    this.onPointerLeave = () => this.startAutoplay();
    this.onFocusIn = () => this.stopAutoplay();
    this.onFocusOut = () => this.startAutoplay();
    this.onMotionChange = () => this.handleMotionPreference();
  }

  init() {
    if (!this.slides.length) return;

    this.slides.forEach((slide, index) => {
      const active = index === 0;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
      slide.inert = !active;
    });

    this.previousButton?.addEventListener('click', this.onPrevious);
    this.nextButton?.addEventListener('click', this.onNext);
    this.section.addEventListener('pointerenter', this.onPointerEnter);
    this.section.addEventListener('pointerleave', this.onPointerLeave);
    this.section.addEventListener('focusin', this.onFocusIn);
    this.section.addEventListener('focusout', this.onFocusOut);
    this.reducedMotion.addEventListener('change', this.onMotionChange);
    this.handleMotionPreference();
  }

  handleMotionPreference() {
    this.observer?.disconnect();
    this.observer = null;
    this.section.classList.remove('about-hero--motion-enabled', 'is-revealed');
    this.stopAutoplay();

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
    }, { threshold: 0.2 });
    this.observer.observe(this.section);
  }

  reveal() {
    this.section.classList.add('about-hero--motion-enabled');
    this.slides[this.index]?.classList.add('is-entering');
    void this.section.offsetWidth;
    this.section.classList.add('is-revealed');
    this.transitionTimer = window.setTimeout(() => {
      this.slides[this.index]?.classList.remove('is-entering');
      this.transitionTimer = null;
    }, 900);
    this.startAutoplay();
  }

  activate(nextIndex, userInitiated = false) {
    if (this.slides.length < 2) return;
    const next = (nextIndex + this.slides.length) % this.slides.length;
    if (next === this.index) return;

    const animate = this.section.classList.contains('about-hero--motion-enabled') && !this.reducedMotion.matches;
    const outgoing = this.slides[this.index];
    const direction = (next - this.index + this.slides.length) % this.slides.length === 1 ? 'next' : 'previous';
    window.clearTimeout(this.transitionTimer);
    this.slides.forEach((slide, index) => {
      slide.classList.remove('is-entering', 'is-leaving', 'is-next', 'is-previous');
      if (index !== this.index) slide.classList.remove('is-active');
    });
    if (animate) this.section.classList.remove('is-revealed');

    this.index = next;
    this.slides.forEach((slide, index) => {
      const active = index === this.index;
      slide.setAttribute('aria-hidden', String(!active));
      slide.inert = !active;
      if (active) slide.classList.add('is-active');
    });
    if (this.current) this.current.textContent = String(this.index + 1);

    if (animate) {
      outgoing.classList.add('is-leaving', `is-${direction}`);
      this.slides[this.index].classList.add('is-entering', `is-${direction}`);
      void this.section.offsetWidth;
      this.section.classList.add('is-revealed');
      this.transitionTimer = window.setTimeout(() => {
        outgoing.classList.remove('is-active', 'is-leaving', `is-${direction}`);
        this.slides[this.index]?.classList.remove('is-entering', `is-${direction}`);
        this.transitionTimer = null;
      }, 820);
    } else {
      outgoing.classList.remove('is-active');
    }
    this.startAutoplay();
  }

  startAutoplay() {
    this.stopAutoplay();
    if (this.reducedMotion.matches || this.slides.length < 2 || this.section.dataset.autoplay !== 'true') return;
    const delay = Number(this.section.dataset.autoplayDelay) || 7000;
    this.timer = window.setTimeout(() => this.activate(this.index + 1), delay);
  }

  stopAutoplay() {
    if (!this.timer) return;
    window.clearInterval(this.timer);
    this.timer = null;
  }

  destroy() {
    this.stopAutoplay();
    window.clearTimeout(this.transitionTimer);
    this.observer?.disconnect();
    this.previousButton?.removeEventListener('click', this.onPrevious);
    this.nextButton?.removeEventListener('click', this.onNext);
    this.section.removeEventListener('pointerenter', this.onPointerEnter);
    this.section.removeEventListener('pointerleave', this.onPointerLeave);
    this.section.removeEventListener('focusin', this.onFocusIn);
    this.section.removeEventListener('focusout', this.onFocusOut);
    this.reducedMotion.removeEventListener('change', this.onMotionChange);
    this.section.classList.remove('about-hero--motion-enabled', 'is-revealed');
  }
}

class AboutHeroRegistry {
  constructor() {
    this.instances = new Map();
    this.initAll(document);
    document.addEventListener('shopify:section:load', (event) => this.initAll(event.target));
    document.addEventListener('shopify:section:unload', (event) => this.destroy(event.target));
  }

  initAll(root) {
    root.querySelectorAll?.('[data-about-hero]').forEach((section) => {
      if (this.instances.has(section)) return;
      const controller = new AboutHeroController(section);
      controller.init();
      this.instances.set(section, controller);
    });
  }

  destroy(root) {
    root.querySelectorAll?.('[data-about-hero]').forEach((section) => {
      const controller = this.instances.get(section);
      controller?.destroy();
      this.instances.delete(section);
    });
  }
}

if (!window.aboutHeroRegistry) window.aboutHeroRegistry = new AboutHeroRegistry();
