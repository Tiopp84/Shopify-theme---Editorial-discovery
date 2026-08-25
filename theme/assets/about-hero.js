class AboutHeroController {
  constructor(section) {
    this.section = section;
    this.slides = [...section.querySelectorAll('[data-about-hero-slide]')];
    this.stage = section.querySelector('.about-hero__slides');
    this.previousButton = section.querySelector('[data-about-hero-previous]');
    this.nextButton = section.querySelector('[data-about-hero-next]');
    this.current = section.querySelector('[data-about-hero-current]');
    this.index = 0;
    this.stagePointer = null;
    this.dragTarget = null;
    this.dragDirection = null;
    this.isTransitioning = false;
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
    this.onStagePointerDown = (event) => this.startStageSwipe(event);
    this.onStagePointerMove = (event) => this.moveStageSwipe(event);
    this.onStagePointerUp = (event) => this.endStageSwipe(event);
    this.onStagePointerCancel = () => this.cancelStageSwipe();
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
    this.stage?.addEventListener('pointerdown', this.onStagePointerDown);
    this.stage?.addEventListener('pointermove', this.onStagePointerMove);
    this.stage?.addEventListener('pointerup', this.onStagePointerUp);
    this.stage?.addEventListener('pointercancel', this.onStagePointerCancel);
    this.reducedMotion.addEventListener('change', this.onMotionChange);
    this.handleMotionPreference();
  }

  handleMotionPreference() {
    this.observer?.disconnect();
    this.observer = null;
    this.section.classList.remove('about-hero--motion-enabled', 'is-revealed');
    this.stopAutoplay();

    if (this.reducedMotion.matches) return;

    // Autoplay is independent of the optional viewport reveal animation.
    this.startAutoplay();

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
  }

  startStageSwipe(event) {
    if (event.pointerType !== 'touch' || this.slides.length < 2 || this.isTransitioning) return;
    this.stagePointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
    this.stage?.setPointerCapture?.(event.pointerId);
  }

  moveStageSwipe(event) {
    const pointer = this.stagePointer;
    if (!pointer || pointer.id !== event.pointerId) return;
    const deltaX = event.clientX - pointer.x;
    const deltaY = event.clientY - pointer.y;
    if (Math.abs(deltaX) <= Math.abs(deltaY)) return;
    event.preventDefault();
    const direction = deltaX < 0 ? 1 : -1;
    const target = this.prepareDragPreview(direction);
    const distance = Math.max(this.stage?.clientWidth || 0, 1);
    this.setDragOffset(this.slides[this.index], deltaX);
    this.setDragOffset(target, direction * distance + deltaX);
  }

  endStageSwipe(event) {
    const pointer = this.stagePointer;
    this.stagePointer = null;
    if (!pointer || pointer.id !== event.pointerId) return;
    const deltaX = event.clientX - pointer.x;
    const deltaY = event.clientY - pointer.y;
    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) <= Math.abs(deltaY)) {
      this.snapBackStage();
      return;
    }
    this.commitStageSwipe(deltaX < 0 ? 1 : -1);
  }

  prepareDragPreview(direction) {
    if (this.dragTarget && this.dragDirection === direction) return this.dragTarget;
    this.clearDragPreview();
    const target = this.slides[(this.index + direction + this.slides.length) % this.slides.length];
    target.classList.add('is-drag-preview');
    target.style.opacity = '1';
    this.dragTarget = target;
    this.dragDirection = direction;
    return target;
  }

  setDragOffset(slide, offset) {
    if (!slide) return;
    slide.style.transition = 'none';
    slide.style.transform = `translate3d(${offset}px, 0, 0)`;
  }

  snapBackStage() {
    const source = this.slides[this.index];
    const target = this.dragTarget;
    [source, target].filter(Boolean).forEach((slide) => {
      slide.style.transition = 'transform 220ms cubic-bezier(.22, 1, .36, 1), opacity 220ms ease';
    });
    source?.style.removeProperty('transform');
    if (target) target.style.transform = `translate3d(${this.dragDirection * Math.max(this.stage?.clientWidth || 0, 1)}px, 0, 0)`;
    window.setTimeout(() => this.clearDragPreview(), 240);
  }

  commitStageSwipe(direction) {
    const source = this.slides[this.index];
    const target = this.dragTarget || this.prepareDragPreview(direction);
    if (!source || !target) return;
    this.isTransitioning = true;
    const distance = Math.max(this.stage?.clientWidth || 0, 1);
    [source, target].forEach((slide) => { slide.style.transition = 'transform 380ms cubic-bezier(.22, 1, .36, 1), opacity 380ms ease'; });
    source.style.transform = `translate3d(${-direction * distance}px, 0, 0)`;
    target.style.transform = 'translate3d(0, 0, 0)';
    window.setTimeout(() => {
      source.classList.remove('is-active');
      target.classList.add('is-active');
      this.index = this.slides.indexOf(target);
      this.slides.forEach((slide, index) => { slide.setAttribute('aria-hidden', String(index !== this.index)); slide.inert = index !== this.index; });
      if (this.current) this.current.textContent = String(this.index + 1);
      this.clearDragPreview();
      this.isTransitioning = false;
      this.startAutoplay();
    }, 400);
  }

  clearDragPreview() {
    this.slides.forEach((slide) => {
      if (!slide.classList.contains('is-drag-preview') && !slide.style.transform) return;
      slide.classList.remove('is-drag-preview');
      slide.style.removeProperty('transition');
      slide.style.removeProperty('transform');
      slide.style.removeProperty('opacity');
    });
    this.dragTarget = null;
    this.dragDirection = null;
  }

  cancelStageSwipe() {
    this.stagePointer = null;
    this.snapBackStage();
  }

  activate(nextIndex, userInitiated = false) {
    if (this.slides.length < 2 || this.isTransitioning) return;
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
    window.clearTimeout(this.timer);
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
    this.stage?.removeEventListener('pointerdown', this.onStagePointerDown);
    this.stage?.removeEventListener('pointermove', this.onStagePointerMove);
    this.stage?.removeEventListener('pointerup', this.onStagePointerUp);
    this.stage?.removeEventListener('pointercancel', this.onStagePointerCancel);
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
