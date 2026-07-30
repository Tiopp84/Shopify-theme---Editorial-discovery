class CatalogReveal {
  constructor() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.body.dataset.aosDuration = '400';
    const targets = [...document.querySelectorAll('[data-catalog-reveal][data-aos]')];
    const reveal = (target, delay = 0) => {
      if (delay) target.style.transitionDelay = `${delay}ms`;
      target.classList.add('aos-animate');
      window.setTimeout(() => {
        target.removeAttribute('data-aos');
        target.removeAttribute('data-aos-delay');
        target.removeAttribute('data-aos-duration');
        target.style.removeProperty('transition-delay');
      }, 480 + delay);
    };

    if (!('IntersectionObserver' in window)) {
      targets.forEach(reveal);
      window.catalogRevealBoot?.release();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
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
            observer.unobserve(entry.target);
            reveal(entry.target, Math.min(index, 3) * 100);
          });
      });
    }, { rootMargin: '0px 0px -18%', threshold: 0 });

    targets.forEach((target) => observer.observe(target));
    window.catalogRevealBoot?.release();
  }
}

if (!window.catalogReveal) window.catalogReveal = new CatalogReveal();
