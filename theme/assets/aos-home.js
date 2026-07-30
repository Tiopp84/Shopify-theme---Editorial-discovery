class AOSHome {
  constructor() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.classList.add('aos-enabled');
    document.body.dataset.aosDuration = '400';
    this.defaultDuration = 400;
    this.scrollVelocity = 0;
    this.lastScrollPosition = window.scrollY;
    this.lastScrollTime = performance.now();
    this.queue = [];
    this.isAnimating = false;
    this.isReady = false;
    this.sections = new Set();
    this.productStages = new Set();
    this.registerSections(document);

    // The hero is intentionally the sole initial animation. The inline head
    // bootstrap prepared its AOS state before body paint; two frames guarantee
    // the browser paints that state before adding `aos-animate`.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      this.isReady = true;
      this.queueHero();
      this.flushQueue();
    }));

    this.onScroll = () => {
      const now = performance.now();
      const position = window.scrollY;
      const elapsed = Math.max(now - this.lastScrollTime, 16);
      const velocity = Math.abs(position - this.lastScrollPosition) / elapsed;
      this.scrollVelocity = this.scrollVelocity * 0.65 + velocity * 0.35;
      this.lastScrollPosition = position;
      this.lastScrollTime = now;
      this.scheduleEvaluation();
    };
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', () => this.scheduleEvaluation());
    document.addEventListener('shopify:section:load', (event) => this.registerSections(event.target));
    document.addEventListener('shopify:section:reorder', () => this.registerSections(document));
    window.aosHomeBoot?.release();
  }

  registerSections(scope) {
    const sections = [];
    if (scope.matches?.('[data-aos-section]')) sections.push(scope);
    sections.push(...scope.querySelectorAll?.('[data-aos-section]') || []);
    sections.forEach((section) => {
      if (!section.dataset.aosState) this.sections.add(section);
      section.querySelectorAll('[data-aos-products], [data-aos-product-item], [data-aos-item]').forEach((stage) => {
        if (!stage.dataset.aosState) this.productStages.add(stage);
      });
    });
  }

  queueHero() {
    const hero = [...this.sections].find((section) => section.matches('.editorial-hero'));
    if (hero && this.isVisible(hero)) {
      hero.classList.add('editorial-hero--media-settled');
      this.queueSection(hero);
    }
  }

  scheduleEvaluation() {
    if (this.evaluationPending) return;
    this.evaluationPending = true;
    requestAnimationFrame(() => {
      this.evaluationPending = false;
      this.sections.forEach((section) => {
        if (!section.dataset.aosState && this.isReady && this.hasReachedTriggerLine(section)) this.queueSection(section);
      });
      this.productStages.forEach((stage) => {
        const section = stage.closest('[data-aos-section]');
        if (!stage.dataset.aosState && section?.dataset.aosState === 'animated' && this.hasReachedTriggerLine(stage)) this.queueProductStage(stage);
      });
      this.revealQueuedStagesInView();
    });
  }

  hasReachedTriggerLine(section) {
    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    if (rect.bottom <= 0 || rect.top >= viewportHeight) return false;
    // Downward entry uses the section's top; upward entry uses its bottom.
    // In both directions, 40% of the viewport remains clear before it runs.
    return rect.top >= 0
      ? rect.top <= viewportHeight * 0.6
      : rect.bottom >= viewportHeight * 0.4;
  }

  isVisible(section) {
    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    return rect.bottom > 0 && rect.top < viewportHeight;
  }

  queueSection(section) {
    this.queueStage('section', section);
  }

  queueProductStage(stage) {
    this.queueStage('products', stage);
  }

  queueStage(type, element) {
    if (element.dataset.aosState) return;
    element.dataset.aosState = 'queued';
    const duration = this.getDuration();
    if (this.isFastScroll()) {
      this.animateStage(type, element, duration);
      return;
    }
    this.queue.push({ type, element, duration });
    this.flushQueue();
  }

  getDuration() {
    if (this.scrollVelocity >= 0.65) return 350;
    return this.defaultDuration;
  }

  isFastScroll() {
    return this.scrollVelocity >= 0.65;
  }

  revealQueuedStagesInView() {
    if (!this.isFastScroll()) return;
    const pending = this.queue.filter((stage) => this.isVisible(stage.element));
    this.queue = this.queue.filter((stage) => !this.isVisible(stage.element));
    pending.forEach((stage) => this.animateStage(stage.type, stage.element, 350));
  }

  flushQueue() {
    if (!this.isReady || this.isAnimating || this.queue.length === 0) return;
    const { type, element, duration } = this.queue.shift();
    if (!this.isVisible(element)) {
      delete element.dataset.aosState;
      this.flushQueue();
      return;
    }
    this.isAnimating = true;
    this.animateStage(type, element, duration, () => {
      this.isAnimating = false;
      this.scheduleEvaluation();
      this.flushQueue();
    });
  }

  animateStage(type, element, duration, onComplete) {
    if (element.dataset.aosState === 'animated') return;
    element.dataset.aosState = 'animated';

    const candidates = [];
    if (element.matches('[data-aos]')) candidates.push(element);
    candidates.push(...element.querySelectorAll('[data-aos]'));
    const targets = candidates.filter((target) => {
      if (type === 'products') return true;
      return !target.closest('[data-aos-products], [data-aos-product-item], [data-aos-item]');
    });
    const maxDelay = Math.max(0, ...targets.map((target) => Number(target.dataset.aosDelay) || 0));
    targets.forEach((target) => {
      target.dataset.aosDuration = duration;
      target.classList.add('aos-animate');
    });

    window.setTimeout(() => {
      targets.forEach((target) => {
        target.removeAttribute('data-aos');
        target.removeAttribute('data-aos-delay');
        target.removeAttribute('data-aos-duration');
      });
      this.scheduleEvaluation();
      onComplete?.();
    }, duration + maxDelay + 80);
  }
}

if (!window.aosHome) window.aosHome = new AOSHome();
