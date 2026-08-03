class CatalogReveal {
  constructor() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.body.dataset.aosDuration = '400';
    this.targets = new Set();
    this.timers = new Map();
    this.observer = 'IntersectionObserver' in window
      ? new IntersectionObserver((entries) => this.handleIntersections(entries), { rootMargin: '0px 0px -18%', threshold: 0 })
      : null;
    this.register(document);

    document.addEventListener('shopify:section:load', (event) => this.register(event.target));
    document.addEventListener('shopify:section:unload', (event) => this.unregister(event.target));
    document.addEventListener('shopify:section:reorder', () => this.register(document));
    window.catalogRevealBoot?.release();
  }

  handleIntersections(entries) {
      const rows = new Map();
      entries.filter((entry) => entry.isIntersecting).forEach((entry) => {
        const row = Math.round(entry.boundingClientRect.top);
        if (!rows.has(row)) rows.set(row, []);
        rows.get(row).push(entry);
      });

      rows.forEach((entriesInRow) => {
        entriesInRow
          .sort((first, second) => first.boundingClientRect.left - second.boundingClientRect.left)
          .forEach((entry, index) => {
            this.observer.unobserve(entry.target);
            this.reveal(entry.target, Math.min(index, 3) * 100);
          });
      });
  }

  register(scope) {
    const targets = [];
    if (scope.matches?.('[data-catalog-reveal][data-aos]')) targets.push(scope);
    targets.push(...scope.querySelectorAll?.('[data-catalog-reveal][data-aos]') || []);
    targets.forEach((target) => {
      if (this.targets.has(target)) return;
      this.targets.add(target);
      if (this.observer) this.observer.observe(target);
      else this.reveal(target);
    });
  }

  unregister(scope) {
    const contains = (element) => scope === element || scope.contains?.(element);
    this.targets.forEach((target) => {
      if (!contains(target)) return;
      this.observer?.unobserve(target);
      const timer = this.timers.get(target);
      if (timer) window.clearTimeout(timer);
      this.timers.delete(target);
      this.targets.delete(target);
    });
  }

  reveal(target, delay = 0) {
    if (this.timers.has(target)) return;
    if (delay) target.style.transitionDelay = `${delay}ms`;
    target.classList.add('aos-animate');
    const timer = window.setTimeout(() => {
      target.removeAttribute('data-aos');
      target.removeAttribute('data-aos-delay');
      target.removeAttribute('data-aos-duration');
      target.style.removeProperty('transition-delay');
      this.timers.delete(target);
      this.targets.delete(target);
    }, 480 + delay);
    this.timers.set(target, timer);
  }
}

if (!window.catalogReveal) window.catalogReveal = new CatalogReveal();
