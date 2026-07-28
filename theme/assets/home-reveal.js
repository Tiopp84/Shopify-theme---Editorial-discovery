class HomeRevealController {
  constructor() {
    if (!window.gsap || !window.ScrollTrigger || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.homeRevealBoot?.release();
      return;
    }

    window.gsap.registerPlugin(window.ScrollTrigger);
    window.ScrollTrigger.config({ limitCallbacks: true });
    this.reveals = new Map();
    this.refreshFrame = null;
    this.hydrate(document);
    window.homeRevealBoot?.release();
    document.addEventListener('shopify:section:load', (event) => this.hydrate(event.target));
    document.addEventListener('shopify:section:unload', (event) => this.destroy(event.target));
  }

  hydrate(scope) {
    scope.querySelectorAll?.('[data-home-reveal], [data-home-reveal-group], [data-home-reveal-chapter]').forEach((element) => {
      if (this.reveals.has(element)) return;
      const targets = this.targetsFor(element);
      if (!targets.length) return;

      window.gsap.set(targets, { autoAlpha: 0, y: element.hasAttribute('data-home-reveal-chapter') ? 12 : 14 });
      const timeline = this.createTimeline(element, targets);
      const reveal = {
        after: [],
        completed: false,
        queued: false,
        started: false,
        targets,
        timeline,
        trigger: null,
      };
      timeline.eventCallback('onComplete', () => {
        reveal.completed = true;
        window.gsap.set(targets, { clearProps: 'opacity,transform,visibility,will-change' });
        reveal.after.splice(0).forEach((callback) => callback());
      });
      this.reveals.set(element, reveal);
      if (element.dataset.homeReveal === 'editorial-hero') {
        this.play(element);
      } else {
        reveal.trigger = window.ScrollTrigger.create({
          trigger: element,
          start: 'top 92%',
          once: true,
          onEnter: () => this.play(element),
        });
      }
    });
    this.scheduleRefresh();
  }

  play(element) {
    const reveal = this.reveals.get(element);
    if (!reveal || reveal.started || reveal.queued) return;

    const parent = element.parentElement?.closest('[data-home-reveal]');
    const parentReveal = parent && this.reveals.get(parent);
    if (parentReveal && !parentReveal.completed) {
      reveal.queued = true;
      parentReveal.after.push(() => {
        reveal.queued = false;
        this.play(element);
      });
      return;
    }

    reveal.started = true;
    window.gsap.set(reveal.targets, { willChange: 'transform,opacity' });
    reveal.timeline.play();
  }

  destroy(scope) {
    this.reveals.forEach((reveal, element) => {
      if (scope !== element && !scope.contains(element)) return;
      reveal.trigger?.kill();
      reveal.timeline.kill();
      window.gsap.set(reveal.targets, { clearProps: 'opacity,transform,visibility,will-change' });
      this.reveals.delete(element);
    });
    this.scheduleRefresh();
  }

  scheduleRefresh() {
    if (this.refreshFrame) return;
    this.refreshFrame = window.requestAnimationFrame(() => {
      this.refreshFrame = null;
      window.ScrollTrigger.refresh();
    });
  }

  targetsFor(element) {
    if (element.hasAttribute('data-home-reveal-chapter')) {
      return [...element.querySelectorAll('.pinned-visual-story__number, h3, .pinned-visual-story__body, a')];
    }
    if (element.hasAttribute('data-home-reveal-group')) return [...element.children];

    switch (element.dataset.homeReveal) {
      case 'editorial-hero': return [...element.querySelectorAll('.editorial-hero__content > *'), element.querySelector('.editorial-hero__media')].filter(Boolean);
      case 'featured-edit': return [...element.querySelectorAll('.featured-edit__header > *')];
      case 'pinned-visual-story': return [...element.querySelectorAll('.pinned-visual-story__intro > *'), element.querySelector('.pinned-visual-story__media')].filter(Boolean);
      case 'material-craft': return [...element.querySelectorAll('.material-craft__images > *, .material-craft__content > *')];
      case 'shoppable-story': return [...element.querySelectorAll('.shoppable-story__intro > *')];
      case 'outfit-composition': return [...element.querySelectorAll('.outfit-composition__content > *'), element.querySelector('.outfit-composition__media')].filter(Boolean);
      default: return [];
    }
  }

  createTimeline(element, targets) {
    const isCardGroup = element.hasAttribute('data-home-reveal-group');
    const isChapter = element.hasAttribute('data-home-reveal-chapter');
    const isHero = element.dataset.homeReveal === 'editorial-hero';
    const duration = isHero ? 0.5 : isCardGroup ? 0.44 : isChapter ? 0.42 : 0.34;
    const stagger = isHero ? 0.12 : isCardGroup ? 0.1 : isChapter ? 0.1 : 0.11;
    const timeline = window.gsap.timeline({ paused: true, defaults: { ease: 'power2.out', overwrite: 'auto' } });

    targets.forEach((target, index) => {
      timeline.to(target, {
        autoAlpha: 1,
        duration,
        y: 0,
      }, index * stagger);
    });
    return timeline;
  }
}

if (!window.homeRevealController) window.homeRevealController = new HomeRevealController();
