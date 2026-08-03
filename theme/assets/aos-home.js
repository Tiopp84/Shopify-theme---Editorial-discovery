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

    // The first hero is intentionally the sole initial animation. The inline head
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
    const hero = [...this.sections].find((section) => section.matches('.editorial-hero, .shoppable-hero'));
    if (hero && this.isVisible(hero)) {
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
      const readyProductStages = [...this.productStages].filter((stage) => {
        const section = stage.closest('[data-aos-section]');
        const triggerLine = stage.closest('[data-aos-trigger="early"]') ? 0.85 : 0.6;
        return !stage.dataset.aosState && section?.dataset.aosState === 'animated' && this.hasReachedTriggerLine(stage, triggerLine);
      });

      const sequencedRows = new Map();
      readyProductStages.forEach((stage) => {
        const sequence = stage.closest('[data-aos-sequence="row"]');
        if (!sequence) {
          this.queueProductStage(stage);
          return;
        }

        if (!sequencedRows.has(sequence)) sequencedRows.set(sequence, new Map());
        const rows = sequencedRows.get(sequence);
        const row = Math.round(stage.getBoundingClientRect().top);
        if (!rows.has(row)) rows.set(row, []);
        rows.get(row).push(stage);
      });

      sequencedRows.forEach((rows) => {
        rows.forEach((stages) => {
          stages
            .sort((first, second) => first.getBoundingClientRect().left - second.getBoundingClientRect().left)
            .forEach((stage, index) => this.queueProductStage(stage, Math.min(index, 3) * 100));
        });
      });
    });
  }

  hasReachedTriggerLine(element, triggerLine = 0.6) {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    if (rect.bottom <= 0 || rect.top >= viewportHeight) return false;
    // Downward entry uses the section's top; upward entry uses its bottom.
    // In both directions, the same clear viewport share remains before it runs.
    return rect.top >= 0
      ? rect.top <= viewportHeight * triggerLine
      : rect.bottom >= viewportHeight * (1 - triggerLine);
  }

  isVisible(section) {
    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    return rect.bottom > 0 && rect.top < viewportHeight;
  }

  queueSection(section) {
    if (section.matches('.editorial-hero, .shoppable-hero')) section.classList.add('hero--media-settled');
    this.queueStage('section', section);
  }

  queueProductStage(stage, sequenceDelay = 0) {
    this.queueStage('products', stage, sequenceDelay);
  }

  queueStage(type, element, sequenceDelay = 0) {
    if (element.dataset.aosState) return;
    element.dataset.aosState = 'queued';
    this.animateStage(type, element, this.scrollVelocity >= 0.65 ? 350 : this.defaultDuration, sequenceDelay);
  }

  animateStage(type, element, duration, sequenceDelay = 0) {
    if (element.dataset.aosState === 'animated' || element.dataset.aosState === 'animating') return;
    element.dataset.aosState = 'animating';

    const candidates = [];
    if (element.matches('[data-aos]')) candidates.push(element);
    candidates.push(...element.querySelectorAll('[data-aos]'));
    const targets = candidates.filter((target) => {
      if (type === 'products') return true;
      return !target.closest('[data-aos-products], [data-aos-product-item], [data-aos-item]');
    });
    const delays = targets.map((target) => {
      const delay = (Number(target.dataset.aosDelay) || 0) + sequenceDelay;
      if (delay) target.dataset.aosDelay = delay;
      return delay;
    });
    const maxDelay = Math.max(0, ...delays);
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
