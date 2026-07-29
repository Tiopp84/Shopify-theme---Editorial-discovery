class HomeRevealController {
  constructor() {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.desktop = window.matchMedia('(min-width: 60rem)');

    if (!window.gsap || !window.ScrollTrigger || this.reducedMotion.matches) {
      window.homeRevealBoot?.release();
      return;
    }

    window.gsap.registerPlugin(window.ScrollTrigger);
    window.ScrollTrigger.config({ limitCallbacks: true });
    this.reveals = new Map();
    this.choreographies = new Map();
    this.refreshFrame = null;
    this.onViewportChange = () => {
      this.destroy(document);
      this.hydrate(document);
    };

    this.hydrate(document);
    window.homeRevealBoot?.release();
    this.desktop.addEventListener('change', this.onViewportChange);
    document.addEventListener('shopify:section:load', (event) => this.hydrate(event.target));
    document.addEventListener('shopify:section:unload', (event) => this.destroy(event.target));
  }

  elementsIn(scope, selector) {
    const elements = [];
    if (scope.matches?.(selector)) elements.push(scope);
    elements.push(...scope.querySelectorAll?.(selector) || []);
    return elements;
  }

  hydrate(scope) {
    this.elementsIn(scope, '[data-home-reveal], [data-home-reveal-group], [data-home-reveal-chapter]').forEach((element) => {
      if (this.reveals.has(element) || this.isChoreographedChapter(element)) return;
      const targets = this.targetsFor(element);
      if (!targets.length) return;

      window.gsap.set(targets, { autoAlpha: 0, y: 14 });
      const timeline = this.createRevealTimeline(element, targets);
      const reveal = { completed: false, started: false, targets, timeline, trigger: null };
      timeline.eventCallback('onComplete', () => {
        reveal.completed = true;
        window.gsap.set(targets, { clearProps: 'opacity,transform,visibility,will-change' });
      });
      this.reveals.set(element, reveal);

      if (element.dataset.homeReveal === 'editorial-hero') {
        this.playReveal(element);
      } else {
        reveal.trigger = window.ScrollTrigger.create({
          trigger: element,
          start: 'top 88%',
          once: true,
          onEnter: () => this.playReveal(element),
        });
      }
    });

    if (this.desktop.matches) {
      this.elementsIn(scope, '[data-motion="editorial-chapters"]').forEach((section) => this.createEditorialChoreography(section));
    }
    this.scheduleRefresh();
  }

  isChoreographedChapter(element) {
    return this.desktop.matches
      && element.hasAttribute('data-home-reveal-chapter')
      && Boolean(element.closest('[data-motion="editorial-chapters"]'));
  }

  createEditorialChoreography(section) {
    if (this.choreographies.has(section)) return;

    const media = section.querySelector('.pinned-visual-story__media');
    const chapters = [...section.querySelectorAll('[data-home-reveal-chapter]')];
    if (!media || !chapters.length) return;

    const chapterTargets = chapters.map((chapter) => [
      ...chapter.querySelectorAll('.pinned-visual-story__number, h3, .pinned-visual-story__body, a'),
    ]).filter((targets) => targets.length);
    if (!chapterTargets.length) return;

    const context = window.gsap.context(() => {
      const mediaImage = media.querySelector('img, svg');
      window.gsap.set(media, { autoAlpha: 1 });
      if (mediaImage) window.gsap.set(mediaImage, { scale: 1.045, transformOrigin: 'center center' });
      chapterTargets.forEach((targets) => window.gsap.set(targets, { autoAlpha: 0, y: 20 }));

      const timeline = window.gsap.timeline({
        defaults: { ease: 'power2.out', overwrite: 'auto' },
        scrollTrigger: {
          trigger: section.querySelector('.pinned-visual-story__layout'),
          start: 'top 72%',
          end: 'bottom 56%',
          scrub: 0.35,
          invalidateOnRefresh: true,
        },
      });

      if (mediaImage) timeline.to(mediaImage, { duration: chapterTargets.length, scale: 1 }, 0);
      chapterTargets.forEach((targets, index) => {
        timeline.to(targets, { autoAlpha: 1, duration: 0.7, y: 0 }, index * 0.72);
      });
    }, section);

    this.choreographies.set(section, { context, media, chapterTargets });
  }

  playReveal(element) {
    const reveal = this.reveals.get(element);
    if (!reveal || reveal.started) return;
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
    this.choreographies.forEach((choreography, section) => {
      if (scope !== section && !scope.contains(section)) return;
      choreography.context.revert();
      this.choreographies.delete(section);
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
    if (element.hasAttribute('data-home-reveal-group')) return [...element.children];
    switch (element.dataset.homeReveal) {
      case 'editorial-hero': return [...element.querySelectorAll('.editorial-hero__content > *'), element.querySelector('.editorial-hero__media')].filter(Boolean);
      case 'featured-edit': return [...element.querySelectorAll('.featured-edit__header > *')];
      case 'pinned-visual-story': {
        const media = element.querySelector('.pinned-visual-story__media');
        return [
          ...element.querySelectorAll('.pinned-visual-story__intro > *'),
          ...(element.dataset.motion === 'editorial-chapters' ? [] : [media]),
        ].filter(Boolean);
      }
      case 'material-craft': return [...element.querySelectorAll('.material-craft__images > *, .material-craft__content > *')];
      case 'shoppable-story': return [...element.querySelectorAll('.shoppable-story__intro > *')];
      case 'outfit-composition': return [...element.querySelectorAll('.outfit-composition__content > *'), element.querySelector('.outfit-composition__media')].filter(Boolean);
      default: return [];
    }
  }

  createRevealTimeline(element, targets) {
    const isCardGroup = element.hasAttribute('data-home-reveal-group');
    const isHero = element.dataset.homeReveal === 'editorial-hero';
    const duration = isHero ? 0.5 : isCardGroup ? 0.4 : 0.34;
    const stagger = isHero ? 0.12 : isCardGroup ? 0.08 : 0.1;
    const timeline = window.gsap.timeline({ paused: true, defaults: { ease: 'power2.out', overwrite: 'auto' } });
    targets.forEach((target, index) => {
      timeline.to(target, { autoAlpha: 1, duration, y: 0 }, index * stagger);
    });
    return timeline;
  }
}

if (!window.homeRevealController) window.homeRevealController = new HomeRevealController();
