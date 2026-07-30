class AOSHome {
  constructor() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.classList.add('aos-enabled');
    document.body.dataset.aosDuration = '400';
    this.defaultDuration = 400;
    this.scrollVelocity = 0;
    this.lastScrollPosition = window.scrollY;
    this.lastScrollTime = performance.now();
    this.timers = new Map();
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
    document.addEventListener('shopify:section:load', (event) => {
      this.unregisterSections(event.target);
      this.registerSections(event.target);
      this.scheduleEvaluation();
    });
    document.addEventListener('shopify:section:unload', (event) => this.unregisterSections(event.target));
    document.addEventListener('shopify:section:reorder', () => {
      this.registerSections(document);
      this.scheduleEvaluation();
    });
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

  unregisterSections(scope) {
    const contains = (element) => scope === element || scope.contains?.(element);
    this.sections.forEach((section) => {
      if (!contains(section)) return;
      delete section.dataset.aosState;
      this.sections.delete(section);
    });
    this.productStages.forEach((stage) => {
      if (!contains(stage)) return;
      delete stage.dataset.aosState;
      this.productStages.delete(stage);
    });
    this.timers.forEach((timer, element) => {
      if (!contains(element)) return;
      window.clearTimeout(timer);
      this.timers.delete(element);
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
    this.animateStage(type, element, this.scrollVelocity >= 0.65 ? 350 : this.defaultDuration);
  }

  animateStage(type, element, duration) {
    if (element.dataset.aosState === 'animated' || element.dataset.aosState === 'animating') return;
    element.dataset.aosState = 'animating';

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

    const timer = window.setTimeout(() => {
      this.timers.delete(element);
      targets.forEach((target) => {
        target.removeAttribute('data-aos');
        target.removeAttribute('data-aos-delay');
        target.removeAttribute('data-aos-duration');
      });
      element.dataset.aosState = 'animated';
      this.scheduleEvaluation();
    }, duration + maxDelay + 80);
    this.timers.set(element, timer);
  }
}

if (!window.aosHome) window.aosHome = new AOSHome();
